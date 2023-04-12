import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FireIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";

const cards = [
  {
    name: "Community Driven",
    icon: <GlobeAltIcon className="h-5 w-5" />,
    description:
      "Etherwav is a community driven music platform. Artists can upload their music and anyone can listen to it. Fans can also tip the artists with a built-in system.",
  },
  {
    name: "Heat Leaderboard",
    icon: <FireIcon className="h-5 w-5" />,
    description:
      "The heat leaderboard is a way to show the most popular artists on Etherwav. Songs with more heat get pushed to the top of the queue, meaning users will see these songs first. The leaderboard is updated every second, just refresh!",
  },
  {
    name: "Find New Music",
    icon: <MusicalNoteIcon className="h-5 w-5" />,
    description:
      "Etherwav is a great place to find new music. You can search for artists, songs, or genres. If you're looking for something specific, you can also filter by genre.",
  },
];


export default function HeaderSection() {
  return (
    <motion.div className="relative isolate overflow-hidden bg-gray-50 dark:bg-[#111] border-t border-gray-200 dark:border-[#333] bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md dark:backdrop-blur-md py-24 sm:py-32 z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {cards.map((card, index) => (
            <div
              key={card.name}
              className="flex gap-x-4 rounded-xl bg-[#eaeaea] dark:bg-white/5 hover:bg-[#eaeaea]/80 dark:hover:bg-[#333]/80 transition duration-200 p-6 ring-1 ring-inset ring-white/10 dark:ring-black/10"
            >
              <AnimatePresence>
                <motion.div
                  className="text-base leading-7"
                 
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <h1 className="font-semibold text-black dark:text-white">
                    <span className="flex items-center">
                      {card.icon}
                      <span className="ml-1">{card.name}</span>
                    </span>
                  </h1>
                  <p className="mt-2 text-black dark:text-white">
                    {card.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
