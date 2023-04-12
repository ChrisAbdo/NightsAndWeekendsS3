import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useAnimation } from "framer-motion";

const AsciiFireAnimation = () => {
  const preRef = useRef(null);
  const controls = useAnimation();
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? Math.floor(window.innerWidth / 5) : 80
  );

  const updateWidth = useCallback(() => {
    setWidth(Math.floor(window.innerWidth / 5));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [updateWidth]);

  const flameAnimation = useCallback(() => {
    const height = 25;
    const size = width * height;
    const buffer = Array(size + width + 1).fill(0);
    const char = " ethrwav".split("");

    function flameIteration() {
      for (let i = 0; i < 10; i++)
        buffer[Math.floor(Math.random() * width) + width * (height - 1)] = 70;

      let animationFrame = "";
      for (let i = 0; i < size; i++) {
        buffer[i] = Math.floor(
          (buffer[i] +
            buffer[i + 1] +
            buffer[i + width] +
            buffer[i + width + 1]) /
            4
        );
        animationFrame += char[buffer[i] > 7 ? 7 : buffer[i]];
        if (i % width > width - 2) animationFrame += "\r\n";
      }

      if (preRef.current) {
        preRef.current.firstChild.data = animationFrame;
      }
      requestAnimationFrame(flameIteration);
    }

    flameIteration();
    controls.start({ opacity: 1, transition: { duration: 4 } });
  }, [width]);

  useEffect(() => {
    flameAnimation();
  }, [flameAnimation]);

  return (
    <div className="overflow-hidden">
      <motion.pre
        ref={preRef}
        className="font-bold text-orange-500 mx-auto whitespace-pre"
        initial={{ opacity: 0 }}
        animate={controls}
      >
        JavaScript is required to view this dope animation.
      </motion.pre>
    </div>
  );
};

export default AsciiFireAnimation;
