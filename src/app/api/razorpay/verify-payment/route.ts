
import { NextResponse } from 'next/server';

/**
 * @fileOverview Deprecated Verification Hub.
 * Razorpay has been removed from the platform.
 */
export async function POST() {
  return NextResponse.json({ error: 'Online payments are currently disabled.' }, { status: 404 });
}
