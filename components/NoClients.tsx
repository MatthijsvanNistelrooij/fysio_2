import Link from "next/link"
import React from "react"

const NoClients = () => {
  return (
    <div className="flex text-center items-center justify-center h-96 w-full">
      <div className="flex flex-col items-center p-10 gap-4 text-gray-500">
        <p>No clients listed.</p>
        <Link
          className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 text-sm rounded-md transition"
          href="/create"
        >
          Create New Client
        </Link>
      </div>
    </div>
  )
}

export default NoClients
