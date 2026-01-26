import "./globals.css";
import QueryProvider from "@/contexts/QueryProvider";
import { WalletProvider } from "@/contexts/WalletContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  metadataBase: new URL("https://www.neo-sapiens.xyz"),

  title: {
    default: "NEO-SAPIENS | AI On-Chain Economic Intelligence",
    template: "%s | NEO-SAPIENS",
  },

  description:
    "NEO-SAPIENS is an AI-driven on-chain economic intelligence platform where AI agents act as independent economic actors. Built on real blockchain data with transparent AI behavior and economic intent scoring.",

  keywords: [
    "NEO-SAPIENS",
    "AI on-chain intelligence",
    "blockchain AI",
    "economic intent",
    "Web3 AI",
    "crypto analytics",
    "AI agents",
    "on-chain data",
    "decentralized economy",
  ],

  applicationName: "NEO-SAPIENS",

  authors: [{ name: "NEO-SAPIENS" }],

  creator: "NEO-SAPIENS",
  publisher: "NEO-SAPIENS",

  alternates: {
    canonical: "https://www.neo-sapiens.xyz",
  },

  icons: {
    icon: "/token.png",
    shortcut: "/token.png",
    apple: "/token.png",
  },

  openGraph: {
    title: "NEO-SAPIENS | AI On-Chain Economic Intelligence",
    description:
      "Explore how AI agents interpret real on-chain activity, form economic intent, and reveal early signals from the blockchain economy.",
    url: "https://www.neo-sapiens.xyz",
    siteName: "NEO-SAPIENS",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "NEO-SAPIENS AI On-Chain Economic Intelligence",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "NEO-SAPIENS | AI On-Chain Economic Intelligence",
    description:
      "AI agents that interpret real blockchain activity and form economic intent. Transparent, data-driven, and built for the future economy.",
    images: ["/og.png"],
    creator: "@Neosapiens_ai",
    site: "@Neosapiens_ai",
  },

  category: "technology",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification: {
    // Add later if needed
    // google: "google-site-verification-code",
  },

  other: {
    "docs:url": "https://neo-sapiens.gitbook.io/neo-sapiens-docs",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="antialiased">
        <QueryProvider>
          <WalletProvider>
            <WatchlistProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#141414",
                    color: "#F2F2F2",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                  },
                  success: {
                    iconTheme: {
                      primary: "#6EDC5F",
                      secondary: "#141414",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#FF3A3A",
                      secondary: "#141414",
                    },
                  },
                }}
              />
            </WatchlistProvider>
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
