// lib/stlExport.js
export async function exportMeshAsSTL(mesh, filename = 'facemesh.stl') {
  const THREE = await import('three');
  const { STLExporter } = await import('three/examples/jsm/exporters/STLExporter');

  if (!mesh || !mesh.geometry) {
    console.error("No mesh found to export!");
    return;
  }

  // Clone the mesh to avoid modifying the one on screen
  const meshClone = mesh.clone();
  meshClone.updateMatrixWorld(true);

  // Create STL exporter
  const exporter = new STLExporter();

  // Export the geometry to STL text
  const stlString = exporter.parse(meshClone, { binary: false });

  // Create a Blob from STL text and trigger download
  const blob = new Blob([stlString], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
