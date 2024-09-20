// 'use client'
import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Canvas
        shadows
        className={('bg-stone-500')}
        camera={{
          position: [-6, 7, 7],
        }}
      >


      </Canvas>
    </div>
  );
}