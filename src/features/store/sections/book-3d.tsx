"use client";

import * as React from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import type { Book } from "@/types";

const W = 1.3;
const H = 2;
const D = 0.28;

/** Word-wrap helper for drawing the title onto the cover canvas. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Builds a procedural cover texture (gradient + title) for a book. */
function useCoverTexture(book: Book) {
  return React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Texture();

    const grad = ctx.createLinearGradient(0, 0, 512, 768);
    grad.addColorStop(0, book.accent[0]);
    grad.addColorStop(1, book.accent[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 768);

    // Soft radial highlight
    const glow = ctx.createRadialGradient(150, 160, 20, 150, 160, 500);
    glow.addColorStop(0, "rgba(255,255,255,0.28)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 512, 768);

    // Brand mark
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "600 22px Sora, system-ui, sans-serif";
    ctx.textBaseline = "top";
    ctx.letterSpacing = "6px";
    ctx.fillText("HUBOLOGY", 48, 56);
    ctx.letterSpacing = "0px";

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 66px Sora, system-ui, sans-serif";
    const lines = wrapText(ctx, book.title, 416);
    let y = 470 - lines.length * 66;
    for (const l of lines) {
      ctx.fillText(l, 48, y);
      y += 74;
    }

    // Subtitle
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "400 26px Manrope, system-ui, sans-serif";
    const subLines = wrapText(ctx, book.subtitle, 416);
    y += 8;
    for (const l of subLines) {
      ctx.fillText(l, 48, y);
      y += 34;
    }

    // Accent rule
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(48, 690, 90, 5);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, [book]);
}

export function Book3D({
  book,
  position,
  rotationY,
  isSelected,
  isDimmed,
  onSelect,
}: {
  book: Book;
  position: [number, number, number];
  rotationY: number;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: (book: Book) => void;
}) {
  const group = React.useRef<THREE.Group>(null);
  const [hovered, setHovered] = React.useState(false);
  const cover = useCoverTexture(book);
  const phase = React.useMemo(() => Math.abs(position[0]) + position[2], [position]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const lift = isSelected ? 0.45 : hovered ? 0.22 : 0;
    const float = Math.sin(t * 0.8 + phase) * 0.05;
    g.position.y = THREE.MathUtils.damp(
      g.position.y,
      position[1] + lift + float,
      6,
      delta,
    );
    g.position.z = THREE.MathUtils.damp(
      g.position.z,
      position[2] + (isSelected ? 1.2 : 0),
      6,
      delta,
    );
    const targetScale = isSelected ? 1.18 : hovered ? 1.06 : 1;
    const s = THREE.MathUtils.damp(g.scale.x, targetScale, 6, delta);
    g.scale.setScalar(s);
    const targetRot = isSelected ? 0 : rotationY + (hovered ? -0.12 : 0);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRot, 6, delta);
  });

  const dim = isDimmed && !isSelected;

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(book);
      }}
    >
      {/* Book body */}
      <RoundedBox args={[W, H, D]} radius={0.04} smoothness={4} castShadow>
        <meshStandardMaterial
          color={book.accent[1]}
          roughness={0.55}
          metalness={0.1}
          transparent
          opacity={dim ? 0.35 : 1}
        />
      </RoundedBox>

      {/* Fore-edge pages */}
      <mesh position={[W / 2 - 0.02, 0, 0]}>
        <boxGeometry args={[0.03, H - 0.08, D - 0.05]} />
        <meshStandardMaterial
          color="#f4f1ea"
          roughness={0.9}
          transparent
          opacity={dim ? 0.35 : 1}
        />
      </mesh>

      {/* Front cover art */}
      <mesh position={[0, 0, D / 2 + 0.001]}>
        <planeGeometry args={[W - 0.02, H - 0.02]} />
        <meshStandardMaterial
          map={cover}
          roughness={0.4}
          metalness={0.05}
          transparent
          opacity={dim ? 0.4 : 1}
        />
      </mesh>
    </group>
  );
}
