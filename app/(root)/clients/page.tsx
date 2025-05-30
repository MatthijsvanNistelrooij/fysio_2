"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/user.actions"
import Link from "next/link"
import { Contact, Edit2, HomeIcon, List, Mail, Phone } from "lucide-react"
import { getClientsByUserId } from "@/lib/client.actions"
import { Client, User } from "@/types"
import { toast } from "sonner"
import CreateForm from "@/components/CreateForm"
import { Input } from "@/components/ui/input"

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
      setLoading(false) // finish loading
    }

    fetchClients()
  }, [user])

  const handleTableRowClick = (id: string) => {
    router.push(`/clients/${id}`)
  }

  const getPetColorClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "dog":
        return "bg-yellow-100"
      case "cat":
        return "bg-purple-100"
      case "horse":
        return "bg-green-100"
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
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="p-5 max-w-7xl w-full rounded-3xl">
        {loading ? (
          <div className="flex items-center justify-center h-96 text-gray-400 text-xl">
            Loading clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="flex text-center items-center max-w-7xl justify-center h-96 w-full">
            <div className="flex flex-col  p-10 gap-3">
              No clients listed.
              <Link
                className="border bg-gray-800 hover:bg-gray-700 rounded-md p-2 text-white"
                href="/create"
              >
                Create new Client
              </Link>
            </div>
          </div>
        ) : (
          <div className="">
            <div className="w-full flex justify-between ">
              <Input
                className="bg-white mr-8 mb-5"
                placeholder="Search by name, email, phone, or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {!edit ? (
                <List
                  onClick={handleToggleEdit}
                  className="cursor-pointer text-gray-400 hover:text-gray-800 mt-2"
                />
              ) : (
                <Edit2
                  onClick={handleToggleEdit}
                  className="cursor-pointer text-gray-400 hover:text-gray-800 mt-2"
                />
              )}
            </div>
            <div className="relative min-h-[400px]">
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  edit && show
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <CreateForm {...user} />
              </div>

              <div
                className={`transition-all duration-500 ${
                  !edit && !show
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                {filteredClients.map((client) => (
                  <div
                    key={client.$id}
                    className="p-3 rounded-2xl bg-white text-white shadow-xl flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex flex-col md:flex-row gap-2">
                        <div
                          className="p-1 rounded-xl text-gray-200 flex items-center bg-gray-800 min-w-[140px] flex-1 text-sm cursor-pointer"
                          onClick={() => handleTableRowClick(client.$id)}
                        >
                          <Contact size={18} className=" text-gray-300 m-1" />
                          <div>{client.name}</div>
                        </div>

                        <div
                          className="p-1 rounded-xl text-gray-600 flex items-center bg-gray-100 min-w-[140px] flex-1 text-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(client.address)
                            toast.success("Address copied to clipboard!")
                          }}
                        >
                          <HomeIcon size={18} className=" text-gray-300 m-1" />
                          {client.address}
                        </div>
                        <div
                          className="p-1 rounded-xl text-gray-600 flex items-center bg-gray-100 min-w-[140px] flex-1 text-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(client.phone)
                            toast.success("Phone number copied to clipboard!")
                          }}
                        >
                          <Phone
                            size={18}
                            className="text-xs text-gray-300 m-1"
                          />
                          {client.phone}
                        </div>
                        <div
                          className="p-1 rounded-xl text-gray-600 flex items-center bg-gray-100 min-w-[140px] flex-1 text-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(client.email)
                            toast.success("Email copied to clipboard!")
                          }}
                        >
                          <Mail
                            size={18}
                            className="text-xs text-gray-300 m-1"
                          />
                          {client.email}
                        </div>
                      </div>

                      <div className="flex flex-row justify-end gap-2 mt-4">
                        {client.pets.length ? (
                          client.pets.map((pet) => (
                            <Link
                              key={pet.$id}
                              href={`/pets/${pet.$id}`}
                              className={`shadow text-gray-800 rounded hover:bg-gray-200 px-4 py-1 text-sm hover:bg-opacity-80 transition ${getPetColorClass(
                                pet.type
                              )}`}
                            >
                              {pet.name}
                            </Link>
                          ))
                        ) : (
                          <div>-</div>
                        )}
                      </div>
                    </div>
                  </div>
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
