import { MusicalNoteIcon } from "@heroicons/react/20/solid";

export default function SidebarDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300 dark:border-[#333]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white dark:bg-black px-2">
          <MusicalNoteIcon
            className="h-5 w-5 text-gray-500"
            aria-hidden="true"
          />
        </span>
      </div>
    </div>
  );
}
