"use client";
/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Text, useFBO } from "@react-three/drei";
import { easing } from "maath";

type Item = { id: string; image: string; title: string; href: string };

function usableSrc(src: string) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  if (src.startsWith("data:image")) return src;
  return "";
}

function RisingAds({ items, progress }: { items: Item[]; progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return items.map((item) => {
      const t = loader.load(item.image);
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      return t;
    });
  }, [items]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = progress.current;
    const rise = THREE.MathUtils.lerp(viewport.height * 1.15, -viewport.height * 0.15, p);
    easing.damp3(group.current.position, [0, rise, 0], 0.18, delta);
    group.current.children.forEach((child, i) => {
      child.position.y = -i * (viewport.height * 0.42);
    });
  });

  const layouts = [
    { x: -1.15, z: 0, w: 2.6, h: 1.7 },
    { x: 1.25, z: 1.2, w: 2.1, h: 1.4 },
    { x: -0.4, z: 0.4, w: 1.6, h: 2.1 },
    { x: 0.9, z: 2, w: 1.8, h: 1.2 },
    { x: -1.4, z: 1.6, w: 1.4, h: 1.8 },
  ];

  return (
    <group ref={group}>
      {items.slice(0, 5).map((item, i) => {
        const L = layouts[i % layouts.length];
        return (
          <mesh key={item.id} position={[L.x, 0, L.z]} onClick={() => { window.location.href = item.href; }}>
            <planeGeometry args={[L.w, L.h]} />
            <meshBasicMaterial map={textures[i]} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function GlassLens({ scene }: { scene: THREE.Scene }) {
  const ref = useRef<THREE.Mesh>(null);
  const buffer = useFBO();
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!ref.current) return;
    const { gl, camera, pointer } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    easing.damp3(ref.current.position, [(pointer.x * v.width) / 2, (pointer.y * v.height) / 2, 15], 0.15, delta);
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} toneMapped={false} />
      </mesh>
      <mesh ref={ref} rotation-x={Math.PI / 2} scale={0.22}>
        <cylinderGeometry args={[1, 1, 0.18, 64]} />
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={1.14}
          thickness={4.5}
          anisotropy={0.01}
          chromaticAberration={0.08}
          transmission={1}
          roughness={0.05}
        />
      </mesh>
    </>
  );
}

function Scene({ items, progress }: { items: Item[]; progress: React.MutableRefObject<number> }) {
  const { scene, viewport } = useThree();
  const world = useMemo(() => new THREE.Scene(), []);
  return (
    <>
      {createPortal(
        <>
          <color attach="background" args={["#0b0b10"]} />
          <Text position={[0, viewport.height * 0.32, 8]} fontSize={0.28} color="#ffffff" anchorX="center" anchorY="middle">
            Ads in motion
          </Text>
          <RisingAds items={items} progress={progress} />
        </>,
        world
      )}
      <GlassLens scene={world} />
      <primitive object={scene} visible={false} />
    </>
  );
}

export default function AdFluidGlass({ items }: { items: Item[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      progress.current = Math.min(1, Math.max(0, -rect.top / span));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!items.length) return null;

  return (
    <div ref={wrapRef} className="relative left-1/2 h-[220vh] w-screen -translate-x-1/2 bg-[#0b0b10]">
      <div className="sticky top-0 h-screen w-full">
        <Canvas camera={{ position: [0, 0, 20], fov: 18 }} gl={{ alpha: true, antialias: true }}>
          <Scene items={items} progress={progress} />
        </Canvas>
      </div>
    </div>
  );
}
