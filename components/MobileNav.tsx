"use client"
import React, { useState } from "react"
import { navItems } from "../constants"
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
import { darkmodeAtom, openSettingsAtom } from "@/lib/store"
import { useAtom } from "jotai"
import { signOutUser } from "@/lib/appwrite/users"

export const MobileNav = () => {
  const pathname = usePathname()
  const handleSignOut = () => {
    signOutUser()
  }

  const [darkmode] = useAtom(darkmodeAtom)
  const [, setOpenSettings] = useAtom(openSettingsAtom)
  const [signout, setSignout] = useState(false)

  const handleClickSettings = () => {
    setOpenSettings(true)
  }

  return (
    <div
      className={`flex flex-col sticky top-0 z-[999] justify-between ${
        darkmode ? "bg-white" : "bg-gray-800"
      }  w-full text-gray-200 p-1 border-b border-gray-500`}
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
                </Link>
              )
            })}
          </div>
          <div className="flex flex-row mt-2 mr-5">
            <div
              onClick={handleClickSettings}
              className={`m-2 flex w-full justify-start gap-2 text-center cursor-pointer ${
                darkmode
                  ? "text-gray-400 hover:text-gray-800"
                  : "text-gray-500 hover:text-gray-200"
              }`}
            >
              <Settings size={20} />
            </div>
            <Link
              href={""}
              onClick={() => setSignout(!signout)}
              className={`flex items-center gap-2 p-2 font-semibold transition
                  ${
                    darkmode
                      ? "text-gray-400 hover:text-gray-800"
                      : "text-gray-500 hover:text-gray-200"
                  }
                `}
            >
              <LogOutIcon size={20} className="transform rotate-180" />
            </Link>
          </div>

          {signout && (
            <div
              className={`absolute top-18 right-5 ${
                darkmode
                  ? "bg-white text-gray-800 border-gray-200"
                  : "bg-gray-800 border-gray-600"
              } p-5 border `}
            >
              Signout?
              <Link
                href={"/"}
                className={`rounded-xl hover:text-gray-200 text-gray-600 font-bold transition mt-3 ${
                  darkmode ? "hover:text-gray-800" : ""
                }`}
                onClick={handleSignOut}
              >
                <LogOutIcon
                  size={20}
                  className="transform rotate-180 m-4"
                  onClick={() => setSignout(!signout)}
                />
              </Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  )
}
