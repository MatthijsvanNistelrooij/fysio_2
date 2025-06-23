import { addPetAtom, selectedPetAtom } from "@/lib/store"
import { useAtom } from "jotai"
import React from "react"
import { Button } from "./ui/button"
import { Dog, Plus } from "lucide-react"
import AddPetForm from "./AddPetForm"
import { Client, Pet } from "@/lib/types"
import { addPetToClient, createPet } from "@/lib/actions/pet.actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import InfoCard from "./InfoCard"

const AddPet = ({ client }: { client: Client }) => {
  const [addPet, setAddPet] = useAtom(addPetAtom)
  const [, setSelectedPet] = useAtom(selectedPetAtom)
  const router = useRouter()

  const handleCreate = async (data: Pet) => {
    try {
      const petResponse = await createPet({
        ...data,
        ownerId: data.ownerId,
      })

      await addPetToClient(data.ownerId, petResponse.$id)

      toast.success("Pet added successfully!")
      setAddPet((prev) => !prev)
      setSelectedPet({
        ...data, // contains name, type, description, etc.
        ...petResponse, // contains $id and any metadata
      })
      router.refresh()
    } catch (error) {
      console.error("Error creating pet:", error)
      toast.error("Failed to create pet.")
    }
  }

  return (
    <div>
      {!addPet ? (
        <InfoCard>
          <Button
            onClick={() => setAddPet(true)}
            className="bg-white w-full hover:bg-[#e9edf3] text-gray-800 cursor-pointer"
          >
            Add Pet
            <Plus />
            <Dog />
          </Button>
        </InfoCard>
      ) : (
        <AddPetForm clientId={client.$id} onSubmit={handleCreate} />
      )}
    </div>
  )
}

export default AddPet
