import { ethers } from "ethers";
import abi from "../config/abi.js";
import { generateKeys } from "../functions/secretpath/generateKeys";
import { getPublicClientAddress } from "../functions/secretpath/getPublicClientAddress";
import { constructPayload } from "../functions/secretpath/constructPayload";
import { encryptPayload } from "../functions/secretpath/encryptPayload";
import { hexlify } from "ethers/lib/utils";
import { querySecret } from "../functions/query/querySecret";

export async function handleSubmit(e, setBallCount) {
  e.preventDefault();
  // handlePlay();

  const routing_contract = process.env.REACT_APP_SECRET_ADDRESS;
  const routing_code_hash = process.env.REACT_APP_CODE_HASH;
  const iface = new ethers.utils.Interface(abi);
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  const [myAddress] = await provider.send("eth_requestAccounts", []);

  const { userPrivateKeyBytes, userPublicKeyBytes, sharedKey } =
    await generateKeys();

  const callbackSelector = iface.getSighash(
    iface.getFunction("upgradeHandler")
  );

  console.log("callbackSelector: ", callbackSelector);

  const callbackGasLimit = 90000;
  // The function name of the function that is called on the private contract
  const handle = "request_random";

  // Data are the calldata/parameters that are passed into the contract
  const data = JSON.stringify({ address: myAddress });

  const chainId = (await provider.getNetwork()).chainId.toString();

  const publicClientAddress = getPublicClientAddress(chainId);

  const callbackAddress = publicClientAddress.toLowerCase();
  console.log("callback address: ", callbackAddress);

  // Payload construction
  const payload = constructPayload(
    data,
    routing_contract,
    routing_code_hash,
    myAddress,
    userPublicKeyBytes,
    callbackAddress,
    callbackSelector,
    callbackGasLimit
  );

  const {
    ciphertext,
    payloadHash,
    payloadSignature,
    _info,
  } = await encryptPayload(
    payload,
    sharedKey,
    provider,
    myAddress,
    userPublicKeyBytes,
    routing_code_hash,
    handle,
    callbackGasLimit,
    iface,
    callbackSelector
  );

  const functionData = iface.encodeFunctionData("send", [
    payloadHash,
    myAddress,
    routing_contract,
    _info,
  ]);

  const feeData = await provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas;
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
  const gasFee =
    maxFeePerGas && maxPriorityFeePerGas
      ? maxFeePerGas.add(maxPriorityFeePerGas)
      : await provider.getGasPrice();
  let amountOfGas = gasFee.mul(callbackGasLimit).mul(3).div(2);
  let my_gas = 150000;

  const tx_params = {
    gas: hexlify(my_gas),
    to: publicClientAddress,
    from: myAddress,
    value: hexlify(amountOfGas),
    data: functionData,
  };

  const txHash = await provider.send("eth_sendTransaction", [tx_params]);
  const newRandomNumber = await querySecret();
  setBallCount(newRandomNumber); // Directly set the new ball count from the query.
  console.log("New ball count set to:", newRandomNumber);
  console.log(`Transaction Hash: ${txHash}`);
  alert(`Congrats! You have received ${newRandomNumber} Secret Balls!`);
}