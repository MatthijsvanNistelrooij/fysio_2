import { editPetAtom, localClientAtom, selectedPetAtom } from "@/lib/store"
import { useAtom } from "jotai"
import React from "react"
import InfoCard from "./InfoCard"
import { Button } from "./ui/button"
import PetForm from "./PetForm"
import { Edit, X } from "lucide-react"
import { deletePet, updatePet } from "@/lib/actions/pet.actions"
import { Pet } from "@/lib/types"
import { toast } from "sonner"

const PetInfo = () => {
  const [, setLocalClient] = useAtom(localClientAtom)
  const [editPet, setEditPet] = useAtom(editPetAtom)

  const [selectedPet, setSelectedPet] = useAtom(selectedPetAtom)

  const handleToggleUpdatePet = () => {
    setEditPet((prev) => !prev)
  }

  const handleUpdatePet = async (data: Pet) => {
    try {
      await updatePet(data.$id, data)

      toast.success("Pet info updated successfully!")
      setLocalClient((prevClient) => {
        if (!prevClient) return prevClient

        return {
          ...prevClient,
          pets: prevClient.pets.map((pet) =>
            pet.$id === data.$id ? data : pet
          ),
        }
      })
      setSelectedPet((prevPet) => {
        if (!prevPet) return null

        return {
          ...prevPet,
          ...data, // spreads in the new fields (name, description, etc.)
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
      await deletePet(id)
      toast.success("Pet deleted successfully!")
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
    }
  }

  return (
    <>
      <InfoCard
        title="Selected Pet"
        action={
          <Button
            type="button"
            className="bg-white hover:bg-gray-100 cursor-pointer text-gray-800"
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
          <div className="flex justify-between w-full mb-10">
            <div className="space-y-2 w-full">
              <p className="text-sm font-medium">Name</p>
              <p className="text-base">{selectedPet?.name || "N/A"}</p>

              <p className="text-sm font-medium">Type</p>
              <p className="text-base">{selectedPet?.type || "N/A"}</p>

              <p className="text-sm font-medium">Breed</p>
              <p className="text-base">{selectedPet?.breed || "N/A"}</p>
            </div>

            <div className="space-y-2 w-full">
              <p className="text-sm font-medium">Age</p>
              <p className="text-base">{selectedPet?.age || "N/A"}</p>
              <p className="text-sm font-medium">Description</p>
              <p className="text-base">{selectedPet?.description || "N/A"}</p>

              <p className="text-sm font-medium">Notes</p>
              <p className="text-base">{selectedPet?.notes || "N/A"}</p>
            </div>
          </div>
        )}
      </InfoCard>
    </>
  )
}

export default PetInfo
