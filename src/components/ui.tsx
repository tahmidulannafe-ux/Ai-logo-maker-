import React from 'react';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black";
    const variants = {
      primary: "bg-[#00FF00] text-black hover:bg-[#00CC00] border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none",
      outline: "bg-white text-black border-2 border-black hover:bg-gray-50",
      ghost: "bg-transparent text-black hover:bg-black/5"
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${className}`}>
    {children}
  </div>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full bg-white border-2 border-black px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-black font-mono text-sm ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => (
      <textarea
        ref={ref}
        className={`w-full bg-white border-2 border-black px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-black font-mono text-sm ${className}`}
        {...props}
      />
    )
  );
TextArea.displayName = "TextArea";

export const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <label className={`block text-xs font-bold uppercase tracking-widest mb-2 text-black ${className}`}>
        {children}
    </label>
);
