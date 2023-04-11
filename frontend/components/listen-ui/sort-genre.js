import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SortGenre({ filterSongsByGenre }) {
  const genres = [
    "All",
    "Pop",
    "Rock",
    "Hip Hop",
    "Jazz",
    "Electronic",
    "Country",
    // Add more genres as needed
  ];
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    if (genre === "All") {
      filterSongsByGenre(null);
    } else {
      filterSongsByGenre(genre);
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <div>
        <Menu.Button className="inline-flex justify-between w-full gap-x-1.5 rounded-md bg-white dark:bg-black px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-50 dark:hover:bg-[#111] transition duration-150">
          {selectedGenre || "Sort by Genre"}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className=" z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-black shadow-lg ring-1 ring-black dark:ring-[#333] ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {genres.map((genre) => (
              <Menu.Item key={genre}>
                {({ active }) => (
                  <button
                    onClick={() => handleGenreSelect(genre)}
                    className={classNames(
                      active ? "bg-gray-100 dark:bg-[#111]" : "",
                      "block w-full text-left px-4 py-2 text-sm"
                    )}
                  >
                    {genre}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
