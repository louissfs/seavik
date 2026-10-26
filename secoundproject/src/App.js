import React, { useState } from 'react';
import './App.css';
import {
  Phone, Mail, Menu, X, ArrowRight, Send,
  FileText, CheckCircle2, AlertCircle
} from 'lucide-react';

// ==========================================
// EMAIL SENDING (EmailJS first, Web3Forms fallback)
// ==========================================
const PLACEHOLDER_KEY = "YOUR_ACCESS_KEY_HERE";
const WEB3FORMS_ACCESS_KEY = PLACEHOLDER_KEY;

async function sendWithWeb3Forms(values, accessKey) {
  if (!accessKey || accessKey === PLACEHOLDER_KEY) {
    console.warn("Add your Web3Forms access key to send email.");
    throw new Error("no-key");
  }
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New enquiry from ${values.name}`,
      from_name: "Seavik website",
      name: values.name,
      email: values.email,
      cargo_or_vessel: values.cargo,
      message: values.message,
    }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "send-failed");
}

const EMAILJS = {
  serviceId: "service_rsc8zh7",
  templateId: "template_pg7lljk",
  publicKey: "fo5LVgFVm0Nj7jDNc", // public keys are meant to be in frontend code
};

const emailjsReady = () =>
  Object.values(EMAILJS).every((v) => v && !v.startsWith("YOUR_"));

async function sendWithEmailJS(values) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS.serviceId,
      template_id: EMAILJS.templateId,
      user_id: EMAILJS.publicKey,
      template_params: {
        name: values.name.trim(),
        email: values.email.trim(),
        title: values.cargo.trim() || "General enquiry",
        message: values.message.trim() || "No additional notes.",
        time: new Date().toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    }),
  });
  if (!res.ok) {
    const reason = await res.text().catch(() => "");
    console.error("EmailJS error:", res.status, reason);
    throw new Error("send-failed");
  }
}

function sendEnquiry(values, accessKey) {
  return emailjsReady()
    ? sendWithEmailJS(values)
    : sendWithWeb3Forms(values, accessKey);
}

// ==========================================
// DATA
// ==========================================
const COMPANY = {
  name: 'SEAVIK LTD',
  tagline: 'Commercial vessel brokerage & offshore chartering desk.',
  email: 'ops@seavik.com',
  phone: '+44 7835 592674',
  companyNumber: '17453210',
  registeredIn: 'England and Wales',
  registeredOffice: '128 City Road, London EC1V 2NX, United Kingdom',
};

const IMG_FALLBACK = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';

const VESSELS = [
  {
    id: 'psv',
    name: 'Platform Supply Vessels (PSV)',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0Rt0P906YrE9AzJdmxg_K4m2VWXZlse6dKDJzKgJfwA&s=10',
    desc: 'Platform Supply Vessels serve as the logistical backbone of offshore energy operations. Engineered to transport vital cargo—including drilling fluids, bulk equipment, fuel, and potable water—between onshore supply bases and offshore rigs or production platforms, these vessels feature expansive, reinforced open deck areas and advanced cargo-handling systems built to sustain uninterrupted field operations.',
  },
  {
    id: 'ahts',
    name: 'Anchor Handling Tug Supply (AHTS) Vessels',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGm8W6NbvhrtNNqBH5HJMQXoX7ZV9UQO37AsMJC9cgbQ&s=10',
    desc: 'AHTS vessels are high-bollard-pull workhorses built for heavy-duty marine support, rig positioning, and deepwater mooring. Outfitted with high-capacity winches, robust towing gear, and dynamic positioning (DP) systems, they safely handle massive anchor deployment, rig towage, and field installation tasks in demanding, high-energy sea conditions.',
  },
  {
    id: 'dsv',
    name: 'Diving Support Vessels (DSV)',
    image: IMG_FALLBACK,
    desc: 'Purpose-built for subsea interventions, Diving Support Vessels facilitate complex underwater operations. Equipped with integrated surface-supplied and saturation diving systems, decompression chambers, and precision station-keeping, they enable commercial dive teams to safely execute subsea inspections, structural repairs, pipeline tie-ins, and subsea infrastructure installations.',
  },
  {
    id: 'seismic',
    name: 'Seismic Survey Vessels',
    image: IMG_FALLBACK,
    desc: 'Specialized for offshore geophysical exploration, seismic survey vessels map subsea geological formations to identify hydrocarbon reservoirs. They deploy arrays of acoustic sources and multi-kilometer hydrophone streamers to capture high-resolution 2D, 3D, and 4D seismic data across vast offshore licensing blocks.',
  },
  {
    id: 'floatel',
    name: 'Accommodation Vessels & Barges (Floatels)',
    image: IMG_FALLBACK,
    desc: 'Often termed "floatels," these marine units provide secure, full-service offshore living quarters during large-scale commissioning, maintenance, and decommissioning campaigns. Beyond high-capacity modular cabins, they house dedicated dining halls, medical facilities, recreation spaces, and integrated workshop areas to maintain workforce well-being and operational readiness offshore.',
  },
  {
    id: 'crane',
    name: 'Heavy-Lift Crane Vessels',
    image: IMG_FALLBACK,
    desc: 'Designed for ultra-heavy marine construction, crane vessels deploy high-capacity revolving or sheerleg cranes to lift, position, and decommission massive offshore assets. They play a critical role in the precise installation of topsides, jacket foundations, subsea templates, and offshore wind turbines in open-water environments.',
  },
  {
    id: 'ctv',
    name: 'Crew Transfer Vessels (CTV) / Fast Crew Boats',
    image: IMG_FALLBACK,
    desc: 'Engineered for speed, efficiency, and comfort, these fast-transit vessels provide safe personnel transfers between shore bases and offshore installations. Equipped with optimized hull forms and specialized motion-compensated gangways, they minimize transit times and deliver reliable crew rotations even in rough transit corridors.',
  },
];

const QUICK_TAGS = VESSELS.map((v) => v.name);

const CONTRACTS = [
  'BIMCO SUPPLYTIME 2017 (Offshore Support Vessels)',
  'BIMCO TOWCON / TOWHIRE 2021 (Ocean Towage & Tug Operations)',
  'BIMCO BARGEHIRE 2021 (Flat-Deck & Specialized Barges)',
  'BIMCO SALEFORM 2012 / SHIPSALE 22 (Sale & Purchase)',
];

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'services' | 'company'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);
  const [formError, setFormError] = useState(null);

  const today = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());

  // Switch page, then scroll to a section (or top)
  const go = (target, sectionId) => {
    setMobileMenuOpen(false);
    setPage(target);
    setTimeout(() => {
      const el = sectionId && document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const toggleTag = (tag) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const requestQuotation = (vessel) => {
    setSelectedTags((prev) => (prev.includes(vessel.name) ? prev : [...prev, vessel.name]));
    go('home', 'enquiry');
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    setFormError(null);

    const lines = [];
    if (selectedTags.length > 0) lines.push(`[Vessel Types / Tags]: ${selectedTags.join(', ')}`);
    if (phone.trim()) lines.push(`[Contact Telephone]: ${phone.trim()}`);
    if (notes.trim()) lines.push(`[Client Requirements & Notes]:\n${notes.trim()}`);

    const payload = {
      name,
      email,
      cargo: selectedTags.length > 0 ? selectedTags.join(' • ') : 'General Vessel Brokerage Enquiry',
      message: lines.length > 0 ? lines.join('\n\n') : 'No additional notes provided.',
    };

    try {
      await sendEnquiry(payload, WEB3FORMS_ACCESS_KEY);
      setSubmittedRef(`SVK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    } catch (err) {
      console.error('Enquiry dispatch failed:', err);
      setFormError(
        err && err.message === 'no-key'
          ? "Email sending isn't connected yet. Add your EmailJS or Web3Forms keys."
          : `That didn't send. Try again, or email ${COMPANY.email}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const navItems = [
    ['home', 'Home'],
    ['services', 'Vessel Services'],
    ['company', 'Company Info'],
  ];

  return (
    <div className="seavik-app">
      {/* NAVBAR */}
      <header className="navbar-seavik">
        <div className="seavik-container nav-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => go('home')}>
            <div>
              <div className="brand-title">{COMPANY.name}</div>
              <div className="brand-subtitle">Maritime Chartering &amp; Brokerage</div>
            </div>
          </div>

          <nav className="nav-links">
            {navItems.map(([key, label]) => (
              <button key={key} onClick={() => go(key)} className="nav-link-btn" style={page === key ? { fontWeight: 800 } : undefined}>
                {label}
              </button>
            ))}
            <button onClick={() => go('home', 'enquiry')} className="btn-marine">
              <span>Send an enquiry</span>
              <ArrowRight size={14} />
            </button>
          </nav>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-btn" aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-drawer">
            {navItems.map(([key, label]) => (
              <button key={key} onClick={() => go(key)} className="mobile-nav-item">{label}</button>
            ))}
            <button onClick={() => go('home', 'enquiry')} className="btn-marine" style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}>
              Send an enquiry
            </button>
          </div>
        )}
      </header>

      {/* ================= PAGE 1: HOME ================= */}
      {page === 'home' && (
        <>
          <section id="hero" className="hero-section">
            <div className="seavik-container hero-grid">
              <div>
                <div className="hero-pill">
                  <span className="pulsing-dot" />
                  <span className="hero-pill-category">Commercial Vessel Brokerage</span>
                </div>

                <h1 className="hero-title">
                  Maritime brokerage <br />
                  <span className="hero-title-accent">&amp; chartering</span>
                </h1>

                <p className="hero-lead">
                  Commercial vessel brokerage and chartering, handled from first enquiry to fixture.
                  Tell us about your open vessel, cargo parcel or project and we'll take it from there.
                </p>

                <div className="hero-highlights-card">
                  <div className="highlight-cell">
                    <span className="cell-num">03</span>
                    <div>
                      <strong className="cell-title">Specialized Desks</strong>
                      <span className="cell-desc">OSV, Cargo/Barges &amp; S&amp;P</span>
                    </div>
                  </div>
                  <div className="highlight-cell">
                    <span className="cell-num">100%</span>
                    <div>
                      <strong className="cell-title">Fixture Coverage</strong>
                      <span className="cell-desc">Enquiry to final recap &amp; delivery</span>
                    </div>
                  </div>
                  <div className="highlight-cell">
                    <span className="cell-num">&lt; 24h</span>
                    <div>
                      <strong className="cell-title">Broker Response</strong>
                      <span className="cell-desc">Full tonnage availability feedback</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ENQUIRY */}
          <section id="enquiry" className="enquiry-section">
            <div className="seavik-container">
              <div className="enquiry-grid">
                <div>
                  <div className="section-pill">
                    <span className="pulsing-dot" />
                    <span>DIRECT BROKER DESK</span>
                  </div>
                  <h2 className="enquiry-title">Send an enquiry</h2>
                  <p className="enquiry-lead">Tell us what needs moving</p>
                  <p className="enquiry-desc">
                    Your requirements are transmitted directly to our London commercial operations desk.
                    A broker will review vessel availability and reply within one business day. For urgent spot needs, our duty broker responds within 2 hours.
                  </p>

                  <div className="enquiry-contacts-box">
                    <a href={`mailto:${COMPANY.email}`} className="enquiry-contact-link">
                      <div className="contact-icon-wrapper"><Mail size={18} color="#0284c7" /></div>
                      <div><strong className="contact-main-val">{COMPANY.email}</strong></div>
                    </a>
                    <a href={`tel:${COMPANY.phone}`} className="enquiry-contact-link">
                      <div className="contact-icon-wrapper"><Phone size={18} color="#0284c7" /></div>
                      <div><strong className="contact-main-val">{COMPANY.phone}</strong></div>
                    </a>
                  </div>
                </div>

                <div>
                  <div className="enquiry-card">
                    <div className="enquiry-card-header">
                      <div>
                        <h3 className="enquiry-card-title">New enquiry</h3>
                        <span className="enquiry-card-date">{today}</span>
                      </div>
                    </div>

                    {submittedRef ? (
                      <div className="success-banner">
                        <CheckCircle2 size={40} color="#059669" />
                        <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#065f46', margin: '0.75rem 0 0.35rem 0' }}>
                          Enquiry Dispatched to {COMPANY.email}
                        </h4>
                        <p style={{ fontSize: '13.5px', color: '#047857', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                          Reference <strong>{submittedRef}</strong> has been logged in our chartering register. Our operations brokers have received your requirements and will contact you promptly.
                        </p>
                        <button
                          onClick={() => {
                            setSubmittedRef(null);
                            setName(''); setEmail(''); setPhone('');
                            setSelectedTags([]); setNotes('');
                          }}
                          className="btn-secondary"
                        >
                          Send another enquiry
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleEnquirySubmit}>
                        {formError && (
                          <div className="error-alert-box">
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                              <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <div style={{ fontSize: '12.5px', color: '#991b1b', lineHeight: 1.5 }}>
                                <strong>Transmission Notice:</strong> {formError}
                                <div style={{ marginTop: '0.5rem' }}>
                                  <a
                                    href={`mailto:${COMPANY.email}?subject=Charter Enquiry from ${encodeURIComponent(name || 'Charterer')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nScope: ${selectedTags.join(', ')}\n\nNotes:\n${notes}`)}`}
                                    className="mailto-fallback-link"
                                  >
                                    Click here to open direct email to {COMPANY.email}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                          <div>
                            <label className="input-label">Your name *</label>
                            <input type="text" required placeholder="e.g. Captain James Ward" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
                          </div>
                          <div>
                            <label className="input-label">Email address *</label>
                            <input type="email" required placeholder="e.g. chartering@operator.com" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
                          </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                          <label className="input-label">Telephone / WhatsApp (Optional)</label>
                          <input type="tel" placeholder="e.g. +44 7835 000000" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" />
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                          <label className="input-label">Quick select requirements</label>
                          <div className="quick-tags-container">
                            {QUICK_TAGS.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`tag-pill ${selectedTags.includes(tag) ? 'active' : ''}`}
                              >
                                <span>+ {tag}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                          <label className="input-label">Additional specifications &amp; notes</label>
                          <textarea
                            rows={3}
                            placeholder="Specify laycan dates, discharge ports, deck point loads, fuel terms or special DP requirements..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="form-input"
                          />
                        </div>

                        <button type="submit" disabled={submitting} className="btn-marine btn-marine-lg" style={{ width: '100%', justifyContent: 'center' }}>
                          <Send size={16} />
                          <span>{submitting ? 'Transmitting to ops@seavik.com...' : 'Send enquiry'}</span>
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '11.5px', color: '#64748b' }}>
                          Directly routed to <strong>{COMPANY.email}</strong>.
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ================= PAGE 2: VESSEL SERVICES ================= */}
      {page === 'services' && (
        <section id="what-we-do" className="desks-section">
          <div className="seavik-container">
            <div className="section-header-centered">
              <div className="section-pill">
                <span className="pulsing-dot" />
                <span>VESSEL SERVICES</span>
              </div>
              <h2 className="section-main-title">Vessel Services</h2>
              <p className="section-desc">
                The offshore and marine tonnage we charter and broker for owners, charterers and project developers.
              </p>
            </div>

            <div className="vessels-grid">
              {VESSELS.map((vessel) => (
                <div key={vessel.id} className="vessel-card">
                  <div className="vessel-img-wrapper">
                    <img
                      src={vessel.image}
                      alt={vessel.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMG_FALLBACK; }}
                      className="vessel-img"
                    />
                  </div>
                  <div className="vessel-card-body">
                    <h4 className="vessel-name">{vessel.name}</h4>
                    <p className="vessel-short-desc">{vessel.desc}</p>
                    <div className="vessel-card-actions">
                      <button onClick={() => requestQuotation(vessel)} className="btn-marine" style={{ width: '100%', justifyContent: 'center' }}>
                        <span>Request quotation</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= PAGE 3: COMPANY INFO ================= */}
      {page === 'company' && (
        <section id="about" className="about-section">
          <div className="seavik-container">
            <div className="about-grid">
              <div>
                <div className="section-pill">
                  <span className="pulsing-dot" />
                  <span>CORPORATE SHIPBROKING</span>
                </div>
                <h2 className="section-main-title">SEAVIK LTD</h2>
                <p className="section-desc" style={{ marginBottom: '1.5rem' }}>
                  Commercial vessel brokerage and offshore chartering desk. We connect vessel owners, charterers, offshore contractors and project developers worldwide.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #bae6fd' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#0369a1', fontWeight: 800 }}>COMPANY NUMBER</span>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0c2444', margin: '0.2rem 0' }}>{COMPANY.companyNumber}</div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Registered in {COMPANY.registeredIn}</span>
                  </div>
                  <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #bae6fd' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#0369a1', fontWeight: 800 }}>REGISTERED OFFICE</span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0c2444', margin: '0.2rem 0', lineHeight: 1.4 }}>
                      128 City Road, London EC1V 2NX
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>United Kingdom</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #bae6fd' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0c2444', marginBottom: '1rem' }}>
                  Chartering Governance &amp; Contracts
                </h3>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  All fixtures brokered by SEAVIK LTD are executed under recognized international maritime standard contracts.
                  Our brokers ensure transparent fixture recap terms, bunker adjustments, off-hire clauses and BIMCO compliance.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '12.5px', color: '#334155' }}>
                  {CONTRACTS.map((c) => (
                    <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={15} color="#0284c7" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer-seavik">
        <div className="seavik-container">
          <div className="footer-grid">
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em' }}>{COMPANY.name}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, maxWidth: '280px', margin: '0 0 1rem 0' }}>
                {COMPANY.tagline}
              </p>
              <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                &copy; {new Date().getFullYear()} SEAVIK LTD. All rights reserved.
              </div>
            </div>

            <div>
              <h4 className="footer-col-title">Pages</h4>
              <ul className="footer-links-list">
                <li><button onClick={() => go('home')} className="footer-link-btn">Home</button></li>
                <li><button onClick={() => go('services')} className="footer-link-btn">Vessel Services</button></li>
                <li><button onClick={() => go('company')} className="footer-link-btn">Company Info</button></li>
                <li><button onClick={() => go('home', 'enquiry')} className="footer-link-btn">Send an enquiry</button></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">London Registered Office</h4>
              <div style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6 }}>
                <div><strong>SEAVIK LTD</strong></div>
                <div>Company No: {COMPANY.companyNumber}</div>
                <div>Registered in {COMPANY.registeredIn}</div>
                <div style={{ marginTop: '0.5rem', color: '#cbd5e1' }}>{COMPANY.registeredOffice}</div>
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div>Email: <a href={`mailto:${COMPANY.email}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>{COMPANY.email}</a></div>
                  <div>Phone: <a href={`tel:${COMPANY.phone}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>{COMPANY.phone}</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}