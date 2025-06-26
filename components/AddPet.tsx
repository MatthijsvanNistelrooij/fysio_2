import { addPetAtom, darkmodeAtom, selectedPetAtom } from "@/lib/store"
import { useAtom } from "jotai"
import React from "react"
import { Button } from "./ui/button"
import { Dog, Plus } from "lucide-react"
import AddPetForm from "./AddPetForm"
import { Client, Pet } from "@/lib/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import InfoCard from "./InfoCard"
import { addPetToClient, createPet } from "@/app/api/pets/route"

const AddPet = ({ client }: { client: Client }) => {
  const [addPet, setAddPet] = useAtom(addPetAtom)
  const [, setSelectedPet] = useAtom(selectedPetAtom)
  const [darkmode] = useAtom(darkmodeAtom)

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
            className={`${
              darkmode
                ? "bg-white hover:bg-[#e9edf3] cursor-pointer text-gray-800 border border-gray-200"
                : "bg-gray-700 cursor-pointer hover:bg-gray-700 text-gray-400 hover:text-gray-200"
            } "w-full" `}
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
