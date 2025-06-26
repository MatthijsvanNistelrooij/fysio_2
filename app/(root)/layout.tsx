import React from "react"
import { redirect } from "next/navigation"

import Sidebar from "@/components/Sidebar"
import { Toaster } from "sonner"
import { MobileNav } from "@/components/MobileNav"
import { getCurrentUser } from "@/lib/appwrite/users"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) return redirect("/sign-in")

  return (
    <main className="flex min-h-screen">
      {/* Sidebar - static, full height */}
      <div className="hidden md:flex w-72 h-screen sticky top-0">
        <Sidebar {...currentUser} />
      </div>

      {/* Main content */}
      <section className="flex-1 flex flex-col">
        <div className="md:hidden sticky top-0">
          <MobileNav {...currentUser} />
        </div>

        <div className="flex-1">
          {children}
          <Toaster richColors position="bottom-right" />
        </div>
      </section>
    </main>
  )
}

export default Layout
