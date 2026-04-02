import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Vercel serverless function export
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, phone, material, size } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize clients
    // Variables will be loaded automatically by Vercel from settings
    const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
    const resendKey = process.env.RESEND_API_KEY || 'placeholder-key';

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendKey);

    // 1. Insert Lead into Supabase DB
    const { data: leadData, error: dbError } = await supabase
      .from('leads')
      .insert([
        {
          name,
          phone,
          material_preference: material || 'Unknown',
          deck_size: size || 'Unknown',
          status: 'new',
        },
      ])
      .select();

    if (dbError) {
      console.error('Database Error:', dbError);
      // We log but continue, to attempt email notification even if DB fails
    }

    // 2. Automated Email Relay to Owner
    try {
      if (resendKey !== 'placeholder-key') {
         await resend.emails.send({
          from: 'leads@projectwooddecks.com',
          to: ['owner@projectwooddecks.com'], // Replace with actual owner email
          subject: `🎯 New Lead Alert: ${name} (${material} ${size} Deck)`,
          html: `
            <h2>New Quote Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Material:</strong> ${material}</p>
            <p><strong>Size:</strong> ${size}</p>
            <p><a href="tel:${phone}">Click here to call them now</a></p>
          `,
        });
      }
    } catch (emailError) {
      console.error('Email Relay Error:', emailError);
    }

    // 3. Customer Drip Campaign Trigger (Future implementation for phase 1)
    // Could send out the Welcome intro to the founder here if they provided an email.

    return res.status(200).json({ success: true, message: 'Lead captured successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
