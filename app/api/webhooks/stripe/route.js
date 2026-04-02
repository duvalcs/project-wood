import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'placeholder_secret');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'placeholder_webhook_secret';

export async function POST(req) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
       event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } else {
       // Mock for local dev without secrets
       event = JSON.parse(payload);
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const leadId = session.metadata?.leadId;

    if (leadId) {
        // Update Supabase Database
        const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { error } = await supabase
        .from('leads')
        .update({ status: 'contracted', deposit_paid: true })
        .eq('id', leadId);
        
        if (error) console.error('Error updating DB:', error);
    }
  }

  return NextResponse.json({ received: true });
}
