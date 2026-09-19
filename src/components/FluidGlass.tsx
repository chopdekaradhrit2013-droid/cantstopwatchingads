"use client";
/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import { useRef, useState, useEffect, memo, type ReactNode } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { useFBO, useGLTF, useScroll, Image, Scroll, Preload, ScrollControls, MeshTransmissionMaterial, Text } from "@react-three/drei";
import { easing } from "maath";

const LENS = "https://raw.githubusercontent.com/DavidHDev/react-bits/main/public/assets/3d/lens.glb";
const BAR = "https://raw.githubusercontent.com/DavidHDev/react-bits/main/public/assets/3d/bar.glb";
const CUBE = "https://raw.githubusercontent.com/DavidHDev/react-bits/main/public/assets/3d/cube.glb";

const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1783394327207-acf441e37dda?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1782094002386-7d9ae1f49f50?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1779684474703-5c0519bcf7e8?w=900&auto=format&fit=crop&q=60",
];

type ModeProps = Record<string, unknown>;

export default function FluidGlass({
  mode = "lens",
  lensProps = {},
  barProps = {},
  cubeProps = {},
  backgroundColor = "#120F17",
  textColor = "#ffffff",
}: {
  mode?: "lens" | "bar" | "cube";
  lensProps?: ModeProps;
  barProps?: ModeProps & { navItems?: { label: string; link: string }[] };
  cubeProps?: ModeProps;
  backgroundColor?: string;
  textColor?: string;
}) {
  const Wrapper = mode === "bar" ? Bar : mode === "cube" ? Cube : Lens;
  const rawOverrides = (mode === "bar" ? barProps : mode === "cube" ? cubeProps : lensProps) || {};
  const { navItems = [
    { label: "Home", link: "/" },
    { label: "Explore", link: "/explore" },
    { label: "Brands", link: "/brands" },
  ], ...modeProps } = rawOverrides as { navItems?: { label: string; link: string }[] } & ModeProps;

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true, toneMapping: THREE.NoToneMapping }} style={{ backgroundColor }}>
      <ScrollControls damping={0.2} pages={3} distance={0.4}>
        {mode === "bar" && <NavItems items={navItems} textColor={textColor} />}
        <Wrapper modeProps={modeProps} backgroundColor={backgroundColor}>
          <Scroll>
            <Typography textColor={textColor} />
            <Images />
          </Scroll>
          <Scroll html />
          <Preload />
        </Wrapper>
      </ScrollControls>
    </Canvas>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  children, glb, geometryKey, lockToBottom = false, followPointer = true, modeProps = {}, backgroundColor = "#120F17",
}: {
  children?: ReactNode; glb: string; geometryKey: string; lockToBottom?: boolean; followPointer?: boolean; modeProps?: ModeProps; backgroundColor?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const { nodes } = useGLTF(glb) as { nodes: Record<string, THREE.Mesh> };
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    const geo = nodes[geometryKey]?.geometry;
    if (!geo) return;
    geo.computeBoundingBox();
    geoWidthRef.current = (geo.boundingBox?.max.x ?? 1) - (geo.boundingBox?.min.x ?? 0) || 1;
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);
    if (modeProps.scale == null) {
      const desired = (v.width * 0.9) / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }
    gl.setClearColor(0x000000, 0);
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps as {
    scale?: number; ior?: number; thickness?: number; anisotropy?: number; chromaticAberration?: number;
  };

  return (
    <>
      {createPortal(
        <>
          <mesh position={[0, 0, -5]} scale={[vp.width * 2, vp.height * 2, 1]}>
            <planeGeometry />
            <meshBasicMaterial color={backgroundColor} toneMapped={false} />
          </mesh>
          {children}
        </>,
        scene
      )}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent toneMapped={false} />
      </mesh>
      <mesh ref={ref} scale={scale ?? 0.15} rotation-x={Math.PI / 2} geometry={nodes[geometryKey]?.geometry}>
        <MeshTransmissionMaterial buffer={buffer.texture} ior={ior ?? 1.15} thickness={thickness ?? 5} anisotropy={anisotropy ?? 0.01} chromaticAberration={chromaticAberration ?? 0.1} {...extraMat} />
      </mesh>
    </>
  );
});

function Lens({ modeProps, backgroundColor }: { modeProps: ModeProps; backgroundColor: string; children?: ReactNode }) {
  return <ModeWrapper glb={LENS} geometryKey="Cylinder" followPointer modeProps={modeProps} backgroundColor={backgroundColor} />;
}
function Cube({ modeProps, backgroundColor }: { modeProps: ModeProps; backgroundColor: string; children?: ReactNode }) {
  return <ModeWrapper glb={CUBE} geometryKey="Cube" followPointer modeProps={modeProps} backgroundColor={backgroundColor} />;
}
function Bar({ modeProps = {}, backgroundColor }: { modeProps?: ModeProps; backgroundColor: string; children?: ReactNode }) {
  return <ModeWrapper glb={BAR} geometryKey="Cube" lockToBottom followPointer={false} modeProps={{ transmission: 1, roughness: 0, thickness: 10, ior: 1.15, color: "#ffffff", ...modeProps }} backgroundColor={backgroundColor} />;
}

function NavItems({ items, textColor }: { items: { label: string; link: string }[]; textColor: string }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, camera } = useThree();
  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);
    group.current.children.forEach((child, i) => { child.position.x = (i - (items.length - 1) / 2) * 0.28; });
  });
  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text key={label} fontSize={0.035} color={textColor} anchorX="center" anchorY="middle" onClick={() => { if (link) window.location.href = link; }}>
          {label}
        </Text>
      ))}
    </group>
  );
}

function Images() {
  const group = useRef<THREE.Group>(null);
  const data = useScroll();
  const { height } = useThree((s) => s.viewport);
  useFrame(() => {
    if (!group.current) return;
    const kids = group.current.children as THREE.Mesh[];
    if (kids[0]) (kids[0].material as { zoom: number }).zoom = 1 + data.range(0, 1 / 3) / 3;
    if (kids[1]) (kids[1].material as { zoom: number }).zoom = 1 + data.range(0, 1 / 3) / 3;
    if (kids[2]) (kids[2].material as { zoom: number }).zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
  });
  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[3, height / 1.1]} url={IMAGE_URLS[0]} />
      <Image position={[2, 0, 3]} scale={3} url={IMAGE_URLS[1]} />
      <Image position={[-2.05, -height, 6]} scale={[1, 3]} url={IMAGE_URLS[2]} />
      <Image position={[-0.6, -height, 9]} scale={[1, 2]} url={IMAGE_URLS[3]} />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url={IMAGE_URLS[4]} />
    </group>
  );
}

function Typography({ textColor }: { textColor: string }) {
  return (
    <Text position={[0, 0, 12]} fontSize={0.35} letterSpacing={-0.05} color={textColor} anchorX="center" anchorY="middle">
      CantStopWatchingAds
    </Text>
  );
}

useGLTF.preload(LENS);
useGLTF.preload(BAR);
useGLTF.preload(CUBE);
