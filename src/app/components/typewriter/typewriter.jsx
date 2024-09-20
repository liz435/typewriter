'use client'

import React, { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ao, disp, diff, arm } from "../assetManager";
import * as THREE from 'three';

// Dynamically import Three.js related components with ssr: false
const DynamicCanvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), { ssr: false });
const DynamicOrbitControls = dynamic(() => import('@react-three/drei').then((mod) => mod.OrbitControls), { ssr: false });
const DynamicPerspectiveCamera = dynamic(() => import('@react-three/drei').then((mod) => mod.PerspectiveCamera), { ssr: false });

function TypewriterMesh() {
  const [textures, setTextures] = useState(null);

  useEffect(() => {
    // Load textures on the client side
    const loadTextures = async () => {
      const { TextureLoader } = await import('three/src/loaders/TextureLoader');
      const loader = new TextureLoader();
      
      try {
        const loadedTextures = await Promise.all([
          loader.loadAsync(ao),
          loader.loadAsync(disp),
          loader.loadAsync(diff),
          loader.loadAsync(arm)
        ]);


        // loadedTextures.forEach(texture => {
        //     texture.wrapS = THREE.RepeatWrapping;
        //     texture.wrapT = THREE.RepeatWrapping;
        //     texture.repeat.set(4, 4); 
        //   });

        setTextures(loadedTextures);
        console.log("Textures loaded successfully:", loadedTextures);
      } catch (error) {
        console.error("Error loading textures:", error);
      }
    };

    loadTextures();
  }, []);

  if (!textures) return null;
  const [aoMap, dispMap, diffMap, armMap] = textures;

//   const shape = new THREE.Shape();
//   const length = 12, width = 8;
// shape.moveTo( 0,0 );
// shape.lineTo( 0, width );
// shape.lineTo( length, width );
// shape.lineTo( length, 0 );
// shape.lineTo( 0, 0 );



// const extrudeSettings = {
// 	steps: 2,
// 	depth: 16,
// 	bevelEnabled: true,
// 	bevelThickness: 1,
// 	bevelSize: 1,
// 	bevelOffset: 0,
// 	bevelSegments: 1
// };

  return (
    <mesh rotation={[0,Math.PI/2,-Math.PI/6]}>
      {/* <extrudeGeometry args={[shape, extrudeSettings]} /> */}
      <boxGeometry args={[2,5,5]}/>
      <meshPhongMaterial 
        aoMap={aoMap}
        // displacementMap={dispMap}
        map={diffMap}
        armMap={armMap}
        metalnessMap={armMap}
      />
    </mesh>
  );
}

export default function Typewriter() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    console.log("Texture paths:", { ao, disp, diff, arm });
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <DynamicCanvas >
        <DynamicOrbitControls />
        <DynamicPerspectiveCamera
          position={[-1, 10, 2]}
          fov={75}
          near={0.1}
          far={1000}
        />
        
        <ambientLight intensity={5} />
        <directionalLight position={[0, 0, 5]} intensity={1} castShadow />
        
        <Suspense fallback={null}>
          <TypewriterMesh  />
        </Suspense>
      </DynamicCanvas>
    </div>
  );
}