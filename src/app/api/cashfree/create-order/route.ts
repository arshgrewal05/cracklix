import { NextResponse } from 'next/server';
import { Cashfree } from 'cashfree-pg';
import { initializeFirebase } from '@/firebase/app';
import { doc, getDoc } from 'firebase/firestore';

/**
 * @fileOverview Hardened Cashfree Order Node v8.0.
 * DEFENSIVE: Comprehensive environment variable audit and payload validation.
 * STABILITY: Isolated logic to prevent build-time dynamic import failures.
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, userId, origin: clientOrigin } = body;
    
    const { firestore: db } = initializeFirebase();

    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    const env = process.env.CASHFREE_ENV || 'production';

    // Phase 1: Authentication Guard
    if (!clientId || !clientSecret) {
      console.error("[CASHFREE_CRITICAL]: Missing API credentials in environment.");
      return NextResponse.json({ 
        error: 'Payment Hub Configuration Error',
        details: 'API Keys not detected on server node.'
      }, { status: 500 });
    }

    // Phase 2: Gateway Configuration
    Cashfree.XClientId = clientId;
    Cashfree.XClientSecret = clientSecret;
    const isProd = env === 'production' || clientSecret.startsWith('cf_prod_');
    Cashfree.XEnvironment = isProd ? Cashfree.Environment.PRODUCTION : Cashfree.Environment.SANDBOX;

    // Phase 3: Payload Validation
    if (!userId || !planId) {
      return NextResponse.json({ error: 'Identity or Plan context missing.' }, { status: 400 });
    }

    // Phase 4: Registry Audit (Verify plan existence and price)
    const planSnap = await getDoc(doc(db, "passes", planId));
    if (!planSnap.exists()) {
      return NextResponse.json({ error: `Pass node '${planId}' not found in registry.` }, { status: 404 });
    }
    const planData = planSnap.data();
    const amount = Number(planData.price);

    if (amount <= 0) {
      return NextResponse.json({ error: 'Manual activation required for free pass nodes.' }, { status: 400 });
    }

    // Phase 5: Student Profile Audit
    const userSnap = await getDoc(doc(db, "users", userId));
    const userData = userSnap.data();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || clientOrigin || new URL(req.url).origin;
    const secureOrigin = siteUrl.replace('http://', 'https://');
    const orderId = `order_${Date.now()}_${userId.slice(-6)}`;

    const orderRequest = {
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
        return_url: `${secureOrigin}/payment/success?order_id={order_id}&plan=${encodeURIComponent(planData.id)}`,
        notify_url: `${secureOrigin}/api/cashfree/webhook`
      },
      order_note: `Elite Prep Pass: ${planData.name}`,
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);
    
    return NextResponse.json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
      cf_order_id: response.data.cf_order_id,
      environment: isProd ? 'production' : 'sandbox'
    });

  } catch (error: any) {
    const errorBody = error?.response?.data || error;
    console.error("[GATEWAY_ORDER_FAILURE]:", errorBody);
    return NextResponse.json({ 
      error: errorBody.message || 'Payment Hub connection timed out.',
      details: errorBody
    }, { status: 500 });
  }
}
