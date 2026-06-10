// store/useThemeStore.ts
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type Theme = "light" | "dark"

type ThemeState = {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const applyTheme = (theme: Theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
}

const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "light"
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) return stored
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: getInitialTheme(),

            toggleTheme: () => {
                const newTheme = get().theme === "dark" ? "light" : "dark"
                applyTheme(newTheme)
                set({ theme: newTheme })
            },

            setTheme: (theme: Theme) => {
                applyTheme(theme)
                set({ theme })
            },
        }),
        {
            name: "theme",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                // apply on page load from persisted state
                if (state?.theme) applyTheme(state.theme)
            },
        }
    )
)