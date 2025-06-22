"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/user.actions"
import Link from "next/link"
import {
  CalendarRange,
  Contact,
  Edit2,
  HomeIcon,
  List,
  Mail,
  MoreVertical,
  Phone,
  PlusCircle,
} from "lucide-react"
import { getClientsByUserId } from "@/lib/actions/client.actions"
import { Client, Pet, User } from "@/lib/types"
import { toast } from "sonner"
import CreateClientForm from "@/components/CreateClientForm"
import { Input } from "@/components/ui/input"
import { usePetStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import Loading from "@/components/Loading"

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState("")
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (edit) {
      // Small timeout to allow transition to apply
      setTimeout(() => setShow(true), 10)
    } else {
      setShow(false)
    }
  }, [edit])

  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchClients = async () => {
      setLoading(true) // start loading
      const data = await getClientsByUserId(user.$id)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedClients: Client[] = data.map((doc: any) => ({
        $id: doc.$id,
        userId: doc.userId,
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        address: doc.address,
        pets: doc.pets,
      }))

      setClients(formattedClients)
      setLoading(false)
    }

    fetchClients()
  }, [user])

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

  const handleToggleEdit = () => {
    setEdit((prev) => !prev)
  }

  const filteredClients = clients.filter((client) => {
    const term = search.toLowerCase()
    return (
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone.toLowerCase().includes(term) ||
      client.address.toLowerCase().includes(term)
    )
  })

  return (
    <div className="min-h-screen flex justify-center py-2 px-2 sm:px-2">
      <div className="w-full">
        {loading ? (
          <Loading />
        ) : clients.length === 0 ? (
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
        ) : (
          <div className="p-5 ">
            <div className="flex justify-between items-center mb-4">
              <Input
                className="bg-white border border-gray-300 focus:border-gray-600 rounded-md px-4 py-2 w-full text-sm"
                placeholder="Search by name, email, phone, or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleToggleEdit}
                className="ml-4 text-gray-600 hover:text-gray-800 transition cursor-pointer"
              >
                {edit ? <List size={20} /> : <Edit2 size={18} />}
              </button>
            </div>

            <div className="relative min-h-[400px]">
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  edit && show
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <CreateClientForm {...user} />
              </div>

              <div
                className={`transition-all duration-500 ${
                  !edit && !show
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                {filteredClients.map((client) => (
                  <Card
                    key={client.$id}
                    className="bg-white rounded-md shadow-sm mb-2 px-4 py-3 border border-gray-200 hover:shadow-md transition select-none"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-2 sm:gap-4 text-sm text-gray-700">
                      <div
                        onClick={() => {
                          navigator.clipboard.writeText(client.name)
                          toast.success("Name copied to clipboard!")
                        }}
                        className="flex items-center gap-2 hover:bg-[#e9edf3] rounded-md px-2 py-1 cursor-pointer transition w-full"
                      >
                        <Contact size={16} className="text-gray-400" />
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
                        <Phone size={16} className="text-gray-300" />
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
                            className="text-gray-400 text-sm flex cursor-pointer hover:text-gray-800 hover:bg-[#e9edf3] py-1 px-3"
                            onClick={() => handleTableRowClick(client.$id)}
                          >
                            No pets listed, create pet
                            <PlusCircle size={12} className="m-1" />
                          </div>
                        )}
                      </div>
                      <div className="flex w-full lg:w-auto justify-end">
                        <MoreVertical
                          onClick={() => handleTableRowClick(client.$id)}
                          size={20}
                          className="text-gray-600 cursor-pointer hover:text-gray-800 mt-1"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Clients
