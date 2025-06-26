import React from "react"
import { Input } from "./ui/input"
import { useAtom } from "jotai"
import { toggleEditAtom, searchAtom, darkmodeAtom } from "@/lib/store"
import { Edit2, List } from "lucide-react"

const Searchbar = () => {
  const [search, setSearch] = useAtom(searchAtom)
  const [edit, setEdit] = useAtom(toggleEditAtom)
  const [darkmode] = useAtom(darkmodeAtom)

  const handleToggleEdit = () => {
    setEdit((prev) => !prev)
  }

  return (
    <div className="flex justify-between items-center mb-4">
      <Input
        className={`${
          darkmode ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200"
        } border border-gray-500 focus:border-gray-600 rounded-md w-full text-sm p-5 `}
        placeholder="Search by name, email, phone, or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        onClick={handleToggleEdit}
        className={`ml-4 ${
          darkmode
            ? "text-gray-600 hover:text-gray-400"
            : "text-gray-200 hover:text-gray-800"
        }  transition cursor-pointer`}
      >
        {edit ? <List size={20} /> : <Edit2 size={18} />}
      </button>
    </div>
  )
}

export default Searchbar
