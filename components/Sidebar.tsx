"use client"
import React from "react"
import { Button } from "./ui/button"
import { signOutUser } from "@/lib/user.actions"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { CalendarRange, Contact } from "lucide-react"
import { navItems } from "../constants"

interface Props {
  fullName: string
  avatar: string
  email: string
}

export const Sidebar = ({ fullName, email }: Props) => {
  const pathname = usePathname()

  const handleSignOut = () => {
    signOutUser()
  }

  return (
    <div className="h-screen max-h-screen border-r w-64">
      <div className=" flex flex-col justify-between h-full">
        <div className="flex flex-col h-full gap-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.url)
            return (
              <Link
                key={item.name}
                href={item.url}
                className={`p-2 rounded-xl hover:text-gray-800 hover:shadow font-bold transition ${
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
        <div className="p-5 border-t">
          <div className="flex flex-col justify-center">
            <p className="font-semibold flex justify-start">{fullName}</p>
            <p className="flex justify-start text-center text-xs mb-2 text-gray-400">
              {email}
            </p>
            <Button
              className="cursor-pointer bg-gray-900 rounded-sm hover:bg-gray-800"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
