import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setEnabled(theme === "dark");
    }
  }, [theme, mounted]);

  const handleToggleChange = (value) => {
    setEnabled(value);
    setTheme(value ? "dark" : "light");
  };

  // This ensures that the component is not rendered server-side
  if (!mounted) return null;

  return (
    <Switch
      checked={enabled}
      onChange={handleToggleChange}
      className={classNames(
        enabled ? "bg-orange-500" : "bg-gray-200",
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          enabled ? "translate-x-5" : "translate-x-0",
          "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        )}
      >
        <span
          className={classNames(
            enabled
              ? "opacity-0 duration-100 ease-out"
              : "opacity-100 duration-200 ease-in",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
          )}
          aria-hidden="true"
        >
          <SunIcon className="h-3 w-3 text-black" />
        </span>
        <span
          className={classNames(
            enabled
              ? "opacity-100 duration-200 ease-in"
              : "opacity-0 duration-100 ease-out",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
          )}
          aria-hidden="true"
        >
          <MoonIcon className="h-3 w-3 text-black" />
        </span>
      </span>
    </Switch>
  );
}
