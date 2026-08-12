import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "VA Spend Advisor | Versatile Accounting", description: "Subscription spend management and AI advisory platform by Versatile Accounting", icons: { icon: "/va-mark.svg" } };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en-AU"><body>{children}</body></html>}
