import React, { useRef, forwardRef } from "react";
import { useGLTF } from "@react-three/drei";

// Wrap Model with forwardRef to allow refs to be passed
export const Model = (props) => {
  const { nodes, materials } = useGLTF("models/gltf/graces-draco2.glb");

  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="Node_3"
          castShadow
          receiveShadow
          geometry={nodes.Node_3.geometry}
          material={materials["Scene_-_Root"]}
        />
      </group>
    </group>
  );
};

useGLTF.preload("models/gltf/graces-draco2.glb");
