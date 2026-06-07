
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @fileOverview Institutional Razorpay Verification Hub v10.0.
 * Hardened: Domestic signature audit and automatic user registry update.
 */

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      planId
    } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || 'Ikrj9m0oFrwlW1peOzgq0Nrb';
    
    // 1. Signature Audit Hub (HMAC-SHA256)
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Security audit failed. Transaction rejected.' }, { status: 400 });
    }

    // 2. Access Synchronization Node
    const { firestore: db } = initializeFirebase();
    const userRef = doc(db, 'users', userId);
    const planRef = doc(db, 'passes', planId);
    
    const planSnap = await getDoc(planRef);
    if (!planSnap.exists()) throw new Error("Pass node missing in master registry.");
    const planData = planSnap.data();

    const duration = planData.durationDays || 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + duration);

    // Update User Registry
    await updateDoc(userRef, {
      status: planId,
      passExpiryDate: expiryDate.toISOString(),
      updatedAt: serverTimestamp()
    });

    // Log Transaction Audit
    await addDoc(collection(db, 'payments'), {
      userId,
      userEmail: (await getDoc(userRef)).data()?.email || 'N/A',
      planId,
      planName: planData.name,
      amount: planData.price,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'VERIFIED',
      createdAt: serverTimestamp()
    });

    // Create Subscription Hub Entry
    await addDoc(collection(db, 'subscriptions'), {
      userId,
      planId,
      planName: planData.name,
      status: 'active',
      startDate: serverTimestamp(),
      expiryDate: expiryDate.toISOString(),
      transactionId: razorpay_payment_id,
      verified: true
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[VERIFICATION_FAILURE]:', error);
    return NextResponse.json({ error: error.message || 'Verification failure.' }, { status: 500 });
  }
}
