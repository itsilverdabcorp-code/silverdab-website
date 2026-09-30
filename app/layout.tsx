import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import Navbar from "./components/navbar/Navbar";
import "./globals.css";

const neueMontreal = localFont({
  src: [
    {
      path: "./components/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./components/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./components/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./components/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./components/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-semibolditalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "./components/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-neue-montreal",
});

export const metadata: Metadata = {
  title: "Silverdab",
  description:
    "Silverdab Corporation: BIM Management, BIM Modelling, Digital Engineering, Visualization, and Asset Information Delivery.",
  icons: {
    icon: "/images/silverdab-logo.png",
    shortcut: "/images/silverdab-logo.png",
    apple: "/images/silverdab-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${neueMontreal.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Script
          defer
          src="https://analytics.silvergraph.ai/script.js"
          data-website-id="13ff8a57-af8f-4aad-ab9d-9db0398b9cc3"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
