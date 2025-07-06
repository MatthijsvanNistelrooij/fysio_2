"use client"
import React from "react"
import { Button } from "./ui/button"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  AlignVerticalJustifyStart,
  CalendarRange,
  Contact,
  Edit,
  LayoutDashboard,
  LogOutIcon,
  Settings,
} from "lucide-react"
import { navItems } from "../constants"
import { useAtom } from "jotai"
import { darkmodeAtom, openSettingsAtom } from "@/lib/store"
import { signOutUser } from "@/lib/appwrite/users"

interface Props {
  fullName: string
  avatar: string
  email: string
}

export const Sidebar = ({ fullName, email }: Props) => {
  const pathname = usePathname()
  const [darkmode] = useAtom(darkmodeAtom)
  const [, setOpenSettings] = useAtom(openSettingsAtom)

  const handleSignOut = () => {
    signOutUser()
  }

  const handleClickSettings = () => {
    setOpenSettings(true)
  }

  return (
    <div
      className={`h-screen w-72 border-r border-gray-400 ${
        darkmode ? "bg-white text-gray-800" : "bg-gray-800 text-white"
      } `}
    >
      <div className=" flex flex-col justify-between h-full">
        <div className="flex flex-col justify-between h-full gap-2 p-3">
          <div>
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
                  className={`flex items-center gap-2 p-2 font-semibold transition
                  ${
                    darkmode
                      ? isActive
                        ? "text-gray-800"
                        : "text-gray-400 hover:text-gray-800"
                      : isActive
                      ? "text-gray-200"
                      : "text-gray-600 hover:text-gray-200"
                  }
                `}
                >
                  {item.icon === "client" ? (
                    <Contact size={20} />
                  ) : item.icon === "calendar" ? (
                    <CalendarRange size={20} />
                  ) : item.icon === "dashboard" ? (
                    <LayoutDashboard size={20} />
                  ) : item.icon === "account" ? (
                    <AlignVerticalJustifyStart size={20} />
                  ) : item.icon === "create" ? (
                    <Edit size={20} />
                  ) : null}

                  <span className="text-sm font-sans">{item.name}</span>
                </Link>
              )
            })}
          </div>

          <div
            onClick={handleClickSettings}
            className={`m-2 flex w-full justify-start gap-2 text-center cursor-pointer ${
              darkmode
                ? "text-gray-400 hover:text-gray-800"
                : "text-gray-500 hover:text-gray-200"
            }`}
          >
            <Settings size={20} />
            Settings
          </div>
        </div>

        <div className="p-5 border-t border-gray-400">
          <div className="flex flex-col justify-center">
            <p className="font-semibold flex justify-start">{fullName}</p>
            <p className="flex justify-start text-center text-xs mb-2 text-gray-400">
              {email}
            </p>
            <Button
              className="cursor-pointer bg-gray-900 rounded-sm hover:bg-gray-700"
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
