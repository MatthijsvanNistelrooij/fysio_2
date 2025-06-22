"use client"
import {
  clientsAtom,
  searchAtom,
  showAtom,
  toggleEditAtom,
  usePetStore,
} from "@/lib/store"
import { Pet } from "@/lib/types"
import {
  CalendarRange,
  Contact,
  HomeIcon,
  Mail,
  Phone,
  MoreVertical,
  Plus,
} from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { Card } from "./ui/card"
import { toast } from "sonner"
import { useAtom } from "jotai"

const ClientList = () => {
  const [clients] = useAtom(clientsAtom)
  const [edit] = useAtom(toggleEditAtom)
  const [search] = useAtom(searchAtom)
  const [show] = useAtom(showAtom)

  const router = useRouter()

  const handleTableRowClick = (id: string) => {
    router.push(`/clients/${id}`)
  }

  const handleClickPet = (id: string, pet: Pet) => {
    const setSelectedPet = usePetStore.getState().setSelectedPet
    setSelectedPet(pet)
    router.push(`/clients/${id}`)
  }

  const getPetColorClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "dog":
        return "bg-yellow-200"
      case "cat":
        return "bg-purple-200"
      case "horse":
        return "bg-green-200"
      default:
        return "bg-gray-100"
    }
  }

  const filteredClients = clients?.filter((client) => {
    const term = search.toLowerCase()
    return (
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone.toLowerCase().includes(term) ||
      client.address.toLowerCase().includes(term)
    )
  })

  return (
    <div
      className={`transition-all duration-500 ${
        !edit && !show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      {filteredClients?.map((client) => (
        <Card
          key={client.$id}
          className="bg-white rounded-md shadow-sm mb-2 px-4 py-5 lg:py-2 border border-gray-200 hover:shadow-md transition select-none"
        >
          <div className="flex flex-col lg:flex-row justify-between gap-4 text-sm text-gray-700">
            <div
              onClick={() => {
                navigator.clipboard.writeText(client.name)
                toast.success("Name copied to clipboard!")
              }}
              className="flex items-center gap-2 hover:bg-[#e9edf3] rounded-md px-2 py-1 cursor-pointer transition w-full"
            >
              <Contact size={16} className="text-gray-300" />
              <span>{client.name}</span>
            </div>

            <div
              onClick={() => {
                navigator.clipboard.writeText(client.address)
                toast.success("Address copied to clipboard!")
              }}
              className="flex items-center gap-2 hover:bg-[#e9edf3] rounded-md px-2 py-1 cursor-pointer transition w-full"
            >
              <HomeIcon size={16} className="text-gray-300" />
              <span>{client.address}</span>
            </div>

            <div
              onClick={() => {
                navigator.clipboard.writeText(client.phone)
                toast.success("Phone number copied to clipboard!")
              }}
              className="flex items-center gap-2 hover:bg-[#e9edf3] rounded-md px-2 py-1 cursor-pointer transition w-full"
            >
              <Phone size={14} className="text-gray-300" />
              <span>{client.phone}</span>
            </div>

            <div
              onClick={() => {
                navigator.clipboard.writeText(client.email)
                toast.success("Email copied to clipboard!")
              }}
              className="flex items-center gap-2 hover:bg-[#e9edf3] rounded-md px-2 py-1 cursor-pointer transition w-full"
            >
              <Mail size={16} className="text-gray-300" />
              <span>{client.email}</span>
            </div>
            <div className="flex flex-wrap justify-end gap-2 w-full">
              {client.pets.length ? (
                client.pets.map((pet) => (
                  <div
                    key={pet.$id}
                    onClick={() => handleClickPet(client.$id, pet)}
                    className={`flex items-center gap-2 px-3 py-1 text-sm cursor-pointer text-gray-700 hover:bg-[#e9edf3] transition ${getPetColorClass(
                      pet.type
                    )}`}
                  >
                    <span>{pet.name}</span>
                    <div className="flex gap-1">
                      {pet.appointments?.map((_, i) => (
                        <CalendarRange key={i} size={14} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="text-gray-500 text-sm flex cursor-pointer hover:text-gray-800 bg-gray-100 hover:bg-[#e9edf3] py-1 px-3"
                  onClick={() => handleTableRowClick(client.$id)}
                >
                  Create new pet
                  <Plus size={12} className="m-1" />
                </div>
              )}
            </div>
            <div className="flex w-full lg:w-auto justify-end">
              <MoreVertical
                onClick={() => handleTableRowClick(client.$id)}
                size={18}
                className="text-gray-400 cursor-pointer hover:text-gray-600 mt-1"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default ClientList
