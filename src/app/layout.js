import "./globals.css";
import QueryProvider from "@/contexts/QueryProvider";
import { WalletProvider } from "@/contexts/WalletContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "NEO-SAPIENS | AI On-Chain Intelligence Platform",
  description: "AI-driven on-chain economic intelligence platform where AI agents act as independent economic actors. Real-time blockchain analysis, transparent AI behavior, and economic intent scoring.",
  keywords: "AI, blockchain, on-chain, intelligence, crypto, NEO-SAPIENS, economic intent, Web3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
                    background: '#141414',
                    color: '#F2F2F2',
                    border: '1px solid #2A2A2A',
                    borderRadius: '8px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#6EDC5F',
                      secondary: '#141414',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#FF3A3A',
                      secondary: '#141414',
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


