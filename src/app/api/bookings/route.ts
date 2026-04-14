import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, clientPhone, clientEmail, date, startTime, endTime, serviceId, notes } = body;

    const appointment = await prisma.appointment.create({
      data: {
        clientName,
        clientPhone,
        clientEmail,
        date: new Date(date),
        startTime,
        endTime,
        serviceId,
        notes,
        status: 'pending',
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Error creating appointment' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        service: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching appointments' }, { status: 500 });
  }
}
