'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface SculptureModelProps {
  modelPath: string;
  scrollProgress: number;
}

const ROTATION_SENSITIVITY = 0.01;
const MAX_X_ROTATION = Math.PI / 2;

function SculptureModel({ modelPath, scrollProgress }: SculptureModelProps) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  const scrollRotation = useMemo(() => scrollProgress * Math.PI, [scrollProgress]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;

    setRotation((prev) => ({
      y: prev.y + deltaX * ROTATION_SENSITIVITY,
      x: Math.max(-MAX_X_ROTATION, Math.min(MAX_X_ROTATION, prev.x - deltaY * ROTATION_SENSITIVITY)),
    }));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    meshRef.current.position.set(0, 0, 0);
    meshRef.current.rotation.y = rotation.y + scrollRotation;
    meshRef.current.rotation.x = rotation.x;
  });

  useEffect(() => {
    if (!scene) return;

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3.5 / maxDim;

    scene.scale.multiplyScalar(scale);
    scene.position.sub(center.multiplyScalar(scale));
  }, [scene]);

  return (
    <group ref={meshRef}>
      <primitive object={scene} />
    </group>
  );
}

function FixedCamera() {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

interface Sculpture3DCanvasProps {
  modelPath: string;
  scrollProgress: number;
}

export function Sculpture3D({ modelPath, scrollProgress }: Sculpture3DCanvasProps) {
  return (
    <div className="w-full h-full min-h-[90vh]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} intensity={0.6} />
        <SculptureModel modelPath={modelPath} scrollProgress={scrollProgress} />
        <FixedCamera />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
