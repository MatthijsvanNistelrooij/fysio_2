import React from "react"
import { redirect } from "next/navigation"
import { Toaster } from "sonner"
import { getCurrentUser } from "@/lib/appwrite/users"

import SettingsDialog from "@/components/shared/SettingsDialog"
import Sidebar from "@/components/shared/Sidebar"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) return redirect("/sign-in")

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Sidebar {...currentUser} />
      <main className="w-full h-screen bg-amber-500 overflow-x-auto">
        <SettingsDialog />

        {children}
        <Toaster richColors position="bottom-right" />
      </main>
    </div>
  )
}

export default Layout
