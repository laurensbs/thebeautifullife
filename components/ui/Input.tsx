import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, className = "", id, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full bg-white/80 border border-border rounded-lg px-5 py-3.5
          font-sans text-sm text-dark placeholder:text-taupe placeholder:font-light placeholder:italic
          transition-all duration-200
          focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
          hover:border-taupe ${className}`}
        {...props}
      />
    </div>
  );
}
