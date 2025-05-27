"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { deleteClient, updateClient } from "@/lib/client.actions"
import { toast } from "sonner"

import DetailsCard from "./DetailsCard"
import { addPetToClient, createPet } from "@/lib/pet.actions"
import ClientForm from "./ClientForm"
import AddPetForm from "./AddPetForm"
import { Client, Pet } from "@/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ClientDetailsComponent({ client }: { client: any }) {
  const router = useRouter()

  const [edit, setEdit] = useState(false)

  console.log("client", client)

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    )
    if (!confirmDelete) return

    try {
      await deleteClient(id)
      toast.success("Client deleted successfully!")

      router.push("/clients")
    } catch (error) {
      console.error("Error deleting client:", error)
      toast.error("Failed to delete client.")
    }
  }

  const handleEditToggle = () => {
    setEdit((prev) => !prev)
  }

  const handleUpdate = async (data: Client) => {
    try {
      await updateClient(client.$id, data)
      toast.success("Client updated successfully!")
      setEdit(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating client:", error)
      toast.error("Failed to update client.")
    }
  }

  const [addPet, setAddPet] = useState(false)

  const handleTogglePetForm = () => {
    setAddPet((prev) => !prev)
  }

  const handleCreate = async (data: Pet) => {
    try {
      const petResponse = await createPet({
        ...data,
        ownerId: data.ownerId, // if this is meant to be the clientId
      })

      await addPetToClient(data.ownerId, petResponse.$id)

      toast.success("Pet added successfully!")
      setAddPet((prev) => !prev)
      router.refresh()
    } catch (error) {
      console.error("Error creating pet:", error)
      toast.error("Failed to create pet.")
    }
  }

  if (edit) {
    return (
      <div className="main-container">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold mb-4">Edit Client</h1>
          <X onClick={handleEditToggle} className="b cursor-pointer" />
        </div>
        <ClientForm
          initialData={client}
          onSubmit={handleUpdate}
          userId={client.userId}
        />
      </div>
    )
  }

  return (
    <>
      <DetailsCard
        title="clients"
        details={[
          { label: "Name", value: client.name },
          { label: "Email", value: client.email },
          { label: "Phone", value: client.phone },
          { label: "Address", value: client.address },
        ]}
        url="/clients"
        onEdit={handleEditToggle}
        onDelete={() => handleDelete(client.$id)}
      />

      <div className="mt-5 p-1">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-2">Pets</h2>

          {addPet ? (
            <X
              onClick={() => handleTogglePetForm()}
              className="cursor-pointer"
            />
          ) : (
            <Plus
              onClick={() => handleTogglePetForm()}
              className="cursor-pointer"
            />
          )}
        </div>

        {addPet ? (
          <div>
            <AddPetForm
              clientId={client.$id}
              onSubmit={(data) => handleCreate(data)}
            />
          </div>
        ) : (
          <div>
            {client.pets && client.pets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                {client.pets.map((pet: Pet, index: number) => (
                  <Link
                    key={pet.$id || index}
                    href={`/pets/${pet.$id}`}
                    className="block rounded shadow hover:shadow-md transition-shadow bg-white text-sm"
                  >
                    <div className="bg-gray-800 px-4 py-2 rounded-t text-sm text-white font-medium">
                      {pet.name}
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="text-gray-800 font-semibold">
                        Age: {pet.age}
                      </p>
                      <p className="text-gray-800 font-semibold">
                        Appointments: {pet.appointments.length}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No pets listed.</p>
            )}
          </div>
        )}
      </div>
    </>
  )
}
