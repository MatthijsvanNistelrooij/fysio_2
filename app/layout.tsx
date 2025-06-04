import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/context/UserContextProvider"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Fysio 2025",
  description: "Fysio App 2025",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
