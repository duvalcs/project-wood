'use client';
export default function SuccessPage() {
  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background: 'var(--bg-cream)'}}>
      <div style={{background:'var(--surface-container-highest)', padding:'3rem', borderRadius:'1rem', maxWidth:'500px', width:'100%', textAlign: 'center'}}>
        <span className="material-symbols-outlined" style={{fontSize: '4rem', color: 'var(--tertiary)', marginBottom: '1rem'}}>check_circle</span>
        <h1 style={{fontFamily:'var(--font-serif)', color:'var(--primary)', marginBottom:'1rem'}}>Deposit Received</h1>
        <p style={{marginBottom:'2rem', color:'rgba(111, 67, 21, 0.8)', fontSize: '1.1rem'}}>Thank you! Your project build schedule is now officially secured. David will be in touch shortly to finalize the materials delivery date.</p>
        <a href="/" style={{display: 'inline-block', background:'var(--primary)', color:'var(--on-primary)', padding:'1rem 2rem', borderRadius:'2rem', textDecoration: 'none', fontWeight:'bold'}}>Return Home</a>
      </div>
    </div>
  )
}
