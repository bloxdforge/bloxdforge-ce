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

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/useIsMobile';
function Joystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const touchId = useRef<number | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const handleStart = (e: React.TouchEvent) => {
    if (touchId.current !== null) return;
    const touch = e.changedTouches[0];
    touchId.current = touch.identifier;
    startPos.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleMove = (e: React.TouchEvent) => {
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId.current);
    if (!touch) return;
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    const maxDist = 40;
    const distance = Math.min(maxDist, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    if (ref.current) {
      ref.current.style.transform = `translate(${x}px, ${y}px)`;
    }
    onMove(x / maxDist, y / maxDist);
  };
  const handleEnd = (e: React.TouchEvent) => {
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId.current);
    if (!touch) return;
    touchId.current = null;
    if (ref.current) {
      ref.current.style.transform = `translate(0px, 0px)`;
    }
    onMove(0, 0);
  };
  return (
    <div 
      className="w-32 h-32 rounded-full bg-white/5 border border-white/10 relative flex items-center justify-center pointer-events-auto backdrop-blur-sm touch-none"
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div ref={ref} className="w-12 h-12 rounded-full bg-white/40 shadow-lg border border-white/20" />
    </div>
  );
}
export default function PlayerControls({ disablePointerLock = false }: { disablePointerLock?: boolean }) {
  const { camera, gl } = useThree();
  const isMobile = useIsMobile();
  const speed = 20;
  const keys = useRef({ w: false, a: false, s: false, d: false, space: false, shift: false });
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  useEffect(() => {
    window.schematicVerticalMove = 0;
    euler.current.setFromQuaternion(camera.quaternion);
    if (isMobile) return;
    const onKeyDown = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'KeyW': keys.current.w = true; break;
        case 'KeyA': keys.current.a = true; break;
        case 'KeyS': keys.current.s = true; break;
        case 'KeyD': keys.current.d = true; break;
        case 'Space': keys.current.space = true; break;
        case 'ShiftLeft': keys.current.shift = true; break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'KeyW': keys.current.w = false; break;
        case 'KeyA': keys.current.a = false; break;
        case 'KeyS': keys.current.s = false; break;
        case 'KeyD': keys.current.d = false; break;
        case 'Space': keys.current.space = false; break;
        case 'ShiftLeft': keys.current.shift = false; break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isMobile, camera]);
  useFrame((state, delta) => {
    if (isMobile) {
        const joystickVector = window.joystickVec || {x: 0, y: 0};
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        forward.y = 0;
        forward.normalize();
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        right.y = 0;
        right.normalize();
        const moveX = joystickVector.x;
        const moveY = joystickVector.y; 
        camera.position.addScaledVector(forward, -moveY * speed * delta);
        camera.position.addScaledVector(right, moveX * speed * delta);
        const verticalMove = window.schematicVerticalMove || 0;
        if (verticalMove !== 0) {
            camera.position.y += verticalMove * speed * delta;
        }
    } else {
        const direction = new THREE.Vector3();
        const frontVector = new THREE.Vector3(0, 0, Number(keys.current.s) - Number(keys.current.w));
        const sideVector = new THREE.Vector3(Number(keys.current.a) - Number(keys.current.d), 0, 0);
        const upDown = Number(keys.current.space) - Number(keys.current.shift);
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed * delta);
        const verticalMove = upDown * speed * delta;
        const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        camRight.y = 0; camRight.normalize();
        const camForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        camForward.y = 0; camForward.normalize();
        camera.position.addScaledVector(camRight, direction.x);
        camera.position.addScaledVector(camForward, -direction.z);
        camera.position.y += verticalMove;
    }
  });
  useEffect(() => {
    if (!isMobile) return;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let touchId: number | null = null;
    const lookSpeed = 0.004;
    const handleTouchStart = (e: TouchEvent) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (t.clientX > window.innerWidth / 2) {
                touchId = t.identifier;
                lastTouchX = t.clientX;
                lastTouchY = t.clientY;
                break;
            }
        }
    };
    const handleTouchMove = (e: TouchEvent) => {
        if (e.cancelable) e.preventDefault();
        const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
        if (!touch) return;
        const dx = touch.clientX - lastTouchX;
        const dy = touch.clientY - lastTouchY;
        euler.current.y -= dx * lookSpeed;
        euler.current.x -= dy * lookSpeed;
        euler.current.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, euler.current.x));
        camera.quaternion.setFromEuler(euler.current);
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
        const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
        if (touch) {
            touchId = null;
        }
    };
    const canvas = gl.domElement;
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);
    return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isMobile, camera, gl.domElement]);
  if (isMobile || disablePointerLock) return null;
  return <PointerLockControls makeDefault />;
}
export { Joystick };