import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { LinkIcon } from "@heroicons/react/24/outline";

import Notification from "../listen-ui/notification";

export default function WalletModal({
  open,
  setOpen,
  connectWallet,
  connectedAccount,
  setConnectedAccount,
  error,
}) {
  const [show, setShow] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");
  return (
    <>
      <Notification
        show={show}
        setShow={setShow}
        notificationText={notificationText}
        notificationDescription={notificationDescription}
      />
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 dark:bg-[#333] bg-opacity-75 dark:bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full ">
                      <LinkIcon
                        className="h-6 w-6 text-orange-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-black dark:text-white"
                      >
                        Connect Wallet
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-[#eaeaea]">
                          Please connect your wallet to Polygon (MATIC) mainnet.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 space-y-4">
                    {connectedAccount ? (
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed inline-flex w-full justify-center rounded-md bg-orange-600 hover:bg-orange-600/80 px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                      >
                        Connected to&nbsp;
                        {connectedAccount.slice(0, 5) +
                          "..." +
                          connectedAccount.slice(-4)}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-orange-600 hover:bg-orange-600/80 px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                        onClick={connectWallet}
                      >
                        Connect to Polygon Mainnet
                      </button>
                    )}

                    {error && (
                      <h1 className="text-red-500 text-sm text-center">
                        You do not appear to have a wallet. Please consider
                        installing and using MetaMask.
                      </h1>
                    )}

                    {connectedAccount && (
                      <button
                        type="button"
                        onClick={() => {
                          setConnectedAccount(null);
                          setShow(true);
                          setNotificationText("Attention!");
                          setNotificationDescription(
                            "We cannot fully disconnect your wallet from our website. Please disconnect through your wallet extension."
                          );
                        }}
                        className="inline-flex w-full justify-center rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-200 dark:hover:bg-[#333] transition duration-200"
                      >
                        Disconnect Wallet
                      </button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
