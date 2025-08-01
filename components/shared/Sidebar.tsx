"use client"
import React from "react"
import { Button } from "../ui/button"
import Link from "next/link"
import { LogOutIcon } from "lucide-react"
import { navItems } from "../../constants"

import { signOutUser } from "@/lib/appwrite/users"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export const Sidebar = () => {
  const pathname = usePathname()

  const handleSignOut = () => {
    signOutUser()
  }

  return (
    <>
      <nav className="bg-gray-100 w-full lg:w-48 lg:h-screen border-b lg:border-b-0 lg:border-r flex flex-col">
        <div className="flex flex-row lg:flex-col lg:h-screen justify-between p-1">
          <div className="flex flex-row lg:flex-col gap-2">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.url}
                className={cn(
                  "p-1 py-2 text-white rounded hover:bg-gray-800",
                  pathname === item.url ? "bg-gray-800" : "bg-gray-700"
                )}
              >
                {item.icon}
              </Link>
            ))}
          </div>

          <div className="lg:w-full">
            <Button
              className="bg-gray-900 rounded-sm hover:bg-gray-700 w-full h-10 cursor-pointer"
              onClick={handleSignOut}
            >
              <span className="hidden sm:inline">Sign Out</span>
              <LogOutIcon size={20} className="ml-2 rotate-180" />
            </Button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Sidebar
