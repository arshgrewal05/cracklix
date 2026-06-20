'use client';

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'icon';
  href?: string;
  imgClassName?: string;
  onClick?: () => void;
  priority?: boolean;
  align?: 'left' | 'center' | 'right';
  iconOnly?: boolean;
}

/**
 * @fileOverview Master Cracklix Branding Node v3.0.
 * Strictly implements the official brand guidelines:
 * - variant="light": Uses cracklix-logo-dark.png (Dark text for Light backgrounds)
 * - variant="dark": Uses cracklix-logo-light.png (Light text for Dark backgrounds)
 * - variant="icon": Uses cracklix-icon.png
 * 
 * MAXIMIZED: Desktop height 72px / Mobile height 62px.
 */
export default function Logo({
  className = "",
  href = "/",
  variant = "light",
  imgClassName = "",
  onClick,
  priority = true,
  align = 'left',
  iconOnly = false
}: LogoProps) {
  
  const assets = {
    light: "/logo/cracklix-logo-dark.png",
    dark: "/logo/cracklix-logo-light.png",
    icon: "/logo/cracklix-icon.png"
  };

  const src = assets[iconOnly ? 'icon' : variant];
  const isIcon = variant === 'icon' || iconOnly;

  const content = (
    <div className={cn(
      "relative shrink-0 flex items-center transition-all duration-300",
      align === 'center' && "mx-auto justify-center",
      align === 'right' && "justify-end",
      isIcon ? "h-10 w-10 md:h-12 md:w-12" : "w-auto",
      className
    )}>
      <Image
        src={src}
        alt="Cracklix"
        width={isIcon ? 64 : 500}
        height={isIcon ? 64 : 150}
        priority={priority}
        className={cn(
          "object-contain w-auto transition-all",
          !isIcon && (imgClassName || "h-[62px] md:h-[72px]"),
          imgClassName
        )}
      />
    </div>
  );

  if (href || onClick) {
    return (
      <Link
        href={href || "/"}
        onClick={onClick}
        className={cn(
          "flex items-center select-none hover:opacity-90 transition-opacity flex-shrink-0",
          align === 'center' && "w-full justify-center"
        )}
      >
        {content}
      </Link>
    );
  }

  return content;
}
