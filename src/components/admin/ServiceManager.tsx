"use client";

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Image as ImageIcon,
  X,
  Save,
  Clock,
  DollarSign,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';

import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image: string | null;
  features: string;
}

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    category: 'Uñas',
    image: '',
    features: '[]'
  });

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      setServices(servicesData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'services');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!currentService.name || !currentService.price || !currentService.duration) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const data = {
        name: currentService.name,
        description: currentService.description || '',
        price: parseFloat(currentService.price.toString()),
        duration: parseInt(currentService.duration.toString()),
        category: currentService.category || 'Uñas',
        image: currentService.image || '',
        features: currentService.features || '[]',
        updatedAt: serverTimestamp(),
      };

      if (currentService.id) {
        await updateDoc(doc(db, 'services', currentService.id), data);
        toast.success('Servicio actualizado');
      } else {
        await addDoc(collection(db, 'services'), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast.success('Servicio creado');
      }
      
      setIsEditing(false);
      setCurrentService({
        name: '',
        description: '',
        price: 0,
        duration: 0,
        category: 'Uñas',
        image: '',
        features: '[]'
      });
    } catch (error) {
      handleFirestoreError(error, currentService.id ? OperationType.UPDATE : OperationType.CREATE, 'services');
      toast.error('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'services', id));
      toast.success('Servicio eliminado');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'services');
      toast.error('Error al eliminar el servicio');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (service: Service) => {
    setCurrentService(service);
    setIsEditing(true);
  };

  const openCreate = () => {
    setCurrentService({
      name: '',
      description: '',
      price: 0,
      duration: 0,
      category: 'Uñas',
      image: '',
      features: '[]'
    });
    setIsEditing(true);
  };

  if (loading && services.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold">Gestión de Servicios</h2>
        <Button onClick={openCreate} className="rounded-full">
          <Plus className="mr-2 w-4 h-4" />
          Nuevo Servicio
        </Button>
      </div>

      {isEditing && (
        <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white">
          <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between p-6">
            <CardTitle className="text-lg font-bold">
              {currentService.id ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nombre del Servicio</Label>
                <Input 
                  value={currentService.name} 
                  onChange={(e) => setCurrentService({...currentService, name: e.target.value})}
                  placeholder="Ej. Manicura Rusa"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <select 
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  value={currentService.category}
                  onChange={(e) => setCurrentService({...currentService, category: e.target.value})}
                >
                  <option value="Uñas">Uñas</option>
                  <option value="Cejas">Cejas</option>
                  <option value="Pestañas">Pestañas</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Precio ($)</Label>
                <Input 
                  type="number"
                  value={currentService.price} 
                  onChange={(e) => setCurrentService({...currentService, price: parseFloat(e.target.value)})}
                  placeholder="0.00"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Duración (minutos)</Label>
                <Input 
                  type="number"
                  value={currentService.duration} 
                  onChange={(e) => setCurrentService({...currentService, duration: parseInt(e.target.value)})}
                  placeholder="60"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input 
                value={currentService.description} 
                onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                placeholder="Breve descripción del servicio..."
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>URL de la Imagen</Label>
              <div className="flex gap-4">
                <Input 
                  value={currentService.image || ''} 
                  onChange={(e) => setCurrentService({...currentService, image: e.target.value})}
                  placeholder="https://..."
                  className="rounded-xl flex-grow"
                />
                {currentService.image && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                    <Image src={currentService.image} alt="Preview" fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-full px-8">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="rounded-full px-8">
                <Save className="mr-2 w-4 h-4" />
                Guardar Servicio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="rounded-3xl border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all">
            <div className="relative h-40 w-full bg-muted">
              {service.image ? (
                <Image 
                  src={service.image} 
                  alt={service.name} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <ImageIcon className="w-10 h-10" />
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" onClick={() => openEdit(service)} className="rounded-full w-8 h-8">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(service.id)} className="rounded-full w-8 h-8">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">
                  {service.category}
                </span>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-lg">{service.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {service.duration} min
                </div>
                <div className="flex items-center gap-1 text-primary font-bold">
                  <DollarSign className="w-4 h-4" />
                  {service.price}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
