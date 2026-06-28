import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Providers } from "./providers"
import GlobalToast from './components/GlobalToast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Guestora — Your One-Stop Online Store",
  description: "Discover amazing deals on electronics, fashion, home essentials and more at Guestora. Fast delivery, secure checkout, and the best prices.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Header color="light" expand="md" container="fluid" fixed="top" />
          <div style={{ marginTop: "57px" }}>{children}</div>
          <Footer />
          <GlobalToast />
        </Providers>
      </body>
    </html>
  )
}
