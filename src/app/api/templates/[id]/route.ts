import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Template from '@/models/Template';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    // params is a promise in next 15
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const template = await Template.findById(id);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Failed to fetch template:', error);
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
  }
}
