'use client';
import { useState } from 'react';

export default function DepositPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: 'DUMMY-LEAD-ID',
          amount: 500,
          projectName: 'Premium Cedar Deck Build'
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background: 'var(--bg-cream)'}}>
      <div style={{background:'var(--surface-container-highest)', padding:'3rem', borderRadius:'1rem', maxWidth:'500px', width:'100%', textAlign: 'center'}}>
        <h1 style={{fontFamily:'var(--font-serif)', color:'var(--primary)', marginBottom:'1rem'}}>Secure Your Build Schedule</h1>
        <p style={{marginBottom:'2rem', color:'rgba(111, 67, 21, 0.8)', fontSize: '1.1rem'}}>A refundable $500 deposit is required to lock in your master quote and begin the material sourcing process. Flexible financing is available upon checkout.</p>
        <button onClick={handleCheckout} style={{width:'100%', background:'var(--primary)', color:'var(--on-primary)', padding:'1.25rem', borderRadius:'2rem', border:'none', fontSize:'1.125rem', fontWeight:'700', cursor:'pointer'}} disabled={loading}>
          {loading ? 'Processing...' : 'Pay Deposit Securely'}
        </button>
      </div>
    </div>
  )
}
