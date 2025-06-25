"use client"
import {
  clientsAtom,
  darkmodeAtom,
  openAppointmentAtom,
  searchAtom,
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
import { toast } from "sonner"
import { useAtom } from "jotai"
import InfoCard from "./InfoCard"

const ClientList = () => {
  const [clients] = useAtom(clientsAtom)
  const [search] = useAtom(searchAtom)
  const [, setOpenAppointment] = useAtom(openAppointmentAtom)
  const setSelectedGlobalPet = usePetStore(
    (state) => state.setSelectedGlobalPet
  )
  const [darkmode] = useAtom(darkmodeAtom)

  const router = useRouter()

  const handleTableRowClick = (id: string) => {
    setSelectedGlobalPet(null)
    router.push(`/clients/${id}`)
  }

  const handleClickPet = (id: string, pet: Pet) => {
    const setSelectedPet = usePetStore.getState().setSelectedGlobalPet
    setSelectedPet(pet)
    setOpenAppointment(false)
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
      className={`${
        darkmode ? "text-gray-700" : "text-gray-200"
      } flex flex-col gap-3 `}
    >
      {filteredClients?.map((client) => (
        <InfoCard key={client.$id}>
          <div className="flex flex-row md:flex-col w-full lg:flex-row justify-between gap-4 text-sm">
            <div className="flex flex-col md:flex-row w-full justify-between gap-5">
              <div
                onClick={() => {
                  navigator.clipboard.writeText(client.name)
                  toast.success("Name copied to clipboard!")
                }}
                className={`flex items-center gap-2 w-full ${
                  darkmode ? "hover:bg-[#e9edf3]" : "hover:bg-gray-700"
                } rounded-md px-2 py-1 cursor-pointer transition w-full`}
              >
                <Contact size={16} className="text-gray-300" />
                <span>{client.name}</span>
              </div>

              <div
                onClick={() => {
                  navigator.clipboard.writeText(client.address)
                  toast.success("Address copied to clipboard!")
                }}
                className={`flex items-center gap-2 w-full ${
                  darkmode ? "hover:bg-[#e9edf3]" : "hover:bg-gray-700"
                } rounded-md px-2 py-1 cursor-pointer transition w-full`}
              >
                <HomeIcon size={16} className="text-gray-300" />
                <span>{client.address}</span>
              </div>

              <div
                onClick={() => {
                  navigator.clipboard.writeText(client.phone)
                  toast.success("Phone number copied to clipboard!")
                }}
                className={`flex items-center gap-2 w-full ${
                  darkmode ? "hover:bg-[#e9edf3]" : "hover:bg-gray-700"
                } rounded-md px-2 py-1 cursor-pointer transition w-full`}
              >
                <Phone size={14} className="text-gray-300" />
                <span>{client.phone}</span>
              </div>

              <div
                onClick={() => {
                  navigator.clipboard.writeText(client.email)
                  toast.success("Email copied to clipboard!")
                }}
                className={`flex items-center gap-2 w-full ${
                  darkmode ? "hover:bg-[#e9edf3]" : "hover:bg-gray-700"
                } rounded-md px-2 py-1 cursor-pointer transition w-full`}
              >
                <Mail size={16} className="text-gray-300" />
                <span>{client.email}</span>
              </div>
            </div>

            <div className="flex flex-row w-full">
              <div className="flex justify-end gap-2 w-full">
                {client.pets.length ? (
                  client.pets.map((pet) => (
                    <div
                      key={pet.$id}
                      onClick={() => handleClickPet(client.$id, pet)}
                      className={`flex gap-2 h-auto py-1 px-3 text-sm cursor-pointer text-gray-700 hover:bg-[#e9edf3] transition ${getPetColorClass(
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
              <div className="flex justify-end">
                <MoreVertical
                  onClick={() => handleTableRowClick(client.$id)}
                  size={18}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 mt-1"
                />
              </div>
            </div>
          </div>
        </InfoCard>
      ))}
    </div>
  )
}

export default ClientList
