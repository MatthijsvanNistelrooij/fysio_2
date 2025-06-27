"use client"
import { useClients } from "@/hooks/useClients"
import { clientsAtom, darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"
import React, { useEffect, useState } from "react"
import InfoCard from "@/components/InfoCard"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import AnimatedNumber from "@/components/AnimatedNumber"
import CustomContainer from "@/components/CustomContainer"

const COLORS = ["#6366F1", "#10B981", "#F59E0B"]

const Dashboard = () => {
  useClients()
  const [clients] = useAtom(clientsAtom)
  const [chartKey, setChartKey] = useState(0)
  const [darkmode] = useAtom(darkmodeAtom)

  const [pieData, setPieData] = useState([
    { name: "Clients", value: 0 },
    { name: "Pets", value: 0 },
    { name: "Appointments", value: 0 },
  ])

  const recalculateData = () => {
    const totalClients = clients?.length
    const totalPets = clients?.flatMap((c) => c.pets || []).length
    const totalAppointments = clients?.flatMap((c) =>
      (c.pets || []).flatMap((p) => p.appointments || [])
    ).length

    setPieData([
      { name: "Clients", value: totalClients || 0 },
      { name: "Pets", value: totalPets || 0 },
      { name: "Appointments", value: totalAppointments || 0 },
    ])
    setChartKey((prev) => prev + 1) // Triggers re-render
  }

  const isReady = clients && clients.length > 0

  useEffect(() => {
    if (isReady) {
      recalculateData()
    }
  }, [isReady])

  return (
    <CustomContainer>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pieData.map((item) => (
          <InfoCard key={item.name} title={item.name}>
            <p className="text-5xl font-semibold">
              <AnimatedNumber number={item.value} />
            </p>
          </InfoCard>
        ))}

        <div className="col-span-1 md:col-span-3">
          <InfoCard
            title="Overview"
            action={
              <Button
                onClick={recalculateData}
                className={` ${
                  darkmode
                    ? "bg-white hover:bg-gray-100 text-gray-800"
                    : "bg-gray-600 text-gray-200 hover:bg-gray-700"
                }  cursor-pointer `}
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
            }
          >
            <div className="w-full h-96">
              {isReady && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart key={chartKey}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </InfoCard>
        </div>
      </div>
    </CustomContainer>
  )
}

export default Dashboard
