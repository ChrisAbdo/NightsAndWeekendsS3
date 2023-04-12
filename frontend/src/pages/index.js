import React from "react";

import dynamic from "next/dynamic";

const AsciiFireAnimation = dynamic(
  () => import("@/components/index-ui/ascii-fire"),
  { ssr: false }
);
const HeaderSection = dynamic(
  () => import("@/components/index-ui/header-section"),
  { ssr: false }
);
const ParallaxText = dynamic(
  () => import("@/components/shared-layout/parallax-text"),
  { ssr: false }
);
const ContentSection = dynamic(
  () => import("@/components/index-ui/content-section"),
  { ssr: false }
);
const Stats = dynamic(() => import("@/components/index-ui/stats"), {
  ssr: false,
});
const ContactMe = dynamic(() => import("@/components/index-ui/contact-me"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/index-ui/footer"), {
  ssr: false,
});

import Link from "next/link";


export default function Index() {
  return (
    <div className="items-center">
      <div className="fixed inset-x-0 bottom-0 z-10">
        <div className="items-center">
          <AsciiFireAnimation />
        </div>
      </div>
      <div className="relative h-screen ">
        <div className="h-screen" />
        <div className="sticky z-20">
          <HeaderSection />
        </div>

        <div className="sticky z-20 bg-gray-50 dark:bg-[#111] bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md dark:backdrop-blur-md">
          <ParallaxText baseVelocity={-1}>
            Etherwav Etherwav Etherwav
          </ParallaxText>
          <ParallaxText baseVelocity={1}>
            Create. Listen. Earn. Create. Listen. Earn.
          </ParallaxText>
        </div>

        <div className="sticky z-20">
          <ContentSection />
        </div>

        <div className="sticky z-20 bg-gray-50 dark:bg-[#111] bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md dark:backdrop-blur-md ">
          <ParallaxText baseVelocity={1}>
            Etherwav Etherwav Etherwav
          </ParallaxText>
          <ParallaxText baseVelocity={-1}>
            Create. Listen. Earn. Create. Listen. Earn.
          </ParallaxText>
        </div>

        <div className="sticky z-20">
          <Stats />
        </div>

        <div className="sticky z-20">
          <ContactMe />
        </div>

        <div className="sticky z-20">
          <Footer />
        </div>

        <div className="fixed inset-0 flex items-center justify-center flex-col z-10">
          <div className="flex items-center justify-center flex-col  p-4">
          <div>

            <h1 className="text-5xl inline bg-white dark:bg-black">Welcome to Etherwav</h1>
            </div>
            <div className="flex mt-4 space-x-2 justify-center bg-white dark:bg-black p-1">
              <Link
                href="/listen"
                className="rounded-md bg-orange-600 hover:bg-orange-600/80 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Start Listening
              </Link>
              <Link
                href="/upload"
                className="rounded-md bg-[#fafafa] dark:bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-black dark:text-white shadow-sm hover:bg-white/80 dark:hover:bg-white/20"
              >
                Upload to Etherwav
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
