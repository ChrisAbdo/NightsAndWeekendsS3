import React, { useLayoutEffect, useRef, useState } from "react";
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

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const updateWidth = () => {
      setWidth(Math.floor(window.innerWidth / 5));
    };

    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, wait);
      };
    };

    const debouncedUpdateWidth = debounce(updateWidth, 250);

    window.addEventListener("resize", debouncedUpdateWidth);

    return () => {
      window.removeEventListener("resize", debouncedUpdateWidth);
    };
  }, []);

  useLayoutEffect(() => {
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
      requestAnimationFrame(f);
    }
    f();
    controls.start({ opacity: 1, transition: { duration: 10 } });
  }, [width]);

  return (
    <div className="overflow-hidden">
      <motion.pre
        ref={preRef}
        className="font-bold text-orange-500 mx-auto whitespace-pre"
        initial={{ opacity: 0 }}
        animate={controls}
      >
        Javascript is required to view this dope animation.
      </motion.pre>
    </div>
  );
};

export default AsciiFireAnimation;
