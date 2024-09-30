let chainImages = {
    // Arbitrum Mainnet
    42161: "https://arbiscan.io/images/svg/brands/arbitrum.svg?v=1.5",
    // Linea Mainnet
    59144: "https://lineascan.build/images/svg/brands/main.svg?v=24.4.2.0",
    //Scroll Mainnet
    534352: "https://scrollecosystem.io/images/banner_logo.png",
    // Metis Mainnet
    1088: "https://cms-cdn.avascan.com/cms2/metis.97de56bab032.svg",
     // XDC Mainnet
     50: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe2KDAtPElT99WYln7tyeQPlPCiBWaRfRA_guAL0HImJWBcRympM_r5VBSiOR29zFpKIU&usqp=CAU",
     // Lisk Mainnet
     1135: "https://cryptologos.cc/logos/lisk-lsk-logo.png?v=032",
     //Mainnetz Mainnet
     2016: "https://assets.coingecko.com/coins/images/33947/large/zcM8MEO5_400x400.png?1703537595",
      //Core Mainnet
      1116: "https://scan.test.btcs.network/images/icon.png",
       //Mantle Mainnet
     5000: "https://www.mantle.xyz/logo-light.svg",
     //Cronos Mainnet
     25: "https://cryptologos.cc/logos/cronos-cro-logo.svg?v=032",
     // Cronos Zk Mainnet
     388: "https://docs.cronos.org/~gitbook/image?url=https%3A%2F%2F1786307500-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FqXsIo4b4WtOTfICyOIxa%252Ficon%252FjttFGLyNrcsRyiavSGOl%252FCGzQIEVX_400x400.png%3Falt%3Dmedia%26token%3D9955a6fa-7d27-48a0-bc9d-534e107668d8&width=32&dpr=2&quality=100&sign=3cf5e6d3&sv=1",
    // Zksync Era Mainnet
    324: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAOVBMVEVHcEzz8/Py8vLy8vLy8vL29vbi4uKCgoI/Pz9aWlr6+vrZ2dlnZ2cAAACioqKbm5sjIyO7u7vx8fEHp9RtAAAAE3RSTlMATtH9///////////////////NLBPW6gAAALRJREFUeAGN0wUSAyEQBEBscf//Y5M5auNQmZKTxkUIqbT5Ea3k3cw2Uqg9KqG3prUwh/yH9PxHH0jW0cOcpSfCfIiMMXgoI6VcQiTkwhISMcKKrw1JF5YMBcI4jEvFq/WBdkbHO1oWxgY2fJNpnb+AeX30dhdKz6IWzS7tA0MYnS0neg4I80ytvBpPhRGpftnCq2WgIYoUY4C9Ll/YLt9+4c9bts8Z9d706WjO86HeXocpxQ06RxKNJbAEDwAAAABJRU5ErkJggg==",
    //Sepolia Testnet
    11155111:
      "https://moralis.io/wp-content/uploads/web3wiki/159-goerli/637aee14aa9d9f521437ec16_hYC2y965v3QD7fEoVvutzGbJzVGLSOk6RZPwEQWcA_E.jpeg",
    // Scroll Testnet
    534351: "https://scrollecosystem.io/images/banner_logo.png",
    // Polygon Amoy Testnet
    80002:
      "https://assets-global.website-files.com/637e2b6d602973ea0941d482/63e26c8a3f6e812d91a7aa3d_Polygon-New-Logo.png",
    // Optimism Testnet
    11155420:
      "https://optimistic.etherscan.io/assets/optimism/images/svg/logos/chain-light.svg?v=24.4.4.4",
    // Arbitrum Testnet
    421614: "https://arbiscan.io/images/svg/brands/arbitrum.svg?v=1.5",
    // Base Sepolia Testnet
    84532: "https://sepolia.basescan.org/images/svg/brands/main.svg?v=24.4.4.9",
    // Berachain Testnet
    80085:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq-tjg8Kqgr76Ved6PbcjBoGCHWwnhDUljH-CziyBOzw&s",
    // Etherlink Testnet
    128123: "https://www.etherlink.com/favicon.ico",
    //Metis Sepolia Testnet
    59902: "https://cms-cdn.avascan.com/cms2/metis.97de56bab032.svg",
    // Near Aurora Testnet
    1313161555:
      "https://pbs.twimg.com/profile_images/1610936866227818502/kIqkTKdR_400x400.jpg",
    // Linea Testnet
    59141: "https://lineascan.build/images/svg/brands/main.svg?v=24.4.2.0",
    // XDC Testnet
    51: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe2KDAtPElT99WYln7tyeQPlPCiBWaRfRA_guAL0HImJWBcRympM_r5VBSiOR29zFpKIU&usqp=CAU",
    //Lisk Sepolia
    4202: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRan6D0dfiYmx2sv4kUPsFkfUDxYUWEuuA_dLJWgPm8Q&s",
     // Kakarot Testnet
     1802203764: "https://assets-global.website-files.com/6464a063474b57e2c4e03b61/64a20e2749d92613acf4fd1b_Logo%20dark.svg",
      // Mainnetz Testnet
      9768: "https://assets.coingecko.com/coins/images/33947/large/zcM8MEO5_400x400.png?1703537595",
      // Moonbeam Testnet
      1287: "https://moonbase.moonscan.io/assets/moonbase/images/svg/logos/chain-light.svg?v=24.6.1.0",
       // Fhenix Testnet
       8008135: "https://media.licdn.com/dms/image/D4D0BAQFtUjFKqv_DJA/company-logo_200_200/0/1695715998703/fhenix_logo?e=2147483647&v=beta&t=U2cvAqKuWeEqE5Cb4HgyuBmVTUcBuZvsDi0JdivU3nw",
          //Core Testnet
      1115: "https://scan.test.btcs.network/images/icon.png",
      //Mantle Testnet
    5003: "https://www.mantle.xyz/logo-light.svg",
    //Cronos Testnet
    338: "https://cryptologos.cc/logos/cronos-cro-logo.svg?v=032",
         // Cronos Zk Testnet
     282: "https://docs.cronos.org/~gitbook/image?url=https%3A%2F%2F1786307500-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FqXsIo4b4WtOTfICyOIxa%252Ficon%252FjttFGLyNrcsRyiavSGOl%252FCGzQIEVX_400x400.png%3Falt%3Dmedia%26token%3D9955a6fa-7d27-48a0-bc9d-534e107668d8&width=32&dpr=2&quality=100&sign=3cf5e6d3&sv=1",
 
    // Zksync Era Sepolia
     300: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAOVBMVEVHcEzz8/Py8vLy8vLy8vL29vbi4uKCgoI/Pz9aWlr6+vrZ2dlnZ2cAAACioqKbm5sjIyO7u7vx8fEHp9RtAAAAE3RSTlMATtH9///////////////////NLBPW6gAAALRJREFUeAGN0wUSAyEQBEBscf//Y5M5auNQmZKTxkUIqbT5Ea3k3cw2Uqg9KqG3prUwh/yH9PxHH0jW0cOcpSfCfIiMMXgoI6VcQiTkwhISMcKKrw1JF5YMBcI4jEvFq/WBdkbHO1oWxgY2fJNpnb+AeX30dhdKz6IWzS7tA0MYnS0neg4I80ytvBpPhRGpftnCq2WgIYoUY4C9Ll/YLt9+4c9bts8Z9d706WjO86HeXocpxQ06RxKNJbAEDwAAAABJRU5ErkJggg=="
};