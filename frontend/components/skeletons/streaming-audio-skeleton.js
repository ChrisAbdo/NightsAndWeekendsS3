import React from "react";

export default function StreamingAudioSkeleton() {
  return (
    <div className="p-6 border-t border-b border-gray-100 dark:border-[#333]">
      <div className="bg-gray-200 dark:bg-[#333] w-full h-14 animate-pulse rounded-full" />
    </div>
  );
}
