import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, duration, category, image, features } = body;

    const serviceRef = doc(db, 'services', id);
    await updateDoc(serviceRef, {
      name,
      description,
      price: parseFloat(price),
      duration: parseInt(duration),
      category,
      image,
      features: typeof features === 'string' ? features : JSON.stringify(features),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error('API Services PUT error:', error);
    return NextResponse.json({ error: 'Error updating service' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceRef = doc(db, 'services', id);
    await deleteDoc(serviceRef);
    return NextResponse.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('API Services DELETE error:', error);
    return NextResponse.json({ error: 'Error deleting service' }, { status: 500 });
  }
}
