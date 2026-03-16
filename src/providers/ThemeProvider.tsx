"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "high-contrast";
type FontSize = "100%" | "115%" | "130%";

interface ThemeContextType {
    theme: Theme;
    fontSize: FontSize;
    reducedMotion: boolean;
    setTheme: (theme: Theme) => void;
    setFontSize: (size: FontSize) => void;
    setReducedMotion: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");
    const [fontSize, setFontSizeState] = useState<FontSize>("100%");
    const [reducedMotion, setReducedMotionState] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load settings from localStorage on mount
        const savedTheme = localStorage.getItem("ui-theme") as Theme;
        const savedFontSize = localStorage.getItem("ui-font-size") as FontSize;
        const savedReducedMotion = localStorage.getItem("ui-reduced-motion") === "true";

        if (savedTheme) setThemeState(savedTheme);
        if (savedFontSize) setFontSizeState(savedFontSize);
        if (savedReducedMotion !== null) setReducedMotionState(savedReducedMotion);

        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;

        // Remove previous theme classes
        root.classList.remove("light", "dark", "high-contrast");
        // Add current theme class
        root.classList.add(theme);

        // Apply font size
        root.style.fontSize = fontSize;

        // Apply reduced motion
        if (reducedMotion) {
            root.classList.add("reduced-motion");
        } else {
            root.classList.remove("reduced-motion");
        }

        // Save to localStorage
        localStorage.setItem("ui-theme", theme);
        localStorage.setItem("ui-font-size", fontSize);
        localStorage.setItem("ui-reduced-motion", reducedMotion.toString());
    }, [theme, fontSize, reducedMotion, mounted]);

    const setTheme = (t: Theme) => setThemeState(t);
    const setFontSize = (s: FontSize) => setFontSizeState(s);
    const setReducedMotion = (e: boolean) => setReducedMotionState(e);

    return (
        <ThemeContext.Provider value={{ theme, fontSize, reducedMotion, setTheme, setFontSize, setReducedMotion }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
