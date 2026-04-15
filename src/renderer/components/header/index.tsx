import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { Separator } from '@renderer/components/ui/separator';
import {Button} from "@renderer/components/ui/button";
import {Settings} from "@renderer/icons/settings";
import {Search} from "@renderer/icons/search";
import {Terminal} from "@renderer/icons/terminal";
import {ModeToggle} from "@renderer/components/header/mode-toggle/index.js";

export function Header() {
  const isMac = window.electronAPI.platform === 'darwin';
  return (
    <>
      <header className="custom-header" style={{ paddingLeft: isMac ? '80px' : '15px' }}>
        <ModeToggle/>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="hover:cursor-pointer no-drag"
              variant="ghost"
              size="icon"
              aria-label="Terminal"
            >
              <Terminal/>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Terminal</p>
          {/* TODO add command here */}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="hover:cursor-pointer no-drag"
              variant="ghost"
              size="icon"
              aria-label="Search"
            >
              <Search/>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="hover:cursor-pointer no-drag"
              variant="ghost"
              size="icon"
              aria-label="Settings"
            >
              <Settings/>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </header>
      <Separator className="w-full h-px" />
    </>
  )
}
