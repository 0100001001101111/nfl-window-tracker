import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFL Window Tracker | Championship Window Analysis",
  description:
    "Track which NFL teams have an open championship window based on QB salary cap efficiency. Teams under 10% QB cap hit win championships. Teams over 15% don't.",
  keywords: [
    "NFL",
    "salary cap",
    "championship window",
    "quarterback contracts",
    "fantasy football",
    "NFL analytics",
  ],
  authors: [{ name: "NFL Window Tracker" }],
  openGraph: {
    title: "NFL Window Tracker",
    description: "Is your team's championship window open or closed?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-3">
                <div className="w-2 h-8 bg-window-elite rounded" />
                <div>
                  <h1 className="text-lg font-mono font-bold text-text-primary tracking-tight">
                    NFL WINDOW TRACKER
                  </h1>
                  <p className="text-xs text-text-muted hidden sm:block">
                    The #1 predictor of championship success
                  </p>
                </div>
              </a>
              <nav className="flex items-center gap-3 md:gap-6">
                <a
                  href="/"
                  className="text-xs md:text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/history"
                  className="text-xs md:text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Historical
                </a>
                <a
                  href="/methodology"
                  className="text-xs md:text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
                >
                  Methodology
                </a>
              </nav>
              <div className="text-xs font-mono text-text-muted hidden md:block">
                Last updated: 2m ago
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">{children}</main>
        <footer className="border-t border-border mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-text-muted">
                Data sources: Over The Cap, Spotrac, Pro Football Reference
              </p>
              <p className="text-xs text-text-muted">
                The math behind championship windows. Built for fans who think in cap space.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
