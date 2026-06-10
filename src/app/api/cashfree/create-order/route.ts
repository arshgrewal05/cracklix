
import { NextResponse } from 'next/server';
import { Cashfree } from 'cashfree-pg';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * @fileOverview Audited Cashfree Order Creation Node.
 * UPDATED: Strictly anchors return_url to the Vercel production domain.
 */

const clientId = process.env.CASHFREE_CLIENT_ID;
const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
const env = process.env.CASHFREE_ENV || 'production';

// Initialize SDK
Cashfree.XClientId = clientId!;
Cashfree.XClientSecret = clientSecret!;
Cashfree.XEnvironment = (env === 'production' || clientSecret?.includes('_prod_')) 
  ? Cashfree.Environment.PRODUCTION 
  : Cashfree.Environment.SANDBOX;

export async function POST(req: Request) {
  try {
    const { planId, userId, origin } = await req.json();
    const { firestore: db } = initializeFirebase();

    console.log(`[CASHFREE_AUDIT] Creating order for User: ${userId}, Plan: ${planId}`);

    if (!userId || !planId) {
      return NextResponse.json({ error: 'Missing mandatory session data.' }, { status: 400 });
    }

    const planSnap = await getDoc(doc(db, "passes", planId));
    if (!planSnap.exists()) {
      console.error(`[CASHFREE_AUDIT] Plan ${planId} missing in registry.`);
      return NextResponse.json({ error: 'Invalid Pass Node.' }, { status: 404 });
    }
    const planData = planSnap.data();
    const amount = Number(planData.price);

    if (amount <= 0) {
      return NextResponse.json({ error: 'Direct purchase of Free node is blocked.' }, { status: 400 });
    }

    const userSnap = await getDoc(doc(db, "users", userId));
    const userData = userSnap.data();

    // VERCEL DOMAIN ANCHORING
    // Prioritize NEXT_PUBLIC_SITE_URL for return_url to ensure production domain usage
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin || new URL(req.url).origin;
    const baseOrigin = siteUrl.replace('http://', 'https://');
    const orderId = `order_${Date.now()}_${userId.slice(-4)}`;

    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: userId,
        customer_name: userData?.name || "Aspirant",
        customer_email: userData?.email || "student@cracklix.com",
        customer_phone: userData?.phone?.replace(/\D/g, '').slice(-10) || "9999999999",
      },
      order_meta: {
        // Return URL is now strictly anchored to the site URL
        return_url: `${baseOrigin}/payment/success?order_id={order_id}&plan=${encodeURIComponent(planData.name)}`,
      },
      order_note: `Elite Pass: ${planData.name}`,
    };

    console.log('[CASHFREE_AUDIT] Sending Payload with anchored domain:', baseOrigin);

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    
    console.log('[CASHFREE_AUDIT] Gateway Response:', response.data);

    return NextResponse.json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
      cf_order_id: response.data.cf_order_id,
      environment: env
    });
  } catch (error: any) {
    const errData = error?.response?.data || error;
    console.error('[CASHFREE_AUDIT_FAILURE]:', errData);
    return NextResponse.json({ 
      error: errData.message || 'Gateway failed to initialize.',
      details: errData
    }, { status: 500 });
  }
}
