import React, { useState } from 'react';
import './App.css';
import {
  Anchor, Phone, Mail, ChevronRight, Menu, X, ArrowRight,
  Check, Copy, Clock, Send,
  FileText, CheckCircle2, AlertCircle, Radio
} from 'lucide-react';

// ==========================================
// EMAILJS CONFIGURATION & DISPATCH SERVICE
// ==========================================
const EMAILJS = {
  serviceId: "service_rsc8zh7", // Email Services tab
  templateId: "template_pg7lljk", // the "new message" template that emails you
  publicKey: "fo5LVgFVm0Nj7jDNc", // Account tab. Public keys are meant to be in frontend code.
};

const emailjsReady = () =>
  Boolean(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey && !EMAILJS.publicKey.startsWith("YOUR_"));

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
    throw new Error(reason || `EmailJS returned HTTP status ${res.status}`);
  }
  return res;
}

// ==========================================
// SEAVIK LTD — BROKERAGE DATA
// ==========================================
const COMPANY = {
  name: 'SEAVIK LTD',
  tagline: 'Commercial vessel brokerage & offshore chartering desk.',
  email: 'ops@seavik.com',
  phone: '+44 7835 592674',
  companyNumber: '17453210',
  registeredIn: 'England and Wales',
  registeredOffice: '128 City Road, London EC1V 2NX, United Kingdom',
  hours: '24/7 Operational Tonnage Desk',
  slaResponse: 'Within 1 business day (Urgent spot: < 2 hours)'
};

const HERO_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHnBJ3Psb2qzTKb109SeQTql9N2lBvtt0tew5I3zgIKg&s=10';

const QUICK_TAGS = [
  'PSV Spot Charter',
  'AHTS Rig Move',
  'Flat-Deck Cargo Barge',
  'Hopper Barge Towage',
  'Vessel Acquisition (S&P)',
  'Disposal / Valuation',
  'Open Vessel Position (Owner)',
  'Project Cargo & Heavy-Lift'
];

const VESSELS = [
  {
    id: 'psv-standard',
    name: 'Platform Supply Vessel (PSV)',
    category: 'OSV',
    deskNumber: '01',
    shortDesc: 'Large open deck and tanks for carrying drilling fluids, fuel, water and deck cargo out to platforms.',
    highlight: 'DP2 Class • 1,000 m² Clear Deck • Multi-Grade Liquid Mud & Dry Bulk Systems',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0Rt0P906YrE9AzJdmxg_K4m2VWXZlse6dKDJzKgJfwA&s=10',
    dimensions: { loa: '84.00 m', beam: '19.00 m', draft: '6.50 m', gt: '3,800 GT' },
    capacities: { deckArea: '1,000 m²', deckStrength: '5.0 t/m²', dwt: '4,500 DWT', fuel: '1,100 m³', bulk: '400 m³' },
    machinery: { power: '6,400 kW', dpClass: 'DP-2 (Kongsberg)', speedMax: '14.5 kts', speedEco: '10.5 kts' },
    accommodation: '28 berths (MLC 2006 compliant)',
    missions: ['Drilling rig resupply & tubular deck carriage', 'Liquid mud, brine & base oil transfer', 'Platform maintenance support', 'Standby & safety support duties'],
    contract: 'BIMCO SUPPLYTIME 2017'
  },
  {
    id: 'ahts-heavy',
    name: 'Anchor Handling Tug Supply (AHTS)',
    category: 'OSV',
    deskNumber: '01',
    shortDesc: 'High bollard pull and a heavy winch for setting anchors, towing rigs and supporting moves.',
    highlight: '210T Bollard Pull • 400T Waterfall Winch • DP2 Deepwater Mooring Package',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGm8W6NbvhrtNNqBH5HJMQXoX7ZV9UQO37AsMJC9cgbQ&s=10',
    dimensions: { loa: '81.00 m', beam: '18.50 m', draft: '7.20 m', gt: '4,200 GT' },
    capacities: { deckArea: '650 m²', deckStrength: '10.0 t/m²', dwt: '3,500 DWT', bollardPull: '210 Tonnes BP' },
    machinery: { power: '18,000 BHP', dpClass: 'DP-2 Notation', speedMax: '16.0 kts', speedEco: '11.5 kts' },
    accommodation: '34 berths fully air-conditioned',
    missions: ['Semi-submersible rig moves & pre-laying anchors', 'Deepwater ocean towage & FPSO hook-up', 'Emergency towing vessel (ETV) coverage', 'Chain & synthetic mooring insert handling'],
    contract: 'BIMCO TOWCON / SUPPLYTIME 2017'
  },
  {
    id: 'barge-flatdeck',
    name: 'Flat-Deck Barge',
    category: 'Barges',
    deskNumber: '02',
    shortDesc: 'A wide, strong deck for oversized modules, project cargo and heavy-lift loads under tow.',
    highlight: '10,000 DWT • 25 t/m² Point Loading • Internal Ballasting & RoRo Loadout Ready',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmnpUc1YPjxIEygDXTPHcix7HL2DGZ4NnJ1MxdlpjSesP6brJDLrTRzjE&s=10',
    dimensions: { loa: '100.00 m', beam: '30.50 m', draft: '5.50 m Laden', gt: '4,600 GT' },
    capacities: { deckArea: '3,000 m² Clear Area', deckStrength: '25.0 t/m² Reinforced', dwt: '10,000 DWT' },
    machinery: { power: 'Unmanned Non-propelled', bollardPull: 'Towed by matched tug (60-120T BP)', speedMax: '8.0 kts under tow', speedEco: '5.8 kts' },
    accommodation: 'Towing crew accommodated on escort tug',
    missions: ['Offshore wind jackets & substations transport', 'Petrochemical modules & refinery columns', 'Roll-on / Roll-off (RoRo) heavy-lift transport', 'Shipyard block transfers & marine civil works'],
    contract: 'BIMCO BARGEHIRE 2021'
  },
  {
    id: 'hopper-barge-tug',
    name: 'Hopper Barge & Ocean Tug',
    category: 'Barges',
    deskNumber: '02',
    shortDesc: 'Hopper barges for aggregates and dry bulk, towed by ocean tugs matched to the route.',
    highlight: 'Split-Hopper & Box Barges • Matched 50-80T BP Ocean Tugs • Dredge & Bulk Logistics',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn2p3O4-LL9WD9SYr4X6jwg8WxtN8B3pOsKns0Cq9qEQ&s=10',
    dimensions: { loa: '76.00 m (Barge) / 36.00 m (Tug)', beam: '16.00 m / 11.50 m', draft: '4.50 m Laden', gt: '2,200 GT Combined' },
    capacities: { deckArea: 'Hopper: 2,500 - 3,500 m³', deckStrength: 'Heavy armour steel floor', dwt: '4,800 DWT' },
    machinery: { power: 'Ocean Tug: 5,000 BHP', bollardPull: '70 Tonnes BP', speedMax: '10.0 kts (free) / 7.0 kts (laden)', speedEco: '6.2 kts' },
    accommodation: 'Tug: 12 Crew berths (MLC compliant)',
    missions: ['Coastal & offshore aggregate transport', 'Capital dredging soil disposal & offshore reclamation', 'Dry bulk shuttle between river ports and deep-sea anchorages', 'Breakwater rock armour placement'],
    contract: 'BIMCO TOWCON / TOWHIRE'
  },
  {
    id: 'sp-commercial-tonnage',
    name: 'Offshore & Commercial Tonnage',
    category: 'SP',
    deskNumber: '03',
    shortDesc: 'From finding a buyer to delivery: tugs, AHTS, PSVs and other offshore assets.',
    highlight: 'Direct Buyer/Seller Brokerage • Desktop & Condition Valuations • Class Records Audit',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE-7_Ovt2NF1oiIP0-YgPL_bf1GK6VOGxM91mYewZXQQ&s=10',
    dimensions: { loa: '50m - 120m Range', beam: 'Variable', draft: 'Variable', gt: 'Up to 15,000 GT' },
    capacities: { deckArea: 'Global asset portfolio covering modern DP tonnage to utility vessels', deckStrength: 'Commercial & Offshore register', dwt: '1,000 - 15,000 DWT' },
    machinery: { power: 'Tier II & Tier III IMO compliant', propulsion: 'Conventional, Diesel-Electric & Hybrid-ready', speedMax: 'IACS Class standards (DNV, ABS, LR)', speedEco: 'Class records and survey history verified' },
    accommodation: 'Certified accommodations verified prior to handover',
    missions: ['Fleet renewal & second-hand vessel acquisitions', 'Distressed asset remarketing & bank valuations', 'Green recycling & end-of-life disposal brokerage', 'Bareboat charter with purchase option (BBHP) structuring'],
    contract: 'BIMCO SALEFORM 2012 / SHIPSALE 22'
  }
];


const DESKS = [
  {
    number: '01',
    title: 'Offshore Support Vessels (OSVs)',
    fleet: 'Platform Supply Vessels (PSVs) and Anchor Handling Tug Supply vessels (AHTS).',
    handle: 'Time and voyage charters, rig moves, anchor handling, towing and day-to-day platform supply runs.',
    vesselIds: ['psv-standard', 'ahts-heavy']
  },
  {
    number: '02',
    title: 'Cargo & Barges',
    fleet: 'Flat-deck barges, hopper barges and ocean-going towing tugs.',
    handle: 'Moving freight through shallow water, shifting heavy-lift equipment and running dry-bulk cargo logistics.',
    vesselIds: ['barge-flatdeck', 'hopper-barge-tug']
  },
  {
    number: '03',
    title: 'Vessel Sale & Purchase (S&P)',
    fleet: 'Buying and selling fleet, disposals and vessel valuations.',
    handle: 'We broker the sale and purchase of commercial vessels and offshore assets directly, anywhere in the world.',
    vesselIds: ['sp-commercial-tonnage']
  }
];

// ==========================================
// MAIN REACT COMPONENT
// ==========================================
export default function App() {
  const [activeDeskFilter, setActiveDeskFilter] = useState('all');
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedHero, setCopiedHero] = useState(false);


  // Enquiry Form State & EmailJS
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cargoRoute, setCargoRoute] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);
  const [formError, setFormError] = useState(null);

  const today = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const copyEmail = (setter) => {
    navigator.clipboard.writeText(COMPANY.email);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
      if (!cargoRoute) setCargoRoute(tag);
      else if (!cargoRoute.includes(tag)) setCargoRoute(`${cargoRoute} • ${tag}`);
    }
  };

  const handleCharter = (vessel) => {
    let tag = 'PSV Spot Charter';
    if (vessel.id === 'ahts-heavy') tag = 'AHTS Rig Move';
    else if (vessel.id === 'barge-flatdeck') tag = 'Flat-Deck Cargo Barge';
    else if (vessel.id === 'hopper-barge-tug') tag = 'Hopper Barge Towage';
    else if (vessel.id === 'sp-commercial-tonnage') tag = 'Vessel Acquisition (S&P)';
    if (!selectedTags.includes(tag)) setSelectedTags((prev) => [...prev, tag]);
    if (!cargoRoute) setCargoRoute(tag);
    setSelectedVessel(null);
    scrollTo('enquiry');
  };


  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    setFormError(null);

    const messageLines = [];
    if (selectedTags.length > 0) {
      messageLines.push(`[Charter Scope / Tags]: ${selectedTags.join(', ')}`);
    }
    if (phone.trim()) {
      messageLines.push(`[Contact Telephone]: ${phone.trim()}`);
    }
    if (notes.trim()) {
      messageLines.push(`[Client Requirements & Notes]:\n${notes.trim()}`);
    }

    const payload = {
      name,
      email,
      cargo: cargoRoute.trim() || (selectedTags.length > 0 ? selectedTags.join(' • ') : 'General Vessel Brokerage Enquiry'),
      message: messageLines.length > 0 ? messageLines.join('\n\n') : 'No additional notes provided.'
    };

    try {
      await sendWithEmailJS(payload);
      const generatedRef = `SVK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(generatedRef);
    } catch (err) {
      console.error('EmailJS dispatch failed:', err);
      setFormError(err.message || 'Transmission encountered a network issue. You can click below to mail our operations desk directly.');
    } finally {
      setSubmitting(false);
    }
  };


  const displayedDesks = activeDeskFilter === 'all'
    ? DESKS
    : DESKS.filter((d) => d.number === activeDeskFilter);

  return (
    <div className="seavik-app">
      {/* 1. NAVBAR */}
      <header className="navbar-seavik">
        <div className="seavik-container nav-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => scrollTo('hero')}>
            <div>
              <div className="brand-title">{COMPANY.name}</div>
              <div className="brand-subtitle">Maritime Brokerage &amp; Chartering</div>
            </div>
          </div>

          <nav className="nav-links">
            <button onClick={() => scrollTo('what-we-do')} className="nav-link-btn">What we do</button>
            <button onClick={() => scrollTo('about')} className="nav-link-btn">Company Info</button>
            <button onClick={() => scrollTo('enquiry')} className="btn-marine">
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
            <button onClick={() => scrollTo('what-we-do')} className="mobile-nav-item">What we do</button>
            <button onClick={() => scrollTo('about')} className="mobile-nav-item">Company Info</button>
            <button onClick={() => scrollTo('enquiry')} className="btn-marine" style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}>
              Send an enquiry
            </button>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="seavik-container hero-grid">
          <div>
            <div className="hero-pill">
              <span className="pulsing-dot" />
              <span className="hero-pill-category">Commercial Vessel Brokerage</span>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span style={{ color: '#64748b' }}>London City Road</span>
            </div>

            <h1 className="hero-title">
              Maritime brokerage <br />
              <span className="hero-title-accent">&amp; chartering</span>
            </h1>

            <p className="hero-lead">
              Commercial vessel brokerage and chartering, handled from first enquiry to fixture.
              Tell us about your open vessel, cargo parcel or project and we'll take it from there.
            </p>

            <div className="hero-actions">
              <button onClick={() => scrollTo('enquiry')} className="btn-marine hero-btn-lg">
                <span>Send an enquiry</span>
                <ArrowRight size={16} />
              </button>
              <button onClick={() => scrollTo('what-we-do')} className="btn-secondary hero-btn-lg">
                <span>What we do</span>
                <ChevronRight size={16} />
              </button>
              <button onClick={() => copyEmail(setCopiedHero)} className="btn-outline-marine hero-btn-lg">
                <Mail size={16} color="#0284c7" />
                <span>{COMPANY.email}</span>
                {copiedHero ? <Check size={15} color="#059669" /> : <Copy size={14} color="#64748b" />}
              </button>
            </div>

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

          <div>
            
          </div>
        </div>
      </section>

      {/* 3. COVERAGE TICKER */}
      <div className="coverage-ticker">
        <div className="seavik-container coverage-ticker-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0284c7' }}>
            <Radio size={14} />
            <span>COMMERCIAL REGISTRATION:</span>
          </div>
          <div className="ticker-marquee">
            <span>SEAVIK LTD</span>
            <span>•</span>
            <span>Company No: 17453210</span>
            <span>•</span>
            <span>Registered: England &amp; Wales</span>
            <span>•</span>
            <span>Office: 128 City Road, London EC1V 2NX</span>
            <span>•</span>
            <span>Ops Desk: ops@seavik.com</span>
            <span>•</span>
            <span>Phone: +44 7835 592674</span>
          </div>
        </div>
      </div>

      {/* 4. WHAT WE DO — 3 CHARTERING DESKS */}
      <section id="what-we-do" className="desks-section">
        <div className="seavik-container">
          <div className="section-header-centered">
            <div className="section-pill">
              <span className="pulsing-dot" />
              <span>SPECIALIZED TONNAGE SECTORS</span>
            </div>
            <h2 className="section-main-title">What we do</h2>
            <p className="section-desc">
              Three focused chartering desks covering offshore support vessels, shallow-draft and heavy barges, and commercial asset transactions.
            </p>

            <div style={{ display: 'inline-flex', gap: '0.5rem', marginTop: '1.25rem', background: '#e0f2fe', padding: '0.35rem', borderRadius: '0.85rem' }}>
              <button
                onClick={() => setActiveDeskFilter('all')}
                className={`desk-filter-btn ${activeDeskFilter === 'all' ? 'active' : ''}`}
              >
                All 3 Desks
              </button>
              <button
                onClick={() => setActiveDeskFilter('01')}
                className={`desk-filter-btn ${activeDeskFilter === '01' ? 'active' : ''}`}
              >
                Desk 01: OSVs
              </button>
              <button
                onClick={() => setActiveDeskFilter('02')}
                className={`desk-filter-btn ${activeDeskFilter === '02' ? 'active' : ''}`}
              >
                Desk 02: Barges
              </button>
              <button
                onClick={() => setActiveDeskFilter('03')}
                className={`desk-filter-btn ${activeDeskFilter === '03' ? 'active' : ''}`}
              >
                Desk 03: S&amp;P
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {displayedDesks.map((desk) => {
              const deskVessels = VESSELS.filter((v) => desk.vesselIds.includes(v.id));
              return (
                <div key={desk.number} id={`desk-${desk.number}`} className="desk-block-card">
                  <div className="desk-block-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="desk-number-badge">DESK {desk.number}</span>
                      <h3 className="desk-block-title">{desk.title}</h3>
                    </div>
                    <span className="desk-sub-badge">BIMCO STANDARD GOVERNANCE</span>
                  </div>

                  <div className="desk-meta-box">
                    <div>
                      <span className="meta-label">The Fleet</span>
                      <p className="meta-value-bold">{desk.fleet}</p>
                    </div>
                    <div>
                      <span className="meta-label">What we handle</span>
                      <p className="meta-value-bold">{desk.handle}</p>
                    </div>
                  </div>

                  <div className="vessels-grid">
                    {deskVessels.map((vessel) => (
                      <div key={vessel.id} className="vessel-card">
                        <div className="vessel-img-wrapper">
                          <img
                            src={vessel.image}
                            alt={vessel.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';
                            }}
                            className="vessel-img"
                          />
                          <div className="vessel-badge-left">DESK {vessel.deskNumber}</div>
                          <div className="vessel-badge-right">{vessel.contract.split(' ')[0]}</div>
                        </div>

                        <div className="vessel-card-body">
                          <h4 className="vessel-name">{vessel.name}</h4>
                          <p className="vessel-short-desc">{vessel.shortDesc}</p>

                          <div className="vessel-specs-pills">
                            {Object.entries(vessel.dimensions).slice(0, 3).map(([k, val]) => (
                              <span key={k} className="spec-pill">{k.toUpperCase()}: {val}</span>
                            ))}
                            {vessel.capacities.dwt && <span className="spec-pill">{vessel.capacities.dwt}</span>}
                            {vessel.capacities.deckArea && <span className="spec-pill">{vessel.capacities.deckArea}</span>}
                          </div>

                          <div className="vessel-card-actions">
                            <button
                              onClick={() => setSelectedVessel(vessel)}
                              className="btn-secondary"
                              style={{ width: '100%', justifyContent: 'center' }}
                            >
                              <span>Full Specs</span>
                              <ChevronRight size={14} />
                            </button>
                            <button
                              onClick={() => handleCharter(vessel)}
                              className="btn-marine"
                              style={{ width: '100%', justifyContent: 'center' }}
                            >
                              <span>Charter Tonnage</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* 7. SEND AN ENQUIRY FORM (EMAILJS INTEGRATED) */}
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
                  <div className="contact-icon-wrapper">
                    <Mail size={18} color="#0284c7" />
                  </div>
                  <div>
                    <span className="contact-small-label">Official Broker Email</span>
                    <strong className="contact-main-val">{COMPANY.email}</strong>
                  </div>
                </a>

                <a href={`tel:${COMPANY.phone}`} className="enquiry-contact-link">
                  <div className="contact-icon-wrapper">
                    <Phone size={18} color="#0284c7" />
                  </div>
                  <div>
                    <span className="contact-small-label">London Operations Desk</span>
                    <strong className="contact-main-val">{COMPANY.phone}</strong>
                  </div>
                </a>
              </div>

              <div className="enquiry-sla-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Clock size={16} color="#0284c7" />
                  <strong style={{ fontSize: '13px', color: '#0c2444' }}>Live Broker Dispatch System</strong>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                  Enquiries are dispatched to our commercial chartering desk via EmailJS (service: <code>{EMAILJS.serviceId}</code>).
                  We immediately cross-reference open positions across Aberdeen, Den Helder, Stavanger and Rotterdam.
                </p>
              </div>
            </div>

            <div>
              <div className="enquiry-card">
                <div className="enquiry-card-header">
                  <div>
                    <h3 className="enquiry-card-title">New enquiry</h3>
                    <span className="enquiry-card-date">{today}</span>
                  </div>
                  <div className="enquiry-card-badge">24/7 TONNAGE DESK</div>
                </div>

                {submittedRef ? (
                  <div className="success-banner">
                    <CheckCircle2 size={40} color="#059669" />
                    <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#065f46', margin: '0.75rem 0 0.35rem 0' }}>
                      Enquiry Dispatched to {COMPANY.email}
                    </h4>
                    <p style={{ fontSize: '13.5px', color: '#047857', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                      Reference <strong>{submittedRef}</strong> has been logged in our chartering register. Our operations brokers have received your cargo requirements and will contact you promptly.
                    </p>
                    <button
                      onClick={() => {
                        setSubmittedRef(null);
                        setName('');
                        setEmail('');
                        setPhone('');
                        setCargoRoute('');
                        setSelectedTags([]);
                        setNotes('');
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
                                href={`mailto:${COMPANY.email}?subject=Charter Enquiry from ${encodeURIComponent(name || 'Charterer')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nScope: ${cargoRoute}\n\nNotes:\n${notes}`)}`}
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
                        <input
                          type="text"
                          required
                          placeholder="e.g. Captain James Ward"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-label">Email address *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. chartering@operator.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="input-label">Telephone / WhatsApp (Optional)</label>
                      <input
                        type="tel"
                        placeholder="e.g. +44 7835 000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="input-label">Cargo parcel, vessel required or passage corridor</label>
                      <input
                        type="text"
                        placeholder="e.g. 800T deck cargo from Aberdeen to Ekofisk, prompt laycan"
                        value={cargoRoute}
                        onChange={(e) => setCargoRoute(e.target.value)}
                        className="form-input"
                      />
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

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-marine btn-marine-lg"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <Send size={16} />
                      <span>{submitting ? 'Transmitting to ops@seavik.com...' : 'Send enquiry'}</span>
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '11.5px', color: '#64748b' }}>
                      Directly routed to <strong>{COMPANY.email}</strong> via verified EmailJS service.
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPANY INFO & ABOUT */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={15} color="#0284c7" />
                  <span>BIMCO SUPPLYTIME 2017 (Offshore Support Vessels)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={15} color="#0284c7" />
                  <span>BIMCO TOWCON / TOWHIRE 2021 (Ocean Towage &amp; Tug Operations)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={15} color="#0284c7" />
                  <span>BIMCO BARGEHIRE 2021 (Flat-Deck &amp; Specialized Barges)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={15} color="#0284c7" />
                  <span>BIMCO SALEFORM 2012 / SHIPSALE 22 (Sale &amp; Purchase)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="footer-seavik">
        <div className="seavik-container">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
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
              <h4 className="footer-col-title">Chartering Desks</h4>
              <ul className="footer-links-list">
                <li><button onClick={() => scrollTo('desk-01')} className="footer-link-btn">01 Offshore Support Vessels (OSVs)</button></li>
                <li><button onClick={() => scrollTo('desk-01')} className="footer-link-btn">Platform Supply Vessels (PSVs)</button></li>
                <li><button onClick={() => scrollTo('desk-01')} className="footer-link-btn">Anchor Handling Tug Supply (AHTS)</button></li>
                <li><button onClick={() => scrollTo('desk-02')} className="footer-link-btn">02 Cargo &amp; Heavy-Lift Barges</button></li>
                <li><button onClick={() => scrollTo('desk-03')} className="footer-link-btn">03 Vessel Sale &amp; Purchase (S&amp;P)</button></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Operations &amp; Tonnage</h4>
              <ul className="footer-links-list">
                <li><button onClick={() => scrollTo('enquiry')} className="footer-link-btn">Submit Open Position (Shipowners)</button></li>
                <li><button onClick={() => scrollTo('enquiry')} className="footer-link-btn">Cargo Parcel &amp; Towage Enquiry</button></li>
                <li><button onClick={() => scrollTo('what-we-do')} className="footer-link-btn">Specialized Broker Desks</button></li>
                <li><button onClick={() => scrollTo('about')} className="footer-link-btn">BIMCO Standard Governance</button></li>
                <li><button onClick={() => scrollTo('hero')} className="footer-link-btn">Back to Top</button></li>
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

      {/* 10. TECHNICAL SPECIFICATIONS MODAL */}
      {selectedVessel && (
        <div className="modal-overlay" onClick={() => setSelectedVessel(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="spec-modal-header">
              <div>
                <span className="card-badge">DESK {selectedVessel.deskNumber} • TECHNICAL DATASHEET</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0c2444', margin: '0.35rem 0' }}>{selectedVessel.name}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#0284c7', fontWeight: 600 }}>{selectedVessel.highlight}</p>
              </div>
              <button onClick={() => setSelectedVessel(null)} className="modal-close-btn" aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <div className="spec-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ borderRadius: '0.85rem', overflow: 'hidden', height: '14rem', background: '#07172c' }}>
                  <img
                    src={selectedVessel.image}
                    alt={selectedVessel.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#0369a1', fontWeight: 800 }}>PRIMARY ROLE &amp; SCOPES</span>
                  <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, margin: '0.5rem 0 1rem 0' }}>
                    {selectedVessel.shortDesc}
                  </p>
                  <div style={{ background: '#f0f7fe', padding: '0.85rem', borderRadius: '0.65rem', border: '1px solid #bae6fd' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#0369a1', fontWeight: 700 }}>CONTRACT STANDARD:</span>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0c2444' }}>{selectedVessel.contract}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div className="spec-table-box">
                  <h4 className="spec-group-title">Principal Dimensions</h4>
                  <table className="spec-table">
                    <tbody>
                      {Object.entries(selectedVessel.dimensions).map(([key, val]) => (
                        <tr key={key}>
                          <td className="spec-key">{key.toUpperCase()}</td>
                          <td className="spec-val">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="spec-table-box">
                  <h4 className="spec-group-title">Capacities &amp; Deck</h4>
                  <table className="spec-table">
                    <tbody>
                      {Object.entries(selectedVessel.capacities).map(([key, val]) => (
                        <tr key={key}>
                          <td className="spec-key">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</td>
                          <td className="spec-val">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 className="spec-group-title">Key Operational Missions</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {selectedVessel.missions.map((mission, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12.5px', color: '#334155' }}>
                      <Check size={14} color="#0284c7" style={{ flexShrink: 0 }} />
                      <span>{mission}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={() => handleCharter(selectedVessel)}
                  className="btn-marine"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <span>Charter this Vessel Specification</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => setSelectedVessel(null)}
                  className="btn-secondary"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}