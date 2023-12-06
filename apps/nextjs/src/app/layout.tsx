import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { headers } from "next/headers";

import { TRPCReactProvider } from "./providers";
import React from "react";

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
        <TRPCReactProvider headers={headers()}>
          {props.children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
