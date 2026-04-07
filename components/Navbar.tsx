"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useScrollHiddenNav } from "@/hooks/useScrollHiddenNav";
import ToggleButton from "@/components/ui/ToggleButton";
import ConnectBtn from "./ui/ConnectBtn";
import { SearchModal } from "./ui/SearchModal";

export default function Navbar() {
  const isVisible = useScrollHiddenNav();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-50 w-full bg-landing-bg dark:bg-landing-bg-dark"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1512px] items-center justify-between px-4 md:h-[80px] md:px-[56px]">
        <Link href="/" className="flex items-center gap-2 md:gap-[17px]">
          <div className="relative h-8 w-8 md:h-10 md:w-10">
            <Image
              src="/assets/logo.svg"
              alt="DIT Logo"
              fill
              className="object-contain dark:hidden"
            />
            <Image
              src="/assets/dark-logo.svg"
              alt="DIT Logo Dark"
              fill
              className="hidden object-contain dark:block"
            />
          </div>
          <span className="pt-1 font-atyp text-2xl leading-none text-black md:pt-2 md:text-[40px] dark:text-white">
            dit
          </span>
        </Link>

        <div className="hidden pe-3.5 md:flex-1 md:justify-end lg:flex">
          <div className="w-full max-w-xs">
            <SearchModal isOpen={false} onClose={() => {}} inline />
          </div>
        </div>
        <div className="hidden items-center gap-3 md:gap-4 lg:flex">
          <ToggleButton />
          <ConnectBtn />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ToggleButton />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full p-2 text-black transition-colors hover:bg-black/10 dark:text-white dark:hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-200/10 bg-white/95 lg:hidden dark:border-slate-700/70 dark:bg-slate-950/95">
          <div className="space-y-4 px-4 py-4">
            <div className="flex items-center justify-end">
              <div className="w-full max-w-xs">
                <SearchModal
                  isOpen={false}
                  onClose={() => setIsMobileMenuOpen(false)}
                  mobile
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <ConnectBtn />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
