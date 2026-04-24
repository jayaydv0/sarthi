"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

type Theme = "dark" | "light";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("ao-theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    if (t === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("ao-theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <section className="rounded-xl bg-surface-container-low p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-2xl font-semibold">Appearance</h3>
          <p className="text-sm text-on-surface-variant">
            Customize the visual interface
          </p>
        </div>
        <Palette
          className="text-3xl text-primary"
          strokeWidth={2}
          aria-hidden
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => toggleTheme("dark")}
          className={`cursor-pointer flex flex-col items-center justify-center gap-4 rounded-xl border-2 p-6 transition-all ${
            theme === "dark"
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
              : "border-outline-variant/20 hover:bg-surface-container-high"
          }`}
        >
          <div className="flex h-24 w-full flex-col gap-2 rounded-lg border border-outline-variant/20 bg-slate-900 p-2 text-left">
            <div className="h-2 w-1/2 rounded-full bg-slate-700" />
            <div className="flex-1 rounded bg-slate-800" />
          </div>
          <span className={`text-sm font-bold ${theme === "dark" ? "text-primary" : "text-on-surface-variant"}`}>
            Deep Sea (Dark)
          </span>
        </button>
        
        <button
          onClick={() => toggleTheme("light")}
          className={`cursor-pointer flex flex-col items-center justify-center gap-4 rounded-xl border-2 p-6 transition-all ${
            theme === "light"
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
              : "border-outline-variant/20 hover:bg-surface-container-high"
          }`}
        >
          <div className="flex h-24 w-full flex-col gap-2 rounded-lg border border-slate-200 bg-white p-2 text-left">
            <div className="h-2 w-1/2 rounded-full bg-slate-200" />
            <div className="flex-1 rounded bg-slate-50" />
          </div>
          <span className={`text-sm font-bold ${theme === "light" ? "text-primary" : "text-on-surface-variant"}`}>
            Crystal (Light)
          </span>
        </button>
      </div>
    </section>
  );
}
