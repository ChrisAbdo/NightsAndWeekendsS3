import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import DarkModeToggle from "./dark-mode-toggle";
import Link from "next/link";

const solutions = [
  {
    name: "Listen",
    description: "Launch Etherwav and start listening",
    href: "/listen",
    icon: ChartPieIcon,
  },
  {
    name: "Upload",
    description: "Upload your music to Etherwav",
    href: "/upload",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Profile",
    description: "View your profile and settings",
    href: "/profile",
    icon: FingerPrintIcon,
  },
];

export default function FlyoutMenu() {
  return (
    <Popover className="relative">
      <Popover.Button className="flex rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-200 dark:hover:bg-[#333] transition duration-200">
        <span>
          <Bars3Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="fixed top-0 left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white dark:bg-black text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="p-4">
              {solutions.map((item) => (
                <div
                  key={item.name}
                  className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-[#111]"
                >
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-[#111] group-hover:bg-white dark:group-hover:bg-[#333]">
                    <item.icon
                      className="h-6 w-6  group-hover:text-orange-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <Link href={item.href} className="font-semibold">
                      {item.name}
                      <span className="absolute inset-0" />
                    </Link>
                    <p className="mt-1 text-gray-600 dark:text-[#999]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50 dark:bg-[#111]">
              <div className="flex items-center justify-center gap-x-2.5 p-3 font-semibold  hover:bg-gray-100 dark:hover:bg-[#333]">
                <DarkModeToggle /> Toggle Theme
              </div>

              <div className="flex items-center justify-center gap-x-2.5 p-3 font-semibold  hover:bg-gray-100 dark:hover:bg-[#333]">
                Star on Github
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
