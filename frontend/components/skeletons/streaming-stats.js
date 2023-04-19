import React from "react";

export default function StreamingStatsSkeleton() {
  return (
    <div>
      <div className="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="bg-gray-200 dark:bg-[#333] w-20 h-4 animate-pulse rounded-md" />
          <div className="bg-gray-200 dark:bg-[#333] w-full h-10 animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
