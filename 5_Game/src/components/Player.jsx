import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRapier, RigidBody } from "@react-three/rapier";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useGame from "../store/useGame";

export default function Player() {
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  const playerRef = useRef();
  const cameraRotation = useRef(0);
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  const blocksCount = useGame((state) => state.blocksCount);
  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);

  const [isDragging, setIsDragging] = useState(false); // Tracks drag state
  const [lastMousePosition, setLastMousePosition] = useState(null);
  const [cameraDistance, setCameraDistance] = useState(5);

  const {
    forward: forwardEvent,
    backward: backwardEvent,
    leftward: leftwardEvent,
    rightward: rightwardEvent,
    jump: jumpEvent,
  } = useGame();

  const jump = () => {
    const origin = playerRef.current.translation(); // get the Position of the Ball From the Floor
    origin.y -= 0.31;

    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray);

    if (hit.toi < 0.15) {
      playerRef.current.applyImpulse({ x: 0, y: 1.5, z: 0 });
    }
  };

  const reset = () => {
    playerRef.current.setTranslation({ x: 0, y: 1, z: 0 });
    playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useEffect(() => {
    const unsubcribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        console.log("Pahes change to ", value);
        if (value === "ready") {
          reset();
        }
      }
    );
    const unsubcribeJump = subscribeKeys(
      (state) => {
        return state.jump;
      },
      (value) => {
        // console.log(value);
        if (value) {
          jump();
        }
      }
    );

    const unsubcribeAny = subscribeKeys((state) => {
      start();
    });
    return () => {
      unsubcribeReset();
      unsubcribeJump();
      unsubcribeAny();
    };
  }, []);

  useEffect(() => {
    if (
      forwardEvent ||
      jumpEvent ||
      rightwardEvent ||
      leftwardEvent ||
      backwardEvent
    ) {
      start();
    }
  }, [forwardEvent, jumpEvent, rightwardEvent, leftwardEvent, backwardEvent]);

  useEffect(() => {
    let initialPinchDistance = null; // To track the starting distance between two fingers
    let isPinching = false;

    // Mouse event listeners
    const handleMouseDown = (event) => {
      setIsDragging(true);
      setLastMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setLastMousePosition(null);
    };

    const handleMouseMove = (event) => {
      if (!isDragging || !lastMousePosition) return;

      const deltaX = event.clientX - lastMousePosition.x;
      cameraRotation.current -= deltaX * 0.005; // Adjust sensitivity
      setLastMousePosition({ x: event.clientX, y: event.clientY });
    };

    // Touch event listeners
    const handleTouchStart = (event) => {
      if (event.touches.length === 1) {
        // Single-finger touch for rotation
        const touch = event.touches[0];
        setIsDragging(true);
        setLastMousePosition({ x: touch.clientX, y: touch.clientY });
      } else if (event.touches.length === 2) {
        // Two-finger touch for pinch zoom
        isPinching = true;
        const distance = calculateDistance(event.touches[0], event.touches[1]);
        initialPinchDistance = distance;
      }
    };

    const handleTouchMove = (event) => {
      if (event.touches.length === 1 && isDragging && lastMousePosition) {
        // Single-finger movement for rotation
        const touch = event.touches[0];
        const deltaX = touch.clientX - lastMousePosition.x;
        cameraRotation.current -= deltaX * 0.005; // Adjust sensitivity
        setLastMousePosition({ x: touch.clientX, y: touch.clientY });
      } else if (event.touches.length === 2 && isPinching) {
        // Two-finger movement for pinch zoom
        const distance = calculateDistance(event.touches[0], event.touches[1]);
        const zoomDelta = (distance - initialPinchDistance) * 0.01; // Adjust sensitivity
        setCameraDistance((prevDistance) => {
          const newDistance = prevDistance - zoomDelta; // Subtract to zoom in, add to zoom out
          return Math.min(Math.max(newDistance, 2), 10); // Clamp between 2 and 10
        });
        initialPinchDistance = distance; // Update the initial distance for next calculation
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      initialPinchDistance = null;
      isPinching = false;
    };

    const handleWheel = (event) => {
      setCameraDistance((prevDistance) => {
        const newDistance = prevDistance + event.deltaY * 0.01; // Adjust sensitivity
        return Math.min(Math.max(newDistance, 2), 10); // Clamp distance between 2 and 10
      });
    };

    // Helper function to calculate the distance between two touch points
    const calculateDistance = (touch1, touch2) => {
      const deltaX = touch2.clientX - touch1.clientX;
      const deltaY = touch2.clientY - touch1.clientY;
      return Math.sqrt(deltaX ** 2 + deltaY ** 2);
    };

    // Attach event listeners
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel);

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      // Cleanup event listeners
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);

      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, lastMousePosition]);

  useFrame((state, delta) => {
    /**
     * KeyBoard Controls
     */
    const keys = getKeys();
    const { forward, backward, leftward, rightward, rotateLeft, rotateRight } =
      keys;

    if (rotateLeft) {
      cameraRotation.current += 1 * delta; // Rotate counter-clockwise
    }
    if (rotateRight) {
      cameraRotation.current -= 1 * delta; // Rotate clockwise
    }

    // Limit rotation to stay within a full circle
    cameraRotation.current = cameraRotation.current % (2 * Math.PI);

    // To move The Position of the Player randomly

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward || forwardEvent) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (rightward || rightwardEvent) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    if (backward || backwardEvent) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }

    if (leftward || leftwardEvent) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    playerRef.current.applyImpulse(impulse);
    playerRef.current.applyTorqueImpulse(torque);

    /**
     * Camera Controls
     */
    const playerPosition = playerRef.current.translation();

    // const cameraPosition = new THREE.Vector3();
    // cameraPosition.copy(playerPosition);
    // cameraPosition.z += 2.25;
    // cameraPosition.y += 0.55;

    // const cameraDistance = 5; // Distance from the player
    const cameraHeight = 2; // Height above the player
    const cameraPosition = new THREE.Vector3(
      playerPosition.x + Math.sin(cameraRotation.current) * cameraDistance,
      playerPosition.y + cameraHeight,
      playerPosition.z + Math.cos(cameraRotation.current) * cameraDistance
    );

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(playerPosition);
    cameraTarget.y += 0.2;

    // to get the values from the current Positon to target positon in the little latency
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    const camera = state.camera;
    camera.position.copy(smoothedCameraPosition);
    camera.lookAt(smoothedCameraTarget);

    /**
     * End Phase or the Final Block
     */
    if (playerPosition.z < -(blocksCount * 4 + 2)) {
      // console.log("Game Win");
      end();
    }

    if (playerPosition.y < -4) {
      reset();
      restart();
    }
    if (jumpEvent) {
      jump();
    }
  });
  return (
    <>
      <RigidBody
        ref={playerRef}
        colliders="ball"
        restitution={0.2}
        friction={1}
        // Follwoing is To Use Stop the Ball From the Rotating
        linearDamping={0.5}
        angularDamping={0.5}
        position={[0, 0.2, 0]}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[0.4, 1]} />
          <meshStandardMaterial flatShading color={"mediumpurple"} />
        </mesh>
      </RigidBody>
    </>
  );
}

// useFrame((state, delta) => {
//   /**
//    * KeyBoard Controls
//    */
//   const keys = getKeys();
//   const { forward, backward, leftward, rightward, jump } = keys;

//   // To move The Position of the Player randomly

//   const impulse = { x: 0, y: 0, z: 0 };
//   const torque = { x: 0, y: 0, z: 0 };

//   const impulseStrength = 0.6 * delta;
//   const torqueStrength = 0.2 * delta;

//   if (forward) {
//     impulse.z -= impulseStrength;
//     torque.x -= torqueStrength;
//   }

//   if (rightward) {
//     impulse.x += impulseStrength;
//     torque.z -= torqueStrength;
//   }

//   if (backward) {
//     impulse.z += impulseStrength;
//     torque.x += torqueStrength;
//   }

//   if (leftward) {
//     impulse.x -= impulseStrength;
//     torque.z += torqueStrength;
//   }

//   playerRef.current.applyImpulse(impulse);
//   playerRef.current.applyTorqueImpulse(torque);

//   /**
//    * Camera Controls
//    */
//   const playerPosition = playerRef.current.translation();

//   const cameraPosition = new THREE.Vector3();
//   cameraPosition.copy(playerPosition);
//   cameraPosition.z += 2.25;
//   cameraPosition.y += 0.55;

//   const cameraTarget = new THREE.Vector3();
//   cameraTarget.copy(playerPosition);
//   cameraTarget.y += 0.2;

//   // to get the values from the current Positon to target positon in the little latency
//   smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
//   smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

//   const camera = state.camera;
//   camera.position.copy(smoothedCameraPosition);
//   camera.lookAt(smoothedCameraTarget);

//   /**
//    * End Phase or the Final Block
//    */
//   if (playerPosition.z < -(blocksCount * 4 + 2)) {
//     // console.log("Game Win");
//     end();
//   }

//   if (playerPosition.y < -4) {
//     reset();
//     restart();
//   }
// });
