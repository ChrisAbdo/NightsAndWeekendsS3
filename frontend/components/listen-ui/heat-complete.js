import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, FireIcon } from '@heroicons/react/24/outline'
import AsciiFireAnimation from '../index-ui/ascii-fire'

export default function HeatComplete({
    open,
    setOpen,
    heatCompleteModalOpen,
    setHeatCompleteModalOpen,
}) {
//   const [open, setOpen] = useState(true)

  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={heatCompleteModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setHeatCompleteModalOpen}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <FireIcon className="h-6 w-6 text-orange-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 ">
                      Thanks for giving Heat!
                    </Dialog.Title>

                    <h1 className="text-md font-bold ">
                      Please refresh the page to see the updated heat count.
                    </h1>


                    <div>
                     <AsciiFireAnimation />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-black px-3 py-2 text-sm font-semibold  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#333] hover:bg-gray-50 dark:hover:bg-[#111] transition duration-150 sm:col-start-1 sm:mt-0"
                    onClick={() => setHeatCompleteModalOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
