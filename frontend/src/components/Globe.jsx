import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

/* Convert lat/lng to 3D position */
function convertLatLngToPosition(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

/* EARTH */
function Earth() {
  const day = useLoader(THREE.TextureLoader, "/earth.jpg");
  const lights = useLoader(THREE.TextureLoader, "/earth_lights.png");

  const earthRef = useRef();

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0009;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={day}
        emissiveMap={lights}
        emissive={new THREE.Color(0xffffff)}
        emissiveIntensity={0.35}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

/* ROUND PHOTO */
function PhotoSprite({ photo, radius, onClick }) {
  const texture = useLoader(THREE.TextureLoader, photo.url);
  texture.anisotropy = 16;

  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const position = useMemo(
    () => convertLatLngToPosition(photo.lat, photo.lng, radius + 0.22),
    [photo.lat, photo.lng, radius]
  );

  // Always face camera
  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.lookAt(camera.position);

      const targetScale = hovered ? 0.75 : 0.6;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[0.6, 0.6, 0.6]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onClick(photo.url)}
    >
      <circleGeometry args={[0.5, 64]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
      />
    </mesh>
  );
}

/* ROTATING GLOBE GROUP */
function RotatingGlobe({ photos, setSelectedPhoto }) {
  const groupRef = useRef();
  const radius = 2;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0012;
    }
  });

  return (
    <group ref={groupRef}>
      <Earth />

      {photos.map((photo) => (
        <PhotoSprite
          key={photo._id}
          photo={photo}
          radius={radius}
          onClick={setSelectedPhoto}
        />
      ))}
    </group>
  );
}

/* MAIN GLOBE */
export default function Globe({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <>
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
        <color attach="background" args={["#000000"]} />

        {/* More authentic subtle stars */}
        <Stars
          radius={300}
          depth={100}
          count={5000}
          factor={3}
          saturation={0}
          fade
          speed={0.2}
        />

        {/* Lighting for depth */}
        <directionalLight position={[5, 3, 5]} intensity={1.4} />
        <ambientLight intensity={0.5} />

        <RotatingGlobe
          photos={photos}
          setSelectedPhoto={setSelectedPhoto}
        />

        <OrbitControls
          enableZoom
          enableDamping
          dampingFactor={0.05}
          autoRotate
          autoRotateSpeed={0.25}
          minDistance={4}
          maxDistance={10}
        />
      </Canvas>

      {/* MODAL */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={selectedPhoto}
            alt=""
            style={{
              maxWidth: "85%",
              maxHeight: "85%",
              borderRadius: "16px",
              boxShadow: "0 0 80px rgba(255,255,255,0.15)",
            }}
          />
        </div>
      )}
    </>
  );
}