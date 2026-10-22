import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, Disc3, Menu, Play, Radio, Send, X } from 'lucide-react'

const rooms = [
  { id: 'sound', n: '01', label: 'SOUND', desc: 'Frequencies for the ones who feel everything.', tone: 'room-violet' },
  { id: 'after-dark', n: '02', label: 'AFTER DARK', desc: 'Gatherings that stay with you long after.', tone: 'room-amber' },
  { id: 'collective', n: '03', label: 'COLLECTIVE', desc: 'Meet the minds making their own weather.', tone: 'room-silver' },
  { id: 'archive', n: '04', label: 'ARCHIVE', desc: 'A living record of scenes, sounds and ideas.', tone: 'room-blue' },
  { id: 'objects', n: '05', label: 'OBJECTS', desc: 'Artifacts from a world beneath one roof.', tone: 'room-rose' },
]

const artists = [
  { no: '01', name: 'THE SELECTORS', role: 'A rotating cast of sound curators', id: 'T—S' },
  { no: '02', name: 'THE IMAGE MAKERS', role: 'Artists behind the atmosphere', id: 'I—M' },
  { no: '03', name: 'THE NIGHT BUILDERS', role: 'Culture keepers & experience makers', id: 'N—B' },
]

function Emblem({ small = false }: { small?: boolean }) {
  return <svg className={small ? 'emblem emblem-small' : 'emblem'} viewBox="0 0 100 70" aria-hidden="true"><path d="M8 38C12 18 28 7 50 7s38 11 42 31H8Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 38c8 10 16 10 24 0 8 10 16 10 24 0 8 10 16 10 24 0 5 6 10 8 15 5M50 38v21c0 12 18 12 18 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}

function PhotoStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const images = Array.from(section.querySelectorAll<HTMLImageElement>('.photo-card img'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationFrame = 0

    const updateParallax = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)))
        const travel = (0.5 - progress) * 24
        images.forEach((image, index) => {
          const offset = index === 0 ? travel : -travel * 0.72
          image.style.setProperty('--parallax-offset', `${offset.toFixed(1)}px`)
        })
      })
    }

    const observer = new IntersectionObserver(([entry]) => {
      const inView = entry.isIntersecting
      setVisible(inView)
      if (inView && !reducedMotion) {
        updateParallax()
        window.addEventListener('scroll', updateParallax, { passive: true })
        window.addEventListener('resize', updateParallax)
      } else {
        window.removeEventListener('scroll', updateParallax)
        window.removeEventListener('resize', updateParallax)
        images.forEach(image => image.style.setProperty('--parallax-offset', '0px'))
      }
    }, { rootMargin: '120px 0px' })

    observer.observe(section)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateParallax)
      window.removeEventListener('resize', updateParallax)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <section ref={sectionRef} className={`photo-story section-pad${visible ? ' photo-story-visible' : ''}`} aria-labelledby="photo-story-heading"><div className="section-kicker"><span>VISUAL STUDIES / 01—02</span><span>THE WORLD TAKING SHAPE</span></div><div className="photo-story-head"><h2 id="photo-story-heading">A feeling<br/>you can <em>see.</em></h2><p>Sound, light and a room that brings it all together.</p></div><div className="photo-grid"><figure className="photo-card"><div className="photo-image-frame"><img src={`${import.meta.env.BASE_URL}images/black-ambrella-stage-green.png`} alt="Black Ambrella DJ setup, controller, laptop and flight case against a green backdrop" width="1869" height="842" loading="lazy" decoding="async"/></div><figcaption>01 / THE SIGNAL</figcaption></figure><figure className="photo-card"><div className="photo-image-frame"><img src={`${import.meta.env.BASE_URL}images/black-ambrella-stage-warm.png`} alt="Black Ambrella DJ setup with umbrella-pattern backdrop and warm amber lighting" width="1448" height="1086" loading="lazy" decoding="async"/></div><figcaption>02 / SOUND IN THE ROOM</figcaption></figure></div></section>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [previewMessage, setPreviewMessage] = useState('')
  const apiUrl = import.meta.env.VITE_PUBLIC_FORMS_ENDPOINT as string | undefined

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setFormMessage('Enter a valid email address to continue.'); return }
    if (!consent) { setFormMessage('Please confirm you would like to receive occasional updates.'); return }
    if (!apiUrl) { setFormMessage('The list is not connected yet. Your address has not been saved.'); return }
    try {
      const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), source: 'black-ambrella-newsletter' }) })
      if (!res.ok) throw new Error('Request failed')
      setFormMessage('You’re on the list. Watch this space.')
      setEmail(''); setConsent(false)
    } catch { setFormMessage('We could not deliver that just now. Please try again later.') }
  }

  const closeMenu = () => setMenuOpen(false)
  return <>
    <header className="topbar">
        <a className="brand-lockup" href="#home" aria-label="Black Ambrella home" onClick={closeMenu}><Emblem small /><span>BLACK<br />AMBRELLA</span></a>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
        <a href="#sound-feature" onClick={closeMenu}>SOUND</a><a href="#after-dark-feature" onClick={closeMenu}>AFTER DARK</a><a href="#collective-feature" onClick={closeMenu}>COLLECTIVE</a><a href="#archive-feature" onClick={closeMenu}>ARCHIVE</a><a href="#bookings" onClick={closeMenu}>BOOKINGS</a>
      </nav>
      <a className="top-cta" href="#connect">JOIN THE LIST <ArrowUpRight size={14}/></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-image" aria-hidden="true"><div className="hero-sun"/><div className="hero-figure"/><div className="hero-grain"/></div>
        <div className="hero-topline"><span>INDEPENDENT BY NATURE</span><span>JOHANNESBURG · EVERYWHERE</span></div>
        <div className="hero-content"><div className="eyebrow"><i/> AN OPEN INVITATION TO THE UNEXPECTED</div><h1>WELCOME TO<br/>THE <em>OTHER SIDE</em><br/>OF SOUND<span className="period">.</span></h1><p>An independent creative universe shaping<br className="desktop-only"/> sound, nightlife, and digital culture.</p><div className="hero-actions"><a className="button button-light" href="#rooms">ENTER BLACK AMBRELLA <ArrowUpRight size={16}/></a><a className="text-link" href="#sound"><span className="play-outline"><Play size={12} fill="currentColor"/></span> EXPLORE THE SOUND</a></div></div>
        <div className="hero-emblem"><Emblem/><span>ONE ROOF. INFINITE WORLDS.</span></div>
        <a href="#manifesto" className="scroll-cue"><span>SCROLL TO STEP INSIDE</span><ArrowDown size={15}/></a><div className="hero-index">BA—001 / EST. IN THE MAKING</div>
      </section>

      <section id="manifesto" className="manifesto section-pad"><div className="section-kicker"><span>01 / THE IDEA</span><span>THE CULTURE BEHIND THE DARKNESS</span></div><div className="manifesto-grid"><h2>We don’t follow<br/>the culture.<br/><em>We set the scene.</em></h2><div className="manifesto-copy"><div className="small-rule"/><p>There’s a feeling before the first track. A room holding its breath. A city finding its rhythm after dark.</p><p>BLACK AMBRELLA is built for that feeling — a home for the sounds, people and ideas making culture happen. Independent in spirit. Connected by instinct.</p><a href="#rooms" className="arrow-link">STEP UNDER THE UMBRELLA <ArrowDownRight size={16}/></a></div></div><div className="manifesto-foot"><span>ONE IDENTITY. MULTIPLE WORLDS.</span><Emblem small/><span>A CULTURE OF OUR OWN.</span></div></section>

      <section id="rooms" className="rooms-section section-pad"><div className="section-kicker"><span>02 / THE UNIVERSE</span><span>CHOOSE YOUR WAY IN <ArrowDownRight size={14}/></span></div><div className="rooms-head"><h2>UNDER THE<br/><em>UMBRELLA.</em></h2><p>Every room has its own frequency.<br/>Find the one that finds you.</p></div><div className="room-grid">{rooms.map(r=><a className={`room-card ${r.tone}`} id={r.id} key={r.id} href={r.id === 'sound' ? '#sound-feature' : r.id === 'after-dark' ? '#after-dark-feature' : r.id === 'collective' ? '#collective-feature' : r.id === 'archive' ? '#archive-feature' : '#objects-feature'}><div className="room-number">{r.n} <span>— 05</span><ArrowUpRight size={16}/></div><div className="room-art"><div className="room-art-core"/><Emblem/></div><div className="room-meta"><div><h3>{r.label}</h3><p>{r.desc}</p></div><ArrowRight size={18}/></div></a>)}</div></section>

      <section className="sound-feature section-pad" id="sound-feature"><div className="section-kicker"><span>03 / SOUND</span><span>LISTEN CLOSELY</span></div><div className="sound-layout"><div className="sound-copy"><div className="eyebrow"><i/> FREQUENCY TEST / 001</div><h2>Made for<br/>the <em>in-between.</em></h2><p>Where deep-house patience meets the pulse of home. A first look at the sonic world taking shape beneath the umbrella.</p><div className="genre-row"><span>AFRO-HOUSE</span><span>AMAPIANO</span><span>DEEP HOUSE</span><span>3-STEP</span></div><button className="listen-button" onClick={()=>setPreviewMessage('No audio is configured yet.')} aria-label="Check audio availability"><span className="listen-icon"><Play size={15} fill="currentColor"/></span><span>{previewMessage || 'AUDIO PREVIEW NOT AVAILABLE YET'}</span><ArrowUpRight size={16}/></button></div><div className="record-art"><div className="record-label"><Emblem/><small>BLACK AMBRELLA<br/>SOUND STUDY Nº 001</small></div><span className="record-side">SIDE A&nbsp; / &nbsp;DEMO ARTWORK</span><span className="record-caption">NO TRACKS<br/>PUBLISHED YET</span></div></div><div className="notice"><AudioLines size={16}/><span>Sound is on the way. Music and mixes will appear here once original audio and release details are ready.</span><a href="#connect">GET UPDATES <ArrowRight size={14}/></a></div></section>

      <section className="frequency-band"><div className="frequency-orbit"><Radio size={34}/><span className="orbit-ring"/></div><div><div className="eyebrow"><i/> FREQUENCY / RADIO & MIX CULTURE</div><h2>Listen beyond<br/><em>the obvious.</em></h2><p>Guest mixes, artist takeovers and late-night transmissions.<br/>The listening room is getting ready.</p></div><a href="#connect" className="button button-outline">BE FIRST TO KNOW <ArrowUpRight size={15}/></a><span className="frequency-code">FM / 00.0<br/>SIGNAL PENDING</span></section>

      <section className="after-dark section-pad" id="after-dark-feature"><div className="section-kicker"><span>04 / AFTER DARK</span><span>THE NIGHT IS A PLACE</span></div><div className="after-grid"><div className="after-art"><div className="after-moon"/><div className="after-horizon"/><span className="after-stamp">AFTER<br/>DARK</span><span className="after-art-note">A NIGHT TO REMEMBER<br/>IS STILL BEING IMAGINED.</span></div><div className="after-copy"><div className="eyebrow"><i/> GATHER WITH INTENTION</div><h2>Not just a<br/><em>night out.</em></h2><p>Small rooms. Big feeling. A dancefloor with something to say. When the first gathering is ready, you’ll hear it here first.</p><div className="empty-event"><div className="empty-mark"><Disc3 size={20}/></div><div><b>THE NEXT CHAPTER IS UNWRITTEN.</b><span>No events announced yet.</span></div><a href="#connect" aria-label="Get event announcements"><ArrowUpRight size={16}/></a></div><a className="arrow-link" href="#connect">GET THE FIRST INVITE <ArrowRight size={16}/></a></div></div></section>

      <PhotoStory />

      <section className="collective section-pad" id="collective-feature"><div className="section-kicker"><span>05 / THE COLLECTIVE</span><span>GOOD THINGS HAPPEN UNDER ONE ROOF</span></div><div className="collective-heading"><h2>A scene is<br/>made by <em>people.</em></h2><p>A platform for the selectors, image makers and night builders<br className="desktop-only"/> shaping what comes next.</p></div><div className="artist-list">{artists.map(a=><a href="#connect" className="artist-row" key={a.no}><span className="artist-no">{a.no} /</span><span className="artist-monogram">{a.id}</span><span className="artist-info"><b>{a.name}</b><small>{a.role}</small></span><span className="artist-note">OPEN CALL / ALWAYS</span><ArrowUpRight size={18}/></a>)}</div><div className="collective-foot"><span>NO ROSTER TO ANNOUNCE. JUST A DOOR LEFT OPEN.</span><a className="arrow-link" href="#connect">MAKE SOMETHING WITH US <ArrowRight size={15}/></a></div></section>

      <section className="archive section-pad" id="archive-feature"><div className="section-kicker"><span>06 / THE ARCHIVE</span><span>FIELD NOTES FROM THE CULTURE</span></div><div className="archive-top"><div><h2>A living<br/><em>record.</em></h2><p>Stories, scenes and sounds worth keeping.<br/>The first entry is still being written.</p></div><div className="archive-visual"><span>FRAGMENTS<br/>OF WHAT’S<br/>TO COME</span><div className="archive-shape"/></div></div><div className="archive-foot"><span>INTERVIEWS / PHOTO ESSAYS / CULTURAL NOTES</span><span>THE ARCHIVE OPENS SOON &nbsp; ↗</span></div></section>

      <section className="objects section-pad" id="objects-feature"><div className="objects-image"><span>STUDY<br/>IN FORM</span><div className="object-silhouette"/><div className="object-vertical">OBJECTS / 001</div></div><div className="objects-copy"><div className="section-kicker"><span>07 / OBJECTS</span></div><div className="eyebrow"><i/> THINGS THAT HOLD A STORY</div><h2>Carry the<br/><em>atmosphere.</em></h2><p>Wearable artifacts. Limited editions. Objects with a point of view. The collection is being considered — thoughtfully, and at its own pace.</p><a className="arrow-link" href="#connect">ASK ABOUT THE COLLECTION <ArrowRight size={15}/></a><small>NO PRODUCTS AVAILABLE FOR PURCHASE.</small></div></section>

      <section className="bookings section-pad" id="bookings"><div className="section-kicker"><span>08 / BOOKINGS</span><span>MAKE THE NIGHT YOURS</span></div><div className="bookings-grid"><div><div className="eyebrow"><i/> FOR ARTISTS, VENUES & GOOD IDEAS</div><h2>Let’s make<br/><em>something move.</em></h2></div><div className="booking-contact"><p>For DJ and artist bookings, event enquiries, collaborations and partnerships, get in touch directly.</p><a className="booking-link" href="mailto:blackambrellasa@gmail.com?subject=BLACK%20AMBRELLA%20Booking%20Enquiry"><span>EMAIL</span><b>blackambrellasa@gmail.com</b><ArrowUpRight size={17}/></a><a className="booking-link" href="tel:+27623193091"><span>CALL / WHATSAPP</span><b>+27 62 319 3091</b><ArrowUpRight size={17}/></a><small>Include your event date, location and the kind of booking you have in mind.</small></div></div></section>

      <section className="partnership section-pad"><div className="section-kicker"><span>09 / IN GOOD COMPANY</span><span>AN OPEN DOOR FOR THE RIGHT IDEAS</span></div><div className="partnership-grid"><h2>Culture has<br/>room for <em>you.</em></h2><div><p>We’re interested in collaborations that bring something real to the room. Venue partnerships, creative campaigns, artist bookings and ideas without a category.</p><a href="#bookings" className="button button-outline">START A CONVERSATION <ArrowUpRight size={15}/></a></div></div><div className="partner-tags"><span>VENUE & FESTIVAL PARTNERSHIPS</span><span>CREATIVE CAMPAIGNS</span><span>ARTIST BOOKINGS</span><span>IDEAS WORTH BUILDING</span></div></section>

      <section className="connect section-pad" id="connect"><div className="connect-text"><div className="eyebrow"><i/> OCCASIONAL NOTES. ALWAYS INTENTIONAL.</div><h2>Under one<br/><em>roof.</em></h2><p>First invites. New sounds. Things worth knowing.<br/>No noise for the sake of it.</p><form className="signup" onSubmit={submit} noValidate><label htmlFor="email">YOUR EMAIL ADDRESS</label><div className="signup-field"><input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@somewhere.com" autoComplete="email" aria-describedby="form-message"/><button type="submit" aria-label="Join the list"><Send size={17}/></button></div><label className="consent-label"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I agree to receive occasional BLACK AMBRELLA updates. I can unsubscribe at any time.</span></label><div id="form-message" className="form-message" aria-live="polite">{formMessage || 'Your email is sent to the configured list endpoint only after consent. No email service is connected yet.'}</div></form></div><div className="connect-aside"><Emblem/><span className="connect-aside-title">THE UMBRELLA IS OPEN.</span><span className="connect-aside-copy">Artists, collaborators, good people.<br/>There’s room for you here.</span><a href="mailto:blackambrellasa@gmail.com" className="email-link">BLACKAMBRELLASA@GMAIL.COM <ArrowUpRight size={14}/></a><a href="tel:+27623193091" className="social-link"><span>CALL / WHATSAPP</span> +27 62 319 3091</a></div></section>
    </main>
    <footer className="footer"><div className="footer-main"><a className="brand-lockup" href="#home"><Emblem small/><span>BLACK<br/>AMBRELLA</span></a><span className="footer-line">WE DON’T FOLLOW THE CULTURE.<br/>WE SET THE SCENE.</span><a className="back-top" href="#home">BACK TO THE TOP <ArrowLeft size={14}/></a></div><div className="footer-bottom"><span>© BLACK AMBRELLA 2026</span><span>AN INDEPENDENT CREATIVE UNIVERSE.</span><a href="mailto:blackambrellasa@gmail.com">BOOKINGS & ENQUIRIES ↗</a></div></footer>
  </>
}

export default App
