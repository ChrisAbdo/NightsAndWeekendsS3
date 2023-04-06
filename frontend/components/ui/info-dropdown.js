import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const items = [{ name: "Download", href: "#" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function InfoDropdown({ nft, media }) {
  async function downloadMedia(url) {
    try {
      const response = await fetch(url);
      const data = await response.blob();
      const blobUrl = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop(); // Extract the filename from the URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error while downloading media:", error);
    }
  }

  return (
    <div className="inline-flex rounded-md shadow-sm">
      <button
        type="button"
        onClick={() => {
          window.open(media, "_blank");
        }}
        className="relative inline-flex items-center rounded-l-md  px-3 py-2 text-sm font-semibold  ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-50 dark:hover:bg-[#111] focus:z-10"
      >
        View
      </button>
      <Menu as="div" className="relative -ml-px block">
        <Menu.Button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-50 dark:hover:bg-[#111] focus:z-10">
          <span className="sr-only">Open options</span>
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-black shadow-lg ring-1 ring-black dark:ring-[#333] ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {items.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <button
                      onClick={() => downloadMedia(media)}
                      className={classNames(
                        active
                          ? "bg-gray-100 dark:bg-[#111] text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-white",
                        "block px-4 py-2 text-sm w-full text-left"
                      )}
                    >
                      {item.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
