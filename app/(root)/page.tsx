"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div>
      <div className="p-5 w-full rounded-3xl m-5 text-white">
        <div className="flex text-center items-center justify-center h-96 w-full">
          <div className="flex flex-col p-10 gap-3 text-gray-700">
            Welkom terug!
            <Link
              className={`bg-gray-800 hover:bg-gray-700 rounded-md p-2 text-white `}
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
