"use client"
import React from "react"
import { Button } from "./ui/button"
import { signOutUser } from "@/lib/user.actions"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { CalendarRange, Contact, LogOutIcon } from "lucide-react"
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
    <div className="h-screen max-h-screen border-r w-72">
      <div className=" flex flex-col justify-between h-full">
        <div className="flex flex-col h-full gap-2 p-5">
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
                className={`p-2 hover:text-gray-800 font-bold transition border hover:border-gray-800 ${
                  isActive ? "border-gray-800" : "text-gray-400"
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
              <LogOutIcon size={20} className="transform rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
