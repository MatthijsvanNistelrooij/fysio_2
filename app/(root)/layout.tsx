import React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/user.actions"
import Sidebar from "@/components/Sidebar"
import { Toaster } from "sonner"
import { MobileNav } from "@/components/MobileNav"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser()

  if (!currentUser) return redirect("/sign-in")

  return (
    <main className="flex h-screen bg-[#e9edf3]">
      <div className="hidden md:flex h-screen">
        <Sidebar {...currentUser} />
      </div>

      <section className="flex w-full flex-col overflow-hidden">
        <div className="md:hidden">
          <MobileNav {...currentUser} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
          <Toaster richColors position="bottom-right" />
        </div>
      </section>
    </main>
  )
}

export default Layout
