// components/Controls.jsx
import React from "react";

export default function Controls({ controls, setControls, onExport, onReset }) {
  function handle(key) {
    return (e) => {
      const v = parseFloat(e.target.value);
      setControls((p) => ({ ...p, [key]: v }));
    };
  }

  return (
    <aside className="panel" style={{ padding: 12 }}>
      <h2 style={{ marginTop: 0 }}>Character Customization</h2>

      <section style={{ marginBottom: 10 }}>
        <h3 style={{ margin: "8px 0" }}>Jaw & Chin</h3>
        <label>
          Jaw Width
          <input type="range" min="0.6" max="1.6" step="0.01" value={controls.jawWidth} onChange={handle("jawWidth")} />
        </label>
        <br />
        <label>
          Chin Height
          <input type="range" min="0.6" max="1.6" step="0.01" value={controls.chinHeight} onChange={handle("chinHeight")} />
        </label>
      </section>

      <section style={{ marginBottom: 10 }}>
        <h3 style={{ margin: "8px 0" }}>Mouth</h3>
        <label>
          Mouth Width
          <input type="range" min="0.7" max="1.5" step="0.01" value={controls.mouthWidth} onChange={handle("mouthWidth")} />
        </label>
        <br />
        <label>
          Lip Thickness
          <input type="range" min="0.7" max="1.6" step="0.01" value={controls.lipThickness} onChange={handle("lipThickness")} />
        </label>
      </section>

      <section style={{ marginBottom: 10 }}>
        <h3 style={{ margin: "8px 0" }}>Nose</h3>
        <label>
          Nose Width
          <input type="range" min="0.7" max="1.6" step="0.01" value={controls.noseWidth} onChange={handle("noseWidth")} />
        </label>
        <br />
        <label>
          Nose Height
          <input type="range" min="0.8" max="1.4" step="0.01" value={controls.noseHeight} onChange={handle("noseHeight")} />
        </label>
      </section>

      <section style={{ marginBottom: 10 }}>
        <h3 style={{ margin: "8px 0" }}>Eyes</h3>
        <label>
          Eye Size
          <input type="range" min="0.7" max="1.5" step="0.01" value={controls.eyeSize} onChange={handle("eyeSize")} />
        </label>
        <br />
        <label>
          Eye Spacing
          <input type="range" min="0.85" max="1.15" step="0.005" value={controls.eyeSpacing} onChange={handle("eyeSpacing")} />
        </label>
      </section>

      <section style={{ marginBottom: 10 }}>
        <h3 style={{ margin: "8px 0" }}>Cheeks & Face</h3>
        <label>
          Cheek Fullness
          <input type="range" min="0.7" max="1.5" step="0.01" value={controls.cheekFullness} onChange={handle("cheekFullness")} />
        </label>
        <br />
        <label>
          Face Scale
          <input type="range" min="0.85" max="1.15" step="0.01" value={controls.faceScale} onChange={handle("faceScale")} />
        </label>
      </section>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={onExport}>Export STL</button>
        <button onClick={onReset} style={{ background: "#c33", color: "#fff" }}>Reset</button>
      </div>
    </aside>
  );
}
