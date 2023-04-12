import "@/src/styles/globals.css";

import Head from "next/head";

import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";

import { Source_Code_Pro } from "next/font/google";

import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("@/components/shared-layout/navbar"), {
  loading: () => <p>Loading...</p>,
});

const sourceCodePro = Source_Code_Pro({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={sourceCodePro.className}>
      <Head>
  <title>Etherwav - Decentralized Community Music Player</title>
  <meta name="description" content="Etherwav is a decentralized community music player built on Polygon. Create and share your music, and get rewarded when the community loves your work." />
  <meta name="keywords" content="Etherwav, decentralized, music player, Polygon, blockchain, community, rewards, crypto, artists" />
  <meta property="og:title" content="Etherwav - Decentralized Community Music Player" />
  <meta property="og:description" content="Etherwav is a decentralized community music player built on Polygon. Create and share your music, and get rewarded when the community loves your work." />
  <meta property="og:image" content="https://etherwav-s3.vercel.app/darkmode.jpeg" />
  <meta property="og:url" content="https://your-website.com" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Etherwav" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Etherwav - Decentralized Community Music Player" />
  <meta name="twitter:description" content="Etherwav is a decentralized community music player built on Polygon. Create and share your music, and get rewarded when the community loves your work." />
  <meta name="twitter:image" content="https://etherwav-s3.vercel.app/darkmode.jpeg" />
  <link rel="icon" href="/favicon.ico" />
</Head>

      <ThemeProvider defaultTheme="light">
        <div className="bg-white dark:bg-black">
          <Navbar />
          <Component {...pageProps} />
          <Analytics />
        </div>
      </ThemeProvider>
    </main>
  );
}
