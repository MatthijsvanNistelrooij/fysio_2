import {
  darkmodeAtom,
  editPetAtom,
  localClientAtom,
  selectedPetAtom,
} from "@/lib/store"
import { useAtom } from "jotai"
import React, { useState } from "react"
import InfoCard from "./InfoCard"
import { Button } from "./ui/button"
import PetForm from "./PetForm"
import { Edit, X } from "lucide-react"
import { Pet } from "@/lib/types"
import { toast } from "sonner"

const SelectedPet = () => {
  const [, setLocalClient] = useAtom(localClientAtom)
  const [editPet, setEditPet] = useAtom(editPetAtom)
  const [isDeleting, setIsDeleting] = useState(false)

  const [selectedPet, setSelectedPet] = useAtom(selectedPetAtom)
  const [darkmode] = useAtom(darkmodeAtom)

  const handleToggleUpdatePet = () => {
    setEditPet((prev) => !prev)
  }

  const handleUpdatePet = async (data: Pet) => {
    try {
      const response = await fetch(`/api/pets/${data.$id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update pet")
      }

      const updatedPet = await response.json()

      toast.success("Pet info updated successfully!")
      setLocalClient((prevClient) => {
        if (!prevClient) return prevClient

        return {
          ...prevClient,
          pets: prevClient.pets.map((pet) =>
            pet.$id === data.$id ? updatedPet : pet
          ),
        }
      })
      setSelectedPet((prevPet) => {
        if (!prevPet) return null

        return {
          ...prevPet,
          ...updatedPet,
          appointments: prevPet.appointments, // keep existing appointments
        }
      })

      setEditPet(false)
    } catch (error) {
      console.error("Error updating pet:", error)
      toast.error("Failed to update pet.")
    }
  }

  const handleDeletePet = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pet?"
    )
    if (!confirmDelete) return

    try {
      setIsDeleting(true) // blokkeert rendering tijdens delete

      const response = await fetch(`/api/pets/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete pet")
      }

      toast.success("Pet deleted successfully!")

      // Reset state
      setSelectedPet(null)
      setLocalClient((prevClient) => {
        if (!prevClient) return prevClient

        return {
          ...prevClient,
          pets: prevClient.pets.filter((pet) => pet.$id !== id),
        }
      })
    } catch (error) {
      console.error("Error deleting pet:", error)
      toast.error("Failed to delete pet.")
      setIsDeleting(false)
    }
  }

  if (isDeleting) {
    return (
      <div className="flex justify-center items-center p-5 text-gray-500">
        Deleting pet...
      </div>
    )
  }
  return (
    <div className="flex w-full">
      <InfoCard
        title="Selected Pet"
        action={
          <Button
            type="button"
            className={` ${
              darkmode
                ? "bg-white hover:bg-gray-100 text-gray-800"
                : "bg-gray-600 text-gray-200 hover:bg-gray-700"
            }  cursor-pointer `}
            onClick={() => handleToggleUpdatePet()}
          >
            {editPet ? <X size={18} /> : <Edit size={18} />}
          </Button>
        }
      >
        {editPet ? (
          <PetForm
            initialData={selectedPet ? selectedPet : undefined}
            onSubmit={handleUpdatePet}
            handleClose={handleToggleUpdatePet}
            handleDelete={handleDeletePet}
          />
        ) : (
          <div className="flex flex-row justify-between w-full mb-10">
            <div className="flex flex-col sm:flex-row w-full justify-between">
              <div className="space-y-2 w-full">
                <p className="text-sm font-medium">Name</p>
                <p className="text-base">{selectedPet?.name || "N/A"}</p>
                <p className="text-sm font-medium">Age</p>
                <p className="text-base">{selectedPet?.age || "N/A"}</p>
                <p className="text-sm font-medium">Type</p>
                <p className="text-base">{selectedPet?.type || "N/A"}</p>

                <p className="text-sm font-medium">Breed</p>
                <p className="text-base">{selectedPet?.breed || "N/A"}</p>
              </div>

              <div className="space-y-2 w-full">
                <p className="text-sm font-medium">Description</p>
                <p className="text-base">{selectedPet?.description || "N/A"}</p>

                <p className="text-sm font-medium">Notes</p>
                <p className="text-base">{selectedPet?.notes || "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </InfoCard>
    </div>
  )
}

export default SelectedPet
