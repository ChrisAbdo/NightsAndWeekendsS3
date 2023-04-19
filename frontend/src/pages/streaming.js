import { Fragment, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
  PlayIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Web3 from "web3";
import Radio from "@/contracts/Radio.json";
import NFT from "@/contracts/NFT.json";
import axios from "axios";
import StreamingHeaderSkeleton from "@/components/skeletons/streaming-header-skeleton";
import StreamingAudioSkeleton from "@/components/skeletons/streaming-audio-skeleton";
import StreamingStatsSkeleton from "@/components/skeletons/streaming-stats";
import StreamingSkeleton from "@/components/skeletons/streaming-skeleton";

const navigation = [
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Deployments", href: "#", icon: ServerIcon, current: true },
  { name: "Activity", href: "#", icon: SignalIcon, current: false },
  { name: "Domains", href: "#", icon: GlobeAltIcon, current: false },
  { name: "Usages", href: "#", icon: ChartBarSquareIcon, current: false },
  { name: "Settings", href: "#", icon: Cog6ToothIcon, current: false },
];
const teams = [
  { id: 1, name: "Planetaria", href: "#", initial: "P", current: false },
  { id: 2, name: "Protocol", href: "#", initial: "P", current: false },
  { id: 3, name: "Tailwind Labs", href: "#", initial: "T", current: false },
];
const secondaryNavigation = [
  { name: "Overview", href: "#", current: true },
  { name: "Activity", href: "#", current: false },
  { name: "Settings", href: "#", current: false },
  { name: "Collaborators", href: "#", current: false },
  { name: "Notifications", href: "#", current: false },
];
const stats = [
  { name: "Number of deploys", value: "405" },
  { name: "Average deploy time", value: "3.65", unit: "mins" },
  { name: "Number of servers", value: "3" },
  { name: "Success rate", value: "98.5%" },
];
const statuses = {
  Completed: "text-green-400 bg-green-400/10",
  Error: "text-rose-400 bg-rose-400/10",
};
const activityItems = [
  {
    user: {
      name: "Michael Foster",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "2d89f0c8",
    branch: "main",
    status: "Completed",
    duration: "25s",
    date: "45 minutes ago",
    dateTime: "2023-01-23T11:00",
  },
  // More items...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Streaming() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [heatOpen, setHeatOpen] = useState(false);
  const [heatCompleteModalOpen, setHeatCompleteModalOpen] = useState(false);
  const [heatButtonLoading, setHeatButtonLoading] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [genreFilteredNfts, setGenreFilteredNfts] = useState([]);
  const isFirstRender = useRef(true);
  const [hovered, setHovered] = useState(null);

  const [heatSort, setHeatSort] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  const [genreActive, setGenreActive] = useState({ active: false, name: null });

  const [isPlaying, setIsPlaying] = useState(false);
  const [heatCount, setHeatCount] = useState(0);
  const [topThreeNfts, setTopThreeNfts] = useState([]);
  const [mostRecentNfts, setMostRecentNfts] = useState([]);
  const [direction, setDirection] = useState("right");

  const [songsLoaded, setSongsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [show, setShow] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const audioRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentNFT, setCurrentNFT] = useState(null);

  const handleCurrentIndex = (i, nft) => {
    setCurrentIndex(i);
    setCurrentNFT(nft);
  };

  useEffect(() => {
    loadSongs();
  }, []);

  async function loadSongs() {
    console.log("Loading songs...");
    const infuraUrl =
      "https://polygon-mumbai.infura.io/v3/bc3a18f867074b7186d877cb4d45675a";
    const web3 = new Web3(infuraUrl);

    // const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      Radio.abi,
      Radio.networks[networkId].address
    );
    const listings = await radioContract.methods.getListedNfts().call();
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
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );

    const sortedNfts = sortSongsByHeat(nfts, sortOrder);
    const topThreeNfts = sortedNfts.slice(0, 3);

    const heatSort = sortSongsByHeat(nfts, "desc");
    setHeatSort(heatSort);

    const mostRecentNfts = nfts
      .filter((nft) => nft !== null)
      .sort((a, b) => {
        return b.tokenId - a.tokenId;
      })
      .slice(0, 5);

    setMostRecentNfts(mostRecentNfts);

    setTopThreeNfts(topThreeNfts);

    setNfts(sortedNfts);

    setSongsLoaded(true);
  }

  function toggleSortOrder() {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    // Re-sort the songs based on the new sortOrder
    const newSortedNfts = sortSongsByHeat(nfts, newSortOrder);
    setNfts(newSortedNfts);
  }

  function sortSongsByHeat(nftsArray, order) {
    return nftsArray
      .filter((nft) => nft !== null)
      .sort((a, b) => {
        return order === "asc"
          ? a.heatCount - b.heatCount
          : b.heatCount - a.heatCount;
      });
  }

  function filterSongsByGenre(genre) {
    if (genre === null) {
      setNfts(heatSort); // Reset NFT list to the original list (unfiltered)
      setGenreActive({ active: false, name: null });
    } else {
      const filteredNfts = nfts.filter((nft) => nft.genre === genre);
      setGenreFilteredNfts(filteredNfts);
      setNfts(filteredNfts);
      setCurrentIndex(0);

      // setGenreActive(genre);
      // set genre active to true and the genre name
      setGenreActive({ active: true, name: genre });

      // notification
      setShow(true);
      setNotificationText("Genre changed!");
      setNotificationDescription(
        "You are now listening to " + genre + " music."
      );
    }
  }

  function shuffleSongs() {
    const shuffledNfts = [...nfts]; // Create a shallow copy of the nfts array to avoid mutating the original array

    for (let i = shuffledNfts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledNfts[i], shuffledNfts[j]] = [shuffledNfts[j], shuffledNfts[i]];
    }

    setNfts(shuffledNfts); // Update the state with the shuffled array
    setShow(true);
    setNotificationDescription("You are now listening to shuffled music.");
    setNotificationText("Shuffle changed!");
  }

  async function handleGiveHeat() {
    // Get an instance of the Radio contract
    try {
      setHeatButtonLoading(true);
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );

      // Give heat to the current NFT
      setLoading(true);
      radioContract.methods
        .giveHeat(nfts[currentIndex].tokenId, heatCount)
        .send({
          from: window.ethereum.selectedAddress,
          to: window.ethereum.selectedAddress,
          value: web3.utils.toWei(heatCount.toString(), "ether"),
        })
        .on("receipt", function () {
          console.log("listed");

          setLoading(false);
          setHeatButtonLoading(false);
          setHeatCompleteModalOpen(true);
        });
    } catch (err) {
      console.log(err);
    }
  }

  function handleNext() {
    setDirection("right");
    setCurrentIndex((currentIndex + 1) % nfts.length);
    setIsPlaying(true);
  }

  function handlePrevious() {
    setDirection("left");
    setCurrentIndex(currentIndex === 0 ? nfts.length - 1 : currentIndex - 1);
    setIsPlaying(true);
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 xl:hidden"
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
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
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
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            Your teams
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {teams.map((team) => (
                              <li key={team.name}>
                                <a
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                    {team.initial}
                                  </span>
                                  <span className="truncate">{team.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="-mx-6 mt-auto">
                          <a
                            href="#"
                            className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                          >
                            <img
                              className="h-8 w-8 rounded-full bg-gray-800"
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt=""
                            />
                            <span className="sr-only">Your profile</span>
                            <span aria-hidden="true">Tom Cook</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden xl:fixed xl:inset-y-2 xl:z-30 xl:flex xl:w-72 xl:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-100 dark:border-[#333] px-6 ">
            <div className="flex h-16 shrink-0 items-center" />
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    Your teams
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <a
                    href="#"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                  >
                    <img
                      className="h-8 w-8 rounded-full bg-gray-800"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">Tom Cook</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="xl:pl-72">
          {/* Sticky search header */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-gray-100 dark:border-[#333] px-4 shadow-sm sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-white xl:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="flex flex-1" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  <input
                    id="search-field"
                    className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    type="search"
                    name="search"
                  />
                </div>
              </form>
            </div>
          </div>

          <main>
            <header>
              {/* Secondary navigation */}
              <nav className="flex overflow-x-auto border-b border-gray-100 dark:border-[#333] py-4">
                <ul
                  role="list"
                  className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
                >
                  {secondaryNavigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={item.current ? "text-indigo-400" : ""}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Heading */}

              {currentNFT ? (
                <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-100 dark:bg-black px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                  <img
                    src={currentNFT?.coverImage}
                    alt=""
                    className="w-32 h-32 self-start sm:self-center rounded-md"
                  />
                  <div>
                    <div className="flex items-center gap-x-3">
                      <h1 className="flex gap-x-3 text-base leading-7">
                        <span className="font-semibold text-white">
                          {currentNFT?.title}
                        </span>
                      </h1>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-gray-400">
                      {currentNFT?.seller}
                    </p>
                  </div>
                  <div className="order-first flex-none w-24 rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none text-center">
                    {currentNFT?.genre}
                  </div>
                </div>
              ) : (
                <StreamingHeaderSkeleton />
              )}

              {/* Audio Player */}
              {currentNFT ? (
                <div
                  key={currentNFT.tokenId} // Add a key prop here, assuming currentNFT has an "id" property
                  className="p-6 border-t border-b border-gray-100 dark:border-[#333]"
                >
                  <audio autoPlay controls className="w-full">
                    <source src={currentNFT?.image} type="audio/mpeg" />
                  </audio>
                </div>
              ) : (
                <StreamingAudioSkeleton />
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 bg-gray-100 dark:bg-black sm:grid-cols-2 lg:grid-cols-4">
                {/* {stats.map((stat, statIdx) => ( */}
                {Array.from({ length: 4 }).map((_, statIdx) => {
                  const getStatInfo = (idx) => {
                    switch (idx) {
                      case 0:
                        return {
                          title: "Song Title",
                          value: currentNFT?.title,
                        };
                      case 1:
                        return {
                          title: "Seller",
                          value: currentNFT?.seller,
                        };
                      case 2:
                        return {
                          title: "Genre",
                          value: currentNFT?.genre,
                        };
                      case 3:
                        return {
                          title: "Heat Count",
                          value: currentNFT?.heatCount,
                        };
                      default:
                        return {
                          title: "",
                          value: "",
                        };
                    }
                  };

                  const statInfo = getStatInfo(statIdx);

                  return currentNFT ? (
                    <div className="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8">
                      <p className="text-sm font-medium leading-6 text-gray-400">
                        {statInfo.title}
                      </p>
                      <p className="mt-2 flex items-baseline gap-x-2">
                        <span className="text-4xl font-semibold tracking-tight text-white truncate max-w-full">
                          {statInfo.value}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <StreamingStatsSkeleton key={statIdx} />
                  );
                })}
              </div>
            </header>

            {/* Activity list */}
            <div className="border-t border-white/10 pt-11">
              <h2 className="px-4 text-base font-semibold leading-7 sm:px-6 lg:px-8">
                Recent Songs
              </h2>
              <table className="mt-6 w-full whitespace-nowrap text-left">
                <colgroup>
                  <col className="w-full sm:w-4/12" />
                  <col className="lg:w-4/12" />
                  <col className="lg:w-2/12" />
                  <col className="lg:w-1/12" />
                  <col className="lg:w-1/12" />
                </colgroup>
                <thead className="border-b border-white/10 text-sm leading-6 text-white">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                    >
                      Song Title
                    </th>
                    <th
                      scope="col"
                      className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                    >
                      Artist
                    </th>
                    <th
                      scope="col"
                      className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                    >
                      Genre
                    </th>

                    <th
                      scope="col"
                      className="flex items-center py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
                    >
                      Heat Count <FireIcon className="h-4 w-4" />
                    </th>

                    <th
                      scope="col"
                      className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                    >
                      Streams
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {nfts.length > 0 ? (
                    nfts.map((nft, i) => (
                      <tr
                        key={i}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        className={`hover:bg-gray-100 dark:hover:bg-[#111] transition duration-150 ease-in-out ${
                          hovered !== null && hovered !== i ? "blur-sm" : ""
                        }`}
                      >
                        <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                          <div className="flex items-center gap-x-4">
                            <motion.div
                              initial={{ opacity: 1 }}
                              whileHover={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="h-8 w-8 rounded-md overflow-hidden bg-gray-800"
                            >
                              <img
                                src={nft.coverImage}
                                alt=""
                                className="h-8 w-8"
                              />
                            </motion.div>
                            <AnimatePresence>
                              {hovered === i && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  className="h-8 w-8 absolute"
                                >
                                  <div
                                    onClick={() => handleCurrentIndex(i, nft)}
                                    className="bg-gray-300 dark:bg-[#333] hover:bg-gray-300 dark:hover:bg-[#444] rounded-md"
                                  >
                                    <PlayIcon className="ml-0.5 h-8 w-8 " />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="truncate text-sm font-medium leading-6">
                              {nft.title}
                            </div>
                          </div>
                        </td>
                        <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                          <span className="text-sm font-medium">
                            {nft.seller.slice(0, 5)}...
                            {nft.seller.slice(-4)}
                          </span>
                        </td>
                        <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                          <div className="flex gap-x-3">
                            <div className="w-24 rounded-md bg-gray-700/40 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-white/10 text-center">
                              {nft.genre}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                          <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                            <time className="text-gray-400 sm:hidden">
                              {/* {nft.genre} */} TIME
                            </time>

                            <div className="hidden text-white sm:block">
                              {nft.heatCount}
                            </div>
                          </div>
                        </td>

                        <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                          Soon!
                        </td>
                      </tr>
                    ))
                  ) : (
                    <StreamingSkeleton />
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
