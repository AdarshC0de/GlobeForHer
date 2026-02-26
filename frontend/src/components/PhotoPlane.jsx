import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useState } from "react";

export default function PhotoPlane({ url, position }) {
  const texture = useLoader(TextureLoader, url);
  const [selected, setSelected] = useState(false);

  return (
    <>
      <mesh position={position} onClick={() => setSelected(true)}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {selected && (
        <div className="modal">
          <img src={url} />
        </div>
      )}
    </>
  );
}