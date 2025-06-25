"use client"
import React from "react"
import { Button } from "./ui/button"
import { signOutUser } from "@/lib/actions/user.actions"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { CalendarRange, Contact, Edit, LogOutIcon } from "lucide-react"
import { navItems } from "../constants"
import { useAtom } from "jotai"
import { darkmodeAtom } from "@/lib/store"

interface Props {
  fullName: string
  avatar: string
  email: string
}

export const Sidebar = ({ fullName, email }: Props) => {
  const pathname = usePathname()
  const [fontSize, setFontSize] = React.useState("12px")
  const [darkmode, setDarkmode] = useAtom(darkmodeAtom)

  React.useEffect(() => {
    document.documentElement.style.setProperty("--global-font-size", fontSize)
  }, [fontSize])

  const handleSignOut = () => {
    signOutUser()
  }

  return (
    <div
      className={`h-screen w-72 border-r  ${
        darkmode ? "bg-white text-gray-800" : "bg-gray-800 text-white"
      } `}
    >
      <div className=" flex flex-col justify-between h-full">
        <div className="flex flex-col h-full gap-2 p-3">
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

                <span className="text-sm font-sans">{item.name}</span>
              </Link>
            )
          })}
        </div>
        <div className="flex text-end gap-2 m-10 rounded-xl justify-evenly">
          <div className="flex items-center space-x-2">
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
          <div className="flex gap-5">
            <button
              onClick={() => setFontSize("10px")}
              style={{ fontSize: "10px", fontWeight: "lighter" }}
              className="cursor-pointer mt-2"
            >
              A
            </button>
            <button
              onClick={() => setFontSize("12px")}
              style={{ fontSize: "12px" }}
              className="cursor-pointer mt-1"
            >
              A
            </button>
            <button
              onClick={() => setFontSize("14px")}
              style={{ fontSize: "14px", fontWeight: "bold" }}
              className="cursor-pointer mt-1"
            >
              A
            </button>
          </div>
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
