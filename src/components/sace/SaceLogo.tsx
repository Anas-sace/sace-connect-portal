import logoAsset from "@/assets/sace-logo.png.asset.json";
import { cn } from "@/lib/utils";

interface SaceLogoProps {
  className?: string;
  onClick?: () => void;
  /** Renders the logo as a button-like target for the hidden admin interaction. */
  interactive?: boolean;
}

export function SaceLogo({ className, onClick, interactive }: SaceLogoProps) {
  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="South Australian College of English"
        className={cn(
          "block rounded-md transition-transform duration-200 active:scale-95",
          className,
        )}
      >
        <img
          src={logoAsset.url}
          alt="South Australian College of English logo"
          className="h-full w-auto select-none"
          draggable={false}
          width={1300}
          height={160}
        />
      </button>
    );
  }

  return (
    <img
      src={logoAsset.url}
      alt="South Australian College of English logo"
      className={cn("w-auto", className)}
      width={1300}
      height={160}
    />
  );
}
