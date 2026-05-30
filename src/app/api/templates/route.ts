import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Template from '@/models/Template';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type TemplateQuery = {
  $or?: Array<
    | { source: 'admin' }
    | { source: 'user'; isPublic: true; moderationStatus: 'approved' }
  >;
  $and?: TemplateQuery[];
  category?: string;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    await connectToDatabase();

    // Default to admin templates, or public approved user templates
    let query: TemplateQuery = {
      $or: [
        { source: 'admin' },
        { source: 'user', isPublic: true, moderationStatus: 'approved' }
      ]
    };

    if (category && category !== 'all') {
      query = { $and: [query, { category }] };
    }

    const templates = await Template.find(query).sort({ createdAt: -1 });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();

    if (session.user.plan !== 'pro') {
      const count = await Template.countDocuments({
        source: 'user',
        userId: session.user.id
      });
      if (count >= 3) {
        return NextResponse.json(
          { error: "Free plan limit reached (3 custom templates). Upgrade to Pro to create more templates." },
          { status: 403 }
        );
      }
    }

    const templateData = {
      ...body,
      source: 'user',
      userId: session.user.id,
      moderationStatus: body.isPublic ? 'pending' : 'approved',
    };

    // Make sure we clear out fields that shouldn't be set directly
    delete templateData._id;
    delete templateData.createdAt;
    delete templateData.updatedAt;

    const template = await Template.create(templateData);

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Failed to create user template:', error);
    return NextResponse.json({ error: 'Failed to create user template' }, { status: 500 });
  }
}
