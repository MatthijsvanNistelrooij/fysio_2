import {
  addAppointmentAtom,
  editAppointmentAtom,
  openAppointmentAtom,
  selectedAppointmentAtom,
  selectedPetAtom,
} from "@/lib/store"
import { Appointment } from "@/lib/types"
import { useAtom } from "jotai"
import {
  CalendarRange,
  Lightbulb,
  Plus,
  ShowerHead,
  Stethoscope,
  Thermometer,
  Zap,
} from "lucide-react"
import React from "react"
import { Button } from "./ui/button"

const Appointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useAtom(
    selectedAppointmentAtom
  )
  const [, setOpenAppointment] = useAtom(openAppointmentAtom)
  const [, setEditAppointment] = useAtom(editAppointmentAtom)
  const [selectedPet] = useAtom(selectedPetAtom)
  const [addAppointment, setAddAppointment] = useAtom(addAppointmentAtom)

  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment((prev) => {
      const isSame = prev?.$id === appointment.$id
      setOpenAppointment(!isSame)
      setEditAppointment(false)
      return isSame ? null : appointment
    })
  }

  function getAppointmentTypeIcon(type: string) {
    switch (type.toLowerCase()) {
      case "massage":
        return <Thermometer className="w-5 h-5 text-green-400" />
      case "hydrotherapy":
        return <ShowerHead className="w-5 h-5 text-blue-400" />
      case "chiropractic care":
        return <Stethoscope className="w-5 h-5 text-purple-400" />
      case "laser therapy":
        return <Lightbulb className="w-5 h-5 text-yellow-400" />
      case "shockwave therapy":
        return <Zap className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  const handleToggleAddAppointment = () => {
    setAddAppointment((prev) => {
      if (prev === true) {
        setSelectedAppointment(null)
      }
      return !prev
    })
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        <Button
          onClick={() => handleToggleAddAppointment()}
          className={`bg-white hover:bg-[#e9edf3] text-gray-800 shadow-xl cursor-pointer w-full ${
            addAppointment ? "bg-[#e9edf3]" : ""
          }`}
        >
          Add Appointment
          <Plus />
          <CalendarRange size={14} className="mr-2" />
        </Button>
        {selectedPet?.appointments.map((appointment: Appointment, index) => (
          <Button
            key={appointment.$id || index}
            onClick={() => {
              handleSelectAppointment(appointment)
              setAddAppointment(false)
            }}
            className={`bg-white text-center items-center px-4 py-4 shadow-xl border border-gray-200 text-gray-800 cursor-pointer hover:bg-[#e9edf3] flex justify-between ${
              !addAppointment && selectedAppointment?.$id === appointment.$id
                ? "bg-[#e9edf3]"
                : ""
            }`}
          >
            <span className={`text-sm flex font-semibold gap-1`}>
              <CalendarRange size={14} className="m-0.5" />
              {new Date(appointment.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {getAppointmentTypeIcon(appointment.type)}
          </Button>
        ))}
      </div>
    </>
  )
}

export default Appointments
