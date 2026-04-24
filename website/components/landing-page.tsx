"use client";

import Link from "next/link";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
  CloudUpload,
  Download,
  LayoutDashboard,
  Link2,
  RefreshCw,
  Rocket,
  Search,
  Shield,
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { BrandLogo } from "@/components/brand-logo";
import { useRef, useEffect, useState } from "react";
import { Code, Box, Globe, Cpu } from "lucide-react";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB5AEllUygDvJMVoQybhh5uGCaAkcmfpM6dlMvKilJgoDc-Ru2cH8-ke7mvQVEkFkZrwrMwZeMkEfBX6ZPQ8DeouNABlq91zWjtIS-CWkC39cp4qI3rYYIPocCkwWwUqb8mrmlELHGRwBe02-nj8_3nl9Rgbj0JiVTHVv_GX0TqdKVTszcp64Yc7kBeBaESNdo8j26ZFeJ6c8GfsS3dn4MuNi79ngyHRO6IGa3OTgJdEAFyAGP7E75VxQnaKMmKvgJZrEj8Y2uxizQ";

const SYNC_FEATURE_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCr_UBwDmAY9AHnqNL2lJPyfjTP85r5EDe-W70dV8kt1d27dx_v-ACkkHATVRReRBlIUufeJZLlQFbUcksu9AcTT37aIf4gjN-YXntDEUaIMtV6qcBcmCViJ2s8rMgSLpOp6dk2nsY2Lpr8oxaEZAS3J6Ow2CDUyY7dp61tLH3evzd0uW-xIXs59g9ZkJNSwbtZv3Vm08mlu8efgWcGpv-O9GbSSW06-KT5HqntdKK1EKsXagHkIRA-_ad1a6XteKQVP6y1VnAYyEo";

const CTA_BG_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCll8pgIk2QWvkoHQdK5WI3oc6LZAVp5l0anhqKg3Tj0UZwrllKl26reHQpPFOWLKKYa2LcPxF3oDpRJZ_u5k7FsG_K6cNjwW7Tyi8MyGfBb7OHbQKCVpbJ6ZXs1_1LfCV9DXtTppNwnMvTzsf6E0KqjASlvP17EopnHWseVS7cYStJImG8y2QR1VU50JnOIYY91IrHpN_ZpyCtc_huuP3DytAlQuCxVZ7KAd0DPx8lGa1hh6ad1bjh4G80d_viKaUzSZy_DThnBrE";

const workflowSteps: {
  n: string;
  Icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    Icon: Link2,
    title: "Connect",
    body: "Link your local folder with one command from the CLI.",
  },
  {
    n: "02",
    Icon: CloudUpload,
    title: "Sync",
    body: "Changes mirror to encrypted storage when you save.",
  },
  {
    n: "03",
    Icon: Rocket,
    title: "Manage",
    body: "Browse files, settings, and history in the web app.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export function LandingPage({ hasUser = false }: { hasUser?: boolean }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  // Smooth mouse movement for spotlight
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = heroRef.current?.getBoundingClientRect();
      if (rect) {
        mouseX.set(clientX - rect.left);
        mouseY.set(clientY - rect.top);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);
  // Parallax values for hero content
  const rotateX = useTransform(smoothY, [0, 800], [2, -2]);
  const rotateY = useTransform(smoothX, [0, 1200], [-2, 2]);

  return (
    <div className="ao-marketing min-h-screen">
      <header className="ao-mkt-nav">
        <div className="flex min-w-0 flex-1 items-center gap-6 md:gap-10">
          <Link href="/" className="min-w-0 shrink-0">
            <BrandLogo asLink={false} />
          </Link>
          <nav className="hidden items-center gap-6 md:flex lg:gap-8">
            <Link href="/" className="ao-mkt-navlink ao-mkt-navlink--active">
              Home
            </Link>
            <a href="#features" className="ao-mkt-navlink">
              Features
            </a>
            <a href="#workflow" className="ao-mkt-navlink">
              Workflow
            </a>
            <a href="#cta" className="ao-mkt-navlink">
              Pricing
            </a>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <div className="hidden max-w-[14rem] items-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] py-2 pl-3 pr-2 lg:flex lg:max-w-xs">
            <Search
              className="mr-2 size-[18px] shrink-0 text-[#908fa0]"
              strokeWidth={2}
              aria-hidden
            />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#e8eefc] placeholder:text-[#8b9cb8] focus:outline-none focus:ring-0"
              placeholder="Search…"
              type="search"
              aria-label="Search"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  toast.info("Global Search is currently indexing. Coming in v2.1!");
                }
              }}
            />
          </div>
          {hasUser ? (
            <Link href="/dashboard" className="ao-btn-primary px-5 py-2.5 text-sm">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="ao-mkt-navlink hidden sm:inline">
                Login
              </Link>
              <Link href="/signup" className="ao-btn-primary px-5 py-2.5 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <main>
        <section ref={heroRef} className="ao-mkt-hero overflow-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Spotlight Effect */}
            <motion.div
              style={{
                left: smoothX,
                top: smoothY,
              }}
              className="absolute -ml-64 -mt-64 h-[512px] w-[512px] rounded-full bg-gradient-to-r from-[#8083ff]/10 to-transparent blur-[120px]"
            />
            
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-[#8083ff]/20 blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                x: [0, 20, 0],
                opacity: [0.08, 0.15, 0.08],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
              className="absolute -bottom-40 -left-24 h-[480px] w-[480px] rounded-full bg-[#4ae176]/10 blur-[100px]"
            />

            {/* Floating 3D Elements */}
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[10%] top-[20%] text-[#8083ff]/30"
            >
              <Code size={48} strokeWidth={1} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute right-[15%] top-[15%] text-[#4ae176]/20"
            >
              <Box size={56} strokeWidth={1} />
            </motion.div>
            <motion.div
              animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-[20%] left-[15%] text-[#c0c1ff]/20"
            >
              <Globe size={40} strokeWidth={1} />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 360, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[15%] right-[20%] text-[#8083ff]/15"
            >
              <Cpu size={64} strokeWidth={1} />
            </motion.div>
          </div>
          <motion.div 
            style={{ opacity, scale, y, rotateX, rotateY }}
            className="ao-mkt-container relative z-[1] grid items-center gap-12 lg:grid-cols-12 lg:gap-16"
          >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="min-w-0 space-y-6 lg:col-span-7"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#1c2739] px-3 py-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#4ae176]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8b9cb8]">
                  Version 2.0 Now Live
                </span>
              </motion.div>
              <motion.h1 variants={itemVariants} className="ao-mkt-h1">
                Manage, sync, and{" "}
                <motion.span 
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="ao-mkt-gradient inline-block bg-[length:200%_auto]"
                >
                  back up your projects
                </motion.span>{" "}
                effortlessly.
              </motion.h1>
              <motion.p variants={itemVariants} className="ao-mkt-lead">
                Your personal cloud for code. Auto-sync local projects and open
                them anywhere—without fighting the UI.
              </motion.p>
              <motion.div variants={itemVariants} className="ao-mkt-btn-row">
                {hasUser ? (
                  <Link href="/dashboard" className="ao-mkt-btn-primary-lg">
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link href="/signup" className="ao-mkt-btn-primary-lg">
                    Get started free
                  </Link>
                )}
                <Link href="#features" className="ao-mkt-btn-secondary-lg">
                  View features
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 40, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-0 lg:col-span-5"
            >
              <motion.div 
                whileHover={{ 
                  rotateX: -10, 
                  rotateY: 10,
                  scale: 1.02,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="ao-mkt-media"
                style={{ perspective: 1000 }}
              >
                <div className="ao-mkt-media-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="h-full w-full object-cover opacity-90"
                    src={HERO_IMG}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081425] via-transparent to-transparent" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section id="features" className="ao-mkt-section">
          <div className="ao-mkt-container">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="ao-kicker"
            >
              Core features
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="ao-title-page mb-10 max-w-xl"
            >
              Built for modern workflows
            </motion.h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
              <motion.article 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="ao-mkt-card md:col-span-8"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(192,193,255,0.12)]">
                  <RefreshCw
                    className="size-6 text-[#c0c1ff]"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
                <h3>Auto sync</h3>
                <p className="mb-6 max-w-lg">
                  Watch the filesystem and push changes to your private cloud—no
                  manual steps.
                </p>
                <div className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="max-h-52 w-full object-cover opacity-50"
                    src={SYNC_FEATURE_IMG}
                  />
                </div>
              </motion.article>
              <motion.article 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="ao-mkt-card md:col-span-4"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(74,225,118,0.1)]">
                  <Shield
                    className="size-6 text-[#4ae176]"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
                <h3>Secure storage</h3>
                <p>Encryption in transit and at rest. Your code stays yours.</p>
              </motion.article>
              <motion.article 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="ao-mkt-card md:col-span-4"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(247,190,29,0.1)]">
                  <Download
                    className="size-6 text-[#f7be1d]"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
                <h3>Download anytime</h3>
                <p>Pull snapshots or paths from any device in seconds.</p>
              </motion.article>
              <motion.article 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="ao-mkt-card flex flex-col gap-6 md:col-span-8 md:flex-row md:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(128,131,255,0.15)]">
                    <LayoutDashboard
                      className="size-6 text-[#e1e0ff]"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </div>
                  <h3>Clean dashboard</h3>
                  <p>
                    A focused workspace: projects first, noise never.
                  </p>
                </div>
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className="hidden w-full max-w-[220px] shrink-0 rotate-2 sm:block"
                >
                  <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#040e1f] p-4 shadow-xl">
                    <div className="mb-3 flex gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ffb4ab]/50" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#f7be1d]/50" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#4ae176]/50" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-[82%] max-w-full rounded bg-[#2a3548]" />
                      <div className="h-2 w-[58%] max-w-full rounded bg-[#2a3548]" />
                      <div className="h-2 w-full max-w-full rounded bg-[#2a3548]" />
                    </div>
                  </div>
                </motion.div>
              </motion.article>
            </div>
          </div>
        </section>

        <section id="workflow" className="ao-mkt-section ao-mkt-section--alt">
          <div className="ao-mkt-container">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="ao-title-page mb-4">The 3-step architecture</h2>
              <p className="text-lg text-[#8b9cb8]">
                Connect, sync, manage—without a computer science degree.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
              {workflowSteps.map(({ n, Icon, title, body }, idx) => (
                <motion.div 
                  key={n}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.15 }}
                  className="relative text-center"
                >
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 text-7xl font-black text-[rgba(255,255,255,0.04)] md:text-8xl">
                    {n}
                  </span>
                  <div className="relative mx-auto mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[#161f30] shadow-lg">
                    <Icon
                      className="size-8 text-[#c0c1ff]"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
                  <p className="text-[0.9375rem] leading-relaxed text-[#8b9cb8]">
                    {body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="ao-mkt-section">
          <div className="ao-mkt-container">
            <div className="relative overflow-hidden rounded-[var(--ao-radius-lg)] border border-[rgba(255,255,255,0.1)] bg-gradient-to-br from-[#1c2739] to-[#101a2c] px-8 py-14 text-center md:px-16 md:py-20">
              <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  className="h-full w-full object-cover"
                  src={CTA_BG_IMG}
                />
              </div>
              <div className="relative z-[1] mx-auto max-w-2xl space-y-6">
                <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
                  Ready to build better?
                </h2>
                <p className="text-lg text-[#8b9cb8]">
                  Start free. No card required.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Link href="/signup" className="ao-mkt-btn-primary-lg px-10">
                    Get started now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="ao-mkt-footer">
        <div className="ao-mkt-container">
          <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
            <div className="space-y-4">
              <BrandLogo asLink={false} />
              <p className="text-sm leading-relaxed text-[#8b9cb8]">
                Secure sync and a calm interface for developers who ship.
              </p>
            </div>
            <div>
              <h5 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                Product
              </h5>
              <ul className="space-y-3 text-sm text-[#8b9cb8]">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#cta" className="hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                Account
              </h5>
              <ul className="space-y-3 text-sm text-[#8b9cb8]">
                <li>
                  <Link href="/login" className="hover:text-white">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white">
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                Legal
              </h5>
              <ul className="space-y-3 text-sm text-[#8b9cb8]">
                <li>
                  <button type="button" onClick={() => toast.info("Our legal team is drafting the Privacy Policy as we speak!")} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
                </li>
                <li>
                  <button type="button" onClick={() => toast.info("Terms of Service are planned for the full v2.0 release.")} className="hover:text-white transition-colors cursor-pointer">Terms</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.06)] pt-8 md:flex-row">
            <p className="text-xs text-[#5c6b82]">
              © {new Date().getFullYear()} ArchitectOS
            </p>
            <span className="flex items-center gap-2 text-xs text-[#4ae176]/90">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ae176]" />
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
