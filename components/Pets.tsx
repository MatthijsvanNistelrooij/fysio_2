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
    setSelectedPet((prev) => (prev?.$id === pet.$id ? null : pet))
  }

  useEffect(() => {
    if (client) {
      setLocalClient(client)
    }
  }, [client, setLocalClient])

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
              {selectedPet?.$id === pet.$id ? <Expand /> : <MoreVertical />}
            </Button>
          }
        >
          <div
            className={`space-y-1 rounded-md border relative ${
              selectedPet?.$id === pet.$id
                ? "bg-gray-100 border-blue-300"
                : "bg-white  border-gray-100 text-gray-800"
            } p-2`}
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
