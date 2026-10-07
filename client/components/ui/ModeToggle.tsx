"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
                {mounted && (
                    <>
                        <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${resolvedTheme === "dark" ? "scale-0 -rotate-90" : "scale-100 rotate-0"}`} />
                        <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${resolvedTheme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"}`} />
                    </>
                )}
                <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
