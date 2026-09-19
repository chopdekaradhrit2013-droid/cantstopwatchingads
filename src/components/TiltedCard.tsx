"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import "./TiltedCard.css";

const spring = { damping: 26, stiffness: 120, mass: 1.6 };

export default function TiltedCard({
  imageSrc, altText = "", captionText = "", overlayContent, displayOverlayContent = true,
}: {
  imageSrc: string; altText?: string; captionText?: string; overlayContent?: React.ReactNode; displayOverlayContent?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);
  const scale = useSpring(1, spring);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ox = e.clientX - r.left - r.width / 2;
    const oy = e.clientY - r.top - r.height / 2;
    rotateX.set((oy / (r.height / 2)) * -10);
    rotateY.set((ox / (r.width / 2)) * 10);
  }

  return (
    <figure ref={ref} className="tilted-card-figure" onMouseMove={onMove} onMouseEnter={() => scale.set(1.06)} onMouseLeave={() => { scale.set(1); rotateX.set(0); rotateY.set(0); }}>
      <motion.div className="tilted-card-inner" style={{ rotateX, rotateY, scale }}>
        <img src={imageSrc} alt={altText} className="tilted-card-img" />
        {displayOverlayContent && overlayContent && <div className="tilted-card-overlay">{overlayContent}</div>}
      </motion.div>
      {captionText ? <figcaption className="sr-only">{captionText}</figcaption> : null}
    </figure>
  );
}
