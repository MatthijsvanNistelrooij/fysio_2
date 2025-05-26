"use client"
import React from "react"
import { navItems } from "../constants"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { signOutUser } from "@/lib/user.actions"
import { CalendarRange, Contact } from "lucide-react"

interface Props {
  fullName: string
  avatar: string
  email: string
}

export const MobileNav = ({ fullName, avatar, email }: Props) => {
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
              className="border hover:bg-gray-500 cursor-pointer mt-1"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </nav>
      </div>

      <div className="bg-gray-800 p-3 rounded-xl mb-10 flex flex-col gap-2">
        <div className="flex flex-row justify-start">
          <Image
            src={avatar}
            width={32}
            height={32}
            alt="avatar"
            className="rounded-full object-cover h-8 w-8"
          />

          <p className="font-semibold text-white m-1 ml-4">{fullName}</p>
        </div>
        <p className="text-xs text-gray-200">{email}</p>
        <Button
          className="border hover:bg-gray-500 text-white cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
