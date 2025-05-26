"use client"
import React from "react"
import { navItems } from "../constants"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "./ui/button"
import { signOutUser } from "@/lib/user.actions"
import { CalendarRange, Contact } from "lucide-react"

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
      <div className="flex flex-row gap-3">
        <nav className="flex flex-row justify-between w-full">
          <div className="mt-2 flex flex-row">
            {navItems.map((item) => {
              const isActive = pathname.includes(item.url)
              return (
                <Link
                  key={item.name}
                  href={item.url}
                  className={`p-2 rounded-xl hover:text-gray-800 hover:shadow font-bold transition w-40 ${
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
              className="cursor-pointer mt-2 p-2"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </nav>
      </div>
    </div>
  )
}
