import { Clone, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { MeshStandardMaterial } from "three";
import { degToRad, MathUtils } from "three/src/math/MathUtils";
import { audios, playAudio } from "../utils/audioManager";

export const CAR_MODELS = [
  "sedanSports",
  "raceFuture",
  "taxi",
  "ambulance",
  "police",
  "truck",
  "firetruck",
];

const SWITCH_DURATION = 600;

export const CarSwitcher = ({ player }) => {
  const changedCarAt = useRef(0);
  const container = useRef();
  const [carModel, setCurrentCarModel] = useState(player.getState("car"));
  useFrame(() => {
    const timeSinceChange = Date.now() - changedCarAt.current;
    if (timeSinceChange < SWITCH_DURATION / 2) {
      container.current.rotation.y +=
        2 * (timeSinceChange / SWITCH_DURATION / 2);
      container.current.scale.x =
        container.current.scale.y =
        container.current.scale.z =
          1 - timeSinceChange / SWITCH_DURATION / 2;
    } else if (timeSinceChange < SWITCH_DURATION) {
      container.current.rotation.y +=
        4 * (1 - timeSinceChange / SWITCH_DURATION);
      container.current.scale.x =
        container.current.scale.y =
        container.current.scale.z =
          timeSinceChange / SWITCH_DURATION;
      if (container.current.rotation.y > Math.PI * 2) {
        container.current.rotation.y -= Math.PI * 2;
      }
    }
    if (timeSinceChange >= SWITCH_DURATION) {
      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        Math.PI * 2,
        0.1
      );
    }
  }, []);
  const newCar = player.getState("car");
  if (newCar !== carModel) {
    playAudio(audios.car_start);
    changedCarAt.current = Date.now();
    setTimeout(() => {
      setCurrentCarModel(newCar);
    }, SWITCH_DURATION / 2);
  }
  return (
    <group ref={container}>
      <Car model={carModel} />
    </group>
  );
};

export const Car = ({ model = CAR_MODELS[0], ...props }) => {
  const { scene } = useGLTF(`/models/cars/${model}.glb`);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material.name === "window") {
          child.material.transparent = true;
          child.material.opacity = 0.5;
        }
        if (
          child.material.name.startsWith("paint") ||
          child.material.name === "wheelInside"
        ) {
          // child.material.rougness = 0.1;
          // child.material.metalness = 1.0;

          child.material = new MeshStandardMaterial({
            color: child.material.color,
            metalness: 0.5,
            roughness: 0.1,
          });
        }
        // console.log(child.material.name);
        if (child.material.name.startsWith("light")) {
          child.material.emissive = child.material.color;
          child.material.emissiveIntensity = 4;
          child.material.toneMapped = false;
        }
      }
    });
  }, [scene]);
  return (
    <group {...props}>
      <Clone
        object={scene}
        rotation-y={degToRad(180)}
        castShadow
        receiveShadow
      />
    </group>
  );
};

CAR_MODELS.forEach((model) => {
  useGLTF.preload(`/models/cars/${model}.glb`);
});
