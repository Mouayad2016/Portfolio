import "../global.css";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "mouayad.com",
    template: "%s | mouayadmouayad.com",
  },
  description: "Explore the digital craftsmanship of Mouayad Mouayad. My portfolio showcases a curated selection of projects that demonstrate my expertise in full-stack development. Discover how I fuse technical skill with design finesse to create impactful solutions.",
  openGraph: {
    title: "Discover the Digital Craftsmanship of Mouayad Mouayad",
    description:
      "Embark on an interactive voyage through my portfolio where each project narrates a story of skill, precision, and passion for full stack development.",
    url: "https://mouayadmouayad.com",
    siteName: "MouayadMouayad.com - Full Stack Developer Portfolio",
    images: [
      {
        url: "https:///mouayadmouayad.com/og.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Mouayad Mouayad - Crafting Code with Passion",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        <Analytics />
      </head>
      <body
        className={`bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        {children}
      </body>
    </html>
  );
}
