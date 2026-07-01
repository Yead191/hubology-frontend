"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import type * as THREE from "three";

import type { Book } from "@/types";
import { Book3D } from "./book-3d";

const SPACING = 1.4;

function layout(index: number, total: number) {
  const x = (index - (total - 1) / 2) * SPACING;
  const z = -Math.abs(x) * 0.4;
  const rotationY = -x * 0.11;
  return { position: [x, 0, z] as [number, number, number], rotationY };
}

/** The shelf group — gentle idle sway plus the row of book meshes. */
function Shelf({
  books,
  selectedSlug,
  onSelect,
}: {
  books: Book[];
  selectedSlug: string | null;
  onSelect: (book: Book) => void;
}) {
  const group = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {books.map((book, i) => {
        const { position, rotationY } = layout(i, books.length);
        return (
          <Book3D
            key={book.id}
            book={book}
            position={position}
            rotationY={rotationY}
            isSelected={selectedSlug === book.slug}
            isDimmed={selectedSlug !== null}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}

/** Full R3F canvas for the store gallery. Default export for lazy import. */
export default function Gallery3D({
  books,
  selectedSlug,
  onSelect,
  onDeselect,
}: {
  books: Book[];
  selectedSlug: string | null;
  onSelect: (book: Book) => void;
  onDeselect: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, 9], fov: 40 }}
      onPointerMissed={onDeselect}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#090b1b"]} />
      <fog attach="fog" args={["#090b1b", 13, 24]} />

      <ambientLight intensity={0.8} />
      <hemisphereLight args={["#b9c6ff", "#0a0a16", 0.5]} />
      <directionalLight position={[5, 8, 6]} intensity={2.4} />
      <pointLight
        position={[-6, 3, 5]}
        color="#8131f0"
        intensity={45}
        distance={30}
        decay={2}
      />
      <pointLight
        position={[6, -1, 4]}
        color="#03C1FB"
        intensity={30}
        distance={30}
        decay={2}
      />

      <React.Suspense fallback={null}>
        <Shelf books={books} selectedSlug={selectedSlug} onSelect={onSelect} />
        <ContactShadows
          position={[0, -1.25, 0]}
          opacity={0.55}
          scale={16}
          blur={2.6}
          far={4.5}
          color="#000000"
        />
      </React.Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minDistance={6.5}
        maxDistance={12}
        minPolarAngle={1.15}
        maxPolarAngle={1.72}
        minAzimuthAngle={-0.7}
        maxAzimuthAngle={0.7}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
