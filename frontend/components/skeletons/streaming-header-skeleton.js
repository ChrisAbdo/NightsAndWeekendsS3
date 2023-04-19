import React from "react";

export default function StreamingHeaderSkeleton() {
  return (
    <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-100 dark:bg-black px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
      <div className="bg-gray-200 dark:bg-[#333] w-32 h-32 animate-pulse rounded-md" />

      <div className="space-y-4 ml-4">
        <div className="bg-gray-200 dark:bg-[#333] w-64 h-4 animate-pulse rounded-md" />
        <div className="bg-gray-200 dark:bg-[#333] w-80 h-4 animate-pulse rounded-md" />
      </div>

      <div className="bg-gray-200 dark:bg-[#333] w-20 h-6 animate-pulse rounded-full" />
    </div>
  );
}
