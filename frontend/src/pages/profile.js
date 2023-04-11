import { Fragment, useState, useEffect, useRef, createRef } from "react";

import axios from "axios";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import Web3 from "web3";
import Radio from "@/contracts/Radio.json";
import NFT from "@/contracts/NFT.json";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3CenterLeftIcon,
  Bars4Icon,
  ClockIcon,
  FireIcon,
  HomeIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronRightIcon,
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import ProfileDropdown from "@/components/profile-ui/profile-dropdown";
import ProfileSkeleton from "@/components/skeletons/profile-skeleton";
import ProfileTopSkeleton from "@/components/skeletons/profile-top-skeleton";
import Link from "next/link";
import ProgressBar from "@/components/listen-ui/song-progress";
import SongProgress from "@/components/listen-ui/song-progress";

const navigation = [
  { name: "Home", href: "#", icon: HomeIcon, current: true },
  { name: "My tasks", href: "#", icon: Bars4Icon, current: false },
  { name: "Recent", href: "#", icon: ClockIcon, current: false },
];
const teams = [
  { name: "Engineering", href: "#", bgColorClass: "bg-indigo-500" },
  { name: "Human Resources", href: "#", bgColorClass: "bg-green-500" },
  { name: "Customer Success", href: "#", bgColorClass: "bg-yellow-500" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [topThreeNfts, setTopThreeNfts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [audioRefs, setAudioRefs] = useState({});
  const [isPlaying, setIsPlaying] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    loadProfileSongs();
  }, []);

  useEffect(() => {
    // Create refs for each nft
    const newAudioRefs = nfts.reduce((acc, nft) => {
      acc[nft.tokenId] = createRef();
      return acc;
    }, {});

    setAudioRefs(newAudioRefs);
  }, [nfts]);

  async function loadProfileSongs() {
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      Radio.abi,

      Radio.networks[networkId].address
    );
    const listings = await radioContract.methods
      .getMyListedNfts()

      .call({ from: window.ethereum.selectedAddress });
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
          const NFTContract = new web3.eth.Contract(
            NFT.abi,

            NFT.networks[networkId].address
          );
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          const nft = {
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            image: meta.data.image,
            title: meta.data.title,
            coverImage: meta.data.coverImage,
            heatCount: i.heatCount,
            genre: meta.data.genre,
          };
          console.log(nft);
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );

    // set nfts in order of heatCount
    const sortedNfts = nfts
      .filter((nft) => nft !== null)
      .sort((a, b) => b.heatCount - a.heatCount);
    const topThreeNfts = sortedNfts.slice(0, 4);

    setTopThreeNfts(topThreeNfts);

    setNfts(sortedNfts);
  }

  async function deleteMyNFT() {
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();

    // Initialize Radio contract
    const radioContract = new web3.eth.Contract(
      Radio.abi,
      Radio.networks[networkId].address
    );

    // Get the tokenId of the selected NFT
    const tokenId = nfts[currentIndex].tokenId;

    // Call deleteNFT function from the Radio contract
    await radioContract.methods
      .deleteNFT(tokenId)
      .send({ from: window.ethereum.selectedAddress });

    // Refresh the list of NFTs after deletion
    loadProfileSongs();
  }

  const slideUp = {
    hidden: { y: "100%" },
    visible: { y: "0%", transition: { duration: 0.5 } },
    exit: { y: "100%", transition: { duration: 0.4 } },
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.9 } },
  };

  const currentPlayingSong = nfts.find((nft) => nft.tokenId === isPlaying);
  const currentSongImage =
    currentPlayingSong?.coverImage || "https://picsum.photos/200";
  const currentSongName = currentPlayingSong?.title || "Song Name";
  const currentSongArtist = currentPlayingSong?.seller || "Artist Name";
  const currentSongHeat = currentPlayingSong?.heatCount || 0;
  const currentSongGenre = currentPlayingSong?.genre || "Genre";

  return (
    <>
      <div className="min-h-full">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 top-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500"
                      alt="Your Company"
                    />
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="px-2">
                      <div className="space-y-1">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                              "group flex items-center rounded-md px-2 py-2 text-base font-medium leading-5"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-gray-500"
                                  : "text-gray-400 group-hover:text-gray-500",
                                "mr-3 h-6 w-6 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                      </div>
                      <div className="mt-8">
                        <h3
                          className="px-3 text-sm font-medium text-gray-500"
                          id="mobile-teams-headline"
                        >
                          Teams
                        </h3>
                        <div
                          className="mt-1 space-y-1"
                          role="group"
                          aria-labelledby="mobile-teams-headline"
                        >
                          {teams.map((team) => (
                            <a
                              key={team.name}
                              href={team.href}
                              className="group flex items-center rounded-md px-3 py-2 text-base font-medium leading-5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            >
                              <span
                                className={classNames(
                                  team.bgColorClass,
                                  "mr-4 h-2.5 w-2.5 rounded-full"
                                )}
                                aria-hidden="true"
                              />
                              <span className="truncate">{team.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 dark:lg:border-[#333] lg:bg-white dark:lg:bg-black lg:pb-4 lg:pt-5">
          <div className="flex flex-shrink-0 items-center px-6">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500"
              alt="Your Company"
            />
          </div>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto pt-1">
            {/* User account dropdown */}
            <Menu
              as="div"
              className="relative inline-block px-3 text-left mt-4"
            >
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 right-0 z-10 mx-3 mt-1 origin-top divide-y divide-gray-200 dark:divide-[#333] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          View profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Settings
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Notifications
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Get desktop app
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Support
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Logout
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            {/* Sidebar Search */}
            <div className="mt-5 px-3">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                  aria-hidden="true"
                >
                  <MagnifyingGlassIcon
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="bg-white dark:bg-black block w-full rounded-md border-0 py-1.5 pl-9 ring-1 ring-inset ring-gray-300 dark:ring-[#333] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Search"
                />
              </div>
            </div>
            {/* Navigation */}
            <nav className="mt-6 px-3">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-200 text-gray-900 dark:bg-[#333] dark:text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-[#333] dark:hover:text-white",
                      "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 h-6 w-6 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="mt-8">
                {/* Secondary navigation */}
                <h3
                  className="px-3 text-sm font-medium text-gray-500"
                  id="desktop-teams-headline"
                >
                  Teams
                </h3>
                <div
                  className="mt-1 space-y-1"
                  role="group"
                  aria-labelledby="desktop-teams-headline"
                >
                  {teams.map((team) => (
                    <a
                      key={team.name}
                      href={team.href}
                      className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-[#333] hover:text-gray-900"
                    >
                      <span
                        className={classNames(
                          team.bgColorClass,
                          "mr-4 h-2.5 w-2.5 rounded-full"
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate dark:text-white">
                        {team.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
        {/* Main column */}
        <div className="flex flex-col lg:pl-64 mb-36">
          {/* Search header */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:hidden">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex flex-1">
                <form className="flex w-full md:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                      <MagnifyingGlassIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search-field"
                      name="search-field"
                      className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-0 focus:placeholder:text-gray-400 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </form>
              </div>
              <div className="flex items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              View profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Notifications
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Get desktop app
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Support
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Logout
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <main className="flex-1">
            {/* Page title & actions */}
            <div className="border-b border-gray-200 dark:border-[#333] px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-medium leading-6  sm:truncate">
                  Your Uploaded Songs
                </h1>
              </div>
              <div className="mt-4 flex sm:ml-4 sm:mt-0">
                <button
                  type="button"
                  className="sm:order-0 order-1 ml-3 inline-flex items-center rounded-md bg-white dark:bg-[#111] px-3 py-2 text-sm font-semibold  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-50 dark:hover:bg-[#111]/80 sm:ml-0"
                >
                  Share
                </button>
                <Link
                  href="/upload"
                  className="order-0 inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 sm:order-1 sm:ml-3"
                >
                  Upload Song
                </Link>
              </div>
            </div>
            {/* Pinned projects */}
            <div className="mt-6 px-4 sm:px-6 lg:px-8">
              <h2 className="text-sm font-medium ">Your Top Songs</h2>
              <ul
                role="list"
                className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4"
              >
                {/* {pinnedProjects.map((project) => ( */}
                {nfts.length > 0 ? (
                  topThreeNfts.map((nft) => (
                    <li
                      key={nft.tokenId}
                      className="relative col-span-1 flex rounded-md shadow-sm"
                    >
                      <div
                        className={classNames(
                          "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                        )}
                      >
                        <Image
                          src={nft.coverImage}
                          width={64}
                          height={64}
                          alt=""
                          className="w-16 h-16 rounded-l-md border border-gray-200 dark:border-[#333]"
                        />
                      </div>
                      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 dark:border-[#333] bg-white dark:bg-[#111]">
                        <div className="flex-1 truncate px-4 py-2 text-sm">
                          <a href="#" className="font-medium ">
                            {nft.title}
                          </a>
                          <p className="text-gray-500 flex items-center">
                            {nft.heatCount}&nbsp;
                            <FireIcon className="h-4 w-4" />
                          </p>
                        </div>
                        <Menu as="div" className="flex-shrink-0 pr-2">
                          <Menu.Button className="inline-flex h-8 w-8 items-center justify-center rounded-full  text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                            <span className="sr-only">Open options</span>
                            <EllipsisVerticalIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
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
                            <Menu.Items className="absolute right-10 top-3 z-10 mx-3 mt-1 w-48 origin-top-right divide-y divide-gray-200 dark:divide-[#333] border border-gray-200 dark:border-[#333] rounded-md bg-white dark:bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href="#"
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 dark:bg-[#111] "
                                          : "",
                                        "block px-4 py-2 text-sm"
                                      )}
                                    >
                                      View Stats
                                    </a>
                                  )}
                                </Menu.Item>
                              </div>
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => deleteMyNFT(nft.tokenId)}
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 dark:bg-[#111]"
                                          : "",
                                        "block px-4 py-2 text-sm"
                                      )}
                                    >
                                      Delete Song
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href="#"
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 dark:bg-[#111]"
                                          : "",
                                        "block px-4 py-2 text-sm"
                                      )}
                                    >
                                      Share
                                    </a>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </li>
                  ))
                ) : (
                  <ProfileTopSkeleton />
                )}
              </ul>
            </div>

            {/* Projects list (only on smallest breakpoint) */}
            <div className="mt-10 sm:hidden">
              <div className="px-4 sm:px-6">
                <h2 className="text-sm font-medium">Songs</h2>
              </div>
              <ul
                role="list"
                className="mt-3 divide-y divide-gray-100 dark:divide-[#333] border-t border-gray-200 dark:border-[#333]"
              >
                {nfts.map((nft, index) => (
                  <li key={nft.tokenId}>
                    <a
                      href="#"
                      className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6"
                    >
                      <span className="flex items-center space-x-3 truncate">
                        <Image
                          className="h-6 w-6 max-w-none rounded-md"
                          width={64}
                          height={64}
                          src={nft.coverImage}
                        />
                        <span className="truncate text-sm font-medium leading-6">
                          {nft.title}
                        </span>
                      </span>
                      <ChevronRightIcon
                        className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects table (small breakpoint and up) */}
            <div className="mt-8 hidden sm:block">
              <div className="inline-block min-w-full border-b border-gray-200 dark:border-[#333] align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-t border-gray-200 dark:border-[#333]">
                      <th
                        className="border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#111] px-6 py-3 text-left text-sm font-semibold "
                        scope="col"
                      >
                        <span className="lg:pl-2">Song</span>
                      </th>
                      <th
                        className="border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#111] px-6 py-3 text-left text-sm font-semibold "
                        scope="col"
                      >
                        Heat
                      </th>
                      <th
                        className="hidden border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#111] px-6 py-3 text-right text-sm font-semibold  md:table-cell"
                        scope="col"
                      >
                        Genre
                      </th>
                      <th
                        className="border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#111] py-3 pr-6 text-right text-sm font-semibold "
                        scope="col"
                      />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                    {" "}
                    {nfts.length > 0 ? (
                      nfts.map((nft, i) => (
                        <tr key={nft.tokenId}>
                          <td className="w-full max-w-0 whitespace-nowrap px-6 py-3 text-sm font-medium ">
                            <div className="flex items-center space-x-3 lg:pl-2">
                              <button
                                onClick={() => {
                                  const audioElement =
                                    audioRefs[nft.tokenId].current;
                                  if (isPlaying === nft.tokenId) {
                                    audioElement.pause();
                                    setIsPlaying(null);
                                  } else {
                                    if (isPlaying !== null) {
                                      // Pause the currently playing audio
                                      audioRefs[isPlaying].current.pause();
                                    }
                                    audioElement.play();
                                    setIsPlaying(nft.tokenId);
                                  }
                                }}
                                className="group inline-flex truncate text-sm"
                              >
                                {isPlaying === nft.tokenId ? (
                                  <PauseCircleIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                ) : (
                                  <PlayCircleIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                )}
                              </button>

                              <audio
                                src={nft.image}
                                ref={audioRefs[nft.tokenId]}
                                // on ended, set isPlaying to null
                                onEnded={() => setIsPlaying(null)}
                                className="h-12 w-full hidden"
                                controls
                              />

                              <Image
                                className="h-8 w-8 max-w-none rounded-md"
                                src={nft.coverImage}
                                width={64}
                                height={64}
                                alt=""
                              />
                              <a
                                href="#"
                                className="truncate hover:text-gray-600"
                              >
                                <span>{nft.title}</span>
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-sm font-medium text-gray-500">
                            <div className="flex items-center space-x-2">
                              <div className="flex flex-shrink-0 -space-x-1" />

                              <span className="flex-shrink-0 text-xs font-medium leading-5">
                                {nft.heatCount}
                              </span>
                            </div>
                          </td>
                          <td className="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">
                            {nft.genre}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium">
                            <ProfileDropdown />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <ProfileSkeleton />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        {/* Audio Player */}
        <AnimatePresence>
          {isPlaying !== null && (
            <motion.div
              className="fixed inset-x-0 bottom-0 flex w-full bg-white dark:bg-black shadow-lg shadow-black/5 ring-1 ring-slate-700/10 dark:ring-[#333]"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideUp}
            >
              <div className="flex w-full justify-between items-center px-6 py-4">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-md mr-4"
                    src={currentSongImage}
                    alt="Song Cover"
                  />
                  <div>
                    <motion.h1
                      className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate w-full"
                      variants={textVariants}
                    >
                      {currentSongName}
                    </motion.h1>
                    <motion.p
                      className="text-sm font-medium text-gray-500 dark:text-gray-400 m-0"
                      variants={textVariants}
                    >
                      {currentSongArtist.slice(0, 5)}...
                      {currentSongArtist.slice(currentSongArtist.length - 5)}
                    </motion.p>
                    <motion.p
                      className="text-sm font-medium text-gray-500 dark:text-gray-400 m-0"
                      variants={textVariants}
                    >
                      Heat: {currentSongHeat}{" "}
                      <FireIcon className="h-4 w-4 inline-block" />
                    </motion.p>
                    <motion.p
                      className="text-sm font-medium text-gray-500 dark:text-gray-400 m-0"
                      variants={textVariants}
                    >
                      Genre: {currentSongGenre}
                    </motion.p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FireIcon className="h-6 w-6 text-orange-600 animate-pulse" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
