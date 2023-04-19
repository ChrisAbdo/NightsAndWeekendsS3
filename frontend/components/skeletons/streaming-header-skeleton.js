import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function StreamingHeaderSkeleton() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-100 dark:bg-black px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div className="bg-gray-200 dark:bg-[#333] w-32 h-32 animate-pulse rounded-md" />

            <div className="space-y-4 ml-4">
              <div className="bg-gray-200 dark:bg-[#333] w-64 h-4 animate-pulse rounded-md" />
              <div className="bg-gray-200 dark:bg-[#333] w-80 h-4 animate-pulse rounded-md" />
            </div>

            <div className="bg-gray-200 dark:bg-[#333] w-20 h-6 animate-pulse rounded-full" />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
            sideOffset={5}
          >
            Play a song to see more!
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
