"use client"
import React from "react"
import { navItems } from "../constants"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { signOutUser } from "@/lib/user.actions"
import { CalendarRange, Contact, LogOutIcon } from "lucide-react"

export const MobileNav = () => {
  const pathname = usePathname()
  const handleSignOut = () => {
    signOutUser()
  }

  return (
    <div
      style={{
        // boxShadow: "0 4px 10px rgba(2, 25, 156, 0.25)",
      }}
      className="flex flex-col justify-between w-full text-black p-4 border-b"
    >
      <div className="flex flex-row gap-2">
        <nav className="flex flex-row justify-between w-full">
          <div className="mt-2 flex flex-row">
            {navItems.map((item) => {
              const isActive =
                (item.url === "/clients" &&
                  (pathname.includes("/clients") ||
                    pathname.includes("/pets"))) ||
                (pathname.startsWith(item.url) && item.url !== "/clients")
              return (
                <Link
                  key={item.name}
                  href={item.url}
                  className={`p-2 rounded-xl hover:text-gray-800  font-bold transition w-14 ml-2 ${
                    isActive ? "" : "text-gray-400"
                  }`}

                >
                  {item.icon === "client" ? (
                    <Contact size={20} />
                  ) : item.icon === "calendar" ? (
                    <CalendarRange size={20} />
                  ) : null}
                </Link>
              )
            })}
          </div>
          <div>
            <Link
              href={"/"}
              className="rounded-xl hover:text-gray-800 text-gray-400 hover:shadow font-bold transition"
              onClick={handleSignOut}
            >
              <LogOutIcon size={20} className="transform rotate-180 mt-4" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
