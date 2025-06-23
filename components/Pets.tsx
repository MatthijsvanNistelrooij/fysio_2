import {
  addPetAtom,
  localClientAtom,
  openAppointmentAtom,
  selectedPetAtom,
} from "@/lib/store"
import { Client, Pet } from "@/lib/types"
import { useAtom } from "jotai"
import React, { useEffect } from "react"
import InfoCard from "./InfoCard"
import { Button } from "./ui/button"
import { MoreVertical, Shrink } from "lucide-react"

const Pets = ({ client }: { client: Client }) => {
  const [localClient, setLocalClient] = useAtom(localClientAtom)
  const [, setAddPet] = useAtom(addPetAtom)
  const [selectedPet, setSelectedPet] = useAtom(selectedPetAtom)
  const [, setOpenAppointment] = useAtom(openAppointmentAtom)

  const handleSelectPet = (pet: Pet) => {
    setAddPet(false)
    setSelectedPet((prev) => (prev?.$id === pet.$id ? null : pet))
  }

  useEffect(() => {
    if (client) {
      setLocalClient(client)
    }
  }, [client, setLocalClient])

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

  return (
    <div className="grid grid-cols-1 gap-3">
      {localClient?.pets.map((pet: Pet, index: number) => (
        <InfoCard
          active={selectedPet?.$id === pet.$id}
          title={pet.name}
          key={pet.$id || index}
          action={
            <Button
              className="bg-white hover:bg-gray-100 text-gray-800 cursor-pointer"
              onClick={() => {
                handleSelectPet(pet)
                setOpenAppointment(false)
              }}
            >
              {selectedPet?.$id === pet.$id ? <Shrink /> : <MoreVertical />}
            </Button>
          }
        >
          <div
            className={`space-y-1 rounded-md relative  p-2  ${getPetColorClass(
              pet.type
            )}`}
          >
            <p className=" font-semibold">Age: {pet.age}</p>
            <div className="font-semibold">
              <div className="flex items-center gap-1 font-semibold">
                Appointments: {pet?.appointments?.length}
              </div>
            </div>
          </div>
        </InfoCard>
      ))}
    </div>
  )
}

export default Pets
