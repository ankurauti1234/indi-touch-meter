import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Delete,
  CornerDownLeft,
  Space,
  Lock,
  ArrowBigUp,
  Eye,
  EyeOff,
  LucideIcon,
} from "lucide-react";

// ----------------------
// Types
// ----------------------
interface KeyboardProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onKeyPress: (key: string) => void;
  targetInput?: string;
  inputValue?: string;
  inputPlaceholder?: string;
  inputLabel?: string;
  inputMaxLength?: number;
  inputType?: string;
  inputPrefix?: string;
}

interface KeyButtonProps {
  value: string;
  label?: string;
  className?: string;
  onClick: (value: string) => void;
  variant?: "link" | "default" | "secondary" | "destructive" | "outline" | "ghost";
  icon?: LucideIcon;
}

// ----------------------
// Component
// ----------------------
export const Keyboard = ({
  isOpen,
  onClose,
  onKeyPress,
  inputValue = "",
  inputPlaceholder = "",
  inputLabel = "",
  inputMaxLength,
  inputType = "text",
  inputPrefix = "",
}: KeyboardProps) => {
  const [capsLock, setCapsLock] = useState(false);
  const [shift, setShift] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isUpperCase = capsLock || shift;

  const handleKeyPress = (key: string) => {
    if (shift && !capsLock) {
      setShift(false);
    }
    onKeyPress(key);
  };

  const qwertyRows: string[][] = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  const numberRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const symbolsShift = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];

  // ----------------------
  // KeyButton Component
  // ----------------------
  const KeyButton = ({
    value,
    label,
    onClick,
    className = "",
    variant = "secondary",
    icon: Icon,
  }: KeyButtonProps) => (
    <Button
      variant={variant}
      size="sm"
      className={`h-14 font-medium text-base transition-all active:scale-95 shadow-sm ${className}`}
      onClick={() => onClick(value)}
    >
      {Icon ? <Icon className="w-5 h-5" /> : (label || value)}
    </Button>
  );

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-card border-t rounded-t-lg shadow-xl">
        <div className="w-full px-4 pb-6 pt-4">
          {/* Temporary Input Display */}
          {inputLabel && (
            <div className="mb-4 p-4 bg-background rounded-lg border shadow-sm">
              <div className="space-y-2">
                {inputLabel && (
                  <Label className="text-sm font-medium">{inputLabel}</Label>
                )}
                
                <div className="flex items-center gap-2">
                  {inputPrefix && (
                    <div className="px-3 h-14 flex items-center justify-center rounded-md bg-border text-muted-foreground font-semibold text-2xl">
                      {inputPrefix}
                    </div>
                  )}
                  
                  <div className="relative flex-1">
                    <div
                      className={`
                        text-start text-2xl font-mono
                        bg-muted rounded-md px-4 py-3
                        border-2 border-primary
                        ${inputValue ? 'text-foreground' : 'text-muted-foreground'}
                      `}
                    >
                      {inputType === "password" && !showPassword && inputValue
                        ? "•".repeat(inputValue.length)
                        : inputValue || inputPlaceholder}
                    </div>

                    {/* Eye icon for password toggle */}
                    {inputType === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {inputMaxLength && (
                  <p className="text-xs text-muted-foreground text-right">
                    {inputValue.length} / {inputMaxLength}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {/* Number Row */}
            <div className="flex gap-1.5">
              <KeyButton
                value="`"
                label={shift ? "~" : "`"}
                className="flex-1"
                onClick={handleKeyPress}
              />

              {(shift ? symbolsShift : numberRow).map((key, idx) => (
                <KeyButton
                  key={idx}
                  value={key}
                  className="flex-1"
                  onClick={handleKeyPress}
                />
              ))}

              <KeyButton
                value={shift ? "_" : "-"}
                className="flex-1"
                onClick={handleKeyPress}
              />
              <KeyButton
                value={shift ? "+" : "="}
                className="flex-1"
                onClick={handleKeyPress}
              />

              <Button
                variant="destructive"
                size="sm"
                className="h-14 w-32 px-8 text-sm font-medium shadow-sm active:scale-95 flex items-center gap-2"
                onClick={() => handleKeyPress("Backspace")}
              >
                <Delete className="w-5 h-5" />
                Del
              </Button>
            </div>

            {/* First row */}
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-14 px-6 text-sm shadow-sm active:scale-95"
                onClick={() => handleKeyPress("Tab")}
              >
                Tab
              </Button>

              {qwertyRows[0].map((key) => (
                <KeyButton
                  key={key}
                  value={isUpperCase ? key.toUpperCase() : key}
                  className="flex-1"
                  onClick={handleKeyPress}
                />
              ))}

              <KeyButton value={shift ? "{" : "["} className="flex-1" onClick={handleKeyPress} />
              <KeyButton value={shift ? "}" : "]"} className="flex-1" onClick={handleKeyPress} />
              <KeyButton value={shift ? "|" : "\\"} className="flex-1" onClick={handleKeyPress} />
            </div>

            {/* Second row */}
            <div className="flex gap-1.5">
              <Button
                variant={capsLock ? "default" : "outline"}
                size="sm"
                className="h-14 px-6 w-28 text-sm font-medium shadow-sm active:scale-95 flex items-center gap-2"
                onClick={() => setCapsLock(!capsLock)}
              >
                <Lock className="w-4 h-4" />
                Caps
              </Button>

              {qwertyRows[1].map((key) => (
                <KeyButton
                  key={key}
                  value={isUpperCase ? key.toUpperCase() : key}
                  className="flex-1"
                  onClick={handleKeyPress}
                />
              ))}

              <KeyButton value={shift ? ":" : ";"} className="flex-1" onClick={handleKeyPress} />
              <KeyButton value={shift ? '"' : "'"} className="flex-1" onClick={handleKeyPress} />

              <Button
                variant="default"
                size="sm"
                className="h-14 px-8 w-32 text-sm font-medium shadow-sm active:scale-95 flex items-center gap-2"
                onClick={() => handleKeyPress("Enter")}
              >
                <CornerDownLeft className="w-5 h-5" />
                Enter
              </Button>
            </div>

            {/* Third row */}
            <div className="flex gap-1.5">
              <Button
                variant={shift ? "default" : "outline"}
                size="sm"
                className="h-14 px-10 w-32 text-sm font-medium shadow-sm active:scale-95 flex items-center gap-2"
                onClick={() => setShift(!shift)}
              >
                <ArrowBigUp className="w-5 h-5" />
                Shift
              </Button>

              {qwertyRows[2].map((key) => (
                <KeyButton
                  key={key}
                  value={isUpperCase ? key.toUpperCase() : key}
                  className="flex-1"
                  onClick={handleKeyPress}
                />
              ))}

              <KeyButton value={shift ? "<" : ","} className="flex-1" onClick={handleKeyPress} />
              <KeyButton value={shift ? ">" : "."} className="flex-1" onClick={handleKeyPress} />
              <KeyButton value={shift ? "?" : "/"} className="flex-1" onClick={handleKeyPress} />

              <Button
                variant={shift ? "default" : "outline"}
                size="sm"
                className="h-14 px-10 w-32 text-sm font-medium shadow-sm active:scale-95 flex items-center gap-2"
                onClick={() => setShift(!shift)}
              >
                <ArrowBigUp className="w-5 h-5" />
                Shift
              </Button>
            </div>

            {/* Space row */}
            <div className="flex gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                className="h-14 flex-1 text-sm shadow-sm active:scale-95 flex items-center justify-center gap-2"
                onClick={() => handleKeyPress(" ")}
              >
                <Space className="w-5 h-5" />
                Space
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};