
import { NextResponse } from 'next/server';
import { Cashfree } from 'cashfree-pg';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * @fileOverview Secure Cashfree Order Creation Node.
 * Handles server-side order generation for institutional pass purchases.
 */

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID!;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET!;
Cashfree.XEnvironment = process.env.CASHFREE_ENV === 'production' 
  ? Cashfree.Environment.PRODUCTION 
  : Cashfree.Environment.SANDBOX;

export async function POST(req: Request) {
  try {
    const { planId, userId } = await req.json();
    const { firestore: db } = initializeFirebase();

    if (!userId || !planId) {
      return NextResponse.json({ error: 'Missing mandatory session data.' }, { status: 400 });
    }

    // 1. Audit Plan Registry
    const planSnap = await getDoc(doc(db, "passes", planId));
    if (!planSnap.exists()) {
      return NextResponse.json({ error: 'Invalid Pass Node.' }, { status: 404 });
    }
    const planData = planSnap.data();

    // 2. Fetch User Metadata for Pre-fill
    const userSnap = await getDoc(doc(db, "users", userId));
    const userData = userSnap.data();

    // 3. Cashfree Order Request
    const request = {
      order_amount: planData.price,
      order_currency: "INR",
      order_id: `order_${Date.now()}_${userId.slice(-4)}`,
      customer_details: {
        customer_id: userId,
        customer_name: userData?.name || "Aspirant",
        customer_email: userData?.email || "student@cracklix.com",
        customer_phone: userData?.phone?.replace(/\D/g, '').slice(-10) || "9999999999",
      },
      order_meta: {
        return_url: `${new URL(req.url).origin}/payment/success?order_id={order_id}&plan=${encodeURIComponent(planData.name)}`,
      },
      order_note: `Purchase: ${planData.name} Elite Pass`,
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    
    return NextResponse.json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    });
  } catch (error: any) {
    console.error('[CASHFREE_ORDER_FAILURE]:', error?.response?.data || error);
    return NextResponse.json({ error: 'Gateway failed to initialize.' }, { status: 500 });
  }
}
