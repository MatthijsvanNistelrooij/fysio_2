import {
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
  ShowerHead,
  Stethoscope,
  Thermometer,
  Zap,
} from "lucide-react"
import React from "react"
import InfoCard from "./InfoCard"
import { Button } from "./ui/button"

const Appointments = () => {
  const [, setEditAppointment] = useAtom(editAppointmentAtom)
  const [, setOpenAppointment] = useAtom(openAppointmentAtom)

  const [selectedAppointment, setSelectedAppointment] = useAtom(
    selectedAppointmentAtom
  )

  const [selectedPet] = useAtom(selectedPetAtom)
  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setOpenAppointment(true)
    setEditAppointment(false)
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

  return (
    <div className="flex flex-row gap-2">
      {selectedPet?.appointments.map((appointment: Appointment, index) => (
        <React.Fragment key={appointment.$id || index}>
          <InfoCard
            title={
              <div className="flex items-center gap-2">
                <span>
                  {new Date(appointment.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {getAppointmentTypeIcon(appointment.type)}
              </div>
            }
            action={
              <Button
                className={`bg-white hover:bg-gray-100 cursor-pointer text-gray-800 ${
                  appointment.$id === selectedAppointment?.$id
                    ? "bg-gray-300"
                    : "bg-white"
                }`}
                onClick={() => handleSelectAppointment(appointment)}
              >
                <CalendarRange size={14} />
              </Button>
            }
          >
            <div className="flex items-center gap-2">
              <span>
                {new Date(appointment.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {getAppointmentTypeIcon(appointment.type)}
            </div>
          </InfoCard>
        </React.Fragment>
      ))}
    </div>
  )
}

export default Appointments
