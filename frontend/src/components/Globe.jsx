import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

function convertLatLngToPosition(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

export default function Globe({ photos }) {
  const radius = 2;

  const photoPositions = useMemo(() => {
    return photos.map(photo => ({
      ...photo,
      position: convertLatLngToPosition(photo.lat, photo.lng, radius)
    }));
  }, [photos]);

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />

      {/* Globe Wireframe */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial color="black" wireframe />
      </mesh>

      {/* Photos */}
      {photoPositions.map(photo => (
        <Html key={photo._id} position={photo.position}>
          <img
            src={photo.url}
            alt=""
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer"
            }}
          />
        </Html>
      ))}

      <OrbitControls enableZoom />
    </Canvas>
  );
}