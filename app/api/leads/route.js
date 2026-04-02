import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, phone, material, size } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
    const resendKey = process.env.RESEND_API_KEY || 'placeholder-key';

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendKey);

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
    }

    try {
      if (resendKey !== 'placeholder-key') {
         await resend.emails.send({
          from: 'leads@projectwooddecks.com',
          to: ['owner@projectwooddecks.com'], 
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

    return NextResponse.json({ success: true, message: 'Lead captured successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
