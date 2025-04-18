import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'
import Wrapper from "@/components/Wrapper";
import { AppWrapper } from "@/context";
import NextTopLoader from 'nextjs-toploader';
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "next-themes";
import { LoadingProvider } from "@/context/LoadingContext";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import GlobalLoader from "@/components/GlobalLoader"
import Footer from "@/components/Footer";
import ClothingCTA from "@/components/CTA";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ESEFABRICS",
  description: "Your one stop shop for everything clothing",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " bg-background dark:bg-background-dark"}>
        <AuthProvider>
        <LoadingProvider>
          <AppWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              
                <GlobalLoader/>
                <Wrapper path="/admin">
                  <Header/>
                </Wrapper>
                <NextTopLoader
  color="green"
  initialPosition={0.08}
  crawlSpeed={200}
  height={3}
  crawl={true}
  showSpinner={false}
  easing="ease"
  speed={200}
  zIndex={1600}
  showAtBottom={false}
/>
                <div className="text-text dark:text-text-dark w-full h-full text bg-background dark:bg-background-dark">
                  <Wrapper path="/admin">
                  <div className="pt-[63.99px]"></div>
                  </Wrapper>
                  {children}
                  <Wrapper path="/admin">
                    <ClothingCTA />
                    <Footer/>
                  </Wrapper>
                </div>
                <Wrapper path="/auth">
                  <BottomNav/>
                </Wrapper>
                <Toaster position="bottom-right"/>

            </ThemeProvider>
          </AppWrapper>
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}