// components/ui/label.tsx
import * as React from "react";

export function Label({ children, htmlFor, className }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>
      {children}
    </label>
  );
}
