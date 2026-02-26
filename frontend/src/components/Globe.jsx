import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function convertLatLngToPosition(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

function Earth() {
  const day = useLoader(THREE.TextureLoader, "/earth.jpg");
  const lights = useLoader(THREE.TextureLoader, "/earth_lights.png");

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={day}
        emissiveMap={lights}
        emissive={new THREE.Color(0xffffff)}
        emissiveIntensity={0.4}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[2.05, 64, 64]} />
      <meshStandardMaterial
        color="#3fa9f5"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function PhotoSprite({ photo, radius, onClick }) {
  const texture = useLoader(THREE.TextureLoader, photo.url);
  texture.anisotropy = 16;

  const spriteRef = useRef();
  const position = convertLatLngToPosition(photo.lat, photo.lng, radius + 0.25);

  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (spriteRef.current) {
      const target = hovered ? 0.65 : 0.5;
      spriteRef.current.scale.lerp(
        new THREE.Vector3(target, target, target),
        0.08
      );
    }
  });

  return (
    <sprite
      ref={spriteRef}
      position={position}
      scale={[0.5, 0.5, 0.5]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onClick(photo.url)}
    >
      <spriteMaterial map={texture} />
    </sprite>
  );
}

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
      <Atmosphere />

      {photos.map(photo => (
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

export default function Globe({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <>
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
        <color attach="background" args={["#000000"]} />

        <Stars
          radius={300}
          depth={80}
          count={8000}
          factor={2}
          saturation={0}
          fade
          speed={0.5}
        />

        <directionalLight
          position={[5, 3, 5]}
          intensity={1.5}
        />

        <ambientLight intensity={0.6} />

        <RotatingGlobe
          photos={photos}
          setSelectedPhoto={setSelectedPhoto}
        />

        <OrbitControls
          enableZoom
          enableDamping
          dampingFactor={0.05}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>

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
              borderRadius: "12px",
              boxShadow: "0 0 60px rgba(255,255,255,0.2)"
            }}
          />
        </div>
      )}
    </>
  );
}