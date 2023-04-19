import React from "react";

export default function StreamingSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr
          key={i}
          className="hover:bg-gray-100 dark:hover:bg-[#111] transition duration-150 ease-in-out"
        >
          <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
            <div className="flex items-center gap-x-4">
              <div className="h-8 w-8 rounded-md overflow-hidden bg-gray-800">
                {/* Cover Image */}
                <div className="bg-gray-200 dark:bg-[#333] h-8 w-8 animate-pulse rounded-full" />
              </div>

              <div className="truncate text-sm font-medium leading-6">
                <div className="bg-gray-200 dark:bg-[#333] h-4 w-64 animate-pulse rounded-full" />
              </div>
            </div>
          </td>
          <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
            <span className="text-sm font-medium">
              <div className="bg-gray-200 dark:bg-[#333] h-4 w-44 animate-pulse rounded-full" />
            </span>
          </td>
          <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
            <div className="flex gap-x-3">
              <div className="bg-gray-200 dark:bg-[#333] h-6 w-24 animate-pulse rounded-md" />
            </div>
          </td>

          <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
            <div className="flex items-center justify-end gap-x-2 sm:justify-start">
              <time className="text-gray-400 sm:hidden">TIME</time>

              <div className="hidden text-white sm:block">
                {" "}
                <div className="bg-gray-200 dark:bg-[#333] h-4 w-4 animate-pulse rounded-full" />
              </div>
            </div>
          </td>

          <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
            Soon!
          </td>
        </tr>
      ))}
    </>
  );
}
