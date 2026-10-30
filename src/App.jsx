import { useCallback, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Briefcase, Clock, Facebook, Instagram, Mail, Menu, Phone, PlusCircle, ShieldCheck, Tag, Truck, X, Zap } from 'lucide-react';
import { BUSINESS } from './config.js';
import { FAQS, SERVICES } from './data.js';
import { whatsappUrl } from './lib.js';
import { Icon, TikTokIcon, WhatsAppIcon } from './icons.jsx';
import BookingModal from './BookingModal.jsx';
import logoImg from './assets/logo.jpg';

const NAV = [['Services', '#services'], ['How it works', '#how'], ['Pricing', '#pricing'], ['Business', '#business'], ['FAQ', '#faq'], ['Contact', '#contact']];

function Header({ onBook }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap bar">
        <a href="#top" className="brand" aria-label={`${BUSINESS.name} home`}>
          <img src={logoImg} alt={`${BUSINESS.name} Logo`} className="brand-logo" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '8px' }} />
          <span>{BUSINESS.name}</span>
        </a>
        <nav className="nav" aria-label="Main">
          {NAV.map(([t, h]) => <a key={h} href={h}>{t}</a>)}
        </nav>
        <button className="btn btn-red btn-sm hide-sm" onClick={() => onBook()}>Book a Delivery</button>
        <button className="icon-btn menu-btn" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Main">
          {NAV.map(([t, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>)}
          <button className="btn btn-red" onClick={() => { setOpen(false); onBook(); }}>Book a Delivery</button>
        </nav>
      )}
    </header>
  );
}

function FloatingActions() {
  return (
    <div className="float-top" aria-label="Quick contact">
      <a className="fab fab-wa" href={whatsappUrl('Hi Go Deliver! I have a question.')} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <WhatsAppIcon size={22} /><span>WhatsApp</span>
      </a>
      <a className="fab fab-call" href={`tel:${BUSINESS.phoneTel}`} aria-label={`Call us on ${BUSINESS.phoneDisplay}`}>
        <Phone size={20} aria-hidden="true" /><span>Call us</span>
      </a>
    </div>
  );
}

function Hero({ onBook }) {
  const [q, setQ] = useState({ service: '', pickup: '', dropoff: '' });
  const up = (k) => (e) => setQ({ ...q, [k]: e.target.value });
  return (
    <section className="hero on-dark" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1>Your City.<br />Our Delivery.</h1>
          <p className="lead">Personal and business deliveries, errands and pick-ups, handled by people who treat your items like their own.</p>
          <div className="hero-cta">
            <button className="btn btn-red btn-lg" onClick={() => onBook()}>Book a Delivery</button>
            <a className="btn btn-outline btn-lg" href="#services">Explore Our Services</a>
          </div>
        </div>
        <form className="quick" onSubmit={(e) => { e.preventDefault(); onBook(q); }} aria-labelledby="quick-title">
          <h2 id="quick-title">Start your request</h2>
          <label htmlFor="q-service">Service</label>
          <select id="q-service" value={q.service} onChange={up('service')}>
            <option value="">Choose a service…</option>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <label htmlFor="q-pickup">Pick-up</label>
          <input id="q-pickup" type="text" value={q.pickup} onChange={up('pickup')} placeholder="Where from?" autoComplete="off" />
          <label htmlFor="q-dropoff">Deliver to</label>
          <input id="q-dropoff" type="text" value={q.dropoff} onChange={up('dropoff')} placeholder="Where to?" autoComplete="off" />
          <button className="btn btn-red btn-block" type="submit">Continue <ArrowRight size={18} aria-hidden="true" /></button>
          <p className="quick-note">You confirm all details next. The final price is agreed with you first.</p>
        </form>
      </div>
    </section>
  );
}

const TRUST = [
  [Truck, 'Personal & business', 'One-off errands or regular runs'],
  [Zap, 'Fast & convenient', 'Book in minutes, on your phone'],
  [ShieldCheck, 'Handled with care', 'Reliable, professional service'],
  [Tag, 'Price agreed first', 'Confirmed before we collect'],
];

function Services({ onBook }) {
  return (
    <section className="section on-light" id="services">
      <div className="wrap">
        <div className="sec-head">
          <h2>Pick a service. We’ll take it from there.</h2>
          <p>Tap any service to start a booking with it already selected.</p>
        </div>
        <ul className="svc-grid">
          {SERVICES.map((s) => (
            <li key={s.id}>
              <button className="svc" onClick={() => onBook({ service: s.id })} aria-label={`Book ${s.title}`}>
                <span className="svc-top">
                  <span className="svc-icon"><Icon name={s.icon} size={26} /></span>
                  <span className="svc-go"><ArrowRight size={20} aria-hidden="true" /></span>
                </span>
                <span className="svc-title">{s.title}</span>
                <span className="svc-blurb">{s.blurb}</span>
                <span className="chips">{s.points.map((p) => <span key={p}>{p}</span>)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const STEPS = [
  ['Tell us what you need', 'Pick a service and fill in the short booking form.'],
  ['Check and send', 'Review your details, then send them on WhatsApp or by email.'],
  ['We confirm the price', 'We reply with the final price and timing. You say yes or adjust.'],
  ['We deliver', 'We collect, deliver and keep you in the loop by phone or WhatsApp.'],
];

function How() {
  return (
    <section className="section on-dark" id="how">
      <div className="wrap">
        <div className="sec-head"><h2>How it works</h2><p>Four simple steps from request to doorstep.</p></div>
        <ol className="steps">
          {STEPS.map(([t, d], i) => (
            <li key={t}><span className="step-n" aria-hidden="true">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pricing({ onBook }) {
  return (
    <section className="section on-light" id="pricing">
      <div className="wrap price-grid">
        <div>
          <p className="pm" aria-hidden="true">±</p>
          <h2>No fixed price lists. A fair price for your job.</h2>
          <p className="lead-dark">Every delivery is different, so your price moves up or down with the details. We confirm the final price with you on WhatsApp, by phone or by email before we collect anything.</p>
          <button className="btn btn-red" onClick={() => onBook()}>Get my price confirmed</button>
        </div>
        <div className="factors">
          <div className="factor down">
            <h3><ArrowDown size={20} aria-hidden="true" /> Usually lowers the price</h3>
            <ul><li>Short distance</li><li>Small, light items</li><li>Flexible timing</li><li>One pick-up, one drop-off</li></ul>
          </div>
          <div className="factor up">
            <h3><ArrowUp size={20} aria-hidden="true" /> Usually raises the price</h3>
            <ul><li>Longer distance</li><li>Large or heavy items</li><li>Express, same-hour requests</li><li>Several stops or waiting time</li></ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Business({ onBook }) {
  return (
    <section className="band" id="business">
      <div className="wrap band-grid">
        <div>
          <h2>Deliveries for your business</h2>
          <p>Send documents, parcels and supplies to your customers or between your branches. Tell us if you need regular runs and we will arrange it with you.</p>
        </div>
        <button className="btn btn-black btn-lg" onClick={() => onBook({ customerType: 'business' })}><Briefcase size={20} aria-hidden="true" /> Request a business delivery</button>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section on-dark" id="faq">
      <div className="wrap faq-wrap">
        <div className="sec-head"><h2>Questions, answered</h2><p>Can’t see yours? Message us and we’ll help.</p></div>
        <div className="faq">
          {FAQS.map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const s = BUSINESS.socials;
  return (
    <section className="section on-light" id="contact">
      <div className="wrap">
        <div className="sec-head"><h2>Talk to us</h2><p>Prefer to speak to a person? Reach us any of these ways.</p></div>
        <ul className="contact-grid">
          <li><a href={`tel:${BUSINESS.phoneTel}`} className="c-card"><Phone size={24} aria-hidden="true" /><strong>Call us</strong><span>{BUSINESS.phoneDisplay}</span></a></li>
          <li><a href={whatsappUrl('Hi Go Deliver!')} target="_blank" rel="noopener noreferrer" className="c-card wa"><WhatsAppIcon size={24} /><strong>WhatsApp</strong><span>{BUSINESS.phoneDisplay}</span></a></li>
          <li><a href={`mailto:${BUSINESS.email}`} className="c-card"><Mail size={24} aria-hidden="true" /><strong>Email</strong><span>{BUSINESS.email}</span></a></li>
          <li><div className="c-card static"><Clock size={24} aria-hidden="true" /><strong>Opening hours</strong><span>{BUSINESS.hours}</span></div></li>
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  const s = BUSINESS.socials;
  return (
    <footer className="site-footer on-dark">
      <div className="wrap foot-grid">
        <div>
          <a href="#top" className="brand">
            <img src={logoImg} alt={`${BUSINESS.name} Logo`} className="brand-logo" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '8px' }} />
            <span>{BUSINESS.name}</span>
          </a>
          <p className="foot-tag">{BUSINESS.tagline}</p>
        </div>
        <nav aria-label="Footer"><h3>Explore</h3>{NAV.slice(0, 5).map(([t, h]) => <a key={h} href={h}>{t}</a>)}</nav>
        <div>
          <h3>Follow us</h3>
          <div className="socials">
            <a href={s.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={20} /></a>
            <a href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
            <a href={s.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><TikTokIcon size={20} /></a>
          </div>
          <p className="foot-mail"><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></p>
        </div>
      </div>
      <div className="wrap legal">© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</div>
    </footer>
  );
}

export default function App() {
  const [booking, setBooking] = useState(null); // null = closed, object = open with prefill
  const book = useCallback((prefill = {}) => setBooking({ ...prefill, _k: Date.now() }), []);
  const close = useCallback(() => setBooking(null), []);
  const { _k, ...initial } = booking || {};
  return (
    <>
      <Header onBook={book} />
      <FloatingActions />
      <main>
        <Hero onBook={book} />
        <section className="trust on-dark" aria-label="Why Go Deliver">
          <ul className="wrap trust-grid">
            {TRUST.map(([I, t, d]) => <li key={t}><I size={24} aria-hidden="true" /><div><strong>{t}</strong><span>{d}</span></div></li>)}
          </ul>
        </section>
        <Services onBook={book} />
        <How />
        <Pricing onBook={book} />
        <Business onBook={book} />
        <Faq />
        <Contact />
      </main>
      <Footer />
      {booking && <BookingModal key={_k} initial={initial} onClose={close} />}
    </>
  );
}