import {
  editAppointmentAtom,
  localClientAtom,
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
  const [selectedAppointment, setSelectedAppointment] = useAtom(
    selectedAppointmentAtom
  )
  const [, setOpenAppointment] = useAtom(openAppointmentAtom)
  const [, setEditAppointment] = useAtom(editAppointmentAtom)
  const [selectedPet] = useAtom(selectedPetAtom)
  const [,] = useAtom(localClientAtom)

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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {selectedPet?.appointments.map((appointment: Appointment, index) => (
          <React.Fragment key={appointment.$id || index}>
            <InfoCard active={appointment.$id === selectedAppointment?.$id}>
              <div
                className="flex flex-row justify-between items-center cursor-pointer"
                onClick={() => handleSelectAppointment(appointment)}
              >
                <span className={`text-sm flex font-semibold gap-1 `}>
                  <CalendarRange size={14} />
                  {new Date(appointment.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <Button
                  className={`bg-white hover:bg-[#e9edf3] cursor-pointer text-gray-800 ${
                    appointment.$id === selectedAppointment?.$id
                      ? "bg-[#e9edf3] "
                      : "bg-white"
                  }`}
                >
                  {getAppointmentTypeIcon(appointment.type)}
                </Button>
              </div>
            </InfoCard>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}

export default Appointments
