import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const AsciiFireAnimation = () => {
  const preRef = useRef(null);
  const controls = useAnimation();
  const [width, setWidth] = useState(() => {
    if (typeof window !== "undefined") {
      return Math.floor(window.innerWidth / 5);
    }
    return 80;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateWidth = () => {
      setWidth(Math.floor(window.innerWidth / 5));
    };

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    const height = 25;
    const size = width * height;
    const b = [];
    for (let i = 0; i < size + width + 1; i++) b[i] = 0;
    const char = " ethrwav".split("");

    function f() {
      for (let i = 0; i < 10; i++)
        b[Math.floor(Math.random() * width) + width * (height - 1)] = 70;
      let a = "";
      for (let i = 0; i < size; i++) {
        b[i] = Math.floor(
          (b[i] + b[i + 1] + b[i + width] + b[i + width + 1]) / 4
        );
        a += char[b[i] > 7 ? 7 : b[i]];
        if (i % width > width - 2) a += "\r\n";
      }

      if (preRef.current) {
        preRef.current.firstChild.data = a;
      }
      setTimeout(f, 30);
    }
    f();
    controls.start({ opacity: 1, transition: { duration: 10 } }); // Duration increased to 4 seconds
  }, [width]);

  return (
    <div className="overflow-hidden">
      <motion.pre
        ref={preRef}
        className="font-bold text-orange-500 mx-auto whitespace-pre"
        initial={{ opacity: 0 }}
        animate={controls}
      >
        This animated fire in plain ASCII art needs JavaScript to run in your
        web browser.
      </motion.pre>
    </div>
  );
};

export default AsciiFireAnimation;
