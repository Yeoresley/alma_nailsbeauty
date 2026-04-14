import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('API GET /api/services called (Firestore)');
    
    // Create a promise that rejects after 8 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Firestore timeout')), 8000);
    });

    const querySnapshotPromise = getDocs(collection(db, 'services'));
    
    const querySnapshot = await Promise.race([querySnapshotPromise, timeoutPromise]) as any;
    
    const services = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('API GET /api/services success, count:', services.length);
    return NextResponse.json(services);
  } catch (error) {
    console.error('API GET /api/services error:', error);
    // Return fallback data if Firestore fails or times out
    return NextResponse.json([
      { id: '1', name: 'Manicura Rusa', price: 35, duration: 90, category: 'Uñas', features: '[]' },
      { id: '2', name: 'Soft Gel', price: 50, duration: 120, category: 'Uñas', features: '[]' },
    ]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, duration, category, image, features } = body;

    const docRef = await addDoc(collection(db, 'services'), {
      name,
      description,
      price: parseFloat(price),
      duration: parseInt(duration),
      category,
      image,
      features: typeof features === 'string' ? features : JSON.stringify(features),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('API Services POST error:', error);
    return NextResponse.json({ error: 'Error creating service' }, { status: 500 });
  }
}
