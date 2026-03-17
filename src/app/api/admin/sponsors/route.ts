import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const sponsors = await prisma.sponsor.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return NextResponse.json(sponsors);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { name, logoUrl, website, showInStrip, showInShowcase, displayOrder } = body;

  if (!name || !logoUrl) {
    return NextResponse.json({ error: 'Name and logo URL are required' }, { status: 400 });
  }

  const sponsor = await prisma.sponsor.create({
    data: {
      name,
      logoUrl,
      website: website || null,
      showInStrip: showInStrip ?? true,
      showInShowcase: showInShowcase ?? true,
      displayOrder: displayOrder ?? 0,
      active: true,
    },
  });

  return NextResponse.json(sponsor, { status: 201 });
}
