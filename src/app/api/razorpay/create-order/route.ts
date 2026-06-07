
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

/**
 * @fileOverview Backend Node for Razorpay Order Creation.
 * FIXED: Added credential presence check and improved error logging.
 */

export async function POST(request: Request) {
  try {
    const { amount, planId } = await request.json();

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error('[RAZORPAY_CONFIG_ERR]: Missing API Keys in environment.');
      return NextResponse.json({ error: 'Gateway configuration error' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    if (amount === undefined || amount === null || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount (Min ₹1 required)' }, { status: 400 });
    }

    // Razorpay expects amount in paise (e.g. 1 INR = 100 paise)
    const options = {
      amount: Math.round(Number(amount) * 100), 
      currency: 'INR',
      receipt: `rcpt_${planId.slice(0, 15)}_${Date.now()}`.slice(0, 40),
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('[RAZORPAY_ORDER_ERR]:', error);
    return NextResponse.json({ error: error.message || 'Order generation failed' }, { status: 500 });
  }
}
