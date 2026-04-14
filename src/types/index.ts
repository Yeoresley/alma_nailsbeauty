export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  features: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  date: Date;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string | null;
  serviceId: string;
  service: Service;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessConfig {
  id: string;
  key: string;
  value: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
