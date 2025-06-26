import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"
import Link from "next/link"
import React from "react"

const NoClients = () => {
  const [darkmode] = useAtom(darkmodeAtom)
  return (
    <div
      className={`h-screen flex text-center ${
        darkmode ? "bg-white" : "bg-gray-800"
      } items-center justify-center h-96 w-full `}
    >
      <div className="h-screen mt-[50vh] flex flex-col items-center p-10 gap-4 text-gray-500">
        <p>No contacts listed.</p>
        <Link
          className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 text-sm rounded-md transition"
          href="/create"
        >
          Create New Contact
        </Link>
      </div>
    </div>
  )
}

export default NoClients
