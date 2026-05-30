import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Template from '@/models/Template';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const templates = await Template.find({ 
      source: 'user', 
      userId: session.user.id 
    }).sort({ createdAt: -1 });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Failed to fetch user templates:', error);
    return NextResponse.json({ error: 'Failed to fetch user templates' }, { status: 500 });
  }
}
