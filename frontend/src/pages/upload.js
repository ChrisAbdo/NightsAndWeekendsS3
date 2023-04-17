import { useState, forwardRef, lazy, Suspense } from "react";
import Web3 from "web3";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import classnames from "classnames";
import * as Select from "@radix-ui/react-select";

import Radio from "@/contracts/Radio.json";
import NFT from "@/contracts/NFT.json";

import client from "@/hooks/useIPFSClient";

const CheckIcon = lazy(() => import("@heroicons/react/20/solid/CheckIcon"));
const ChevronDownIcon = lazy(() =>
  import("@heroicons/react/20/solid/ChevronDownIcon")
);
const ChevronUpIcon = lazy(() =>
  import("@heroicons/react/20/solid/ChevronUpIcon")
);
const TrashIcon = lazy(() => import("@heroicons/react/20/solid/TrashIcon"));
const Divider = dynamic(() => import("@/components/upload-ui/divider"));

const RadioRedirect = dynamic(() =>
  import("@/components/upload-ui/radio-redirect")
);
const Notification = dynamic(() =>
  import("@/components/listen-ui/notification")
);

const inputVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

export default function Upload() {
  const [audioSrc, setAudioSrc] = useState();
  const [coverImageSrc, setCoverImageSrc] = useState();
  const [titleSrc, setTitleSrc] = useState();
  const [genreSrc, setGenreSrc] = useState();

  const [formInput, updateFormInput] = useState({
    title: "",
    coverImage: "",
    genre: "",
  });

  const [show, setShow] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);

  async function onChange(e) {
    // upload image to IPFS

    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);

      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createCoverImage(e) {
    // upload image to IPFS
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);

      updateFormInput({
        ...formInput,
        coverImage: url,
      }); // update form input with cover image URL
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { title, coverImage, genre } = formInput;
    if (!title || !coverImage || !genre || !fileUrl) {
      return;
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify(
        {
          title,
          coverImage,
          image: fileUrl,
          genre,
        },
        circularReplacer()
      );

      try {
        const added = await client.add(data);
        const url = `https://ipfs.io/ipfs/${added.path}`;
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction

        return url;
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  }

  async function listNFTForSale() {
    try {
      setLoading(true);

      const web3 = new Web3(window.ethereum);
      const url = await uploadToIPFS();

      const networkId = await web3.eth.net.getId();

      // Mint the NFT

      const NFTContractAddress = NFT.networks[networkId].address;

      const NFTContract = new web3.eth.Contract(NFT.abi, NFTContractAddress);
      const accounts = await web3.eth.getAccounts();

      const radioContract = new web3.eth.Contract(
        Radio.abi,

        Radio.networks[networkId].address
      );

      NFTContract.methods
        .mint(url)
        .send({ from: accounts[0] })
        .on("receipt", function (receipt) {
          console.log("minted");
          // List the NFT
          const tokenId = receipt.events.NFTMinted.returnValues[0];
          radioContract.methods
            .listNft(NFTContractAddress, tokenId)
            .send({ from: accounts[0] })
            .on("receipt", function () {
              console.log("listed");
              setLoading(false);
              setShow(true);
              setNotificationText("Success!");
              setNotificationDescription(
                "Your song is now available on the listen page."
              );
            })
            .on("error", function (error) {
              console.error("Error:", error);
              setLoading(false);
              setShow(true);
              setNotificationText("Transaction Denied");
              setNotificationDescription("You have denied the transaction.");
            });
        })
        .on("error", function (error) {
          console.error("Error:", error);
          setLoading(false);
          setShow(true);
          setNotificationText("Transaction Denied");
          setNotificationDescription("You have denied the transaction.");
        });
    } catch (error) {
      console.log(error);
      console.log("Error listing NFT for sale: ", error);
    }
  }

  function circularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImageSrc(URL.createObjectURL(file));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    setAudioSrc(URL.createObjectURL(file));
  };

  const handleRemoveAll = () => {
    setAudioSrc(null);
    setCoverImageSrc(null);
    setTitleSrc(null);
    setGenreSrc(null);

    // TODO: Remove all inputs from form
    const titleInput = document.getElementById("title");
    if (titleInput) {
      titleInput.value = "";
    }

    setShow(true);
    setNotificationText("All inputs have been removed");
    setNotificationDescription("Please fill out the form again");
  };

  return (
    <div className="bg-white dark:bg-black">
      <Notification
        show={show}
        setShow={setShow}
        notificationText={notificationText}
        notificationDescription={notificationDescription}
      />
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div>
              <h2 className="text-lg font-medium ">Upload Song</h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    variants={inputVariants}
                  >
                    <div className="flex justify-between">
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-black dark:text-white"
                      >
                        Choose Song File
                      </label>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-black dark:text-white"
                      >
                        MP3 or WAV only
                      </label>
                    </div>
                    <div className="mt-1">
                      <input
                        type="file"
                        name="small-file-input"
                        id="small-file-input"
                        accept="audio/*"
                        onChange={(e) => {
                          handleAudioChange(e);
                          onChange(e);
                          // something else
                        }}
                        className="block w-full border border-gray-300 shadow-sm rounded-md text-sm focus:z-10 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:bg-black dark:border-[#333] dark:text-gray-400
                      file:bg-transparent file:border-0
                      file:bg-gray-100 file:mr-4
                      file:py-2 file:px-4
                      dark:file:bg-black dark:file:text-gray-400"
                      />
                    </div>
                  </motion.div>
                </div>

                <div className="sm:col-span-2">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    variants={inputVariants}
                  >
                    <div className="flex justify-between">
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-black dark:text-white"
                      >
                        Choose Cover Art
                      </label>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-black dark:text-white"
                      >
                        JPG, PNG, or WEBP only
                      </label>
                    </div>
                    <div className="mt-1">
                      <input
                        type="file"
                        name="small-file-input"
                        id="small-file-input"
                        onChange={(e) => {
                          handleCoverImageChange(e);
                          createCoverImage(e);
                          // something else
                        }}
                        className="block w-full border border-gray-300 shadow-sm rounded-md text-sm focus:z-10 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:bg-black dark:border-[#333] dark:text-gray-400
                      file:bg-transparent file:border-0
                      file:bg-gray-100 file:mr-4
                      file:py-2 file:px-4
                      dark:file:bg-black dark:file:text-gray-400"
                      />
                    </div>
                  </motion.div>
                </div>

                <div className="sm:col-span-2">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    variants={inputVariants}
                  >
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-black dark:text-white"
                    >
                      Song Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="company"
                        id="title"
                        autoComplete="off"
                        onChange={(e) => {
                          setTitleSrc(e.target.value);
                          updateFormInput({
                            ...formInput,
                            title: e.target.value,
                          });
                          // something else
                        }}
                        className="block w-full rounded-md border-gray-300 dark:bg-black dark:border-[#333] shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      />
                    </div>
                  </motion.div>
                </div>

                <div className="sm:col-span-2">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={3}
                    variants={inputVariants}
                  >
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-black dark:text-white"
                      >
                        Select Genre
                      </label>

                      <Select.Root
                        id="genre"
                        onValueChange={(e) => {
                          setGenreSrc(e);
                          console.log(e);
                          // something else
                          updateFormInput({ ...formInput, genre: e });
                        }}
                      >
                        <Select.Trigger
                          className="w-full rounded-md inline-flex items-center px-[15px] text-[13px] leading-none h-[35px] gap-[5px] text-violet11 border border-gray-300 dark:border-[#333] shadow-black/10 hover:bg-mauve3 focus:ring-1 focus:ring-orange-500 data-[placeholder]:text-violet9 outline-none"
                          aria-label="Food"
                        >
                          <Select.Value placeholder="Select a genre" />
                          <Select.Icon className="text-violet11">
                            <ChevronDownIcon />
                          </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="overflow-hidden bg-white dark:bg-black border border-gray-200 dark:border-[#333] rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                            <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                              <ChevronUpIcon />
                            </Select.ScrollUpButton>
                            <Select.Viewport className="p-[5px]">
                              <Select.Group>
                                <Select.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
                                  Genres
                                </Select.Label>
                                <SelectItem
                                  className="hover:bg-gray-200 dark:hover:bg-[#111]"
                                  value="Lofi"
                                >
                                  Lofi
                                </SelectItem>
                                <SelectItem
                                  className="hover:bg-gray-200 dark:hover:bg-[#111]"
                                  value="Hip Hop"
                                >
                                  Hip Hop
                                </SelectItem>
                                <SelectItem
                                  className="hover:bg-gray-200 dark:hover:bg-[#111]"
                                  value="R&B"
                                >
                                  R&B
                                </SelectItem>
                                <SelectItem
                                  className="hover:bg-gray-200 dark:hover:bg-[#111]"
                                  value="Pop"
                                >
                                  Pop
                                </SelectItem>
                                <SelectItem
                                  className="hover:bg-gray-200 dark:hover:bg-[#111]"
                                  value="Rock"
                                >
                                  Rock
                                </SelectItem>
                              </Select.Group>
                            </Select.Viewport>
                            <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                              <ChevronDownIcon />
                            </Select.ScrollDownButton>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium ">Preview</h2>

            <div className="mt-4 rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-[#111] shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul
                role="list"
                className="divide-y divide-gray-200 dark:divide-[#333]"
              >
                <li className="flex px-4 py-6 sm:px-6">
                  <div className="flex-shrink-0">
                    {coverImageSrc ? (
                      <img
                        src={coverImageSrc}
                        className="w-24 h-24 rounded-md object-center object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 dark:bg-[#333] w-24 h-24 animate-pulse rounded-md" />
                    )}
                  </div>

                  <div className="ml-6 flex flex-1 flex-col">
                    <div className="flex">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        {titleSrc ? (
                          <h4 className="text-md font-medium text-black dark:text-white">
                            {titleSrc}
                          </h4>
                        ) : (
                          <div className="bg-gray-200 dark:bg-[#333] w-full h-7 animate-pulse rounded-md" />
                        )}

                        {genreSrc ? (
                          <h4 className="text-md font-medium text-black dark:text-white">
                            {genreSrc}
                          </h4>
                        ) : (
                          <div className="bg-gray-200 dark:bg-[#333] w-full h-7 animate-pulse rounded-md" />
                        )}
                      </div>

                      <div className="ml-4 flow-root flex-shrink-0">
                        <button
                          type="button"
                          className="-m-2.5 flex items-center justify-center bg-white dark:bg-[#111] p-2.5 text-gray-400 hover:text-gray-500"
                          onClick={handleRemoveAll}
                        >
                          <span className="sr-only">Remove</span>
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="flex justify-between px-4 py-6 sm:px-6">
                {audioSrc ? (
                  <audio controls className="w-full">
                    <source src={audioSrc} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <div className="bg-gray-200 dark:bg-[#333] w-full h-14 animate-pulse rounded-md" />
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-[#333] px-4 py-6 sm:px-6">
                {!loading &&
                titleSrc &&
                genreSrc &&
                audioSrc &&
                coverImageSrc ? (
                  <button
                    type="submit"
                    className="w-full rounded-md border border-transparent bg-orange-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-600/80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    onClick={listNFTForSale}
                  >
                    Upload Song to Etherwav
                  </button>
                ) : (
                  !loading && (
                    <button
                      type="submit"
                      className="w-full rounded-md border border-transparent bg-orange-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-600/80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-50 cursor-not-allowed"
                      disabled
                    >
                      Fill out all fields to upload
                    </button>
                  )
                )}

                {loading && (
                  <button
                    type="submit"
                    className="cursor-not-allowed w-full rounded-md border border-transparent bg-orange-600 px-4 py-3 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 flex items-center justify-center"
                    disabled
                  >
                    <svg
                      className="animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    &nbsp; Please confirm both transactions
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10" />

        <Divider />

        <RadioRedirect />
      </div>
    </div>
  );
}

const SelectItem = forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          "text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
          {/* <CheckIcon /> */}
          <Suspense fallback={<div>Loading...</div>}>
            <CheckIcon />
          </Suspense>
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

SelectItem.displayName = "SelectItem"; // Add this line to assign a display name to your component
