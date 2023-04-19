import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function StreamingStatsSkeleton() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div>
            <div className="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8">
              <div className="space-y-4">
                <div className="bg-gray-200 dark:bg-[#333] w-20 h-4 animate-pulse rounded-md" />
                <div className="bg-gray-200 dark:bg-[#333] w-full h-10 animate-pulse rounded-md" />
              </div>
            </div>
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
