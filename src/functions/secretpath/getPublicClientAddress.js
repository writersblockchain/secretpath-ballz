// secretpath/getPublicClientAddress.js
import { mainnet, testnet } from "../../config/secretpath";

export function getPublicClientAddress(chainId) {
  let publicClientAddress;

  if (chainId === "1") {
    publicClientAddress = mainnet.publicClientAddressEthereumMainnet;
  }
  if (chainId === "56") {
    publicClientAddress = mainnet.publicClientAddressBinanceSmartChainMainnet;
  }
  if (chainId === "137") {
    publicClientAddress = mainnet.publicClientAddressPolygonMainnet;
  }
  if (chainId === "10") {
    publicClientAddress = mainnet.publicClientAddressOptimismMainnet;
  }
  if (chainId === "42161") {
    publicClientAddress = mainnet.publicClientAddressArbitrumOneMainnet;
  }
  if (chainId === "43114") {
    publicClientAddress = mainnet.publicClientAddressAvalanceCChainMainnet;
  }
  if (chainId === "8453") {
    publicClientAddress = mainnet.publicClientAddressBaseMainnet;
  }
  if (chainId === "59144") {
    publicClientAddress = mainnet.publicClientAddressLineaMainnet;
  }
  if (chainId === "534352") {
    publicClientAddress = mainnet.publicClientAddressScrollMainnet;
  }
  if (chainId === "1088") {
    publicClientAddress = mainnet.publicClientAddressMetisMainnet;
  }
  if (chainId === "50") {
    publicClientAddress = mainnet.publicClientAddressXDCMainnet;
  }
  if (chainId === "1313161554") {
    publicClientAddress = mainnet.publicClientAddressNearAuroraMainnet;
  }
  if (chainId === "1135") {
    publicClientAddress = mainnet.publicClientAddressLiskMainnet;
  }
  if (chainId === "2016") {
    publicClientAddress = mainnet.publicClientAddressMainnetzMainnet;
  }
  if (chainId === "1285") {
    publicClientAddress = mainnet.publicClientAddressMoonriverMainnet;
  }
  if (chainId === "1284") {
    publicClientAddress = mainnet.publicClientAddressMoonbeamMainnet;
  }
  if (chainId === "1116") {
    publicClientAddress = mainnet.publicClientAddressCoreMainnet;
  }
  if (chainId === "5000") {
    publicClientAddress = mainnet.publicClientAddressMantleMainnet;
  }
  if (chainId === "1329") {
    publicClientAddress = mainnet.publicClientAddressSeiMainnet;
  }
  if (chainId === "100") {
    publicClientAddress = mainnet.publicClientAddressGnosisMainnet;
  }
  if (chainId === "25") {
    publicClientAddress = mainnet.publicClientAddressCronosMainnet;
  }
  if (chainId === "388") {
    publicClientAddress = mainnet.publicClientAddressCronosZkEvm;
  }
  if (chainId === "324") {
    publicClientAddress = mainnet.publicClientAddressZksyncEraMainnet;
  }
  if (chainId === "11155111") {
    publicClientAddress = testnet.publicClientAddressSepoliaTestnet;
  }
  if (chainId === "534351") {
    publicClientAddress = testnet.publicClientAddressScrollTestnet;
  }
  if (chainId === "80002") {
    publicClientAddress = testnet.publicClientAddressPolygonAmoyTestnet;
  }
  if (chainId === "11155420") {
    publicClientAddress = testnet.publicClientAddressOptimismSepoliaTestnet;
  }
  if (chainId === "421614") {
    publicClientAddress = testnet.publicClientAddressArbitrumSepoliaTestnet;
  }
  if (chainId === "84532") {
    publicClientAddress = testnet.publicClientAddressBaseSepoliaTestnet;
  }
  if (chainId === "80085") {
    publicClientAddress = testnet.publicClientAddressBerachainTestnet;
  }
  if (chainId === "128123") {
    publicClientAddress = testnet.publicClientAddressEtherlinkTestnet;
  }
  if (chainId === "59902") {
    publicClientAddress = testnet.publicClientAddressMetisSepoliaTestnet;
  }
  if (chainId === "1313161555") {
    publicClientAddress = testnet.publicClientAddressNearAuroraTestnet;
  }
  if (chainId === "59141") {
    publicClientAddress = testnet.publicClientAddressLineaSepoliaTestnet;
  }
  if (chainId === "51") {
    publicClientAddress = testnet.publicClientAddressXDCApothemTestnet;
  }
  if (chainId === "4202") {
    publicClientAddress = testnet.publicClientAddressLiskSepoliaTestnet;
  }
  if (chainId === "1802203764") {
    publicClientAddress = testnet.publicClientAddressKakarotTestnet;
  }
  if (chainId === "9768") {
    publicClientAddress = testnet.publicClientAddressMainnetzTestnet;
  }
  if (chainId === "1287") {
    publicClientAddress = testnet.publicClientAddressMoonbaseAlphaTestnet;
  }
  if (chainId === "8008135") {
    publicClientAddress = testnet.publicClientAddressFhenixHeliumTestnet;
  }
  if (chainId === "1115") {
    publicClientAddress = testnet.publicClientAddressCoreTestnet;
  }
  if (chainId === "5003") {
    publicClientAddress = testnet.publicClientAddressMantleTestnet;
  }
  if (chainId === "10200") {
    publicClientAddress = testnet.publicClientAddressGnosisChiadoTestnet;
  }
  if (chainId === "713715") {
    publicClientAddress = testnet.publicClientAddressSeiTestnet;
  }
  if (chainId === "44433") {
    publicClientAddress = testnet.publicClientAddressUbitTestnet;
  }
  if (chainId === "338") {
    publicClientAddress = testnet.publicClientAddressCronosTestnet;
  }
  if (chainId === "282") {
    publicClientAddress = testnet.publicClientAddressCronosZkEvmTestnet;
  }
  if (chainId === "300") {
    publicClientAddress = testnet.publicClientAddressZkSyncEraSepoliaTestnet;
  }
  if (chainId === "1995") {
    publicClientAddress = testnet.publicClientAddressEdeXaTestnet;
  }

  return publicClientAddress;
}
