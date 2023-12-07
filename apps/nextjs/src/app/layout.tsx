import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import React from "react";
import { headers } from "next/headers";
import Link from "next/link";

import { AuthShowcase } from "./_components/auth-showcase";
import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

/**
 * Since we're passing `headers()` to the `TRPCReactProvider` we need to
 * make the entire app dynamic. You can move the `TRPCReactProvider` further
 * down the tree (e.g. /dashboard and onwards) to make part of the app statically rendered.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menus for UCLA",
  description: "Menus for UCLA",
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <nav className="fixed inset-x-0 top-0 z-50 bg-white/30 backdrop-blur-lg">
          <div className="mx-auto max-w-7xl px-0 sm:px-0 lg:px-0">
            {" "}
            {/* Adjusted padding here */}
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="hidden md:block">
                  <div className="ml-1 flex items-baseline space-x-4">
                    {/* Navigation Links as Buttons */}
                    <Link href="/" passHref>
                      <button className="rounded-md px-3 py-2 text-lg font-medium text-black hover:text-white">
                        Home
                      </button>
                    </Link>
                    <Link
                      href="/dining-hall?title=Epicuria&restaurantId=3"
                      passHref
                    >
                      <button className="rounded-md px-3 py-2 text-lg font-medium text-black hover:text-white">
                        Epicuria
                      </button>
                    </Link>
                    <Link
                      href="/dining-hall?title=BruinPlate&restaurantId=2"
                      passHref
                    >
                      <button className="rounded-md px-3 py-2 text-lg font-medium text-black  hover:text-white">
                        Bruin Plate
                      </button>
                    </Link>
                    <Link
                      href="/dining-hall?title=DeNeve&restaurantId=1"
                      passHref
                    >
                      <button className="rounded-md px-3 py-2 text-lg font-medium text-black  hover:text-white">
                        DeNeve
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <AuthShowcase />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <TRPCReactProvider headers={headers()}>
          {props.children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
