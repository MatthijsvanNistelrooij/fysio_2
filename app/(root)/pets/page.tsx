"use client"
import React, { useEffect, useState } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"

export interface Pet {
  $id: string
  name: string
  type: string
  age?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointments: any[]
}

const Pets = () => {
  const [pets, setPets] = useState<Pet[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchPets = async () => {
      const res = await fetch("/api/pets", { cache: "no-store" })

      if (!res.ok) {
        console.error("Failed to fetch pets")
        return
      }

      const data = await res.json()

      const formattedPets = data.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc: any): Pet => ({
          $id: doc.$id,
          name: doc.name,
          age: doc.age,
          appointments: doc.appointments || [],
          type: doc.type || "",
        })
      )

      setPets(formattedPets)
    }

    fetchPets()
  }, [])

  const handleTableRowClick = (id: string) => {
    router.push(`/pets/${id}`)
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="main-container p-6 bg-white max-w-7xl w-full">
        <h1 className="text-xl font-bold mb-4">Pets</h1>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-bold">Name</TableHead>
              <TableHead className="text-black font-bold">Age</TableHead>
              <TableHead className="text-black font-bold">
                Appointments
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pets.map((pet) => (
              <TableRow
                key={pet.$id}
                onClick={() => handleTableRowClick(pet.$id)}
                className="hover:bg-gray-100 cursor-pointer"
              >
                <TableCell>{pet.name}</TableCell>
                <TableCell>{pet.age}</TableCell>
                <TableCell>{pet.appointments.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Pets
