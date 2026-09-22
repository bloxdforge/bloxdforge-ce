"use client";

/**
 *  Copyright (c) 2026 khrotu. Apache License 2.0.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Environment } from '@react-three/drei';
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Loader2, AlertTriangle } from 'lucide-react';
interface ModelViewerProps {
  file: File;
}
export default function ModelViewer({ file }: ModelViewerProps) {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!file) return;
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setScene(null);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!isMounted) return;
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) {
        setError("Failed to read file buffer.");
        setIsLoading(false);
        return;
      }
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      loader.parse(
        buffer,
        '',
        (gltf) => {
          if (isMounted) {
            setScene(gltf.scene);
            setIsLoading(false);
          }
        },
        (err) => {
          if (isMounted) {
            console.error("GLB Parse Error:", err);
            setError("Invalid GLB file data.");
            setIsLoading(false);
          }
        }
      );
    };
    reader.onerror = () => {
      if (isMounted) {
        setError("Error reading file.");
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
    return () => {
      isMounted = false;
      dracoLoader.dispose();
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            }
          }
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);
  if (isLoading) {
    return (
      <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center text-text-subtle gap-3">
        <Loader2 className="animate-spin w-8 h-8 text-primary" data-force-animation="on" />
        <span className="text-xs font-mono">Parsing GLB...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center text-red-400 gap-3">
        <AlertTriangle className="w-8 h-8" />
        <span className="text-sm font-bold">Load Failed</span>
        <span className="text-xs text-text-subtle">{error}</span>
      </div>
    );
  }
  if (!scene) return null;
  return (
    <div className="w-full h-full bg-[#0a0a0a] relative">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [5, 5, 5], fov: 50 }}>
        <color attach="background" args={['#151515']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <Environment files="/environment/potsdamer_platz_1k.hdr" />
        <Center top>
          <primitive object={scene} />
        </Center>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={1} minPolarAngle={0} maxPolarAngle={Math.PI} />
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-gray-300 pointer-events-none border border-white/10">
        {file.name}
      </div>
    </div>
  );
}
