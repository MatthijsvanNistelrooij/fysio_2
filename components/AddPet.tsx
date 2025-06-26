import { addPetAtom, darkmodeAtom, selectedPetAtom } from "@/lib/store"
import { useAtom } from "jotai"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { Dog, Plus } from "lucide-react"
import AddPetForm from "./AddPetForm"
import { Client, Pet } from "@/lib/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import InfoCard from "./InfoCard"

const AddPet = ({ client }: { client: Client }) => {
  const [, setSelectedPet] = useAtom(selectedPetAtom)
  const [addPet, setAddPet] = useAtom(addPetAtom)
  const [, setIsLoading] = useState(false)
  const [darkmode] = useAtom(darkmodeAtom)

  const router = useRouter()

  const handleCreate = async (data: Partial<Pet>) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          ownerId: client.$id,
        }),
      })

      if (!res.ok) throw new Error("Failed to create pet")

      const pet = await res.json()
      setSelectedPet(pet)
      toast.success("Pet added successfully!", pet)
      router.refresh()
      // Hier kun je eventueel de pet in state zetten, of navigeren
    } catch (error) {
      console.error(error)
      toast.error("Failed to add pet.")
    } finally {
      setIsLoading(false)
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
