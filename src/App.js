import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { useInitEthereum } from "./functions/initEthereum";
import { Mouse, Plane, Borders, InstancedSpheres } from "./functions/createBalls";
import MyImage from "./poweredby.png";
import { handleSubmit } from "./functions/submit";
import { initializeWeb3Modal } from './config/web3ModalConfig';

export const App = () => {
  const [chainId, setChainId] = useState("");
  const [ballCount, setBallCount] = useState(1);

  useEffect(() => {
    initializeWeb3Modal();
  }, []);

  useInitEthereum(setChainId);

  return (
    <>
      <div className="heading">
        <h3>Cross-Chain Secret VRF Demo</h3>
        <h6>
          <a
            href="https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/usecases/vrf/vrf-developer-tutorial"
            target="_blank"
            rel="noopener noreferrer"
          >
            [click here for docs]
          </a>
        </h6>
      </div>

      <div className="button-container">
        <button onClick={(e) => handleSubmit(e, setBallCount)}>
          Give me Secret Balls
        </button>

        <img
          src={MyImage}
          alt="Descriptive Alt Text"
          style={{ marginTop: "10px", maxWidth: "100px" }}
        />
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
  );
};
