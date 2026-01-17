import { Calistoga, PT_Serif } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import UserActionsTrigger from "@/components/UserActionsTrigger";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const calistoga = Calistoga({
  weight: ["400"],
  variable: "--",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  weight: ["400", "700"],
  variable: "--font-pt-serif",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html style={{ scrollBehavior: "smooth" }} lang="en">
      <body
        className={`${calistoga.variable} ${ptSerif.variable} antialiased w-screen overflow-x-hidden`}
      >
        <AuthProvider>
          {children}
          <UserActionsTrigger />
        </AuthProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
