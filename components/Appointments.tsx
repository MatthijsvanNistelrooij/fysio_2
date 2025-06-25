import {
  addAppointmentAtom,
  darkmodeAtom,
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
    setAddAppointment(false)
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
      const next = !prev
      if (next) {
        // We're opening AddAppointment, so clear any selected appointment
        setSelectedAppointment(null)
      }
      return next
    })
  }

  const [darkmode] = useAtom(darkmodeAtom)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {darkmode ? (
          <Button
            onClick={() => handleToggleAddAppointment()}
            className={`bg-white hover:bg-[#e9edf3] text-gray-800 shadow-xl rounded-xl cursor-pointer w-full ${
              addAppointment ? "bg-[#e9edf3]" : ""
            }`}
          >
            Add Appointment
            <Plus />
            <CalendarRange size={14} className="mr-2" />
          </Button>
        ) : (
          <Button
            onClick={() => handleToggleAddAppointment()}
            className={`bg-gray-600 hover:bg-gray-800 text-gray-200 shadow-xl rounded-xl cursor-pointer w-full ${
              addAppointment ? "bg-gray-800 text-gray-200" : ""
            }`}
          >
            Add Appointment
            <Plus />
            <CalendarRange size={14} className="mr-2" />
          </Button>
        )}

        {selectedPet?.appointments.map((appointment: Appointment, index) =>
          !darkmode ? (
            <Button
              key={appointment.$id || index}
              onClick={() => handleSelectAppointment(appointment)}
              className={`bg-gray-600 hover:bg-gray-800 text-gray-200 shadow-xl border border-gray-700 rounded-xl cursor-pointer px-4 py-4 flex justify-between w-full
        ${
          !addAppointment && selectedAppointment?.$id === appointment.$id
            ? "bg-gray-800"
            : ""
        }`}
            >
              <span className="text-sm flex font-semibold gap-1">
                <CalendarRange size={14} className="m-0.5" />
                {new Date(appointment.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {getAppointmentTypeIcon(appointment.type)}
            </Button>
          ) : (
            <Button
              key={appointment.$id || index}
              onClick={() => handleSelectAppointment(appointment)}
              className={`bg-white hover:bg-[#e9edf3] text-gray-800 shadow-xl border border-gray-200 rounded-xl cursor-pointer px-4 py-4 flex justify-between w-full
        ${
          !addAppointment && selectedAppointment?.$id === appointment.$id
            ? "bg-[#e9edf3]"
            : ""
        }`}
            >
              <span className="text-sm flex font-semibold gap-1">
                <CalendarRange size={14} className="m-0.5" />
                {new Date(appointment.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {getAppointmentTypeIcon(appointment.type)}
            </Button>
          )
        )}
      </div>
    </>
  )
}

export default Appointments
