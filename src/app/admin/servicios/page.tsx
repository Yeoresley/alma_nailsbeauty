import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Scissors, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ServiceManager from '@/components/admin/ServiceManager';

export default function AdminServicesPage() {
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
          <Button variant="ghost" asChild className="justify-start rounded-xl">
            <Link href="/admin">
              <CalendarIcon className="mr-2 w-5 h-5" />
              Citas
            </Link>
          </Button>
          <Button variant="default" asChild className="justify-start rounded-xl">
            <Link href="/admin/servicios">
              <Scissors className="mr-2 w-5 h-5" />
              Servicios
            </Link>
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
        <ServiceManager />
      </main>
    </div>
  );
}
