import "@/src/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";

import { Source_Code_Pro } from "next/font/google";

import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("@/components/shared-layout/navbar"), {
  loading: () => <p>Loading...</p>,
})

const sourceCodePro = Source_Code_Pro({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={sourceCodePro.className}>
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
