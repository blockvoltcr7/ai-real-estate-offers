import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { offersTable } from "@/server/db/schema";
import { db } from "@/server/db";

// Helper function to check authentication
function checkAuth() {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return userId;
}

// GET all offers for the authenticated user
export async function GET() {
  const userId = checkAuth();
  if (userId instanceof NextResponse) return userId;

  const offers = await db
    .select()
    .from(offersTable)
    .where(eq(offersTable.userId, userId));

  return NextResponse.json(offers);
}

// POST to create a new offer
export async function POST(request: Request) {
  const userId = checkAuth();
  if (userId instanceof NextResponse) return userId;

  const body = await request.json();
  const { clientName, clientAddress } = body; // Added clientName and clientAddress

  if (!clientName || !clientAddress) {
    // Updated validation to include new fields
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const newOffer = await db
    .insert(offersTable)
    .values({
      userId,
      clientName,
      clientAddress,
    })
    .returning();

  return NextResponse.json(newOffer[0], { status: 201 });
}

// PATCH to update an existing offer
export async function PATCH(request: Request) {
  const userId = checkAuth();
  if (userId instanceof NextResponse) return userId;

  // TODO: CHECK FOR AUTHORIZATION

  const body = await request.json();
  const { id, name, content, clientName, clientAddress } = body; // Added clientName and clientAddress

  if (!id || (!name && !content && !clientName && !clientAddress)) {
    // Updated validation
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const updatedOffer = await db
    .update(offersTable)
    .set({ content, clientName, clientAddress })
    .where(eq(offersTable.id, id))
    .returning();

  if (updatedOffer.length === 0) {
    return new NextResponse("Offer not found", { status: 404 });
  }

  return NextResponse.json(updatedOffer[0]);
}

// DELETE to remove an offer
export async function DELETE(request: Request) {
  const userId = checkAuth();
  if (userId instanceof NextResponse) return userId;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing offer ID", { status: 400 });
  }

  const deletedOffer = await db
    .delete(offersTable)
    .where(eq(offersTable.id, id))
    .returning();

  if (deletedOffer.length === 0) {
    return new NextResponse("Offer not found", { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
