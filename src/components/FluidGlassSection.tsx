"use client";
import dynamic from "next/dynamic";

const FluidGlass = dynamic(() => import("./FluidGlass"), { ssr: false });

export function FluidGlassSection() {
  return (
    <div className="relative left-1/2 h-[70vh] w-screen -translate-x-1/2 overflow-hidden bg-[#120F17]">
      <FluidGlass
        mode="lens"
        backgroundColor="#120F17"
        textColor="#ffffff"
        lensProps={{ scale: 0.25, ior: 1.15, thickness: 5, chromaticAberration: 0.1, anisotropy: 0.01 }}
      />
    </div>
  );
}
