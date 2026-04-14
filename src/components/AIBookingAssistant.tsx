'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleGenAI, Type } from "@google/genai";
import { format, addDays, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'booking_summary';
  data?: any;
}

export default function AIBookingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '¡Hola! Soy tu asistente de Alma_nailsbeauty. ¿En qué puedo ayudarte hoy? Puedes decirme algo como "Quiero reservar una manicura para el martes que viene".' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initChat = () => {
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    
    const getServicesTool = {
      name: "get_services",
      description: "Obtiene la lista de servicios disponibles con sus precios y duraciones.",
      parameters: {
        type: Type.OBJECT,
        properties: {},
      },
    };

    const getAvailableSlotsTool = {
      name: "get_available_slots",
      description: "Obtiene los horarios disponibles para una fecha específica.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          date: {
            type: Type.STRING,
            description: "La fecha en formato ISO (YYYY-MM-DD).",
          },
        },
        required: ["date"],
      },
    };

    const bookAppointmentTool = {
      name: "book_appointment",
      description: "Realiza la reserva final de la cita.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          clientName: { type: Type.STRING, description: "Nombre completo del cliente." },
          clientPhone: { type: Type.STRING, description: "Teléfono de contacto." },
          clientEmail: { type: Type.STRING, description: "Email (opcional)." },
          date: { type: Type.STRING, description: "Fecha de la cita (YYYY-MM-DD)." },
          startTime: { type: Type.STRING, description: "Hora de inicio (HH:mm)." },
          serviceId: { type: Type.STRING, description: "ID del servicio seleccionado." },
          notes: { type: Type.STRING, description: "Notas adicionales." },
        },
        required: ["clientName", "clientPhone", "date", "startTime", "serviceId"],
      },
    };

    chatRef.current = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `Eres un asistente amable y profesional para Alma_nailsbeauty, un salón de belleza premium. 
        Tu objetivo es ayudar a los clientes a reservar citas.
        
        Sigue estos pasos:
        1. Identifica el servicio que el cliente desea. Si no lo especifica, muestra las opciones disponibles usando get_services.
        2. Pregunta por la fecha y hora. Usa get_available_slots para confirmar disponibilidad (aunque por ahora siempre devolvemos los mismos slots estándar).
        3. Solicita los datos de contacto: nombre y teléfono (el email es opcional).
        4. Antes de confirmar, muestra un resumen de la reserva.
        5. Finalmente, usa book_appointment para guardar la reserva.
        
        Hoy es ${format(new Date(), 'PPPP', { locale: es })}.
        Sé conciso y elegante en tus respuestas.`,
        tools: [{ functionDeclarations: [getServicesTool, getAvailableSlotsTool, bookAppointmentTool] }],
      },
    });
  };

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      initChat();
    }
  }, [isOpen]);

  const handleToolCall = async (call: any) => {
    const { name, args } = call;
    
    if (name === 'get_services') {
      const res = await fetch('/api/services');
      const services = await res.json();
      return services;
    }
    
    if (name === 'get_available_slots') {
      // Mock slots as in the BookingForm
      return ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
    }
    
    if (name === 'book_appointment') {
      try {
        // We need the service duration to calculate endTime
        const servicesRes = await fetch('/api/services');
        const services = await servicesRes.json();
        const service = services.find((s: any) => s.id === args.serviceId);
        
        if (!service) throw new Error('Servicio no encontrado');

        const [hours, minutes] = args.startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + service.duration;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...args,
            endTime,
            date: new Date(args.date).toISOString(),
          }),
        });

        if (res.ok) {
          return { success: true, message: "Reserva confirmada con éxito." };
        } else {
          return { success: false, message: "Error al procesar la reserva." };
        }
      } catch (error) {
        return { success: false, message: "Error interno." };
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response = await chatRef.current.sendMessage({ message: input });
      
      while (response.functionCalls) {
        const toolResults = [];
        for (const call of response.functionCalls) {
          const result = await handleToolCall(call);
          toolResults.push({
            functionResponse: {
              name: call.name,
              response: result,
              id: call.id
            }
          });
        }
        
        response = await chatRef.current.sendMessage({
          message: {
            role: 'tool',
            parts: toolResults
          },
        });
      }

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.text || 'Entendido. ¿Hay algo más en lo que pueda ayudarte?' 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      toast.error('Lo siento, hubo un error al procesar tu mensaje.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50"
      >
        <Sparkles className="w-8 h-8" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl z-50 flex flex-col overflow-hidden border border-primary/10"
          >
            {/* Header */}
            <div className="bg-primary p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Asistente Alma</h3>
                  <p className="text-xs opacity-80">En línea ahora</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-4 bg-muted/10"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-foreground shadow-sm border border-primary/5 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-primary/5">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="rounded-full h-12 px-6 border-primary/10 focus-visible:ring-primary"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="rounded-full w-12 h-12 p-0 shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
