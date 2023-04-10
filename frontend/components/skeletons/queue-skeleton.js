import React from "react";

export default function QueueSkeleton() {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <li
            key={i}
            onClick={() => {
              setCurrentIndex(i);
            }}
            className=" py-4 hover:bg-gray-200 dark:hover:bg-[#111] transition duration-150 rounded-md p-6"
          >
            <div className="flex space-x-3">
              {/* Image */}
              <div className="bg-gray-200 dark:bg-[#333] w-10 h-10 animate-pulse rounded-md" />

              <div className="flex-1 space-y-3">
                {/* Title */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    <div className="bg-gray-200 dark:bg-[#333] w-28 h-4 animate-pulse rounded-md" />
                  </h3>
                   {/* Heat Count */}
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="bg-gray-200 dark:bg-[#333] w-6 h-4 animate-pulse rounded-md" />
                  </div>
                </div>

               {/* Seller */}
                <div className="text-sm text-gray-500">
                  <div className="bg-gray-200 dark:bg-[#333] w-24 h-4 animate-pulse rounded-md" />
                </div>
              </div>
            </div>
          </li>
        ))}
    </>
  );
}
