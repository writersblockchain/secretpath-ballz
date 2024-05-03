import * as THREE from "three"
import { useEffect, useLayoutEffect, useMemo, useState, useRef } from "react"
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
import { SecretNetworkClient } from "secretjs"
import { testnet, mainnet } from "./config/secretpath"
import MyImage from "./poweredby.png"
import Song from "./sonic.mp3"

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
  chainImages: {
    // Arbitrum Mainnet
    42161: "https://arbiscan.io/images/svg/brands/arbitrum.svg?v=1.5",
    // Linea Mainnet
    59144: "https://lineascan.build/images/svg/brands/main.svg?v=24.4.2.0",

    //Scroll Mainnet
    534352: "https://scrollscan.com/images/svg/brands/main.svg?v=24.4.3.0",

    // Metis Mainnet
    1088: "https://cms-cdn.avascan.com/cms2/metis.97de56bab032.svg",

    //Sepolia Testnet
    11155111: "https://sepolia.etherscan.io/images/svg/brands/ethereum-original.svg",

    // Scroll Testnet
    534351: "https://scrollscan.com/images/svg/brands/main.svg?v=24.4.3.0",

    // Polygon Amoy Testnet
    80002: "https://assets-global.website-files.com/637e2b6d602973ea0941d482/63e26c8a3f6e812d91a7aa3d_Polygon-New-Logo.png",

    // Optimism Testnet
    11155420: "https://optimistic.etherscan.io/assets/optimism/images/svg/logos/chain-light.svg?v=24.4.4.4",

    // Arbitrum Testnet
    421614: "https://arbiscan.io/images/svg/brands/arbitrum.svg?v=1.5",

    // Base Sepolia Testnet
    84532: "https://basescan.org/images/svg/brands/main.svg?v=24.4.4.9",

    // Berachain Testnet
    80085: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq-tjg8Kqgr76Ved6PbcjBoGCHWwnhDUljH-CziyBOzw&s",

    // Etherlink Testnet
    128123: "https://www.etherlink.com/favicon.ico",

    //Metis Sepolia Testnet
    59902: "https://cms-cdn.avascan.com/cms2/metis.97de56bab032.svg",

    // Near Aurora Testnet
    1313161555: "https://play-lh.googleusercontent.com/0zJGaaodqDL--ig2W2h60zp5uLMexQs4_PRlon5qhakSwqsdwa_ZmV9DQKvg1WVnn-w=w240-h480-rw",

    // Linea Testnet
    59141: "https://lineascan.build/images/svg/brands/main.svg?v=24.4.2.0",

    // XDC Apothem
    51: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe2KDAtPElT99WYln7tyeQPlPCiBWaRfRA_guAL0HImJWBcRympM_r5VBSiOR29zFpKIU&usqp=CAU",

    //Lisk Sepolia
    4202: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRan6D0dfiYmx2sv4kUPsFkfUDxYUWEuuA_dLJWgPm8Q&s",
  },
  ethersConfig,
  chains: [
    mainnets.ethereumMainnet,
    mainnets.binanceSmartChainMainnet,
    mainnets.polygonMainnet,
    mainnets.optimismMainnet,
    mainnets.arbitrumMainnet,
    mainnets.avalancheMainnet,
    mainnets.baseMainnet,
    mainnets.lineaMainnet,
    mainnets.scrollMainnet,
    mainnets.metisMainnet,
    testnets.sepoliaTestnet,
    testnets.scrollTestnet,
    testnets.polygonTestnet,
    testnets.optimismTestnet,
    testnets.arbitrumTestnet,
    testnets.baseSepoliaTestnet,
    testnets.berachainTestnet,
    testnets.etherlinkTestnet,
    testnets.metisSepoliaTestnet,
    testnets.nearAuroraTestnet,
    testnets.lineaSepoliaTestnet,
    testnets.XDCApothemTestnet,
    testnets.liskSepoliaTestnet,
  ],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
})

const tempColor = new THREE.Color()
const data = Array.from({ length: 200 }, () => ({ color: niceColors[17][Math.floor(Math.random() * 5)], scale: 0.25 + Math.random() }))

export const App = () => {
  const [chainId, setChainId] = useState("")
  const [ballCount, setBallCount] = useState(1)

  const audioRef = useRef(null)

  const handlePlay = () => {
    audioRef.current.play().catch((error) => {
      console.error("Error attempting to play audio:", error)
    })
  }

  let query = async () => {
    const secretjs = new SecretNetworkClient({
      url: "https://lcd.testnet.secretsaturn.net",
      chainId: "pulsar-3",
    })

    try {
      const query_tx = await secretjs.query.compute.queryContract({
        contract_address: process.env.REACT_APP_SECRET_ADDRESS,
        code_hash: process.env.REACT_APP_CODE_HASH,
        query: { retrieve_random: {} },
      })
      return query_tx.random // Return the fetched random number.
    } catch (error) {
      console.error("Error fetching random number:", error)
      return 1 // Return a default value in case of error.
    }
  }

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
    handlePlay()

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

    //data are the calldata/parameters that are passed into the contract
    const data = JSON.stringify({ address: myAddress })

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

    if (chainId === "59144") {
      publicClientAddress = mainnet.publicClientAddressLineaMainnet
    }

    if (chainId === "534352") {
      publicClientAddress = mainnet.publicClientAddressScrollMainnet
    }

    if (chainId === "1088") {
      publicClientAddress = mainnet.publicClientAddressMetisMainnet
    }

    if (chainId === "11155111") {
      publicClientAddress = testnet.publicClientAddressSepoliaTestnet
    }
    if (chainId === "534351") {
      publicClientAddress = testnet.publicClientAddressScrollTestnet
    }
    if (chainId === "80002") {
      publicClientAddress = testnet.publicClientAddressPolygonAmoyTestnet
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

    if (chainId === "128123") {
      publicClientAddress = testnet.publicClientAddressEtherlinkTestnet
    }
    if (chainId === "59902") {
      publicClientAddress = testnet.publicClientAddressMetisSepoliaTestnet
    }
    if (chainId === "1313161555") {
      publicClientAddress = testnet.publicClientAddressNearAuroraTestnet
    }
    if (chainId === "59141") {
      publicClientAddress = testnet.publicClientAddressLineaSepoliaTestnet
    }
    if (chainId === "51") {
      publicClientAddress = testnet.publicClientAddressXDCApothemTestnet
    }
    if (chainId === "4202") {
      publicClientAddress = testnet.publicClientAddressLiskSepoliaTestnet
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
    const newRandomNumber = await query()
    setBallCount(newRandomNumber) // Directly set the new ball count from the query.
    console.log("New ball count set to:", newRandomNumber)
    console.log(`Transaction Hash: ${txHash}`)
    alert(`Congrats! You have received ${newRandomNumber} Secret Balls!`)
  }

  return (
    <>
      <audio ref={audioRef} src={Song} preload="auto" />
      <div className="heading">
        <h3>Cross-Chain Secret VRF Demo</h3>
        <h6>
          <a
            href="https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/usecases/vrf/vrf-developer-tutorial"
            target="_blank">
            [click here for docs]
          </a>
        </h6>
      </div>

      <div className="button-container">
        <button onClick={handleSubmit}>Give me Secret Balls </button>

        <img src={MyImage} alt="Descriptive Alt Text" style={{ marginTop: "10px", maxWidth: "100px" }} />
      </div>
      <div className="connect-wallet-button-container">
        <w3m-button className="connect-wallet-button" />
      </div>

      <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 100 }}>
        <Physics gravity={[0, -50, 0]}>
          <group position={[0, 0, -10]}>
            <Mouse />
            <Borders />
            <InstancedSpheres key={ballCount} count={ballCount} />
          </group>
        </Physics>
      </Canvas>
    </>
  )
}
function InstancedSpheres({ count }) {
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
