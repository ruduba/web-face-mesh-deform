'use client';
import React, { useRef, useEffect, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';

export default function FaceMeshViewer() {
  const videoRef = useRef(null);
  const mountRef = useRef(null);
  const [controls, setControls] = useState({
    jawWidth: 0,
    chinHeight: 0,
    mouthWidth: 0,
    lipThickness: 0,
    noseWidth: 0,
    noseHeight: 0,
    eyeSize: 0,
    eyeSpacing: 0,
    cheekFullness: 0,
    faceScale: 0,
  });

  useEffect(() => {
    let renderer, scene, camera, mesh, geometry, positions;
    let THREE, FACEMESH_TRIANGLES;

    const init = async () => {
      // ✅ Dynamic imports for Three.js + MediaPipe constants
      const threeMod = await import('three');
      THREE = threeMod.default;
      const { FACEMESH_TRIANGLES: TRIANGLES } = await import('@mediapipe/face_mesh');
      FACEMESH_TRIANGLES = TRIANGLES;

      // ✅ Setup renderer
      const mount = mountRef.current;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth || 640, mount.clientHeight || 480);
      mount.appendChild(renderer.domElement);

      // ✅ Scene + camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        (mount.clientWidth || 640) / (mount.clientHeight || 480),
        0.1,
        1000
      );
      camera.position.z = 2;

      // ✅ Lighting
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 0, 2);
      scene.add(light);

      // ✅ Face mesh geometry
      geometry = new THREE.BufferGeometry();
      positions = new Float32Array(468 * 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setIndex(Array.from(FACEMESH_TRIANGLES));
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: 0xff6666,
        wireframe: false,
        flatShading: true,
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // ✅ Setup MediaPipe FaceMesh
      const fm = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });
      fm.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      fm.onResults((results) => {
        if (!results.multiFaceLandmarks || !results.multiFaceLandmarks.length) return;
        const landmarks = results.multiFaceLandmarks[0];

        for (let i = 0; i < landmarks.length; i++) {
          const lm = landmarks[i];
          positions[i * 3] = lm.x - 0.5;
          positions[i * 3 + 1] = -lm.y + 0.5;
          positions[i * 3 + 2] = -lm.z;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
      });

      // ✅ Manual camera stream handler
      const video = videoRef.current;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();

        const processFrame = async () => {
          await fm.send({ image: video });
          requestAnimationFrame(processFrame);
        };
        processFrame();
      } catch (err) {
        console.error('Camera access denied or not available', err);
      }

      // ✅ Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        mesh.rotation.y += 0.005;
        renderer.render(scene, camera);
      };
      animate();
    };

    init();

    return () => {
      if (renderer) renderer.dispose();
    };
  }, []);

  const handleControlChange = (key, value) => {
    setControls((prev) => ({ ...prev, [key]: parseFloat(value) }));
  };

  return (
    <div className="flex flex-col items-center p-4 text-white bg-neutral-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-1">Web Character Face Editor</h1>
      <p className="text-sm mb-3">Live webcam → deformable face mesh. Use the sliders to sculpt.</p>

      <div className="flex w-full justify-center space-x-4">
        {/* Webcam feed */}
        <video ref={videoRef} autoPlay muted className="rounded-lg border border-gray-700" width="240" height="180" />

        {/* 3D mesh viewer */}
        <div ref={mountRef} className="rounded-lg bg-neutral-950 w-[640px] h-[480px]" />

        {/* Controls */}
        <div className="flex flex-col text-sm space-y-2">
          <h2 className="text-lg font-semibold mb-2">Character Customization</h2>
          {Object.keys(controls).map((key) => (
            <div key={key}>
              <label>{key}</label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={controls[key]}
                onChange={(e) => handleControlChange(key, e.target.value)}
                className="w-full accent-red-500"
              />
            </div>
          ))}
          <button className="bg-red-600 px-3 py-1 mt-2 rounded hover:bg-red-700 text-white text-xs">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
