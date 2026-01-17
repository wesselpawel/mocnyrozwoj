import Image from "next/image";
import React, { useState } from "react";

export const LoadingSkeleton = () => {
  return <div className="aspect-square bg-gray-300 animate-pulse"></div>;
};

export function ImageWithSkeleton({
  src,
  index,
  setCurrentIndex,
  setImageOpen,
}: {
  src: string;
  index: number;
  setCurrentIndex: any;
  setImageOpen: any;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <div
      onClick={() => {
        setCurrentIndex(index);
        setImageOpen(true);
      }}
      className="aspect-square cursor-pointer"
    >
      {loading && <LoadingSkeleton />}
      <Image
        src={src}
        width={244}
        height={244}
        alt="Obraz namalowany na płótnie"
        className={`w-full h-full object-cover duration-500 drop-shadow-lg shadow-black ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
