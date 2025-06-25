"use client"
import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"
import Link from "next/link"

export default function Home() {
  const [darkmode] = useAtom(darkmodeAtom)

  return (
    <div
      className={` min-h-screen flex justify-center ${
        darkmode ? "bg-[#e9edf3] text-gray-800" : "bg-gray-800 text-gray-200"
      }  `}
    >
      <div className="p-5 w-full rounded-3xl m-5">
        <div className="flex text-center items-center justify-center h-96 w-full">
          <div className="flex flex-col p-10 gap-3">
            Welkom terug!
            <Link
              className={`border bg-gray-800 ${darkmode ? "border-gray-200" : "border-gray-500"} hover:bg-gray-700 rounded-md p-2 text-white `}
              href="/create"
            >
              Create new Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
