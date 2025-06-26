import PetDetailsComponent from "@/components/PetDetailsComponent"
import { Appointment, Pet } from "@/lib/types"
import { notFound } from "next/navigation"

const PetDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const awaitedParams = await params
  const id = awaitedParams.id

  if (!id) return notFound()

  // Haal pet data op via fetch naar je API
  const petRes = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/pets?id=${id}`,
    {
      cache: "no-store",
    }
  )

  if (!petRes.ok) return notFound()

  const rawPet = await petRes.json()

  const pet: Pet = {
    $id: rawPet.$id || "",
    ownerId: rawPet.ownerId,
    name: rawPet.name,
    type: rawPet.type,
    age: rawPet.age,
    breed: rawPet.breed,
    notes: rawPet.notes,
    description: rawPet.description,
    appointments: rawPet.appointments ?? [],
    drawing: rawPet.drawing,
  }

  // Haal appointments via fetch op naar aparte endpoint (zorg dat die bestaat)
  const appointmentsRes = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/appointments/byPet?petId=${pet.$id}`,
    {
      cache: "no-store",
    }
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawAppointments: any[] = []
  if (appointmentsRes.ok) {
    rawAppointments = await appointmentsRes.json()
  }

  const appointments: Appointment[] = rawAppointments.map((doc) => ({
    $id: doc.$id,
    description: doc.description,
    treatment: doc.treatment,
    date: doc.date,
    petId: doc.petId,
    userId: doc.userId,
    type: doc.type,
  }))

  return <PetDetailsComponent pet={pet} appointments={appointments} />
}

export default PetDetails
