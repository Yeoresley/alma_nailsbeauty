"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const steps = ['Servicio', 'Fecha y Hora', 'Tus Datos', 'Confirmación'];

const timeSlots = [
  '09:00', '10:30', '12:00', '14:00', '15:30', '17:00'
];

const defaultServicesFallback = [
  { id: '1', name: 'Manicura Rusa', price: 35, duration: 90, category: 'Uñas' },
  { id: '2', name: 'Soft Gel', price: 50, duration: 120, category: 'Uñas' },
  { id: '3', name: 'Lifting de Pestañas', price: 55, duration: 60, category: 'Pestañas' },
  { id: '4', name: 'Diseño de Cejas', price: 20, duration: 30, category: 'Cejas' },
];

export default function BookingForm() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<any[]>(defaultServicesFallback);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingServices, setFetchingServices] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (servicesData.length > 0) {
        setServices(servicesData);
      }
      setFetchingServices(false);
    }, (error) => {
      console.error('Firestore services error:', error);
      setFetchingServices(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    if (step === 0 && !selectedService) {
      toast.error('Por favor selecciona un servicio');
      return;
    }
    if (step === 1 && (!selectedDate || !selectedTime)) {
      toast.error('Por favor selecciona fecha y hora');
      return;
    }
    if (step === 2 && (!formData.name || !formData.phone)) {
      toast.error('Por favor completa tus datos básicos');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        clientName: formData.name,
        clientPhone: formData.phone,
        clientEmail: formData.email,
        date: Timestamp.fromDate(selectedDate!),
        startTime: selectedTime,
        endTime: calculateEndTime(selectedTime!, selectedService.duration),
        serviceId: selectedService.id,
        notes: formData.notes,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('¡Cita reservada con éxito!');
      setStep(3);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
      toast.error('Hubo un error al procesar tu reserva.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-4">
          {steps.map((s, idx) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= idx ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-muted-foreground border'
              }`}>
                {step > idx ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
              </div>
              <span className={`text-xs font-medium ${step >= idx ? 'text-primary' : 'text-muted-foreground'}`}>{s}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden border">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Booking Area */}
        <div className="lg:col-span-2">
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-heading font-bold">Selecciona un Servicio</h2>
              <div className="grid grid-cols-1 gap-4">
                {fetchingServices ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Cargando servicios...</p>
                  </div>
                ) : services.length > 0 ? (
                  services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all text-left ${
                        selectedService?.id === s.id 
                          ? 'border-primary bg-primary/5 shadow-lg' 
                          : 'border-white bg-white hover:border-primary/20'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{s.category}</span>
                        <h3 className="text-lg font-bold">{s.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration} min</span>
                          <span className="font-bold text-foreground">${s.price}</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedService?.id === s.id ? 'border-primary bg-primary' : 'border-muted'
                      }`}>
                        {selectedService?.id === s.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-3xl border border-dashed space-y-4">
                    <p className="text-muted-foreground">No pudimos cargar los servicios.</p>
                    <Button variant="outline" onClick={fetchServices} className="rounded-full">
                      Reintentar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-heading font-bold">Fecha y Hora</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-lg font-bold">1. Elige el día</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-3xl border bg-white shadow-xl p-4"
                    disabled={(date) => date < startOfToday()}
                    locale={es}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-lg font-bold">2. Elige la hora</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-4 rounded-2xl border-2 font-bold transition-all ${
                          selectedTime === time 
                            ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' 
                            : 'border-white bg-white hover:border-primary/20'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-heading font-bold">Tus Datos de Contacto</h2>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input 
                        id="name" 
                        placeholder="Ej. Ana García" 
                        className="pl-10 rounded-xl h-12" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        placeholder="Ej. +1 234 567 890" 
                        className="pl-10 rounded-xl h-12" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico (Opcional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="tu@email.com" 
                      className="pl-10 rounded-xl h-12" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="notes" 
                      placeholder="¿Algo que debamos saber?" 
                      className="pl-10 rounded-xl h-12" 
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12 space-y-6">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-heading font-bold">¡Reserva Confirmada!</h2>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                Gracias {formData.name}, tu cita para {selectedService?.name} ha sido agendada con éxito.
              </p>
              <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm mx-auto text-left space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-bold">{selectedDate && format(selectedDate, 'PPP', { locale: es })}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Hora:</span>
                  <span className="font-bold">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio:</span>
                  <span className="font-bold">{selectedService?.name}</span>
                </div>
              </div>
              <div className="pt-8">
                <Button asChild variant="outline" className="rounded-full px-8">
                  <Link href="/">Volver al Inicio</Link>
                </Button>
              </div>
            </div>
          )}

          {step < 3 && (
            <div className="mt-12 flex justify-between">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={step === 0}
                className="rounded-full px-8"
              >
                <ChevronLeft className="mr-2 w-5 h-5" />
                Atrás
              </Button>
              <Button 
                onClick={step === 2 ? handleSubmit : handleNext} 
                className="rounded-full px-10 shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading ? 'Procesando...' : step === 2 ? 'Confirmar Reserva' : 'Siguiente'}
                {step < 2 && <ChevronRight className="ml-2 w-5 h-5" />}
              </Button>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="rounded-[2.5rem] border-none shadow-2xl sticky top-24 overflow-hidden">
            <div className="bg-primary p-6 text-primary-foreground">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Tu Reserva
              </h3>
            </div>
            <CardContent className="p-8 space-y-6">
              {selectedService ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{selectedService.category}</p>
                      <p className="text-lg font-bold">{selectedService.name}</p>
                    </div>
                    <p className="font-bold text-primary">${selectedService.price}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{selectedService.duration} min</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground italic text-sm">Ningún servicio seleccionado</p>
              )}

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Fecha</p>
                    <p className="text-sm font-bold">
                      {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'No seleccionada'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Hora</p>
                    <p className="text-sm font-bold">{selectedTime || 'No seleccionada'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Total:</span>
                  <span className="text-2xl font-bold text-primary">${selectedService?.price || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
