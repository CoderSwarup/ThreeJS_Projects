import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { Model } from "./Model";
import { degToRad } from "three/src/math/MathUtils.js";
import gsap from "gsap";

export default function About() {
  const [tab, setTab] = useState(0);
  const pointLightRef = useRef();
  const modelRef = useRef();

  // Handle tab changes and trigger GSAP animation
  useEffect(() => {
    const positions = [
      { x: 3, y: -8, scale: 3, rotation: degToRad(-40) }, // Tab 0: Aglaea
      { x: 1, y: -8, scale: 2, rotation: degToRad(-10) },
      { x: -2, y: -8, scale: 4, rotation: degToRad(10) },
    ];

    const pointLightpositions = [
      { x: -0.2, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: -2 },
    ];

    if (modelRef.current) {
      const { x, y, rotation, scale } = positions[tab];

      gsap.to(modelRef.current.position, {
        x: x,
        y: y,
        scale: scale,
        duration: 1.5,
        ease: "power2.inOut",
      });

      gsap.to(modelRef.current.rotation, {
        y: rotation,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }
  }, [tab]);

  return (
    <section className="main">
      <Canvas
        camera={{
          position: [0, 0, 4],
          fov: 75,
        }}
      >
        <pointLight
          ref={pointLightRef}
          position={[0, 0, 2]}
          intensity={10}
          color={"#fff"}
        />

        {/* Model with GSAP animation */}
        <group
          ref={modelRef}
          position-x={3}
          position-y={-8}
          rotation-y={degToRad(-40)}
          scale={3}
        >
          <Model />
        </group>
      </Canvas>

      {/* Tab Content */}
      <div className="a">
        <div className="about">
          <div className="top-tab">
            <h1
              className={`${tab === 0 && "active"}`}
              onClick={() => setTab(0)}
            >
              Aglaea
            </h1>
            <h1
              className={`${tab === 1 && "active"}`}
              onClick={() => setTab(1)}
            >
              Thalia
            </h1>
            <h1
              className={`${tab === 2 && "active"}`}
              onClick={() => setTab(2)}
            >
              Euphre
            </h1>
          </div>

          {/* Description content */}
          <div className="description">
            {tab === 0 && (
              <p>
                She was venerated as the goddess of beauty, splendor, glory,
                magnificence, and adornment. She is the youngest of the Charites
                according to Hesiod. Aglaea is one of three daughters of Zeus
                and either the Oceanid Eurynome, or of Eunomia, the goddess of
                good order and lawful conduct.
              </p>
            )}
            {tab === 1 && (
              <p>
                Thalia, in Greek religion, one of the nine Muses, patron of
                comedy; also, according to the Greek poet Hesiod, a Grace (one
                of a group of goddesses of fertility). She is the mother of the
                Corybantes, celebrants of the Great Mother of the Gods, Cybele,
                the father being Apollo, a god related to music and dance. In
                her hands she carried the comic mask and the shepherd’s staff.
              </p>
            )}
            {tab === 2 && (
              <p>
                Euphrosyne is a Goddess of Good Cheer, Joy and Mirth. Her name
                is the female version of a Greek word euphrosynos, which means
                "merriment". The Greek poet Pindar states that these goddesses
                were created to fill the world with pleasant moments and good
                will. Usually the Charites attended the goddess of beauty
                Aphrodite.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
