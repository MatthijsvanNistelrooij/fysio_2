"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { darkmodeAtom, openCreateDialogAtom } from "@/lib/store"
import { DialogOverlay } from "@radix-ui/react-dialog"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import CreateClientForm from "../CreateClientForm"

const CreateClientDialog = () => {
  const [darkmode] = useAtom(darkmodeAtom)
  const [openCreateDialog, setOpenCreateDialog] = useAtom(openCreateDialogAtom)
  const [fontSize] = useState("12px")

  useEffect(() => {
    document.documentElement.style.setProperty("--global-font-size", fontSize)
  }, [fontSize])

  return (
    <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
      <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
      <DialogContent
        className={`p-10 ${
          darkmode
            ? "bg-gray-100 text-gray-800 border-none"
            : "bg-gray-800 text-gray-200 border-none"
        }`}
      >
        <hr />
        <DialogHeader className="mt-10">
          <DialogTitle>Create</DialogTitle>
        </DialogHeader>

          <CreateClientForm padding="5" />

      </DialogContent>
    </Dialog>
  )
}

export default CreateClientDialog
