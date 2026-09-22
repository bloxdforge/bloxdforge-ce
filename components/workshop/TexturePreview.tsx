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

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useEffect, useMemo } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';
interface SkyboxFaces {
  px: string | null;
  nx: string | null;
  py: string | null;
  ny: string | null;
  pz: string | null;
  nz: string | null;
}
interface BloxdIslandProps {
  textures: { [key: string]: string };
  skybox?: SkyboxFaces | null;
}
const DEFAULT_SKYBOX: { px: string; nx: string; py: string; ny: string; pz: string; nz: string } = {
  px: '/textures/default/skyBoxes/gloomy/_px.jpg',
  nx: '/textures/default/skyBoxes/gloomy/_nx.jpg',
  py: '/textures/default/skyBoxes/gloomy/_py.jpg',
  ny: '/textures/default/skyBoxes/gloomy/_ny.jpg',
  pz: '/textures/default/skyBoxes/gloomy/_pz.jpg',
  nz: '/textures/default/skyBoxes/gloomy/_nz.jpg',
};
function Block({ position, texture, color }: { position: [number, number, number], texture?: string, color?: string }) {
  const map = useMemo(() => {
    if (!texture) return null;
    const tex = new THREE.TextureLoader().load(texture);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [texture]);
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={map} color={color || (map ? undefined : '#555')} />
    </mesh>
  );
}
function MultiFaceBlock({ position, textures }: { position: [number, number, number], textures: string[] }) {
  const maps = useMemo(() => {
    return textures.map(url => {
      if (!url) return null;
      const tex = new THREE.TextureLoader().load(url);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });
  }, [textures]);
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      {maps.map((map, i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} map={map} color={map ? undefined : '#555'} />
      ))}
    </mesh>
  );
}
function Skybox({ faces }: { faces: SkyboxFaces }) {
  const { scene } = useThree();
  useEffect(() => {
    const loader = new THREE.CubeTextureLoader();
    const sources: string[] = [
      faces.px ?? DEFAULT_SKYBOX.px,
      faces.nx ?? DEFAULT_SKYBOX.nx,
      faces.py ?? DEFAULT_SKYBOX.py,
      faces.ny ?? DEFAULT_SKYBOX.ny,
      faces.pz ?? DEFAULT_SKYBOX.pz,
      faces.nz ?? DEFAULT_SKYBOX.nz,
    ];
    let texture: THREE.CubeTexture | null = null;
    let disposed = false;
    loader.load(
      sources,
      (loaded) => {
        if (disposed) return;
        texture = loaded;
        texture.colorSpace = THREE.SRGBColorSpace;
        scene.background = texture;
      },
      undefined,
      () => {
        if (disposed) return;
        const fallback = loader.load(
          [DEFAULT_SKYBOX.px, DEFAULT_SKYBOX.nx, DEFAULT_SKYBOX.py, DEFAULT_SKYBOX.ny, DEFAULT_SKYBOX.pz, DEFAULT_SKYBOX.nz],
          (loaded) => {
            if (disposed) return;
            loaded.colorSpace = THREE.SRGBColorSpace;
            scene.background = loaded;
          }
        );
        texture = fallback;
      }
    );
    return () => {
      disposed = true;
      if (scene.background === texture) scene.background = null;
      texture?.dispose();
    };
  }, [faces.px, faces.nx, faces.py, faces.ny, faces.pz, faces.nz, scene]);
  return null;
}
function Scene({ textures }: BloxdIslandProps) {
  const islandShape = [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0, 0],
  ];
  const chestMaps = useMemo(() => [
    textures['chest_side'],
    textures['chest_side'],
    textures['chest_top'],
    textures['chest_top'],
    textures['chest_front'],
    textures['chest_side'],
  ], [textures]);
  const oreSlots = useMemo(() => {
    return [
      { dx: 0, dz: 0, y: 2, key: 'coal_ore' },
      { dx: 2, dz: 1, y: 2, key: 'iron_ore' },
      { dx: 5, dz: 2, y: 2, key: 'gold_ore' },
      { dx: 0, dz: 1, y: 0, key: 'coal_ore' },
      { dx: 2, dz: 0, y: 1, key: 'lapis_ore' },
      { dx: 4, dz: 2, y: 1, key: 'iron_ore' },
      { dx: 5, dz: 0, y: 1, key: 'emerald_ore' },
      { dx: 1, dz: 2, y: 0, key: 'diamond_ore' },
      { dx: 3, dz: 2, y: 0, key: 'moonstone_ore' },
    ];
  }, []);
  const oreKey = (x: number, z: number, y: number): string | undefined => {
    const slot = oreSlots.find((s) => s.dx === x && s.dz === z && s.y === y);
    return slot?.key;
  };
  return (
    <group position={[0, -2, 0]}>
      {islandShape.map((row, z) =>
        row.map((val, x) => {
          if (!val) return null;
          const worldX = x - 3;
          const worldZ = z - 3;
          return (
            <group key={`${x}-${z}`}>
              <Block position={[worldX, 0, worldZ]} texture={textures[oreKey(x, z, 0) ?? 'stone'] ?? textures['stone']} />
              <Block position={[worldX, 1, worldZ]} texture={textures[oreKey(x, z, 1) ?? 'stone'] ?? textures['stone']} />
              <Block position={[worldX, 2, worldZ]} texture={textures[oreKey(x, z, 2) ?? 'stone'] ?? textures['stone']} />
              <Block position={[worldX, 3, worldZ]} texture={textures['dirt']} />
              <Block position={[worldX, 4, worldZ]} texture={textures['grass_top']} />
            </group>
          );
        })
      )}
      {[5, 6, 7, 8].map(y => (
        <Block key={`log-${y}`} position={[-2, y, -2]} texture={textures['log_maple']} />
      ))}
      {Array.from({length: 5}, (_, x) =>
        Array.from({length: 5}, (_, z) => (
          <Block key={`leaf1-${x}-${z}`} position={[x - 4, 8, z - 4]} texture={textures['leaves_maple']} />
        ))
      )}
      {Array.from({length: 3}, (_, x) =>
        Array.from({length: 3}, (_, z) => (
          <Block key={`leaf2-${x}-${z}`} position={[x - 3, 9, z - 3]} texture={textures['leaves_maple']} />
        ))
      )}
      <Block position={[-2, 10, -2]} texture={textures['leaves_maple']} />
      <group position={[2, 5, -2]} rotation={[0, -Math.PI / 2, 0]}>
         <MultiFaceBlock position={[0, 0, 0]} textures={chestMaps} />
      </group>
    </group>
  );
}
export default function TexturePreview({ textures, skybox }: BloxdIslandProps) {
  const { schematicAntiAlias, schematicShadows } = useSettingsStore();
  const resolvedSkybox = useMemo<SkyboxFaces>(() => {
    if (!skybox) return DEFAULT_SKYBOX;
    return {
      px: skybox.px,
      nx: skybox.nx,
      py: skybox.py,
      ny: skybox.ny,
      pz: skybox.pz,
      nz: skybox.nz,
    };
  }, [skybox]);
  return (
    <div className="w-full h-full bg-[#0a0a0a] overflow-hidden">
      <Canvas
        camera={{ position: [8, 8, 8], fov: 50 }}
        dpr={[1, 2]}
        shadows={schematicShadows}
        gl={{ antialias: schematicAntiAlias }}
        key={`${schematicAntiAlias}-${schematicShadows}`}
      >
        <Skybox faces={resolvedSkybox} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow={schematicShadows} />
        <OrbitControls autoRotate autoRotateSpeed={1.5} maxPolarAngle={Math.PI / 1.8} />
        <Scene textures={textures} />
        <Suspense fallback={null}>
          <Environment files="/environment/rooitou_park_1k.hdr" background={false} blur={0.8} />
        </Suspense>
      </Canvas>
    </div>
  );
}