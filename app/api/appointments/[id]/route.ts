import { NextRequest, NextResponse } from "next/server";
import type { Appointment } from "@/lib/types";
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "@/lib/appwrite/appointments";

type Params = { params: { id: string } };

// export async function GET(req: NextRequest, context: Params) {
//   const { id } = context.params;
//   const appointment = await getAppointmentById(id);

//   if (!appointment) {
//     return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
//   }

//   return NextResponse.json(appointment);
// }

export async function PUT(req: NextRequest, context: Params) {
  const { id } = context.params;
  const data: Appointment = await req.json();

  await updateAppointment(id, data);
  const updated = await getAppointmentById(id);

  if (!updated) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, context: Params) {
  const { id } = context.params;
  await deleteAppointment(id);
  return NextResponse.json({ message: "Appointment deleted successfully" });
}
