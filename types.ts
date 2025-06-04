export interface Pet {
  $id: string
  name: string
  age?: string
  type: string
  description: string
  appointments: Appointment[]
  breed?: string
  notes?: string
  ownerId: string
  drawing: string
}

export interface Client {
  $id: string
  userId: string
  name: string
  email: string
  phone: string
  address: string
  pets: Pet[]
}
export interface User {
  $id: string
  email: string
  name: string
  fullName: string
  avatar: string
}

export interface Appointment {
  $id: string
  description: string
  treatment: string
  date: Date
  petId: string
  userId: string
}
