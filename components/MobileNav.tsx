"use client"
import React, { useState } from "react"
import { navItems } from "../constants"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { signOutUser } from "@/lib/actions/user.actions"
import {
  CalendarRange,
  Contact,
  Edit,
  LogOutIcon,
  Settings,
} from "lucide-react"
import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"

export const MobileNav = () => {
  const [fontSize, setFontSize] = React.useState("12px")
  React.useEffect(() => {
    document.documentElement.style.setProperty("--global-font-size", fontSize)
  }, [fontSize])

  const pathname = usePathname()
  const handleSignOut = () => {
    signOutUser()
  }

  const [showSettings, setShowSettings] = useState(false)

  const fontSizes = [
    { size: "10px", label: "A", fontWeight: "lighter" },
    { size: "12px", label: "A", fontWeight: "normal" },
    { size: "14px", label: "A", fontWeight: "bold" },
  ]

  const [darkmode, setDarkmode] = useAtom(darkmodeAtom)

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
                    <CalendarRange size={20} />
                  ) : item.icon === "create" ? (
                    <Edit size={20} />
                  ) : null}
                </Link>
              )
            })}
          </div>
          <div className="flex">
            <Settings
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-500 mt-8 cursor-pointer select-none"
              size={18}
            />

            {showSettings && (
              <div
                className={`absolute top-10 right-20 ${
                  darkmode ? "bg-white" : "bg-gray-800"
                } p-5 rounded-xl border`}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex gap-3 items-end mb-2 mr-10">
                    {fontSizes.map(({ size, label, fontWeight }) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        style={{
                          fontSize: size,
                          fontWeight: fontWeight,
                        }}
                        className={`cursor-pointer px-2 py-1 rounded transition ${
                          fontSize === size
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        aria-label={`Set font size to ${size}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setDarkmode(!darkmode)}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-300 cursor-pointer ${
                      !darkmode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        !darkmode ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            <Link
              href={"/"}
              className="rounded-xl hover:text-gray-200 text-gray-600 hover:shadow font-bold transition mt-3"
              onClick={handleSignOut}
            >
              <LogOutIcon size={20} className="transform rotate-180 m-4" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
