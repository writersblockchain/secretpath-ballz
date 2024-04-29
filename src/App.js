import * as THREE from "three"
import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Physics, usePlane, useSphere } from "@react-three/cannon"
import niceColors from "nice-color-palettes"
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react"
import { projectId, testnets, mainnets, metadata } from "./config/config"
import { ethers } from "ethers"
import { arrayify, hexlify, SigningKey, keccak256, recoverPublicKey, computeAddress } from "ethers/lib/utils"
import { ecdh, chacha20_poly1305_seal } from "@solar-republic/neutrino"
import { bytes, bytes_to_base64, json_to_bytes, sha256, concat, text_to_bytes, base64_to_bytes } from "@blake.regalia/belt"
import abi from "./config/abi"
import { testnet, mainnet } from "./config/secretpath"

const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
})

createWeb3Modal({
  ethersConfig,
  chains: [
    testnets.arbitrumTestnet,
    testnets.sepoliaTestnet,
    testnets.scrollTestnet,

    testnets.optimismTestnet,
    testnets.baseSepoliaTestnet,
    testnets.berachainTestnet,
    testnets.metisSepoliaTestnet,
    testnets.lineaSepoliaTestnet,
    testnets.nearAuroraTestnet,
    mainnets.ethereumMainnet,
    mainnets.polygonMainnet,
    mainnets.binanceSmartChainMainnet,
    mainnets.optimismMainnet,
    mainnets.arbitrumMainnet,
    mainnets.avalancheMainnet,
    mainnets.baseMainnet,
    mainnets.scrollMainnet,
    mainnets.lineaMainnet,
  ],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
})

const tempColor = new THREE.Color()
const data = Array.from({ length: 200 }, () => ({ color: niceColors[17][Math.floor(Math.random() * 5)], scale: 0.25 + Math.random() }))

export const App = () => {
  const [chainId, setChainId] = useState("")

  useEffect(() => {
    const handleChainChanged = (_chainId) => {
      // Convert _chainId to a number since it's usually hexadecimal
      const numericChainId = parseInt(_chainId, 16)
      setChainId(numericChainId.toString())
      console.log("Network changed to chain ID:", numericChainId)
    }

    window.ethereum.on("chainChanged", handleChainChanged)

    // Fetch initial chain ID
    const fetchChainId = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
      const { chainId } = await provider.getNetwork()
      setChainId(chainId.toString())
      console.log("Current Chain ID:", chainId)
    }

    fetchChainId()

    // Cleanup function to remove listener
    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const routing_contract = process.env.REACT_APP_SECRET_ADDRESS
    const routing_code_hash = process.env.REACT_APP_CODE_HASH
    const iface = new ethers.utils.Interface(abi)
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any")

    const [myAddress] = await provider.send("eth_requestAccounts", [])

    const wallet = ethers.Wallet.createRandom()
    const userPrivateKeyBytes = arrayify(wallet.privateKey)
    const userPublicKey = new SigningKey(wallet.privateKey).compressedPublicKey
    const userPublicKeyBytes = arrayify(userPublicKey)
    const gatewayPublicKey = "A20KrD7xDmkFXpNMqJn1CLpRaDLcdKpO1NdBBS7VpWh3"
    const gatewayPublicKeyBytes = base64_to_bytes(gatewayPublicKey)

    const sharedKey = await sha256(ecdh(userPrivateKeyBytes, gatewayPublicKeyBytes))

    const callbackSelector = iface.getSighash(iface.getFunction("upgradeHandler"))

    console.log("callbackSelector: ", callbackSelector)

    const callbackGasLimit = 90000
    //the function name of the function that is called on the private contract
    const handle = "request_random"
    const numWords = 3

    //data are the calldata/parameters that are passed into the contract
    const data = JSON.stringify({ numWords: Number(numWords) })

    let publicClientAddress

    if (chainId === "1") {
      publicClientAddress = mainnet.publicClientAddressEthereumMainnet
    }
    if (chainId === "56") {
      publicClientAddress = mainnet.publicClientAddressBinanceSmartChainMainnet
    }
    if (chainId === "137") {
      publicClientAddress = mainnet.publicClientAddressPolygonMainnet
    }
    if (chainId === "10") {
      publicClientAddress = mainnet.publicClientAddressOptimismMainnet
    }
    if (chainId === "42161") {
      publicClientAddress = mainnet.publicClientAddressArbitrumOneMainnet
    }
    if (chainId === "43114") {
      publicClientAddress = mainnet.publicClientAddressAvalanceCChainMainnet
    }
    if (chainId === "8453") {
      publicClientAddress = mainnet.publicClientAddressBaseMainnet
    }
    if (chainId === "534352") {
      publicClientAddress = mainnet.publicClientAddressScrollMainnet
    }
    if (chainId === "59144") {
      publicClientAddress = mainnet.publicClientAddressLineaMainnet
    }

    if (chainId === "11155111") {
      publicClientAddress = testnet.publicClientAddressSepoliaTestnet
    }
    if (chainId === "534351") {
      publicClientAddress = testnet.publicClientAddressScrollTestnet
    }
    if (chainId === "80001") {
      publicClientAddress = testnet.publicClientAddressPolygonMumbaiTestnet
    }
    if (chainId === "11155420") {
      publicClientAddress = testnet.publicClientAddressOptimismSepoliaTestnet
    }
    if (chainId === "421614") {
      publicClientAddress = testnet.publicClientAddressArbitrumSepoliaTestnet
    }
    if (chainId === "84532") {
      publicClientAddress = testnet.publicClientAddressBaseSepoliaTestnet
    }
    if (chainId === "80085") {
      publicClientAddress = testnet.publicClientAddressBerachainTestnet
    }
    if (chainId === "59901") {
      publicClientAddress = testnet.publicClientAddressMetisSepoliaTestnet
    }
    if (chainId === "1313161555") {
      publicClientAddress = testnet.publicClientAddressNearAuroraTestnet
    }
    if (chainId === "59141") {
      publicClientAddress = testnet.publicClientAddressLineaSepoliaTestnet
    }

    const callbackAddress = publicClientAddress.toLowerCase()
    console.log("callback address: ", callbackAddress)

    // Payload construction
    const payload = {
      data: data,
      routing_info: routing_contract,
      routing_code_hash: routing_code_hash,
      user_address: myAddress,
      user_key: bytes_to_base64(userPublicKeyBytes),
      callback_address: bytes_to_base64(arrayify(callbackAddress)),
      callback_selector: bytes_to_base64(arrayify(callbackSelector)),
      callback_gas_limit: callbackGasLimit,
    }

    const payloadJson = JSON.stringify(payload)
    const plaintext = json_to_bytes(payload)
    const nonce = crypto.getRandomValues(bytes(12))

    const [ciphertextClient, tagClient] = chacha20_poly1305_seal(sharedKey, nonce, plaintext)
    const ciphertext = concat([ciphertextClient, tagClient])
    const ciphertextHash = keccak256(ciphertext)
    const payloadHash = keccak256(concat([text_to_bytes("\x19Ethereum Signed Message:\n32"), arrayify(ciphertextHash)]))
    const msgParams = ciphertextHash

    const params = [myAddress, msgParams]
    const method = "personal_sign"
    const payloadSignature = await provider.send(method, params)
    const user_pubkey = recoverPublicKey(payloadHash, payloadSignature)

    const _info = {
      user_key: hexlify(userPublicKeyBytes),
      user_pubkey: user_pubkey,
      routing_code_hash: routing_code_hash,
      task_destination_network: "pulsar-3",
      handle: handle,
      nonce: hexlify(nonce),
      payload: hexlify(ciphertext),
      payload_signature: payloadSignature,
      callback_gas_limit: callbackGasLimit,
    }

    const functionData = iface.encodeFunctionData("send", [payloadHash, myAddress, routing_contract, _info])

    const gasFee = await provider.getGasPrice()
    const amountOfGas = gasFee.mul(callbackGasLimit).mul(3).div(2)

    const tx_params = {
      gas: hexlify(150000),
      to: publicClientAddress,
      from: myAddress,
      value: hexlify(amountOfGas),
      data: functionData,
    }

    const txHash = await provider.send("eth_sendTransaction", [tx_params])
    console.log(`Transaction Hash: ${txHash}`)
  }

  return (
    <>
      <button onClick={handleSubmit}></button>
      <div className="connect-wallet-button-container">
        <w3m-button className="connect-wallet-button" />
      </div>

      <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 100 }}>
        <Physics gravity={[0, -50, 0]}>
          <group position={[0, 0, -10]}>
            <Mouse />
            <Borders />
            <InstancedSpheres />
          </group>
        </Physics>
      </Canvas>
    </>
  )
}
function InstancedSpheres({ count = 200 }) {
  const { viewport } = useThree()
  const [ref, api] = useSphere((index) => ({
    mass: data[index].scale * 100,
    position: [4 - Math.random() * 8, viewport.height * 3, 0, 0],
    args: [data[index].scale],
  }))
  const colorArray = useMemo(() => Float32Array.from(new Array(count).fill().flatMap((_, i) => tempColor.set(data[i].color).toArray())), [count])
  useLayoutEffect(() => {
    // Cannon does not support variable size for instances (yet), so this is something that's exclusive to react
    for (let i = 0; i < count; i++) api.at(i).scaleOverride([data[i].scale, data[i].scale, data[i].scale])
  }, [])
  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <sphereGeometry args={[1, 64, 64]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </sphereGeometry>
      <meshBasicMaterial toneMapped={false} vertexColors />
    </instancedMesh>
  )
}

function Borders() {
  const { viewport } = useThree()
  return (
    <>
      <Plane position={[0, -viewport.height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Plane position={[-viewport.width / 2 - 1, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Plane position={[viewport.width / 2 + 1, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <Plane position={[0, 0, -1]} rotation={[0, 0, 0]} />
      <Plane position={[0, 0, 12]} rotation={[0, -Math.PI, 0]} />
    </>
  )
}

function Plane({ color, position = [0, 0, 0], ...props }) {
  const [, api] = usePlane(() => ({ ...props }))
  useEffect(() => api.position.set(...position), [api, position])
}

function Mouse() {
  const { viewport } = useThree()
  const [, api] = useSphere(() => ({ type: "Kinematic", args: [4] }))
  useFrame((state) => api.position.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 7))
}
