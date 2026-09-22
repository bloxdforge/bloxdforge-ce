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

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Stats } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import PlayerControls, { Joystick } from './PlayerControls';
import { getBloxdTextureName } from '@/lib/client-texture-map';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import type { ParsedBloxdSchematic } from '@/lib/converter';
const globalImageBitmapCache = new Map<string, Promise<ImageBitmap | null>>();
const globalModelExistsCache = new Map<string, Promise<boolean>>();
const TEXTURE_SIZE = 16;
const ATLAS_SIZE = 1024;
const DEFAULT_TEXTURE_ROOT = '/textures/default/textures';
const DEFAULT_MODEL_ROOT = '/textures/default/models';
const MODEL_Y_EPSILON = 0.001; 
enum RenderType {
  OPAQUE = 0,
  GLASS = 1,
  FLORA = 2,
  WATER = 3,
}
interface BlockProps {
  type: RenderType;
  isTransparent: boolean;
}
interface DebugModelInspectInfo {
  blockId: number;
  rawBlockName: string;
  normalizedBlockName: string;
  mcId: string;
  kind: CustomModelKind;
  resolvedModelName: string;
  yawRadians: number;
  yawDegrees: number;
  yawSource: string;
  chunkPos: [number, number, number];
  chunkLocalPos: [number, number, number];
  blockPos: [number, number, number];
  blockData: Record<string, unknown> | null;
}
interface GridData {
  grid: Uint32Array;
  blockDataMap: Map<string, Record<string, unknown>>;
  width: number;
  height: number;
  length: number;
}
interface MergedSchematicMeshProps {
  data: ParsedBloxdSchematic;
  gridData: GridData;
  atlasTexture: THREE.Texture;
  uvMap: Record<number, FaceUvMap>;
  customModelById: Record<number, CustomModelKind>;
  blockPropsById: Record<number, BlockProps>;
  setProgress: (progress: number) => void;
}
interface ModelInstancesProps {
  data: ParsedBloxdSchematic;
  gridData: GridData;
  modelNameById: Record<number, string>;
  blockNameById: Record<number, string>;
  modelYawById: Record<number, number>;
  modelScenes: Record<string, THREE.Object3D>;
  mcIdByBlockId: Record<number, string>;
  customModelById: Record<number, CustomModelKind>;
  blockPropsById: Record<number, BlockProps>;
  airBlockIds: Set<number>;
  debugMode: boolean;
  onInspectModel: (info: DebugModelInspectInfo) => void;
}
interface ModelLayout {
  key: string;
  scene: THREE.Object3D;
  pos: [number, number, number];
  rot: [number, number, number];
  localPos: [number, number, number];
  localRot: [number, number, number];
  scale: [number, number, number];
  debugInfo: {
    blockId: number;
    mcId: string;
    kind: CustomModelKind;
    yaw: number;
    yawSource: string;
    chunkPos: [number, number, number];
    chunkLocalPos: [number, number, number];
    globalPos: [number, number, number];
    bd: Record<string, unknown> | undefined;
  };
}
declare global {
  interface Window {
    joystickVec?: { x: number; y: number };
    schematicVerticalMove?: number;
  }
}
type BlockFace = 'top' | 'bottom' | 'north' | 'south' | 'east' | 'west';
type FaceUvMap = Record<BlockFace, number[]> & {
  flora: number[];
};
type FaceTextureMap = Record<BlockFace, string> & {
  flora: string;
};
type CustomModelKind =
  | 'door'
  | 'trapdoor'
  | 'ladder'
  | 'bed'
  | 'banner'
  | 'board'
  | 'carpet'
  | 'potion_table'
  | 'enchanting_table'
  | 'pod';
const DEFAULT_FACES: BlockFace[] = ['top', 'bottom', 'north', 'south', 'east', 'west'];
const DEFAULT_FACE_UV: FaceUvMap = {
  top: [0, 0, 1, 1],
  bottom: [0, 0, 1, 1],
  north: [0, 0, 1, 1],
  south: [0, 0, 1, 1],
  east: [0, 0, 1, 1],
  west: [0, 0, 1, 1],
  flora: [0, 0, 1, 1],
};
const TEXTURE_SIDE_STEMS = new Set<string>(['apple_block', 'artisan_table', 'banana_block', 'beetroot_block', 'black_spawn_block', 'blue_spawn_block', 'bone_block', 'bread_block', 'brown_spawn_block', 'cactus', 'carrot_block', 'cherry_block', 'chest', 'chili_pepper_block', 'coconut_block', 'corn_block', 'crafting_table', 'custom_lobby_block', 'cyan_spawn_block', 'diamond_gen_spawn', 'drop_location_block', 'explosive_paint_black', 'explosive_paint_blue', 'explosive_paint_brown', 'explosive_paint_cyan', 'explosive_paint_gray', 'explosive_paint_green', 'explosive_paint_light_blue', 'explosive_paint_light_gray', 'explosive_paint_lime', 'explosive_paint_magenta', 'explosive_paint_orange', 'explosive_paint_pink', 'explosive_paint_purple', 'explosive_paint_red', 'explosive_paint_white', 'explosive_paint_yellow', 'fallen_cherry_leaves', 'fallen_maple_leaves', 'furnace', 'gray_spawn_block', 'green_spawn_block', 'hay_block', 'iron_chest', 'iron_watermelon', 'leather_block', 'light_blue_spawn_block', 'light_gray_spawn_block', 'lime_spawn_block', 'magenta_spawn_block', 'mailbox', 'mango_block', 'melon', 'mob_spawner_block_empty', 'mob_spawner_hostile_block', 'mob_spawner_neutral_block', 'mob_spawner_passive_block', 'moonstone_chest', 'moonstone_explosive', 'moonstone_gen_spawn', 'orange_spawn_block', 'ore_gen_spawn', 'pear_block', 'pine_cone_block', 'pink_spawn_block', 'plum_block', 'pumpkin', 'purple_spawn_block', 'quartz_block', 'red_spawn_block', 'shop_trader_spawn', 'shop_wizard_spawn', 'slab_andesite_brick', 'slab_aspen', 'slab_brick', 'slab_cedar', 'slab_cherry', 'slab_chiseled_red_sandstone', 'slab_chiseled_sandstone', 'slab_cobblestone', 'slab_cut_red_sandstone', 'slab_cut_sandstone', 'slab_diorite_brick', 'slab_dirt', 'slab_elm', 'slab_engraved_andesite', 'slab_engraved_diorite', 'slab_engraved_granite', 'slab_granite_brick', 'slab_grass_top', 'slab_ice_brick', 'slab_jungle', 'slab_jungle_grass_top', 'slab_mango', 'slab_maple', 'slab_mossy_cobblestone', 'slab_palm', 'slab_pear', 'slab_pine', 'slab_pine_grass_top', 'slab_plum', 'slab_red_sandstone', 'slab_red_sandstone_brick', 'slab_sandstone_brick', 'slab_sandstone_normal', 'slab_smooth_stone', 'slab_spectral', 'slab_stone', 'slab_stone_andesite', 'slab_stone_andesite_smooth', 'slab_stone_diorite', 'slab_stone_diorite_smooth', 'slab_stone_granite', 'slab_stone_granite_smooth', 'slab_stonebrick', 'slab_stonebrick_carved', 'slab_stonebrick_mossy', 'snowy_messy_stone', 'watermelon', 'white_spawn_block', 'yellow_spawn_block']);
const TEXTURE_TOP_STEMS = new Set<string>(['apple_block', 'artisan_table', 'aspen_door', 'banana_block', 'beetroot_block', 'black_spawn_block', 'blue_gen_spawn', 'blue_spawn_block', 'bone_block', 'bread_block', 'brown_spawn_block', 'cactus', 'carrot_block', 'cedar_door', 'cherry_block', 'cherry_door', 'chest', 'chili_pepper_block', 'coconut_block', 'corn_block', 'crafting_table', 'custom_lobby_block', 'cyan_gen_spawn', 'cyan_spawn_block', 'diamond_gen_spawn', 'drop_location_block', 'elm_door', 'explosive_paint_black', 'explosive_paint_blue', 'explosive_paint_brown', 'explosive_paint_cyan', 'explosive_paint_gray', 'explosive_paint_green', 'explosive_paint_light_blue', 'explosive_paint_light_gray', 'explosive_paint_lime', 'explosive_paint_magenta', 'explosive_paint_orange', 'explosive_paint_pink', 'explosive_paint_purple', 'explosive_paint_red', 'explosive_paint_white', 'explosive_paint_yellow', 'furnace', 'grass', 'gray_gen_spawn', 'gray_spawn_block', 'green_spawn_block', 'hay_block', 'iron_watermelon', 'jungle_door', 'jungle_tall_grass', 'leather_block', 'light_blue_spawn_block', 'light_gray_spawn_block', 'lime_gen_spawn', 'lime_spawn_block', 'magenta_spawn_block', 'mango_block', 'mango_door', 'maple_door', 'melon', 'mob_spawner_block', 'moonstone_chest', 'moonstone_explosive', 'moonstone_gen_spawn', 'orange_spawn_block', 'ore_gen_spawn', 'palm_door', 'pear_block', 'pear_door', 'pine_cone_block', 'pine_door', 'pink_gen_spawn', 'pink_spawn_block', 'plum_block', 'plum_door', 'podzol', 'pumpkin', 'purple_spawn_block', 'red_gen_spawn', 'red_sandstone', 'red_spawn_block', 'sandstone', 'shop_trader_spawn', 'shop_wizard_spawn', 'spectral_door', 'sugar_cane_plant_stage2', 'tall_grass', 'tomato_plant_stage2', 'watermelon', 'white_gen_spawn', 'white_spawn_block', 'yellow_gen_spawn', 'yellow_spawn_block']);
const TEXTURE_BOTTOM_STEMS = new Set<string>(['apple_block', 'aspen_door', 'banana_block', 'beetroot_block', 'carrot_block', 'cedar_door', 'cherry_block', 'cherry_door', 'chili_pepper_block', 'coconut_block', 'corn_block', 'elm_door', 'iron_chest', 'jungle_door', 'jungle_tall_grass', 'mango_block', 'mango_door', 'maple_door', 'moonstone_chest', 'palm_door', 'pear_block', 'pear_door', 'pine_door', 'plum_block', 'plum_door', 'spectral_door', 'tall_grass']);
const TEXTURE_FRONT_STEMS = new Set<string>(['bread_block', 'chest', 'furnace', 'iron_chest', 'mailbox', 'moonstone_chest']);
const TEXTURE_BACK_STEMS = new Set<string>(['bread_block', 'chest', 'iron_chest', 'moonstone_chest']);
function removePngSuffix(filename: string): string { return filename.endsWith('.png') ? filename.slice(0, -4) : filename; }
function resolveFacing(mcId: string): 'north' | 'south' | 'east' | 'west' | null { const match = mcId.match(/facing=(north|south|east|west)/); return (match?.[1] as 'north' | 'south' | 'east' | 'west' | undefined) ?? null; }
function normalizeCardinalFacing(value: unknown): 'north' | 'south' | 'east' | 'west' | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'north' || normalized === 'south' || normalized === 'east' || normalized === 'west') return normalized;
  return null;
}
function parseNumericLike(value: unknown): number | null { if (typeof value === 'number' && Number.isFinite(value)) return value; if (typeof value !== 'string') return null; const parsed = Number.parseFloat(value.trim()); return Number.isFinite(parsed) ? parsed : null; }
function getMcAttribute(mcId: string, key: string): string | null { const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const match = mcId.match(new RegExp(`${escapedKey}=([^,\\]]+)`)); return match?.[1] ?? null; }
function parseBooleanLike(value: unknown): boolean | null { if (typeof value === 'boolean') return value; if (typeof value !== 'string') return null; const normalized = value.trim().toLowerCase(); if (normalized === 'true') return true; if (normalized === 'false') return false; return null; }
function parseHalfLike(value: unknown): 'top' | 'bottom' | null { if (typeof value === 'string') { const normalized = value.trim().toLowerCase(); if (['top', 'upper', 'up'].includes(normalized)) return 'top'; if (['bottom', 'lower', 'down'].includes(normalized)) return 'bottom'; } return null; }
function resolveYawFromBlockData(blockData: Record<string, unknown> | undefined, yawFromFacing: (facing: 'north' | 'south' | 'east' | 'west' | null) => number): number | null {
  if (!blockData) return null;
  const facing = normalizeCardinalFacing(blockData.facing) ?? normalizeCardinalFacing(blockData.direction) ?? normalizeCardinalFacing(blockData.face);
  if (facing) return yawFromFacing(facing);
  const rotationRaw = blockData.rotation ?? blockData.rot ?? blockData.yaw;
  const rotation = parseNumericLike(rotationRaw);
  if (rotation === null) return null;
  const wrapped = ((Math.round(rotation) % 16) + 16) % 16;
  if (wrapped >= 1 && wrapped <= 4) return yawFromFacing((['south', 'east', 'north', 'west'] as const)[wrapped - 1]);
  if (wrapped <= 3) return yawFromFacing((['south', 'east', 'north', 'west'] as const)[wrapped]);
  const quarterTurn = Math.round(wrapped / 4) % 4;
  return yawFromFacing((['south', 'east', 'north', 'west'] as const)[quarterTurn]);
}
function resolveTrapdoorIsOpen(mcId: string, blockData?: Record<string, unknown>): boolean {
  if (blockData && Object.prototype.hasOwnProperty.call(blockData, 'open')) { const parsed = parseBooleanLike(blockData.open); if (parsed !== null) return parsed; }
  return parseBooleanLike(getMcAttribute(mcId, 'open')) ?? mcId.includes('open=true');
}
function resolveTrapdoorIsTop(mcId: string, blockData?: Record<string, unknown>): boolean {
  if (blockData && Object.prototype.hasOwnProperty.call(blockData, 'half')) { const parsed = parseHalfLike(blockData.half); if (parsed !== null) return parsed === 'top'; }
  return parseHalfLike(getMcAttribute(mcId, 'half')) === 'top';
}
function normalizeBlockName(blockName: string): string { return blockName.split('|')[0].replace(/^_+/, '').replace(/\s+Top$/i, '').replace(/\s+Head$/i, '').trim(); }
function getBaseMcName(mcId: string): string { return mcId.replace('minecraft:', '').split('[')[0].toLowerCase(); }
function detectCustomModelKind(blockName: string, mcId: string): CustomModelKind | null {
  const normalizedName = normalizeBlockName(blockName);
  const baseMcName = getBaseMcName(mcId);
  if (baseMcName.includes('potion_table') || /\bpotion\s*table\b/i.test(normalizedName)) return 'potion_table';
  if (baseMcName.includes('enchanting_table') || baseMcName.includes('enchanting_trapdoor') || /\benchant(ing)?\s*table\b/i.test(normalizedName)) return 'enchanting_table';
  if (baseMcName.includes('carpet')) return 'carpet';
  if (baseMcName.includes('trapdoor')) return 'trapdoor';
  if (baseMcName === 'door' || baseMcName.endsWith('_door')) return 'door';
  if (baseMcName.includes('ladder')) return 'ladder';
  if (baseMcName === 'bed' || baseMcName.endsWith('_bed') || /\bstrongbed\b/i.test(normalizedName) || /\bbed\b/i.test(normalizedName)) return 'bed';
  if (baseMcName.includes('banner') || /\bbanner\b/i.test(normalizedName)) return 'banner';
  if (baseMcName.includes('sign') || /\bboard\b/i.test(normalizedName)) return 'board';
  if (/_pod(_|$)/.test(baseMcName)) return 'pod';
  return null;
}
function modelUrlFromName(modelName: string): string { return `${DEFAULT_MODEL_ROOT}/${encodeURIComponent(modelName)}.glb`; }
function resolveModelNameForBlock(blockName: string, mcId: string, kind: CustomModelKind): string[] {
  const normalizedName = normalizeBlockName(blockName);
  const baseMcName = getBaseMcName(mcId);
  const part = getMcAttribute(mcId, 'part');
  const half = getMcAttribute(mcId, 'half');
  const candidates: string[] = [];
  if (kind === 'carpet') {
    const carpetColor = baseMcName.endsWith('_carpet') ? baseMcName.slice(0, -'_carpet'.length) : baseMcName;
    candidates.push(`carpet_${carpetColor}_model`);
    if (carpetColor === 'moss') candidates.push('carpet_green_model');
  } else if (kind === 'potion_table') { candidates.push('Potion Table');
  } else if (kind === 'enchanting_table') {
    const materialPrefix = normalizedName.match(/^(.+?)\s+enchanting\s+table$/i)?.[1]?.trim();
    if (materialPrefix) candidates.push(`${materialPrefix} Enchanting Table`);
    candidates.push(normalizedName, 'Wood Enchanting Table', 'Stone Enchanting Table', 'Iron Enchanting Table', 'Gold Enchanting Table', 'Diamond Enchanting Table');
  } else if (kind === 'door') {
    if (half === 'upper' || /\bTop\b/i.test(blockName)) candidates.push(`_${normalizedName} Top`);
    else candidates.push(`${normalizedName}`);
  } else if (kind === 'trapdoor' || kind === 'ladder') { candidates.push(normalizedName);
  } else if (kind === 'bed') {
    if (part === 'head' || /\bHead\b/i.test(blockName)) candidates.push(`_${normalizedName} Head`);
    else candidates.push(`${normalizedName}`);
  } else if (kind === 'banner') {
    if (/\bFlag\b/i.test(blockName) || /\btop\b/i.test(blockName) || /\bside\b/i.test(blockName)) candidates.push(`_${normalizedName} Flag`);
    else if (/\bHanging\b/i.test(blockName) || /\bbot\b/i.test(blockName)) candidates.push(`_${normalizedName} Hanging`, `_${normalizedName} Flag Hanging`);
    else candidates.push(normalizedName);
  } else if (kind === 'board') { candidates.push('Board');
  } else { candidates.push(`_${normalizedName}`, normalizedName); }
  return Array.from(new Set(candidates));
}
function resolveYawFromBloxdBlockName(blockName: string, yawFromFacing: (facing: 'north' | 'south' | 'east' | 'west' | null) => number): number | null {
  const rotationIdx = Number.parseInt(blockName.match(/meta\|rot\|?([1-4])/i)?.[1] ?? '', 10);
  if (!Number.isFinite(rotationIdx) || rotationIdx < 1 || rotationIdx > 4) return null;
  const faceDirs: Array<'south' | 'east' | 'north' | 'west'> = ['south', 'east', 'north', 'west'];
  return yawFromFacing(faceDirs[rotationIdx - 1]);
}
function getBloxdRotationIndex(blockName: string): 1 | 2 | 3 | 4 | null {
  const rotationIdx = Number.parseInt(blockName.match(/meta\|rot\|?([1-4])/i)?.[1] ?? '', 10);
  if (rotationIdx === 1 || rotationIdx === 2 || rotationIdx === 3 || rotationIdx === 4) return rotationIdx;
  return null;
}
function formatCompassFromYaw(yawRadians: number): { label: string; bearingDeg: number } {
  const bearing = (((THREE.MathUtils.radToDeg(yawRadians) + 180) % 360) + 360) % 360;
  const labels = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return { label: labels[Math.round(bearing / 22.5) % labels.length], bearingDeg: Number(bearing.toFixed(1)) };
}
function CameraHeadingTracker({ onHeadingChange }: { onHeadingChange: (yawRadians: number) => void }) {
  const { camera } = useThree();
  const lastYaw = React.useRef(0);
  const forward = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    camera.getWorldDirection(forward);
    const yaw = Math.atan2(-forward.x, forward.z);
    if (Math.abs(yaw - lastYaw.current) > 0.001) { lastYaw.current = yaw; onHeadingChange(yaw); }
  });
  return null;
}
function StaticModelInstance({ layout, debugMode, onInspect, blockNameById, modelNameById }: {
  layout: ModelLayout;
  debugMode: boolean;
  onInspect: (info: DebugModelInspectInfo) => void;
  blockNameById: Record<number, string>;
  modelNameById: Record<number, string>;
}) {
  const l = layout;
  const clone = useMemo(() => l.scene.clone(true), [l.scene]);
  const groupRef = React.useRef<THREE.Group>(null);
  React.useLayoutEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.updateMatrix();
    g.traverse((o) => { o.updateMatrix(); o.matrixAutoUpdate = false; });
    g.updateMatrixWorld(true);
  }, []);
  return (
    <group ref={groupRef} position={l.pos} rotation={l.rot} onPointerDown={(e) => {
      if (!debugMode || e.button !== 2) return;
      e.stopPropagation(); e.nativeEvent.preventDefault();
      const rawBlockName = blockNameById[l.debugInfo.blockId] ?? '';
      onInspect({
        blockId: l.debugInfo.blockId, rawBlockName, normalizedBlockName: normalizeBlockName(rawBlockName), mcId: l.debugInfo.mcId, kind: l.debugInfo.kind, resolvedModelName: modelNameById[l.debugInfo.blockId],
        yawRadians: Number(l.debugInfo.yaw.toFixed(6)), yawDegrees: Number(THREE.MathUtils.radToDeg(l.debugInfo.yaw).toFixed(2)), yawSource: l.debugInfo.yawSource,
        chunkPos: l.debugInfo.chunkPos, chunkLocalPos: l.debugInfo.chunkLocalPos, blockPos: l.debugInfo.globalPos, blockData: l.debugInfo.bd ?? null,
      });
    }}>
      <primitive object={clone} position={l.localPos} rotation={l.localRot} scale={l.scale} />
    </group>
  );
}
function resolveFaceTexturesForBlock(mcId: string, fallbackFilename: string): FaceTextureMap {
  const baseStem = removePngSuffix(fallbackFilename);
  const unsuffixedStem = baseStem.replace(/_(top|side|bottom|front|back)$/i, '');
  const stemCandidates = Array.from(new Set([unsuffixedStem.toLowerCase(), baseStem.toLowerCase()]));
  const pickStemFrom = (set: Set<string>) => stemCandidates.find((c) => set.has(c)) ?? null;
  const sideTexture = pickStemFrom(TEXTURE_SIDE_STEMS) ? `${pickStemFrom(TEXTURE_SIDE_STEMS)}_side.png` : fallbackFilename;
  const topTexture = pickStemFrom(TEXTURE_TOP_STEMS) ? `${pickStemFrom(TEXTURE_TOP_STEMS)}_top.png` : fallbackFilename;
  const bottomTexture = pickStemFrom(TEXTURE_BOTTOM_STEMS) ? `${pickStemFrom(TEXTURE_BOTTOM_STEMS)}_bottom.png` : sideTexture;
  const frontTexture = pickStemFrom(TEXTURE_FRONT_STEMS) ? `${pickStemFrom(TEXTURE_FRONT_STEMS)}_front.png` : sideTexture;
  const backTexture = pickStemFrom(TEXTURE_BACK_STEMS) ? `${pickStemFrom(TEXTURE_BACK_STEMS)}_back.png` : sideTexture;
  const faces: FaceTextureMap = { top: topTexture, bottom: bottomTexture, north: sideTexture, south: sideTexture, east: sideTexture, west: sideTexture, flora: fallbackFilename };
  const facing = resolveFacing(mcId);
  if (facing === 'north') { faces.north = frontTexture; faces.south = backTexture; }
  else if (facing === 'south') { faces.south = frontTexture; faces.north = backTexture; }
  else if (facing === 'east') { faces.east = frontTexture; faces.west = backTexture; }
  else if (facing === 'west') { faces.west = frontTexture; faces.east = backTexture; }
  return faces;
}
function resolveFloraTextureFilename(mcId: string, fallbackFilename: string): string {
  const baseMcName = getBaseMcName(mcId);
  const half = (getMcAttribute(mcId, 'half') ?? '').toLowerCase();
  if (baseMcName === 'grass' || baseMcName === 'short_grass') return 'tallgrass.png';
  if (baseMcName === 'tall_grass') return (half === 'upper' || half === 'top') ? 'tall_grass_top.png' : 'tall_grass_bottom.png';
  return fallbackFilename;
}
function getBlockProperties(mcId: string): BlockProps {
  const id = mcId.toLowerCase();
  const baseMcName = getBaseMcName(mcId);
  if (baseMcName === 'water' || baseMcName.endsWith('_water')) return { type: RenderType.WATER, isTransparent: true };
  if (id.includes('glass') || (id.includes('ice') && !id.includes('packed') && !id.includes('blue') && !id.includes('iceball'))) return { type: RenderType.GLASS, isTransparent: true };
  const floraKeywords = ['sapling', 'dandelion', 'poppy', 'orchid', 'allium', 'bluet', 'tulip', 'daisy', 'cornflower', 'lily_of_the_valley', 'rose', 'mushroom', 'fungus', 'roots', 'fern', 'dead_bush', 'web', 'sprouts', 'wheat', 'carrot', 'potato', 'beetroot', 'crop', 'sugar_cane', 'bamboo', 'grass', 'kelp', 'seagrass', 'nether_wart', 'lilac', 'peony', 'torch', 'fire', 'coral', 'pickle', 'stem', 'plant', 'cotton', 'rice', 'cranberries', 'corn', 'chili', 'tomato', 'lettuce', 'coffee', 'cauliflower', 'parsnip', 'cabbage', 'blueberry', 'strawberry'];
  const solidExceptions = ['grass_block', 'grass_path', 'dirt_path', 'mycelium', 'podzol', 'mushroom_block', 'mushroom_stem', 'wart_block', 'coral_block', 'mangrove_roots', 'muddy_mangrove_roots', 'shroomlight', 'leaves', 'hay_block', 'bone_block', 'purpur_block', 'quartz_block', 'coal_block', 'iron_block', 'gold_block', 'diamond_block', 'emerald_block', 'lapis_block', 'slime_block', 'honey_block', 'copper_block', 'amethyst_block', 'redstone_block', 'kelp_block', 'bamboo_block', 'bamboo_planks', 'bamboo_mosaic', 'cherry_block', 'plum_block', 'coconut_block', 'pear_block', 'mango_block', 'banana_block', 'carrot_block', 'potato_block', 'beetroot_block', 'pine_cone_block', 'apple_block', 'bread_block', 'fireball_block'];
  if (floraKeywords.some(k => id.includes(k)) && !solidExceptions.some(k => id.includes(k))) return { type: RenderType.FLORA, isTransparent: true };
  if (['leaves', 'bars', 'door', 'trapdoor', 'carpet', 'vine', 'ladder', 'spawner', 'scaffolding', 'lantern', 'chain', 'brewing_stand', 'beacon', 'cactus', 'cake', 'bed', 'banner', 'sign', 'board'].some(k => id.includes(k))) return { type: RenderType.OPAQUE, isTransparent: true };
  return { type: RenderType.OPAQUE, isTransparent: false };
}
function useGridData(data: ParsedBloxdSchematic | null, airBlockIds: Set<number>) {
    return useMemo(() => {
        if (!data) return { grid: new Uint32Array(0), blockDataMap: new Map<string, Record<string, unknown>>(), width: 0, height: 0, length: 0 };
        const { size: [width, height, length], pos, chunks, blockdatas } = data;
        const grid = new Uint32Array(width * height * length);
        for (const chunk of chunks) {
            for (let y = 0; y < 32; y++) {
                const globalY = chunk.pos[1] * 32 + y;
                const gridY = globalY - pos[1];
                if (gridY < 0 || gridY >= height) continue;
                for (let z = 0; z < 32; z++) {
                    const globalZ = chunk.pos[2] * 32 + z;
                    const gridZ = globalZ - pos[2];
                    if (gridZ < 0 || gridZ >= length) continue;
                    for (let x = 0; x < 32; x++) {
                        const globalX = chunk.pos[0] * 32 + x;
                        const gridX = globalX - pos[0];
                        if (gridX < 0 || gridX >= width) continue;
                        const blockId = chunk.blocks[x * 1024 + y * 32 + z] ?? 0;
                        if (airBlockIds.has(blockId) || blockId === 0) continue;
                        grid[(gridY * length + gridZ) * width + gridX] = blockId;
                    }
                }
            }
        }
        const blockDataMap = new Map<string, Record<string, unknown>>();
        if (blockdatas) {
            for (const bd of blockdatas) {
                try {
                    const parsed = JSON.parse(bd.blockdataStr);
                    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                        blockDataMap.set(`${bd.blockX},${bd.blockY},${bd.blockZ}`, parsed as Record<string, unknown>);
                    }
                } catch {}
            }
        }
        return { grid, blockDataMap, width, height, length };
    }, [data, airBlockIds]);
}
function MergedSchematicMesh({ data, gridData, atlasTexture, uvMap, customModelById, blockPropsById, setProgress }: MergedSchematicMeshProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  useEffect(() => {
    if (!data || !gridData.width) return;
    const abortController = new AbortController();
    const generateGeometry = async () => {
      const { grid, width, height, length } = gridData;
      const getBlock = (x: number, y: number, z: number) => {
          if (x < 0 || y < 0 || z < 0 || x >= width || y >= height || z >= length) return 0;
          return grid[(y * length + z) * width + x];
      };
      const positions: number[] = [];
      const normals: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];
      let vertCount = 0;
      const centerX = width / 2;
      const centerY = height / 2;
      const centerZ = length / 2;
      const totalBlocks = width * height * length;
      let processedBlocks = 0;
      const yieldChunkSize = 16;
      for (let cy = 0; cy < Math.ceil(height / yieldChunkSize); cy++) {
        for (let cz = 0; cz < Math.ceil(length / yieldChunkSize); cz++) {
          for (let cx = 0; cx < Math.ceil(width / yieldChunkSize); cx++) {
            if (abortController.signal.aborted) return;
            const startX = cx * yieldChunkSize, startY = cy * yieldChunkSize, startZ = cz * yieldChunkSize;
            const endX = Math.min(startX + yieldChunkSize, width), endY = Math.min(startY + yieldChunkSize, height), endZ = Math.min(startZ + yieldChunkSize, length);
            for (let y = startY; y < endY; y++) {
              for (let z = startZ; z < endZ; z++) {
                for (let x = startX; x < endX; x++) {
                  const id = getBlock(x, y, z);
                  if (id === 0 || customModelById[id]) continue;
                  const props = blockPropsById[id] ?? { type: RenderType.OPAQUE, isTransparent: false };
                  const mx = centerX - x, my = y - centerY, mz = z - centerZ;
                  const faceUvs = uvMap[id] ?? DEFAULT_FACE_UV;
                  if (props.type === RenderType.FLORA) {
                    const [uMin, vMin, uMax, vMax] = faceUvs.flora;
                    const xMid = mx + 0.5, zMid = mz + 0.5;
                    positions.push(xMid, my, mz, xMid, my + 1, mz, xMid, my + 1, mz + 1, xMid, my, mz + 1, xMid, my, mz + 1, xMid, my + 1, mz + 1, xMid, my + 1, mz, xMid, my, mz);
                    normals.push(1,0,0, 1,0,0, 1,0,0, 1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0);
                    uvs.push(uMin, vMin, uMin, vMax, uMax, vMax, uMax, vMin, uMax, vMin, uMax, vMax, uMin, vMax, uMin, vMin);
                    let i = vertCount;
                    indices.push(i, i+1, i+2, i, i+2, i+3, i+4, i+5, i+6, i+4, i+6, i+7);
                    vertCount += 8;
                    positions.push(mx, my, zMid, mx, my + 1, zMid, mx + 1, my + 1, zMid, mx + 1, my, zMid, mx + 1, my, zMid, mx + 1, my + 1, zMid, mx, my + 1, zMid, mx, my, zMid);
                    normals.push(0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1);
                    uvs.push(uMin, vMin, uMin, vMax, uMax, vMax, uMax, vMin, uMax, vMin, uMax, vMax, uMin, vMax, uMin, vMin);
                    i = vertCount;
                    indices.push(i, i+1, i+2, i, i+2, i+3, i+4, i+5, i+6, i+4, i+6, i+7);
                    vertCount += 8;
                    continue;
                  }
                  const shouldRenderFace = (nId: number) => {
                    if (nId === 0 || customModelById[nId]) return true;
                    const nProps = blockPropsById[nId];
                    if (!nProps || nProps.type === RenderType.FLORA) return true;
                    if (props.type === RenderType.WATER) return false;
                    if (props.type === RenderType.GLASS) return nProps.type !== RenderType.GLASS && nProps.isTransparent;
                    return nProps.isTransparent;
                  };
                  const addQuad = (p1: number[], p2: number[], p3: number[], p4: number[], nx: number, ny: number, nz: number, face: BlockFace) => {
                      const [uMin, vMin, uMax, vMax] = faceUvs[face] ?? faceUvs.flora;
                      positions.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2], p4[0], p4[1], p4[2]);
                      normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz, nx, ny, nz);
                      uvs.push(uMin, vMin, uMax, vMin, uMax, vMax, uMin, vMax);
                      indices.push(vertCount, vertCount + 1, vertCount + 2, vertCount, vertCount + 2, vertCount + 3);
                      vertCount += 4;
                  };
                  if (shouldRenderFace(getBlock(x - 1, y, z))) addQuad([mx + 1, my, mz + 1], [mx + 1, my, mz], [mx + 1, my + 1, mz], [mx + 1, my + 1, mz + 1], 1, 0, 0, 'west');
                  if (shouldRenderFace(getBlock(x + 1, y, z))) addQuad([mx, my, mz], [mx, my, mz + 1], [mx, my + 1, mz + 1], [mx, my + 1, mz], -1, 0, 0, 'east');
                  if (shouldRenderFace(getBlock(x, y + 1, z))) addQuad([mx, my + 1, mz + 1], [mx + 1, my + 1, mz + 1], [mx + 1, my + 1, mz], [mx, my + 1, mz], 0, 1, 0, 'top');
                  if (shouldRenderFace(getBlock(x, y - 1, z))) addQuad([mx, my, mz], [mx + 1, my, mz], [mx + 1, my, mz + 1], [mx, my, mz + 1], 0, -1, 0, 'bottom');
                  if (shouldRenderFace(getBlock(x, y, z + 1))) addQuad([mx, my, mz + 1], [mx + 1, my, mz + 1], [mx + 1, my + 1, mz + 1], [mx, my + 1, mz + 1], 0, 0, 1, 'south');
                  if (shouldRenderFace(getBlock(x, y, z - 1))) addQuad([mx + 1, my, mz], [mx, my, mz], [mx, my + 1, mz], [mx + 1, my + 1, mz], 0, 0, -1, 'north');
                }
              }
            }
            processedBlocks += (endX - startX) * (endY - startY) * (endZ - startZ);
            setProgress(processedBlocks / totalBlocks);
            if (cx % 4 === 0) await new Promise(resolve => setTimeout(resolve, 0));
          }
        }
      }
      if (positions.length > 0 && !abortController.signal.aborted) {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geom.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
        geom.computeBoundingSphere();
        setGeometry(geom);
      }
      if (!abortController.signal.aborted) setProgress(1);
    };
    generateGeometry();
    return () => abortController.abort();
  }, [data, uvMap, setProgress, blockPropsById, customModelById, gridData]);
  if (!geometry) return null;
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial map={atlasTexture} transparent={true} alphaTest={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}
function ModelInstances({ data, gridData, modelNameById, blockNameById, modelYawById, modelScenes, mcIdByBlockId, customModelById, blockPropsById, airBlockIds, debugMode, onInspectModel }: ModelInstancesProps) {
  const modelLayouts = useMemo(() => {
    if (!data || !gridData.width) return [];
    const { grid, width, height, length, blockDataMap } = gridData;
    const centerX = width / 2, centerY = height / 2, centerZ = length / 2;
    const layouts: ModelLayout[] = [];
    const getBlock = (x: number, y: number, z: number) => {
      if (x < 0 || y < 0 || z < 0 || x >= width || y >= height || z >= length) return 0;
      return grid[(y * length + z) * width + x];
    };
    const isNeighborOccludingModel = (neighborId: number) => {
      if (neighborId === 0 || airBlockIds.has(neighborId) || customModelById[neighborId]) return false;
      const props = blockPropsById[neighborId] ?? { type: RenderType.OPAQUE, isTransparent: false };
      return props.type === RenderType.OPAQUE && !props.isTransparent;
    };
    const yawFromFacing = (facing: 'north' | 'south' | 'east' | 'west' | null) => {
      if (facing === 'north') return Math.PI;
      if (facing === 'east') return -Math.PI / 2;
      if (facing === 'west') return Math.PI / 2;
      return 0;
    };
    for (const chunk of data.chunks) {
      for (let y = 0; y < 32; y++) {
        const globalY = chunk.pos[1] * 32 + y;
        const gridY = globalY - data.pos[1];
        if (gridY < 0 || gridY >= height) continue;
        for (let z = 0; z < 32; z++) {
          const globalZ = chunk.pos[2] * 32 + z;
          const gridZ = globalZ - data.pos[2];
          if (gridZ < 0 || gridZ >= length) continue;
          for (let x = 0; x < 32; x++) {
            const globalX = chunk.pos[0] * 32 + x;
            const gridX = globalX - data.pos[0];
            if (gridX < 0 || gridX >= width) continue;
            const blockId = chunk.blocks[x * 1024 + y * 32 + z] ?? 0;
            if (airBlockIds.has(blockId) || blockId === 0) continue;
            const modelName = modelNameById[blockId];
            const modelScene = modelScenes[modelName];
            if (!modelName || !modelScene) continue;
            if (isNeighborOccludingModel(getBlock(gridX - 1, gridY, gridZ)) &&
                isNeighborOccludingModel(getBlock(gridX + 1, gridY, gridZ)) &&
                isNeighborOccludingModel(getBlock(gridX, gridY - 1, gridZ)) &&
                isNeighborOccludingModel(getBlock(gridX, gridY + 1, gridZ)) &&
                isNeighborOccludingModel(getBlock(gridX, gridY, gridZ - 1)) &&
                isNeighborOccludingModel(getBlock(gridX, gridY, gridZ + 1))) {
              continue;
            }
            const bd = blockDataMap.get(`${globalX},${globalY},${globalZ}`);
            const mcId = mcIdByBlockId[blockId] ?? '';
            const rawBlockName = blockNameById[blockId] ?? '';
            const facing = resolveFacing(mcId);
            let yaw = modelYawById[blockId] ?? yawFromFacing(facing);
            let yawSource = modelYawById[blockId] !== undefined ? 'block_name_meta_rot' : (facing ? 'mcid_facing' : 'default_south');
            const kind = customModelById[blockId];
            if (kind === 'potion_table' || kind === 'enchanting_table') {
              const metadataYaw = resolveYawFromBlockData(bd, yawFromFacing);
              if (metadataYaw !== null) { yaw = metadataYaw; yawSource = 'blockdata_rotation_or_facing'; }
            }
            let localDy = 0, localDz = 0, pitch = 0;
            let modelScale: [number, number, number] = [1, 1, 1];
            const modelSize = modelScene.userData.size || { x: 1, y: 1, z: 1 };
            if (kind === 'door') localDz = -(0.5 - (modelSize.z / 2));
            else if (kind === 'ladder') {
              const rotationIdx = getBloxdRotationIndex(rawBlockName);
              const isRot1 = rotationIdx === 1;
              yaw += isRot1 ? Math.PI / 2 : Math.PI;
              localDz = (0.5 - (modelSize.z / 2));
            }
            else if (kind === 'bed' && facing === 'north') { yaw += Math.PI; }
            else if (kind === 'board') { yaw += Math.PI; localDz = facing ? (0.5 - (modelSize.z / 2)) : 0; }
            else if (kind === 'trapdoor') {
              if (resolveTrapdoorIsOpen(mcId, bd)) { localDz = -(0.5 - (modelSize.z / 2)); } 
              else { pitch = -Math.PI / 2; localDz = modelSize.y / 2; localDy = resolveTrapdoorIsTop(mcId, bd) ? 0.5 + ((modelSize.y - modelSize.z) / 2) : 1.5 - modelSize.z; }
            } else if (kind === 'carpet') { modelScale = [1, -1, 1]; localDy = 1.0 - (modelSize.y * modelScale[1]) - 1.0; } 
            else if (kind === 'potion_table') modelScale = [1, 1, 1];
            else if (kind === 'enchanting_table') modelScale = [1, 1, 1];
            localDy += MODEL_Y_EPSILON;
            layouts.push({
              key: `m_${globalX}_${globalY}_${globalZ}`,
              scene: modelScene,
              pos: [centerX - gridX + 0.5, gridY - centerY, gridZ - centerZ + 0.5] as [number, number, number],
              rot: [0, yaw, 0] as [number, number, number],
              localPos: [0, localDy, localDz] as [number, number, number],
              localRot: [pitch, 0, 0] as [number, number, number],
              scale: modelScale,
              debugInfo: { blockId, mcId, kind, yaw, yawSource, chunkPos: chunk.pos, chunkLocalPos: [x,y,z], globalPos: [globalX, globalY, globalZ], bd }
            });
          }
        }
      }
    }
    return layouts;
  }, [data, gridData, modelNameById, blockNameById, modelScenes, mcIdByBlockId, customModelById, blockPropsById, airBlockIds, modelYawById]);
  const handleInspect = useMemo(() => (info: DebugModelInspectInfo) => onInspectModel(info), [onInspectModel]);
  return (
    <group>
      {modelLayouts.map((l) => (
        <StaticModelInstance key={l.key} layout={l} debugMode={debugMode} onInspect={handleInspect} blockNameById={blockNameById} modelNameById={modelNameById} />
      ))}
    </group>
  );
}
export default function SchematicRenderer({ data, showFps }: { data: ParsedBloxdSchematic | null, showFps: boolean }) {
  const { schematicAntiAlias, schematicShadows } = useSettingsStore();
  const [atlasTexture, setAtlasTexture] = useState<THREE.Texture | null>(null);
  const [uvMap, setUvMap] = useState<Record<number, FaceUvMap>>({});
  const [mcIdByBlockId, setMcIdByBlockId] = useState<Record<number, string>>({});
  const [customModelById, setCustomModelById] = useState<Record<number, CustomModelKind>>({});
  const [blockNameById, setBlockNameById] = useState<Record<number, string>>({});
  const [modelNameById, setModelNameById] = useState<Record<number, string>>({});
  const [modelYawById, setModelYawById] = useState<Record<number, number>>({});
  const [modelScenes, setModelScenes] = useState<Record<string, THREE.Object3D>>({});
  const [blockPropsById, setBlockPropsById] = useState<Record<number, BlockProps>>({ 0: { type: RenderType.OPAQUE, isTransparent: true } });
  const [airBlockIds, setAirBlockIds] = useState<Set<number>>(new Set([0]));
  const [isProcessing, setIsProcessing] = useState(false);
  const [meshProgress, setMeshProgress] = useState(0);
  const [atlasProgress, setAtlasProgress] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  const [debugCameraYaw, setDebugCameraYaw] = useState(0);
  const [debugSelection, setDebugSelection] = useState<DebugModelInspectInfo | null>(null);
  const isMobile = useIsMobile();
  const gridData = useGridData(data, airBlockIds);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.code === 'PageUp') { e.preventDefault(); setDebugMode((p) => !p); } };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  const debugHeading = useMemo(() => formatCompassFromYaw(debugCameraYaw), [debugCameraYaw]);
  const debugPayload = useMemo(() => debugSelection ? JSON.stringify({ camera: { compass: debugHeading.label, bearingDegrees: debugHeading.bearingDeg, yawRadians: Number(debugCameraYaw.toFixed(6)) }, modelInspect: debugSelection }, null, 2) : '', [debugSelection, debugHeading, debugCameraYaw]);
  useEffect(() => { if (data) setMeshProgress(0); }, [data]);
  useEffect(() => {
    if (!data) return;
    const generateAtlas = async () => {
        setIsProcessing(true);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        try {
            const loadTextureBitmap = async (filename: string): Promise<ImageBitmap | null> => {
              const cached = globalImageBitmapCache.get(filename);
              if (cached) return cached;
              const pending = fetch(`${DEFAULT_TEXTURE_ROOT}/${encodeURIComponent(filename)}`).then(r => r.ok ? r.blob().then(createImageBitmap) : null).catch(() => null);
              globalImageBitmapCache.set(filename, pending);
              return pending;
            };
            const modelExists = async (modelName: string): Promise<boolean> => {
              const cached = globalModelExistsCache.get(modelName);
              if (cached) return cached;
              const pending = fetch(modelUrlFromName(modelName), { method: 'HEAD' }).then(r => r.ok).catch(() => false);
              globalModelExistsCache.set(modelName, pending);
              return pending;
            };
            const resolveTextureFilename = async (filename: string): Promise<string> => {
              const candidates = [filename, filename.includes('_') ? `${filename.substring(0, filename.lastIndexOf('_'))}.png` : '', 'stone.png'].filter(Boolean);
              for (const candidate of candidates) {
                if (await loadTextureBitmap(candidate)) return candidate;
              }
              return 'stone.png';
            };
            const blockConversionModule = await import('@/lib/converter/block-conversion.js');
            const blockJsonsModule = await import('@/lib/converter/block-jsons.js');
            const blockConversion = blockConversionModule as { bloxdToMcId?: (id: number) => string; default?: { bloxdToMcId?: (id: number) => string } };
            const blockJsons = blockJsonsModule as { idToNameJson?: Record<string, string>; default?: { idToNameJson?: Record<string, string> } };
            const bloxdToMcId = blockConversion.bloxdToMcId ?? blockConversion.default?.bloxdToMcId;
            const idToNameJson = blockJsons.idToNameJson ?? blockJsons.default?.idToNameJson;
            if (!bloxdToMcId || !idToNameJson) throw new Error('Could not load block conversion maps');
            const uniqueBlockIds = new Set<number>();
            data.chunks.forEach(chunk => chunk.blocks.forEach(id => uniqueBlockIds.add(id)));
            const requiredFiles = new Set<string>();
            const idToFaceTextures: Record<number, FaceTextureMap> = {};
            const nextMcIdByBlockId: Record<number, string> = {};
            const nextCustomModelById: Record<number, CustomModelKind> = {};
            const nextBlockNameById: Record<number, string> = {};
            const nextModelNameById: Record<number, string> = {};
            const nextModelYawById: Record<number, number> = {};
            const nextBlockPropsById: Record<number, BlockProps> = { 0: { type: RenderType.OPAQUE, isTransparent: true } };
            const nextAirBlockIds = new Set<number>([0]);
            const unknownBlockIds: number[] = [];
            let processedCount = 0;
            const totalCount = uniqueBlockIds.size;
            const blockPromises = Array.from(uniqueBlockIds).map(async (id) => {
                const blockNameLower = (idToNameJson[String(id)] || '').toLowerCase();
                if (!blockNameLower) { unknownBlockIds.push(id); return; }
                if (blockNameLower.includes('air')) { nextAirBlockIds.add(id); return; }
                const mcKey = bloxdToMcId(id);
                nextMcIdByBlockId[id] = mcKey;
                nextBlockPropsById[id] = getBlockProperties(mcKey);
                const blockDisplayName = idToNameJson[String(id)] || '';
                nextBlockNameById[id] = blockDisplayName;
                const nameYaw = resolveYawFromBloxdBlockName(blockDisplayName, (f) => f === 'north' ? Math.PI : f === 'east' ? -Math.PI / 2 : f === 'west' ? Math.PI / 2 : 0);
                if (nameYaw !== null) nextModelYawById[id] = nameYaw;
                const customKind = detectCustomModelKind(blockDisplayName, mcKey);
                if (customKind) {
                  const candidateNames = resolveModelNameForBlock(blockDisplayName, mcKey, customKind);
                  for (const candidate of candidateNames) {
                    if (await modelExists(candidate)) { nextCustomModelById[id] = customKind; nextModelNameById[id] = candidate; break; }
                  }
                }
                const filename = await resolveTextureFilename(getBloxdTextureName(mcKey));
                const floraFilename = await resolveTextureFilename(resolveFloraTextureFilename(mcKey, filename));
                const unresolvedFaces = resolveFaceTexturesForBlock(mcKey, filename);
                const resolvedFaces = await Promise.all(DEFAULT_FACES.map(f => resolveTextureFilename(unresolvedFaces[f])));
                const faceTextures: FaceTextureMap = { top: resolvedFaces[0], bottom: resolvedFaces[1], north: resolvedFaces[2], south: resolvedFaces[3], east: resolvedFaces[4], west: resolvedFaces[5], flora: floraFilename };
                idToFaceTextures[id] = faceTextures;
                requiredFiles.add(faceTextures.flora);
                DEFAULT_FACES.forEach(f => requiredFiles.add(faceTextures[f]));
                processedCount++;
                setAtlasProgress(processedCount / totalCount);
            });
            await Promise.all(blockPromises);
            if (unknownBlockIds.length > 0) {
              const posToId = new Map<string, number>();
              for (const chunk of data.chunks) {
                for (let y = 0; y < 32; y++) {
                  for (let z = 0; z < 32; z++) {
                    for (let x = 0; x < 32; x++) {
                      const cellId = chunk.blocks[x * 1024 + y * 32 + z] ?? 0;
                      if (cellId !== 0) posToId.set(`${chunk.pos[0] * 32 + x},${chunk.pos[1] * 32 + y},${chunk.pos[2] * 32 + z}`, cellId);
                    }
                  }
                }
              }
              const unknownSet = new Set(unknownBlockIds);
              const neighborVotes = new Map<number, Map<number, number>>();
              const neighborDirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
              for (const [key, cellId] of posToId) {
                if (!unknownSet.has(cellId)) continue;
                const [cx, cy, cz] = key.split(',').map(Number);
                for (const [dx, dy, dz] of neighborDirs) {
                  const neighborId = posToId.get(`${cx + dx},${cy + dy},${cz + dz}`);
                  if (!neighborId || unknownSet.has(neighborId) || !idToFaceTextures[neighborId]) continue;
                  let votes = neighborVotes.get(cellId);
                  if (!votes) neighborVotes.set(cellId, (votes = new Map<number, number>()));
                  votes.set(neighborId, (votes.get(neighborId) ?? 0) + 1);
                }
              }
              for (const id of unknownBlockIds) {
                const votes = neighborVotes.get(id);
                const donor = votes ? [...votes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] : undefined;
                if (donor === undefined || !idToFaceTextures[donor]) { nextAirBlockIds.add(id); continue; }
                idToFaceTextures[id] = { ...idToFaceTextures[donor] };
                nextBlockPropsById[id] = nextBlockPropsById[donor] ?? { type: RenderType.OPAQUE, isTransparent: false };
                nextMcIdByBlockId[id] = nextMcIdByBlockId[donor];
                nextBlockNameById[id] = `Unknown Block ${id} (≈ ${nextBlockNameById[donor] || 'unknown'})`;
              }
            }
            requiredFiles.add('stone.png');
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = ATLAS_SIZE;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.imageSmoothingEnabled = false;
            let x = 0, y = 0;
            const filenameToUV: Record<string, number[]> = {};
            const inset = 0.5 / ATLAS_SIZE;
            const fileArray = Array.from(requiredFiles);
            const bitmaps = await Promise.all(fileArray.map(f => loadTextureBitmap(f)));
            fileArray.forEach((filename, i) => {
                const img = bitmaps[i];
                if (!img || !ctx) return;
                if (y + TEXTURE_SIZE > ATLAS_SIZE) return;
                ctx.drawImage(img, x, y, TEXTURE_SIZE, TEXTURE_SIZE);
                filenameToUV[filename] = [x / ATLAS_SIZE + inset, 1 - ((y + TEXTURE_SIZE) / ATLAS_SIZE) + inset, (x + TEXTURE_SIZE) / ATLAS_SIZE - inset, 1 - (y / ATLAS_SIZE) - inset];
                if ((x += TEXTURE_SIZE) >= ATLAS_SIZE) { x = 0; y += TEXTURE_SIZE; }
            });
            const tex = new THREE.CanvasTexture(canvas);
            tex.magFilter = tex.minFilter = THREE.NearestFilter;
            tex.colorSpace = THREE.SRGBColorSpace;
            setAtlasTexture(tex);
            const finalUVMap: Record<number, FaceUvMap> = {};
            const stoneUv = filenameToUV['stone.png'] ?? [0, 0, 1, 1];
            Object.entries(idToFaceTextures).forEach(([id, faces]) => {
                finalUVMap[parseInt(id)] = { top: filenameToUV[faces.top] ?? stoneUv, bottom: filenameToUV[faces.bottom] ?? stoneUv, north: filenameToUV[faces.north] ?? stoneUv, south: filenameToUV[faces.south] ?? stoneUv, east: filenameToUV[faces.east] ?? stoneUv, west: filenameToUV[faces.west] ?? stoneUv, flora: filenameToUV[faces.flora] ?? stoneUv };
            });
            setMcIdByBlockId(nextMcIdByBlockId); setCustomModelById(nextCustomModelById); setBlockNameById(nextBlockNameById); setModelNameById(nextModelNameById); setModelYawById(nextModelYawById); setBlockPropsById(nextBlockPropsById); setAirBlockIds(nextAirBlockIds); setUvMap(finalUVMap);
            const loadedModelScenes: Record<string, THREE.Object3D> = {};
            const uniqueModelNames = Array.from(new Set(Object.values(nextModelNameById)));
            const gltfPromises = uniqueModelNames.map(async (modelName) => {
              try {
                const gltf = await loader.loadAsync(modelUrlFromName(modelName));
                const root = gltf.scene || gltf.scenes?.[0];
                if (root) {
                  root.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                      const mesh = child as THREE.Mesh;
                      mesh.geometry?.computeBoundingBox(); mesh.geometry?.computeBoundingSphere();
                      if (mesh.material) {
                        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                        for (const mat of mats) {
                          mat.side = THREE.DoubleSide;
                          mat.alphaTest = 0.1;
                          mat.transparent = true;
                        }
                      }
                    }
                  });
                  const box = new THREE.Box3().setFromObject(root);
                  const scaleFactor = Math.max(box.getSize(new THREE.Vector3()).x, box.getSize(new THREE.Vector3()).y, box.getSize(new THREE.Vector3()).z) > 0.001 ? 1.0 / Math.max(box.getSize(new THREE.Vector3()).x, box.getSize(new THREE.Vector3()).y, box.getSize(new THREE.Vector3()).z) : 1;
                  const scaleWrapper = new THREE.Group(); scaleWrapper.add(root); scaleWrapper.scale.setScalar(scaleFactor); scaleWrapper.updateMatrixWorld(true);
                  const scaledBox = new THREE.Box3().setFromObject(scaleWrapper);
                  scaleWrapper.position.set(-scaledBox.getCenter(new THREE.Vector3()).x, -scaledBox.min.y, -scaledBox.getCenter(new THREE.Vector3()).z);
                  const offsetWrapper = new THREE.Group(); offsetWrapper.add(scaleWrapper); offsetWrapper.userData.size = scaledBox.getSize(new THREE.Vector3());
                  loadedModelScenes[modelName] = offsetWrapper;
                }
              } catch (e) { console.error(`Failed to load model: ${modelName}`, e); }
            });
            await Promise.all(gltfPromises);
            setModelScenes(loadedModelScenes);
        } catch (e) { console.error("Atlas generation failed:", e); } finally { dracoLoader.dispose(); setIsProcessing(false); }
    };
    generateAtlas();
  }, [data]);
  const showProgress = isProcessing || (meshProgress > 0 && meshProgress < 1);
  if (!data) return null;
  return (
    <div className="relative w-full h-full bg-[#0a0a0a]" style={{ touchAction: 'none' }}>
        {showProgress && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50 text-white flex-col gap-2 pointer-events-none">
                <p>{isProcessing ? `Generating Texture Atlas (${Math.round(atlasProgress * 100)}%)...` : 'Building 3D Mesh...'}</p>
                <div className="w-48 h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{width: `${(isProcessing ? atlasProgress * 50 : 50 + meshProgress * 50)}%`}}/>
                </div>
            </div>
        )}
        <Canvas camera={{ fov: 75, position: [0, 0, 5] }} shadows={schematicShadows} dpr={[1, 1.5]} gl={{ antialias: schematicAntiAlias, powerPreference: 'high-performance' }} key={`${schematicAntiAlias}-${schematicShadows}`}>
            {showFps && <Stats />}
            {debugMode && <CameraHeadingTracker onHeadingChange={setDebugCameraYaw} />}
            <color attach="background" args={['#87CEEB']} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[50, 100, 50]} intensity={1.5} castShadow={schematicShadows} />
            {atlasTexture && <MergedSchematicMesh data={data} gridData={gridData} atlasTexture={atlasTexture} uvMap={uvMap} customModelById={customModelById} blockPropsById={blockPropsById} setProgress={setMeshProgress} />}
            <ModelInstances data={data} gridData={gridData} modelNameById={modelNameById} blockNameById={blockNameById} modelYawById={modelYawById} modelScenes={modelScenes} airBlockIds={airBlockIds} mcIdByBlockId={mcIdByBlockId} customModelById={customModelById} blockPropsById={blockPropsById} debugMode={debugMode} onInspectModel={setDebugSelection} />
            <PlayerControls disablePointerLock={debugMode} />
        </Canvas>
        {debugMode && (
          <>
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-6 w-6"><div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/90" /><div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/90" /></div>
            </div>
            <div className="absolute left-3 top-3 z-40 max-w-[min(680px,95vw)] rounded-md border border-white/25 bg-black/70 p-3 font-mono text-xs text-white backdrop-blur-sm">
              <div>Debug Mode: ON</div><div>Camera Heading: {debugHeading.label} ({debugHeading.bearingDeg} deg)</div>
              {debugPayload && (<><button type="button" className="mt-2 rounded border border-white/30 px-2 py-1 text-xs hover:bg-white/10" onClick={() => navigator.clipboard.writeText(debugPayload).catch(() => {})}>Copy Inspect Payload</button><pre className="mt-2 max-h-64 overflow-auto rounded border border-white/20 bg-black/50 p-2 text-[11px] leading-4">{debugPayload}</pre></>)}
            </div>
          </>
        )}
        {isMobile && (
            <>
                <div className="absolute bottom-10 left-10 z-50"><Joystick onMove={(x, y) => { window.joystickVec = { x, y }; }} /></div>
                <div className="absolute bottom-10 right-10 z-50 flex flex-col gap-4">
                  <button className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white pointer-events-auto backdrop-blur-sm active:bg-white/30" onTouchStart={(e) => { e.preventDefault(); window.schematicVerticalMove = 1; }} onTouchEnd={(e) => { e.preventDefault(); window.schematicVerticalMove = 0; }}><ArrowUp size={32} /></button>
                  <button className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white pointer-events-auto backdrop-blur-sm active:bg-white/30" onTouchStart={(e) => { e.preventDefault(); window.schematicVerticalMove = -1; }} onTouchEnd={(e) => { e.preventDefault(); window.schematicVerticalMove = 0; }}><ArrowDown size={32} /></button>
                </div>
            </>
        )}
    </div>
  );
}