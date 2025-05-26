import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="p-5 bg-white max-w-5xl w-full border rounded-3xl m-10">
        <div className="flex text-center items-center justify-center h-96 w-full">
          <div className="flex flex-col border p-10 gap-3">
            Welkom terug!
            <Link
              className="border bg-gray-800 hover:bg-gray-700 rounded-md p-2 text-white"
              href="/create"
            >
              Create new Client
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
