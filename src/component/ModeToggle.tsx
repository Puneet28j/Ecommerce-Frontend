import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "../components/theme-provider";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../components/ui/tooltip";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      {/* Desktop version — full animated button */}
      <div className="hidden sm:block">
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                className="rounded-full relative overflow-hidden"
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <SunIcon className="w-[1.5rem] h-[1.5rem] rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
                <MoonIcon className="absolute w-[1.5rem] h-[1.5rem] rotate-0 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
                <span className="sr-only">Switch Theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Switch Theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile version — compact icon */}
      <div className="block sm:hidden">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-1.5 transition-transform duration-200 hover:scale-110 text-primary"
        >
          {theme === "dark" ? (
            <SunIcon className="w-7 h-7" strokeWidth={1.8} />
          ) : (
            <MoonIcon className="w-7 h-7" strokeWidth={1.8} />
          )}
        </button>
      </div>
    </>
  );
}
