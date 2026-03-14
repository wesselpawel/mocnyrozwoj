"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type ImageWithPreviewProps = {
  src: string;
  alt: string;
  className?: string;
  size?: number;
  previewSize?: number;
};

export default function ImageWithPreview({
  src,
  alt,
  className = "",
  size = 64,
  previewSize = 256,
}: ImageWithPreviewProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden border-2 border-[#e77503]/30 ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${size}px`}
      />
      
      {isHovering && (
        <div
          className="fixed z-50 pointer-events-none rounded-xl overflow-hidden shadow-2xl border-2 border-white"
          style={{
            width: previewSize,
            height: previewSize,
            left: position.x + (containerRef.current?.getBoundingClientRect().left || 0) + 20,
            top: position.y + (containerRef.current?.getBoundingClientRect().top || 0) - previewSize / 2,
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={`${previewSize}px`}
            priority
          />
        </div>
      )}
    </div>
  );
}
