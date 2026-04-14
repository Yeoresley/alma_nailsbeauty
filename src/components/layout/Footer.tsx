import Link from 'next/link';
import { Sparkles, Instagram, Facebook, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-heading font-bold">Alma_nailsbeauty</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Realzamos tu belleza natural con servicios premium de uñas, cejas y pestañas. 
              Experiencia personalizada en un ambiente elegante y relajante.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/alma_nailsbeauty/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background border flex items-center justify-center hover:text-primary hover:border-primary transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border flex items-center justify-center hover:text-primary hover:border-primary transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border flex items-center justify-center hover:text-primary hover:border-primary transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold mb-6">Explorar</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/servicios" className="text-muted-foreground hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link href="/reservar" className="text-muted-foreground hover:text-primary transition-colors">Agendar Cita</Link></li>
              <li><Link href="/admin/login" className="text-muted-foreground hover:text-primary transition-colors">Acceso Admin</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold mb-6">Servicios</h4>
            <ul className="space-y-4 text-sm">
              <li className="text-muted-foreground">Manicura & Pedicura</li>
              <li className="text-muted-foreground">Diseño de Cejas</li>
              <li className="text-muted-foreground">Extensiones de Pestañas</li>
              <li className="text-muted-foreground">Lifting de Pestañas</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Calle Elegancia #123, Ciudad Belleza</span>
              </li>
              <li className="flex gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>hola@almanailsbeauty.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Alma_nailsbeauty. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
