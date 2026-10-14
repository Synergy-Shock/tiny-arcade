import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DocuBotWidget } from "@synergy-shock/docubot-widget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiny Arcade — Small games. Good breaks.",
  description:
    "Play tic-tac-toe, memory match, and rock-paper-scissors. Three tiny browser games, no login required.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <DocuBotWidget
          title="Tiny Arcade help"
          subtitle="Answers from the game guide"
          welcomeMessage="Hi! Ask me how any of the games work."
          suggestions={[
            "How does memory match score moves?",
            "What counts as a draw in tic-tac-toe?",
            "Does the arcade save my progress?",
          ]}
          appearance={{ primaryColor: "#9473c7", linkColor: "#9672ce" }}
        />
      </body>
    </html>
  );
}
