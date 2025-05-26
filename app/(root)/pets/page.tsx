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
import { redirect } from "next/navigation"
import { getAllPets } from "@/lib/pet.actions"

export interface Pet {
  $id: string
  name: string
  type: string
  age?: string
  appointments: []
}

export interface Client {
  $id: string
  name: string
  email: string
  phone: string
  address: string
  pets: Pet[]
}

const Pets = () => {
  const [pets, setPets] = useState<Pet[]>([])

  console.log(pets)

  useEffect(() => {
    const fetchPets = async () => {
      const data = await getAllPets()

      // explicitly cast each document to your Client type
      const formattedPets = data.map(
        (doc): Pet => ({
          $id: doc.$id,
          name: doc.name,
          age: doc.age,
          appointments: doc.appointments,
          type: "",
        })
      )

      setPets(formattedPets)
    }

    fetchPets()
  }, [])

  const handleTableRowClick = (id: string) => {
    redirect(`/pets/${id}`)
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="main-container p-6 bg-white max-w-5xl w-full">
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
