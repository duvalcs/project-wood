'use client';

import { useEffect, useRef, useState } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";

export default function Home() {
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const baContainerRef = useRef(null);
  const baWrapperRef = useRef(null);
  const baHandleRef = useRef(null);
  const baBeforeImgRef = useRef(null);
  
  const [quizStep, setQuizStep] = useState(1);
  const [quizState, setQuizState] = useState({ material: '', size: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Parallax + Sticky header logic + BA Slider Logic
  useEffect(() => {
    // initialize calendar
    (async function () {
      const cal = await getCalApi();
      cal("ui", {"styles":{"branding":{"brandColor":"#8B5A2B"}},"hideEventTypeDetails":false,"layout":"month_view"});
    })();

    // sticky header
    const header = document.getElementById('sticky-header');
    const handleHeader = () => {
      if (window.scrollY > 50) header.style.boxShadow = 'var(--shadow-soft)';
      else header.style.boxShadow = 'none';
    };
    window.addEventListener('scroll', handleHeader);

    // luxury slider
    const track = trackRef.current;
    const items = track ? track.querySelectorAll('.slider-item') : [];
    
    let updateSliderParams = () => {};
    if (track && items.length > 0) {
      updateSliderParams = () => {
        const trackCenter = track.getBoundingClientRect().left + (track.offsetWidth / 2);
        
        items.forEach((item) => {
          const card = item.querySelector('.slider-card');
          const rect = item.getBoundingClientRect();
          const itemCenter = rect.left + (rect.width / 2);
          
          const offset = (itemCenter - trackCenter) / (track.offsetWidth * 0.6);
          const clampedOffset = Math.max(-1, Math.min(1, offset));
          
          const rotateY = clampedOffset * 35;
          const scale = 1 - Math.abs(clampedOffset) * 0.15;
          const opacity = 1 - Math.abs(clampedOffset) * 0.6;
          const translateZ = Math.abs(clampedOffset) * -200;
          const titleOpacity = Math.abs(clampedOffset) < 0.2 ? 1 : 0;
          
          card.style.setProperty('--rotateY', `${rotateY}deg`);
          card.style.setProperty('--scale', scale);
          card.style.setProperty('--opacity', opacity);
          card.style.setProperty('--translateZ', `${translateZ}px`);
          card.style.setProperty('--title-opacity', titleOpacity);
        });

        const maxScroll = track.scrollWidth - track.clientWidth;
        const scrolledPercentage = (track.scrollLeft / maxScroll) * 100;
        if (fillRef.current) fillRef.current.style.width = `${Math.max(25, scrolledPercentage)}%`;
      };
      
      track.addEventListener('scroll', updateSliderParams);
      window.addEventListener('resize', updateSliderParams);
      updateSliderParams();
    }

    // Interactive Before & After Slider
    const baContainer = baContainerRef.current;
    const baWrapper = baWrapperRef.current;
    const baHandle = baHandleRef.current;
    const baBeforeImg = baBeforeImgRef.current;
    let isDragging = false;
    let updateBASlider = () => {};
    let onMouseMove = () => {};
    let onTouchMove = () => {};
    let anchorImage = () => {};

    if (baContainer && baWrapper && baHandle) {
        updateBASlider = (clientX) => {
            const rect = baContainer.getBoundingClientRect();
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;
            baWrapper.style.width = `${percent}%`;
            baHandle.style.left = `${percent}%`;
        };

        const onMouseDown = (e) => { isDragging = true; updateBASlider(e.clientX); };
        const onMouseUp = () => { isDragging = false; };
        onMouseMove = (e) => { if (isDragging) updateBASlider(e.clientX); };

        const onTouchStart = (e) => { isDragging = true; updateBASlider(e.touches[0].clientX); };
        const onTouchEnd = () => { isDragging = false; };
        onTouchMove = (e) => { 
            if(!isDragging) return;
            if(e.cancelable && (e.target === baHandle || e.target.closest('#ba-handle'))) e.preventDefault();
            updateBASlider(e.touches[0].clientX); 
        };

        baContainer.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);

        baContainer.addEventListener('touchstart', onTouchStart, {passive: true});
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('touchmove', onTouchMove, {passive: false});

        anchorImage = () => {
             if (baBeforeImg) baBeforeImg.style.width = `${baContainer.offsetWidth}px`;
        };
        window.addEventListener('resize', anchorImage);
        anchorImage();
    }

    return () => {
      window.removeEventListener('scroll', handleHeader);
      if (track) {
          track.removeEventListener('scroll', updateSliderParams);
          window.removeEventListener('resize', updateSliderParams);
      }
      window.removeEventListener('mouseup', () => { isDragging = false; });
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchend', () => { isDragging = false; });
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', anchorImage);
    }
  }, []);

  // Submit Lead
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const name = e.target['q-name'].value;
    const phone = e.target['q-phone'].value;

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          material: quizState.material,
          size: quizState.size
        })
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setQuizStep(4);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header id="sticky-header" className="header">
        <div className="header-container">
          <div className="logo-group">
            <span className="material-symbols-outlined logo-icon">carpenter</span>
            <h1 className="logo">Project Wood</h1>
          </div>
          <a href="tel:+15025550199" className="call-fab" aria-label="Call Now">
            <span className="material-symbols-outlined">call</span>
          </a>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-container">
          <div className="hero-image-block">
            <img src="/hero.png" alt="Family enjoying a custom wooden deck" className="hero-img" />
            <div className="hero-gradient"></div>
            <div className="hero-text-overlay">
              <h1 className="hero-title">Louisville’s Finest Artisanal Decks</h1>
              <p className="hero-subtitle">Handcrafted for families, built for generations.</p>
            </div>
          </div>
          <a href="#consultation" className="btn-secondary hero-cta">
            Book Free On-Site Consultation
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </section>

        <section className="process-sect" id="process">
          <h2 className="section-title">The <span className="title-accent">Worry-Free</span> Process</h2>
          <div className="process-timeline">
            <div className="process-step">
              <div className="step-num">1</div>
              <h3>Free Consult</h3>
              <p>We listen to your vision.</p>
            </div>
            <div className="process-step">
              <div className="step-num">2</div>
              <h3>Master Quote</h3>
              <p>No hidden materials fees.</p>
            </div>
            <div className="process-step">
              <div className="step-num">3</div>
              <h3>Artisanal Build</h3>
              <p>Clean & respectful.</p>
            </div>
          </div>
        </section>

        <section className="trust-sect">
          <div className="badge-card">
            <span className="material-symbols-outlined badge-icon">verified_user</span>
            <span className="badge-label">LICENSED</span>
          </div>
          <div className="badge-card">
            <span className="material-symbols-outlined badge-icon">security</span>
            <span className="badge-label">INSURED</span>
          </div>
          <div className="badge-card">
            <span className="material-symbols-outlined badge-icon">history</span>
            <span className="badge-label">10-YR WARRANTY</span>
          </div>
        </section>

        <section className="ba-sect">
          <h2 className="section-title">See The <span className="title-accent">Transformation</span></h2>
          <div className="ba-container" id="ba-slider" ref={baContainerRef}>
            <img src="/after.png" className="ba-image ba-after" alt="Beautiful new deck" draggable="false" />
            <div className="ba-before-wrapper" id="ba-before-wrapper" style={{width: '50%'}} ref={baWrapperRef}>
               <img src="/before.png" className="ba-image ba-before" alt="Rotting old deck" draggable="false" ref={baBeforeImgRef} />
            </div>
            <div className="ba-handle" id="ba-handle" style={{left: '50%'}} ref={baHandleRef}>
              <span className="material-symbols-outlined">sync_alt</span>
            </div>
          </div>
        </section>

        <section className="craftsmanship-sect" id="gallery">
          <h2 className="section-title">Master Woodwork <span className="title-accent">in Every Grain</span></h2>
          <div className="luxury-slider">
            <div className="slider-track" ref={trackRef}>
              <div className="slider-item">
                <div className="slider-card">
                  <img src="/grain.png" alt="Wood grain detail" />
                  <div className="slider-overlay">
                    <h3>Premium Materials</h3>
                    <p>Hand-selected cedar</p>
                  </div>
                </div>
              </div>
              <div className="slider-item">
                <div className="slider-card">
                  <img src="/slider2.png" alt="Carpenter precision" />
                  <div className="slider-overlay">
                    <h3>Precision Craftsmanship</h3>
                    <p>Built with intent</p>
                  </div>
                </div>
              </div>
              <div className="slider-item">
                <div className="slider-card">
                  <img src="/slider1.png" alt="Twilight deck" />
                  <div className="slider-overlay">
                    <h3>Atmospheric Integration</h3>
                    <p>Custom lighting solutions</p>
                  </div>
                </div>
              </div>
              <div className="slider-item">
                <div className="slider-card">
                  <img src="/hero.png" alt="Complete deck" />
                  <div className="slider-overlay">
                    <h3>Family Friendly</h3>
                    <p>A space for memories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="slider-progress">
            <div className="progress-bar">
              <div className="progress-fill" ref={fillRef}></div>
            </div>
          </div>
        </section>

        <section className="human-sect" id="about">
          <div className="bio-card">
            <img src="/founder.png" alt="Founder in flannel" className="bio-img" />
            <div className="bio-text">
              <h3>Meet the Craftsman</h3>
              <p>I&apos;m David, and building safe, beautiful decks for Louisville families is my life&apos;s work. I personally oversee every joint and stain on your property.</p>
            </div>
          </div>
          <div className="areas-card">
            <span className="material-symbols-outlined map-icon">map</span>
            <h3>Hyper-Local Service</h3>
            <p>Exclusively serving The Highlands, St. Matthews, Norton Commons, Prospect & Middletown.</p>
          </div>
        </section>

        <section className="testimonials-sect" id="reviews">
          <h2 className="section-title">What Your Neighbors Say</h2>
          <div className="testimonials-list">
            <div className="testimonial-card">
              <span className="material-symbols-outlined quote-mark">format_quote</span>
              <p className="quote-text">&quot;The best deck builder in Louisville! Project Wood treated us like family. Our new cedar deck is the talk of the block.&quot;</p>
              <div className="author-row">
                <div className="author-avatar bg-avatar-1">SM</div>
                <div className="author-info">
                  <p className="author-name">Sarah M.</p>
                  <p className="author-loc">Highlands Resident</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <span className="material-symbols-outlined quote-mark">format_quote</span>
              <p className="quote-text">&quot;Local craftsmen who actually care about the community. The attention to detail on the wood joints is incredible.&quot;</p>
              <div className="author-row">
                <div className="author-avatar bg-avatar-2">JW</div>
                <div className="author-info">
                  <p className="author-name">James W.</p>
                  <p className="author-loc">St. Matthews Local</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lead-sect" id="consultation">
          <div className="financing-banner">
            <span className="material-symbols-outlined">payments</span>
            <span><b>Flexible Financing Available</b> - Build Now, Pay Over Time</span>
          </div>
          <div className="lead-card">
            <h2 className="lead-title">Let’s Build Together</h2>
            <p className="lead-subtitle">Get a tailored quote for your community-focused project.</p>
            
            <form onSubmit={handleQuizSubmit} className="quiz-form">
              {quizStep === 1 && (
                <div className="quiz-step active-step">
                  <label>1. What material are you dreaming of?</label>
                  <div className="quiz-options">
                    {['Premium Cedar', 'Composite', 'Repair/Stain'].map(mat => (
                      <button key={mat} type="button" className="quiz-btn" onClick={() => { setQuizState({...quizState, material: mat}); setQuizStep(2); }}>
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {quizStep === 2 && (
                <div className="quiz-step active-step">
                  <label>2. Roughly how large?</label>
                  <div className="quiz-options">
                    {['Small / Standard', 'Medium Entertainment', 'Large / Wrap-Around'].map(size => (
                      <button key={size} type="button" className="quiz-btn" onClick={() => { setQuizState({...quizState, size: size}); setQuizStep(3); }}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {quizStep === 3 && (
                <div className="quiz-step active-step">
                  <label>3. Where should we send your quote?</label>
                  <div className="input-block mb-3">
                    <input type="text" placeholder="Full Name" required id="q-name" name="q-name" />
                  </div>
                  <div className="input-block mb-3">
                    <input type="tel" placeholder="(502) 555-0199" required id="q-phone" name="q-phone" />
                  </div>
                  <button type="submit" className="btn-submit" style={submitSuccess ? {background: 'var(--tertiary)', boxShadow: 'none'} : (isSubmitting ? {opacity: 0.7} : {})}>
                    {submitSuccess ? 'Quote Requested!' : (isSubmitting ? 'Submitting...' : 'Complete Request')}
                  </button>
                </div>
              )}
              {quizStep === 4 && (
                <div className="quiz-step active-step" style={{animation: 'fadeIn 0.4s ease-out forwards'}}>
                  <label>4. Schedule Your On-Site Tour</label>
                  <p style={{fontSize: '0.875rem', color: 'rgba(111,67,21,0.8)', marginBottom: '1rem'}}>Your quote request has been sent! Pick a time for David to stop by and assess the materials.</p>
                  <div style={{background: 'white', borderRadius: '12px', overflow:'hidden', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'}}>
                      <Cal 
                        calLink="john-doe-example/15min" 
                        style={{width:"100%",height:"400px",overflow:"scroll"}}
                        config={{layout: 'month_view'}}
                      />
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="main-footer">
        <div className="footer-logo">
          <span className="material-symbols-outlined">carpenter</span>
          <span className="footer-title">Project Wood Artisanal Decks</span>
        </div>
        <p className="footer-copy">© 2026 Project Wood Artisanal Decks. <br/><span className="version-badge">v0.1 beta (Next.js)</span></p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">License Info</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>

      <nav className="bottom-nav">
        <a href="#" className="nav-item active-nav">
          <span className="material-symbols-outlined nav-icon" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
          <span className="nav-label">Home</span>
        </a>
        <a href="#gallery" className="nav-item text-muted">
          <span className="material-symbols-outlined nav-icon">grid_view</span>
          <span className="nav-label">Gallery</span>
        </a>
        <a href="#reviews" className="nav-item text-muted">
          <span className="material-symbols-outlined nav-icon">verified</span>
          <span className="nav-label">Reviews</span>
        </a>
        <a href="#consultation" className="nav-item text-muted">
          <span className="material-symbols-outlined nav-icon">event_available</span>
          <span className="nav-label">Consult</span>
        </a>
      </nav>
    </>
  );
}
