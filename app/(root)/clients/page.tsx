"use client"
import React, { useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/user.actions"

import Link from "next/link"
import { HomeIcon, Mail, Phone, PlusCircle } from "lucide-react"
import { getClientsByUserId } from "@/lib/client.actions"
import Header from "@/components/Header"
import { Client, User } from "@/types"

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [user, setUser] = useState<User | null>(null)

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
    }

    fetchClients()
  }, [user])

  const router = useRouter()

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

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="p-5 bg-white max-w-5xl w-full border rounded-3xl m-10">
        {clients.length === 0 ? (
          <div className="flex text-center items-center justify-center h-96 w-full">
            <div className="flex flex-col border p-10 gap-3">
              No clients listed.
              <Link
                className="border bg-gray-600 hover:bg-gray-700 rounded-md p-2 text-white"
                href="/create"
              >
                Create new Client
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full flex justify-between">
              <Header />
              <Link
                className="p-2 rounded-xl hover:text-gray-800 text-gray-200 font-bold transition"
                href="/create"
              >
                <PlusCircle />
              </Link>
            </div>
            <div className="flex flex-col w-full gap-2 pt-4">
              {clients.map((client) => (
                <div
                  className="p-1 rounded-2xl bg-white text-white flex shadow-xl"
                  key={client.$id}
                >
                  <div
                    className="bg-gray-800 rounded-xl hover:bg-gray-700 p-2 py-1 flex justify-start w-40 cursor-pointer"
                    onClick={() => handleTableRowClick(client.$id)}
                  >
                    {client.name}
                  </div>

                  <div className="flex justify-between w-full">
                    <div className="flex">
                      <div className="ml-2 p-1 rounded-xl text-gray-600 flex w-40 bg-gray-100">
                        <HomeIcon
                          size={18}
                          className="text-xs text-gray-300 m-1"
                        />
                        {client.address}
                      </div>
                      <div className="ml-2 p-1 rounded-xl text-gray-600 flex w-40 bg-gray-100">
                        <Phone
                          size={18}
                          className="text-xs text-gray-300 m-1"
                        />
                        {client.phone}
                      </div>
                      <div className="ml-2 p-1 rounded-xl text-gray-600 flex w-40 bg-gray-100">
                        <Mail size={18} className="text-xs text-gray-300 m-1" />
                        {client.email}
                      </div>
                    </div>

                    <div className="mt-1 ">
                      {client.pets.length ? (
                        <div className="flex gap-2 mr-2">
                          {client.pets.map((pet) => (
                            <Link
                              key={pet.$id}
                              href={`/pets/${pet.$id}`}
                              className={`shadow text-gray-800 rounded-xl px-4 py-1 text-sm hover:bg-opacity-80 transition ${getPetColorClass(
                                pet.type
                              )}`}
                            >
                              {pet.name}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div>-</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Clients
