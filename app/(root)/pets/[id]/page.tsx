import PetDetailsComponent from "@/components/PetDetailsComponent"
import { getAppointmentsByPetId } from "@/lib/appointment.actions"
import { getPetById } from "@/lib/pet.actions"
import { Appointment, Pet } from "@/types"
import { notFound } from "next/navigation"

const PetDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const awaitedParams = await params
  const id = awaitedParams.id

  if (!id) return notFound()

  const rawPet = await getPetById(id)

  const pet: Pet = {
    $id: rawPet?.$id || "",
    ownerId: rawPet?.ownerId,
    name: rawPet?.name,
    type: rawPet?.type,
    age: rawPet?.age,
    breed: rawPet?.breed,
    notes: rawPet?.notes,
    description: rawPet?.description,
    appointments: rawPet?.appointments ?? [],
    drawing: rawPet?.drawing
  }

  if (!pet) return notFound()

  const rawAppointments = await getAppointmentsByPetId(pet.$id)

  const appointments: Appointment[] = rawAppointments.map((doc) => ({
    $id: doc.$id,
    description: doc.description,
    treatment: doc.treatment,
    date: doc.date,
    petId: doc.petId,
    userId: doc.userId,
  }))

  return <PetDetailsComponent pet={pet} appointments={appointments} />
}

export default PetDetails
