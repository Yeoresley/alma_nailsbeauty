"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Calendar, Clock, ShieldCheck, Star, ArrowRight, Instagram, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-primary/20 text-primary text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                <span>Experiencia de Belleza Premium</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-8xl font-heading font-bold tracking-tight leading-[1.1]"
              >
                Realza tu <span className="text-primary italic">Esencia</span>, <br />
                Define tu <span className="relative inline-block">
                  Estilo
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="absolute bottom-2 left-0 h-3 bg-primary/20 -z-10" 
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              >
                Especialistas en manicura rusa, diseño de cejas y extensiones de pestañas. 
                Donde la elegancia se encuentra con la perfección técnica.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <Button asChild size="lg" className="rounded-full px-10 py-7 text-lg shadow-xl shadow-primary/20 group">
                  <Link href="/reservar">
                    Agendar Cita
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-10 py-7 text-lg border-primary/20 hover:bg-primary/5">
                  <Link href="/servicios">Ver Servicios</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <FeatureCard 
                icon={ShieldCheck}
                title="Calidad Garantizada"
                description="Utilizamos productos de alta gama y técnicas avanzadas para resultados duraderos."
              />
              <FeatureCard 
                icon={Clock}
                title="Puntualidad"
                description="Respetamos tu tiempo. Sistema de citas optimizado para evitar esperas innecesarias."
              />
              <FeatureCard 
                icon={Star}
                title="Atención Personalizada"
                description="Cada servicio es único. Diseñamos el look perfecto según tus facciones y estilo."
              />
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-heading font-bold">Nuestras Especialidades</h2>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Descubre nuestra selección de servicios diseñados para resaltar lo mejor de ti.
                </p>
              </div>
              <Button asChild variant="link" className="text-primary text-lg font-bold group">
                <Link href="/servicios" className="flex items-center">
                  Ver todos los servicios
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CategoryCard 
                title="Uñas"
                image="https://picsum.photos/seed/nails/800/1000"
                services={['Manicura Rusa', 'Soft Gel', 'Pedicura Spa']}
              />
              <CategoryCard 
                title="Cejas"
                image="https://picsum.photos/seed/brows/800/1000"
                services={['Diseño & Depilación', 'Laminado', 'Henna']}
              />
              <CategoryCard 
                title="Pestañas"
                image="https://picsum.photos/seed/lashes/800/1000"
                services={['Lifting', 'Extensiones Clásicas', 'Volumen Ruso']}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Sparkles className="absolute top-10 left-10 w-20 h-20" />
                <Sparkles className="absolute bottom-10 right-10 w-32 h-32" />
              </div>
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-6xl font-heading font-bold">¿Lista para brillar?</h2>
                <p className="text-xl opacity-90 leading-relaxed">
                  No esperes más para consentirte. Agenda tu cita hoy mismo y vive la experiencia Alma_nailsbeauty.
                </p>
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-12 py-8 text-xl font-bold shadow-2xl">
                  <Link href="/reservar">Agendar mi Cita en Alma_nailsbeauty</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-white shadow-sm border border-muted flex flex-col items-center text-center space-y-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-heading font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function CategoryCard({ title, image, services }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer"
    >
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-8 space-y-4">
        <h3 className="text-4xl font-heading font-bold text-white">{title}</h3>
        <ul className="flex flex-wrap gap-2">
          {services.map((s: string) => (
            <li key={s} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/30">
              {s}
            </li>
          ))}
        </ul>
        <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button asChild variant="secondary" className="rounded-full w-full">
            <Link href="/servicios">Ver Detalles</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
