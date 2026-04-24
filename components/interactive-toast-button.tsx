"use client";

import { toast } from "sonner";
import React from "react";

export function InteractiveToastButton({
  children,
  message,
  className,
  as: Component = "button",
  type,
  ...props
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
  as?: any;
  type?: "button" | "submit" | "reset";
  [key: string]: any;
}) {
  return (
    <Component
      type={Component === "button" ? type || "button" : undefined}
      className={className}
      onClick={(e: any) => {
        e.preventDefault();
        toast.info(message);
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
