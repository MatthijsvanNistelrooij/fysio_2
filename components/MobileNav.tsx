"use client"
import React from "react"
import { navItems } from "../constants"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "./ui/button"
import { signOutUser } from "@/lib/user.actions"
import {
  CalendarRange,
  Contact,
  LogOutIcon,
} from "lucide-react"

interface Props {
  fullName: string
  avatar: string
  email: string
}

export const MobileNav = ({ avatar }: Props) => {
  const pathname = usePathname()
  const handleSignOut = () => {
    signOutUser()
  }
  console.log(avatar)

  return (
    <div className="flex flex-col justify-between w-full text-black p-4 shadow">
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
                  className={`p-2 rounded-xl hover:text-gray-800 hover:shadow font-bold transition w-10 ml-2 ${
                    isActive ? "" : "text-gray-400"
                  }`}
                  style={{
                    boxShadow: isActive
                      ? "0 4px 10px rgba(2, 25, 156, 0.25)"
                      : undefined,
                  }}
                >
                  {item.icon === "client" ? (
                    <Contact />
                  ) : item.icon === "calendar" ? (
                    <CalendarRange />
                  ) : null}
                </Link>
              )
            })}
          </div>
          <div>
            <Button
              className="bg-transparent rounded-xl hover:bg-white cursor-pointer mt-2 text-gray-400 hover:text-gray-800 border shadow shadow-purple-200"
              onClick={handleSignOut}

            >
              <LogOutIcon className="transform rotate-180" />
            </Button>
          </div>
        </nav>
      </div>
    </div>
  )
}
