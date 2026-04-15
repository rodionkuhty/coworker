import { Monitor, Moon, Sun, Waves } from "lucide-react"

import { Button } from "@renderer/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu"
import { useTheme } from "@renderer/components/theme-provider"

const themes = [
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
  { value: "system", label: "Системная", icon: Monitor },
  { value: "ocean", label: "Океан", icon: Waves },
] as const

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="no-drag hover:cursor-pointer">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((item) => {
          const Icon = item.icon

          return (
            <DropdownMenuItem key={item.value} onClick={() => setTheme(item.value)}>
              <span className="flex w-full items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </span>
                {theme === item.value ? <span>✓</span> : null}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}