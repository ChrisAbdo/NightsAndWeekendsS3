import { Fragment } from "react";
import DarkModeToggle from "@/components/shared-layout/dark-mode-toggle";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import {
  ChartPieIcon,
  CursorArrowRaysIcon,
  FireIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import ThemeSkeleton from "./theme-skeleton";

const products = [
  {
    name: "Listen",
    description: "Find the best songs on Polygon",
    href: "/listen",
    icon: ChartPieIcon,
  },
  {
    name: "Earn and Give Heat",
    description: "Support other artists by giving them heat",
    href: "/listen",
    icon: CursorArrowRaysIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  {
    name: "Star on GitHub",
    href: "https://github.com/ChrisAbdo/Ethrwav",
    icon: StarIcon,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavbarSkeleton() {
  return (
    <header className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-[#333] z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <h1 className="flex items-center text-xl font-bold leading-7 text-black dark:text-white">
              <FireIcon className="h-6 w-6 mr-1" aria-hidden="true" />
              Etherwav
            </h1>
          </Link>
        </div>

        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-black dark:text-white">
              Listen
              <ChevronDownIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
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
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white dark:bg-black border dark:border-[#333] shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {products.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-[#111] transition duration-150"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-[#111] group-hover:bg-white dark:group-hover:bg-[#333]">
                        <item.icon
                          className="h-6 w-6 text-gray-600 dark:text-[#999] group-hover:text-orange-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-auto">
                        <Link href={item.href} className="block font-semibold">
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
                <div className="grid grid-cols-2 divide-x divide-gray-900/5 dark:divide-[#333] bg-gray-50 dark:bg-[#111] dark:border-t dark:border-[#333]">
                  {callsToAction.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#333]"
                    >
                      <item.icon
                        className="h-5 w-5 flex-none text-gray-400"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <Link
            href="/upload"
            className="text-sm font-semibold leading-6 text-black dark:text-white"
          >
            Upload
          </Link>

          <Link
            href="/profile"
            className="text-sm font-semibold leading-6 text-black dark:text-white"
          >
            Profile
          </Link>
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="flex items-center justify-center w-40">
            {/* {loading ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-full rounded-md bg-transparent px-5 py-2 text-sm font-semibold text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-200 dark:hover:bg-[#111] transition duration-200 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-loader-2 animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
              </button>
            ) : connectedAccount ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-full rounded-md bg-transparent px-5 py-2 text-sm font-semibold text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-200 dark:hover:bg-[#111] transition duration-200 flex items-center justify-center"
              >
                {connectedAccount.slice(0, 5)}...{connectedAccount.slice(-4)}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-full rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-200 dark:hover:bg-[#111] transition duration-200 flex items-center justify-center"
              >
                <span>Connect Wallet</span>
              </button>
            )} */}
             <button
                type="button"
              
                className="w-full rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-200 dark:hover:bg-[#111] transition duration-200 flex items-center justify-center"
              >
                <span>Connect Wallet</span>
              </button>
          </div>

          <div className="flex items-center ml-4">
            {/* <DarkModeToggle /> */}
            <ThemeSkeleton />
          </div>

          {/* <WalletModal
            open={open}
            setOpen={setOpen}
            connectWallet={connectWallet}
            connectedAccount={connectedAccount}
            setConnectedAccount={setConnectedAccount}
            error={error}
          /> */}
        </div>

        <div className="flex lg:hidden space-x-2">
          {/* {connectedAccount && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-md bg-transparent px-5 py-2 text-sm font-semibold text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-200 dark:hover:bg-[#111] transition duration-200"
            >
              {connectedAccount.slice(0, 5)}...{connectedAccount.slice(-4)}
            </button>
          )}

          {!connectedAccount && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-200 dark:hover:bg-[#111] transition duration-200"
            >
              <span>Connect Wallet</span>
            </button>
          )} */}
          <div className="flex items-center">{/* <FlyoutMenu /> */}</div>
        </div>
      </nav>
    </header>
  );
}
