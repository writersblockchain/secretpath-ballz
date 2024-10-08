import React, { useMemo, useEffect, useLayoutEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { usePlane, useSphere } from "@react-three/cannon";
import niceColors from "nice-color-palettes";

const tempColor = new THREE.Color();
const data = Array.from({ length: 200 }, () => ({
  color: niceColors[17][Math.floor(Math.random() * 5)],
  scale: 0.25 + Math.random(),
}));

export function InstancedSpheres({ count }) {
  const { viewport } = useThree();
  const [ref, api] = useSphere((index) => ({
    mass: data[index].scale * 100,
    position: [4 - Math.random() * 8, viewport.height * 3, 0, 0],
    args: [data[index].scale],
  }));
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(count)
          .fill()
          .flatMap((_, i) => tempColor.set(data[i].color).toArray())
      ),
    [count]
  );
  useLayoutEffect(() => {
    // Cannon does not support variable size for instances (yet), so this is something that's exclusive to react
    for (let i = 0; i < count; i++)
      api.at(i).scaleOverride([data[i].scale, data[i].scale, data[i].scale]);
  }, [api, count]);
  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <sphereGeometry args={[1, 64, 64]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </sphereGeometry>
      <meshBasicMaterial toneMapped={false} vertexColors />
    </instancedMesh>
  );
}

export function Borders() {
  const { viewport } = useThree();
  return (
    <>
      <Plane
        position={[0, -viewport.height / 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Plane
        position={[-viewport.width / 2 - 1, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Plane
        position={[viewport.width / 2 + 1, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Plane position={[0, 0, -1]} rotation={[0, 0, 0]} />
      <Plane position={[0, 0, 12]} rotation={[0, -Math.PI, 0]} />
    </>
  );
}

export function Plane({ color, position = [0, 0, 0], ...props }) {
  const [, api] = usePlane(() => ({ ...props }));
  useEffect(() => api.position.set(...position), [api, position]);
  return null;
}

export function Mouse() {
  const { viewport } = useThree();
  const [, api] = useSphere(() => ({ type: "Kinematic", args: [4] }));
  useFrame((state) =>
    api.position.set(
      (state.mouse.x * viewport.width) / 2,
      (state.mouse.y * viewport.height) / 2,
      7
    )
  );
  return null; 
}
