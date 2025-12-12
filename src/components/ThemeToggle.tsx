import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
      {/* Light */}
      <Button
        onClick={() => setTheme("light")}
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0 rounded-full"
      >
        <Sun className="h-4 w-4" />
      </Button>

      {/* Dark */}
      <Button
        onClick={() => setTheme("dark")}
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0 rounded-full"
      >
        <Moon className="h-4 w-4" />
      </Button>

      {/* System */}
      <Button
        onClick={() => setTheme("system")}
        variant={theme === "system" ? "default" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0 rounded-full"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}
