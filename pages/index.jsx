// pages/index.jsx
import React, { useRef, useState } from "react";
import FaceMeshViewer from "../components/face-mesh-viewer";
import Controls from "../components/controls";

export default function Home() {
  const viewerRef = useRef(null);

  // high-level controls object (character editor)
  const [controls, setControls] = useState({
    jawWidth: 1.0,
    chinHeight: 1.0,
    mouthWidth: 1.0,
    lipThickness: 1.0,
    noseWidth: 1.0,
    noseHeight: 1.0,
    eyeSize: 1.0,
    eyeSpacing: 1.0,
    cheekFullness: 1.0,
    faceScale: 1.0
  });

  return (
    <main style={{ display: "flex", gap: 20, padding: 18 }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ margin: 0 }}>Web Character Face Editor</h1>
        <p style={{ marginTop: 6, marginBottom: 18, color: "#bbb" }}>
          Live webcam → deformable face mesh. Use the sliders to sculpt.
        </p>

        <FaceMeshViewer ref={viewerRef} controls={controls} />
      </div>

      <div style={{ width: 340 }}>
        <Controls
          controls={controls}
          setControls={setControls}
          onExport={() => viewerRef.current?.exportSTL?.()}
          onReset={() => {
            // reset UI sliders and tell viewer
            setControls({
              jawWidth: 1.0,
              chinHeight: 1.0,
              mouthWidth: 1.0,
              lipThickness: 1.0,
              noseWidth: 1.0,
              noseHeight: 1.0,
              eyeSize: 1.0,
              eyeSpacing: 1.0,
              cheekFullness: 1.0,
              faceScale: 1.0
            });
            viewerRef.current?.resetMesh?.();
          }}
        />
      </div>
    </main>
  );
}
