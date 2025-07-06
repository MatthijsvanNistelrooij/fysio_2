"use client"

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react"

import { User } from "@/lib/types"

interface UserContextProps {
  user: User | null
}

interface UserProviderProps {
  children: ReactNode
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/users", {
          method: "GET",
          credentials: "include",
        })

        if (!res.ok) {
          throw new Error("Failed to fetch user")
        }

        const currentUser = await res.json()
        setUser(currentUser)
      } catch (err) {
        console.error("Could not fetch user:", err)
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  )
}

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}
