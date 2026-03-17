import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return null;
  return session;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, logoUrl, website, showInStrip, showInShowcase, displayOrder, active } = body;

  const sponsor = await prisma.sponsor.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(logoUrl !== undefined && { logoUrl }),
      ...(website !== undefined && { website: website || null }),
      ...(showInStrip !== undefined && { showInStrip }),
      ...(showInShowcase !== undefined && { showInShowcase }),
      ...(displayOrder !== undefined && { displayOrder }),
      ...(active !== undefined && { active }),
    },
  });

  return NextResponse.json(sponsor);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  await prisma.sponsor.delete({ where: { id } });

  return NextResponse.json({ message: 'Sponsor deleted' });
}
