import { useEffect } from "react"
import { useAtom } from "jotai"

import { Client } from "@/lib/types"
import { clientsAtom, loadingAtom, userAtom } from "@/lib/store"

export const useClients = () => {
  const [, setClients] = useAtom(clientsAtom)
  const [, setLoading] = useAtom(loadingAtom)
  const [, setUser] = useAtom(userAtom)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const userRes = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
      })

      const currentUser = await userRes.json()
      setUser(currentUser)

      if (!currentUser?.$id) {
        setLoading(false)
        return
      }

      const clientsRes = await fetch(`/api/clients?userId=${currentUser.$id}`, {
        method: "GET",
        credentials: "include",
      })

      const data = await clientsRes.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedClients: Client[] = data.map((doc: any) => ({
        $id: doc.$id,
        userId: doc.userId,
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        address: doc.address,
        pets: doc.pets,
      }))

      setClients(formattedClients)
      setLoading(false)
    }

    fetchData()
  }, [])
}
