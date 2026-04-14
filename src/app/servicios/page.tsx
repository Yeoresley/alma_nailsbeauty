"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const categories = [
  { id: 'nails', name: 'Uñas' },
  { id: 'brows', name: 'Cejas' },
  { id: 'lashes', name: 'Pestañas' },
];

const servicesData = {
  nails: [
    {
      id: '1',
      name: 'Manicura Rusa',
      description: 'Limpieza profunda de cutícula y esmaltado semipermanente.',
      price: 35,
      duration: 90,
      category: 'Uñas',
      features: ['Limpieza profunda', 'Esmaltado perfecto', 'Hidratación']
    },
    {
      id: '2',
      name: 'Soft Gel',
      description: 'Extensiones de gel flexibles y ligeras con acabado natural.',
      price: 50,
      duration: 120,
      category: 'Uñas',
      features: ['Largo personalizado', 'Acabado natural', 'Duración 3-4 semanas']
    },
    {
      id: '3',
      name: 'Pedicura Spa',
      description: 'Tratamiento completo para pies con exfoliación y masaje.',
      price: 45,
      duration: 60,
      category: 'Uñas',
      features: ['Exfoliación', 'Masaje relajante', 'Esmaltado semi']
    }
  ],
  brows: [
    {
      id: '4',
      name: 'Diseño & Depilación',
      description: 'Diseño personalizado según tu morfología facial.',
      price: 20,
      duration: 30,
      category: 'Cejas',
      features: ['Mapeo facial', 'Depilación con cera/hilo', 'Acabado limpio']
    },
    {
      id: '5',
      name: 'Laminado de Cejas',
      description: 'Efecto de cejas más pobladas y peinadas.',
      price: 45,
      duration: 45,
      category: 'Cejas',
      features: ['Peinado duradero', 'Nutrición', 'Tinte incluido']
    }
  ],
  lashes: [
    {
      id: '6',
      name: 'Lifting de Pestañas',
      description: 'Elevación y curvatura de tus pestañas naturales.',
      price: 55,
      duration: 60,
      category: 'Pestañas',
      features: ['Curvatura natural', 'Tinte negro intenso', 'Nutrición con Keratina']
    },
    {
      id: '7',
      name: 'Extensiones Clásicas',
      description: 'Efecto rímel natural, una extensión por cada pestaña.',
      price: 75,
      duration: 120,
      category: 'Pestañas',
      features: ['Look natural', 'Sin peso', 'Mirada abierta']
    },
    {
      id: '8',
      name: 'Volumen Ruso',
      description: 'Efecto glamuroso y tupido con abanicos hechos a mano.',
      price: 95,
      duration: 150,
      category: 'Pestañas',
      features: ['Máximo volumen', 'Efecto sombra', 'Ideal para eventos']
    }
  ]
};

export default function Services() {
  return (
    <>
      <Navbar />
      <div className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold">Nuestros Servicios</h1>
            <p className="text-xl text-muted-foreground">
              Ofrecemos tratamientos especializados con los más altos estándares de calidad y bioseguridad.
            </p>
          </motion.div>

          <Tabs defaultValue="nails" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-muted/50 p-1 rounded-full h-14">
                {categories.map((cat) => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="rounded-full px-8 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {Object.entries(servicesData).map(([key, services]) => (
              <TabsContent key={key} value={key}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.map((service, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="h-full flex flex-col rounded-[2rem] border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                        <CardHeader className="bg-muted/30 pb-8">
                          <div className="flex justify-between items-start mb-4">
                            <CardTitle className="text-2xl font-bold">{service.name}</CardTitle>
                            <span className="text-2xl font-bold text-primary">${service.price}</span>
                          </div>
                          <CardDescription className="text-base leading-relaxed">
                            {service.description}
                          </CardDescription>
                          <div className="flex items-center gap-2 mt-4 text-sm font-medium text-muted-foreground">
                            <span className="bg-white px-3 py-1 rounded-full border">{service.duration} min</span>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow p-8 space-y-6">
                          <ul className="space-y-3">
                            {service.features.map((feature, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <Check className="w-3 h-3 text-primary" />
                                </div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Button asChild className="w-full rounded-full py-6 group">
                            <Link href="/reservar">
                              Reservar este servicio
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Custom Request CTA */}
          <div className="mt-24 p-12 rounded-[3rem] bg-accent/30 border border-accent/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4">
              <h2 className="text-3xl font-heading font-bold">¿Buscas algo personalizado?</h2>
              <p className="text-muted-foreground">
                Si tienes una idea específica o necesitas un combo de servicios, contáctanos directamente por WhatsApp para una asesoría personalizada.
              </p>
            </div>
            <Button size="lg" variant="outline" className="rounded-full px-8 py-7 border-primary text-primary hover:bg-primary hover:text-white">
              Consultar por WhatsApp
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
