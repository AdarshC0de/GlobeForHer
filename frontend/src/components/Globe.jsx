import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Globe({ photos }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
      {/* Lighting */}
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />

      {/* BLACK OUTLINE GLOBE */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial 
          color="black" 
          wireframe={true} 
        />
      </mesh>

      <OrbitControls enableZoom />
    </Canvas>
  );
}