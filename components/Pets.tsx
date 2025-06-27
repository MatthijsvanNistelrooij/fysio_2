import {
  addPetAtom,
  darkmodeAtom,
  localClientAtom,
  openAppointmentAtom,
  selectedPetAtom,
} from "@/lib/store"
import { Client, Pet } from "@/lib/types"
import { useAtom } from "jotai"
import React, { useEffect } from "react"
import InfoCard from "./InfoCard"
import { Button } from "./ui/button"
import { CalendarRange, MoreVertical, Shrink } from "lucide-react"
import Image from "next/image"
import dog from "../public/dog_avatar.jpg"
import cat from "../public/cat_avatar.jpg"
import horse from "../public/horse_avatar.jpg"
type PetType = "Dog" | "Horse" | "Cat" | "Other"

const Pets = ({ client }: { client: Client }) => {
  const [localClient, setLocalClient] = useAtom(localClientAtom)
  const [, setAddPet] = useAtom(addPetAtom)
  const [selectedPet, setSelectedPet] = useAtom(selectedPetAtom)
  const [, setOpenAppointment] = useAtom(openAppointmentAtom)
  const [darkmode] = useAtom(darkmodeAtom)

  const handleSelectPet = (pet: Pet) => {
    setAddPet(false)
    setSelectedPet((prev) => (prev?.$id === pet.$id ? null : pet))
  }

  const getPetImage = (type: PetType) => {
    switch (type) {
      case "Dog":
        return dog
      case "Horse":
        return horse
      case "Cat":
        return cat
      default:
        return horse
    }
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
        <InfoCard key={pet.$id || index}>
          <div className={`flex justify-center gap-2 text-gray-800`}>
            <div
              className={`flex w-full justify-between space-y-1 rounded-md  p-2 ${getPetColorClass(
                pet.type
              )}`}
            >
              <div className="flex flex-col gap-2">
                <p className=" font-semibold">{pet.name}</p>
                <div className="font-semibold">
                  <div className="flex flex-wrap gap-1 items-center">
                    {pet.appointments?.slice(0, 4).map((_, i) => (
                      <CalendarRange key={i} size={14} />
                    ))}
                    {pet.appointments && pet.appointments.length > 4 && (
                      <span className="text-xs text-gray-600">
                        (+{pet.appointments.length - 4} more)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className=" h-14 w-14 rounded-full overflow-hidden bg-gray-700 shrink-0">
                <Image alt="Avatar" src={getPetImage(pet?.type as PetType)} />
              </div>
            </div>
            <div className="flex text-center">
              <Button
                className={` ${
                  darkmode
                    ? "bg-white hover:bg-gray-100 text-gray-800"
                    : "bg-gray-600 text-gray-200 hover:bg-gray-700"
                }  cursor-pointer `}
                onClick={() => {
                  handleSelectPet(pet)
                  setOpenAppointment(false)
                }}
              >
                {selectedPet?.$id === pet.$id ? <Shrink /> : <MoreVertical />}
              </Button>
            </div>
          </div>
        </InfoCard>
      ))}
    </div>
  )
}

export default Pets
