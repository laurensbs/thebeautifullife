import { Heart } from "lucide-react";

interface DividerProps {
  className?: string;
  hearts?: number;
}

export default function Divider({ className = "", hearts = 1 }: DividerProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-12 bg-border" />
      {Array.from({ length: hearts }).map((_, i) => (
        <Heart
          key={i}
          className="text-accent fill-accent"
          size={12}
          strokeWidth={0}
        />
      ))}
      <span className="h-px w-12 bg-border" />
    </div>
  );
}
