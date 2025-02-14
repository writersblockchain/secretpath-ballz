// querySecret.js
import { SecretNetworkClient } from "secretjs";

export const querySecret = async () => {
  const secretjs = new SecretNetworkClient({
    url: "https://pulsar.lcd.secretnodes.com",
    chainId: "pulsar-3",
  });

  try {
    const query_tx = await secretjs.query.compute.queryContract({
      contract_address: process.env.REACT_APP_SECRET_ADDRESS,
      code_hash: process.env.REACT_APP_CODE_HASH,
      query: { retrieve_random: {} },
    });
    console.log("secretjs_url: ", secretjs.url);
    return query_tx.random; // Return the fetched random number
  } catch (error) {
    console.error("Error fetching random number:", error);
    return 1; // Return a default value in case of error
  }
};
