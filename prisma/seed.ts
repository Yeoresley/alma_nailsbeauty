import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const services = [
    {
      name: 'Manicura Rusa',
      description: 'Limpieza profunda de cutícula y esmaltado semipermanente.',
      price: 35,
      duration: 90,
      category: 'Uñas',
      features: JSON.stringify(['Limpieza profunda', 'Esmaltado perfecto', 'Hidratación']),
    },
    {
      name: 'Soft Gel',
      description: 'Extensiones de gel flexibles y ligeras con acabado natural.',
      price: 50,
      duration: 120,
      category: 'Uñas',
      features: JSON.stringify(['Largo personalizado', 'Acabado natural', 'Duración 3-4 semanas']),
    },
    {
      name: 'Lifting de Pestañas',
      description: 'Elevación y curvatura de tus pestañas naturales.',
      price: 55,
      duration: 60,
      category: 'Pestañas',
      features: JSON.stringify(['Curvatura natural', 'Tinte negro intenso', 'Nutrición con Keratina']),
    },
    {
      name: 'Diseño de Cejas',
      description: 'Diseño personalizado según tu morfología facial.',
      price: 20,
      duration: 30,
      category: 'Cejas',
      features: JSON.stringify(['Mapeo facial', 'Depilación con cera/hilo', 'Acabado limpio']),
    },
  ];

  // Clear existing services
  await prisma.service.deleteMany();

  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
