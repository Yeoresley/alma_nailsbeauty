import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Scissors, 
  Settings, 
  LogOut, 
  Plus, 
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

async function getAppointments() {
  return await prisma.appointment.findMany({
    include: {
      service: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
}

export default async function AdminDashboard() {
  const appointments = await getAppointments();

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="flex flex-col gap-2">
          <Button variant="default" className="justify-start rounded-xl">
            <CalendarIcon className="mr-2 w-5 h-5" />
            Citas
          </Button>
          <Button variant="ghost" className="justify-start rounded-xl">
            <Scissors className="mr-2 w-5 h-5" />
            Servicios
          </Button>
          <Button variant="ghost" className="justify-start rounded-xl">
            <Settings className="mr-2 w-5 h-5" />
            Configuración
          </Button>
        </nav>

        <div className="mt-auto">
          <Button variant="ghost" asChild className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl">
            <Link href="/">
              <LogOut className="mr-2 w-5 h-5" />
              Salir
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-heading font-bold">Gestión de Citas</h1>
            <p className="text-muted-foreground">Bienvenida, aquí tienes el resumen de hoy.</p>
          </div>
          <Button className="rounded-full shadow-lg shadow-primary/20">
            <Plus className="mr-2 w-5 h-5" />
            Nueva Cita Manual
          </Button>
        </header>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total" value={stats.total.toString()} icon={CalendarIcon} color="bg-blue-500" />
            <StatCard title="Pendientes" value={stats.pending.toString()} icon={Clock} color="bg-yellow-500" />
            <StatCard title="Confirmadas" value={stats.confirmed.toString()} icon={CheckCircle2} color="bg-green-500" />
            <StatCard title="Canceladas" value={stats.cancelled.toString()} icon={XCircle} color="bg-red-500" />
          </div>

          {/* Appointments List */}
          <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
            <CardHeader className="border-b bg-white flex flex-row items-center justify-between space-y-0 p-6">
              <CardTitle className="text-xl font-bold">Próximas Citas</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar cliente..." className="pl-9 rounded-full h-9" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wider font-bold text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Servicio</th>
                      <th className="px-6 py-4">Fecha & Hora</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {apt.clientName.charAt(0)}
                            </div>
                            <span className="font-medium">{apt.clientName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{apt.service.name}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-medium">{format(new Date(apt.date), 'dd/MM/yyyy')}</p>
                            <p className="text-muted-foreground">{apt.startTime}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={apt.status === 'confirmed' ? 'default' : apt.status === 'pending' ? 'secondary' : 'destructive'} className="rounded-full">
                            {apt.status === 'confirmed' ? 'Confirmada' : apt.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="rounded-full">Gestionar</Button>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          No hay citas registradas aún.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="rounded-3xl border-none shadow-lg overflow-hidden">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
