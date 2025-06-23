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
import { Expand, MoreVertical } from "lucide-react"

const Pets = ({ client }: { client: Client }) => {
  const [localClient, setLocalClient] = useAtom(localClientAtom)
  const [, setAddPet] = useAtom(addPetAtom)
  const [selectedPet, setSelectedPet] = useAtom(selectedPetAtom)
  const [, setOpenAppointment] = useAtom(openAppointmentAtom)

  const handleSelectPet = (pet: Pet) => {
    setAddPet(false)
    setSelectedPet(pet)
  }

  useEffect(() => {
    if (client) {
      setLocalClient(client)
    }
  }, [client, setLocalClient])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {localClient?.pets.map((pet: Pet, index: number) => (
        <InfoCard
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
              {selectedPet?.$id === pet.$id ? <Expand /> : <MoreVertical />}
            </Button>
          }
        >
          <div
            className={`space-y-1 relative ${
              selectedPet?.$id === pet.$id ? "bg-[#e9edf3]" : "bg-white"
            } p-2`}
          >
            <p className="text-gray-800 font-semibold">Age: {pet.age}</p>
            <div className="text-gray-800 font-semibold">
              <div className="flex items-center gap-1 text-gray-800 font-semibold">
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
