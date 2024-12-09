import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import React from "react";

export default function Effects() {
  return (
    <EffectComposer>
      <DepthOfField focusDistance={0.01} focalLength={0.2} bokehScale={3} />
    </EffectComposer>
  );
}
