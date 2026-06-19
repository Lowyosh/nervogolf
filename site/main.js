/* ─── Dropdown: close on link click or outside click ────────────────────── */
(function initDetailsClose() {
  document.querySelectorAll('details').forEach(details => {
    details.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => { details.removeAttribute('open'); });
    });
  });

  document.addEventListener('click', e => {
    document.querySelectorAll('details[open]').forEach(details => {
      if (!details.contains(e.target)) details.removeAttribute('open');
    });
  });
})();

/* ─── Smooth anchor navigation ────────────────────────────────────────────── */
document.querySelectorAll('a[href^="/#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    a.closest('details')?.removeAttribute('open');
    const target = document.querySelector(a.getAttribute('href').slice(1));
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── GSAP ScrollTrigger ──────────────────────────────────────────────────── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ─── Section title character animations ─────────────────────────────────── */
(function initTitleAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  function splitToCharSpans(el) {
    const spans = [];
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        [...node.textContent].forEach(char => {
          if (!char.trim()) {
            // Conservamos los espacios como texto normal para no colapsarlos
            frag.appendChild(document.createTextNode(char));
            return;
          }
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          spans.push(span);
          frag.appendChild(span);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        spans.push(node);
      }
    });
    return spans;
  }

  document.querySelectorAll('section h3').forEach(heading => {
    const chars = splitToCharSpans(heading);
    if (!chars.length) return;

    gsap.set(chars, { y: 40, opacity: 0 });

    ScrollTrigger.create({
      trigger: heading,
      start: 'top 88%',
      end: 'bottom 12%',
      onEnter: () => {
        gsap.fromTo(chars,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' }
        );
      },
      onLeave: () => {
        gsap.to([...chars].reverse(),
          { y: -40, opacity: 0, duration: 0.35, stagger: 0.03, ease: 'power2.in' }
        );
      },
      onEnterBack: () => {
        gsap.fromTo([...chars].reverse(),
          { y: -40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' }
        );
      },
      onLeaveBack: () => {
        gsap.to(chars,
          { y: 40, opacity: 0, duration: 0.35, stagger: 0.03, ease: 'power2.in' }
        );
      }
    });
  });
})();

/* ─── Cookie Consent ──────────────────────────────────────────────────────── */
const CONSENT_KEY = 'nervogolf_cookie_consent';

function loadTrackingScripts() {
  const s1 = document.createElement('script');
  s1.async = true;
  s1.src = 'https://www.googletagmanager.com/gtag/js?id=G-Y0SN420WNE';
  document.head.appendChild(s1);

  const s2 = document.createElement('script');
  s2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-Y0SN420WNE');
  `;
  document.head.appendChild(s2);

  const s3 = document.createElement('script');
  s3.textContent = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1814325216617453');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(s3);
}

(function initCookieConsent() {
  const consent = localStorage.getItem(CONSENT_KEY);
  if (consent === 'accepted') { loadTrackingScripts(); return; }
  if (consent === 'declined') return;

  const banner = document.getElementById('cookie-banner');
  if (banner) banner.style.display = '';

  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    banner.style.display = 'none';
    loadTrackingScripts();
  });

  document.getElementById('cookie-decline')?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    banner.style.display = 'none';
  });
})();

/* ─── Copy to clipboard (contacto.html) ──────────────────────────────────── */
document.querySelectorAll('.copy-phone').forEach(btn => {
  btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(btn.dataset.number);
    const iconCopy = btn.querySelector('.icon-copy');
    const iconCheck = btn.querySelector('.icon-check');
    iconCopy.classList.add('hidden');
    iconCheck.classList.remove('hidden');
    setTimeout(() => {
      iconCopy.classList.remove('hidden');
      iconCheck.classList.add('hidden');
    }, 1500);
  });
});

/* ─── Simuladores card animations ───────────────────────────────────────── */
(function initSimuladoresCards() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('#simuladores .card').forEach(card => {
    gsap.set(card, { opacity: 0, filter: 'blur(16px)', y: 24 });

    ScrollTrigger.create({
      trigger: card,
      start: 'top 88%',
      end: 'bottom 12%',
      onEnter: () => {
        gsap.killTweensOf(card);
        gsap.to(card, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power2.out' });
      },
      onLeave: () => {
        gsap.killTweensOf(card);
        gsap.to(card, { opacity: 0, filter: 'blur(16px)', y: -24, duration: 0.5, ease: 'power2.in' });
      },
      onEnterBack: () => {
        gsap.killTweensOf(card);
        gsap.to(card, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power2.out' });
      },
      onLeaveBack: () => {
        gsap.killTweensOf(card);
        gsap.to(card, { opacity: 0, filter: 'blur(16px)', y: 24, duration: 0.7, ease: 'power2.in' });
      }
    });
  });
})();

/* ─── Planes cards formation animation ───────────────────────────────────── */
(function initPlanesCards() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const cards = Array.from(document.querySelectorAll('#planes .card'));
  if (!cards.length) return;

  // Member=0, Gold=1, Platinum=2 — Gold lidera, las otras siguen 150ms después
  const delays = [0.15, 0, 0.15];

  gsap.set(cards, { opacity: 0, y: 52 });

  ScrollTrigger.create({
    trigger: '#planes',
    start: 'top 78%',
    onEnter: () => {
      cards.forEach((card, i) => {
        gsap.killTweensOf(card);
        gsap.to(card, { opacity: 1, y: 0, duration: 0.75, delay: delays[i], ease: 'power2.out' });
      });
    },
    onLeaveBack: () => {
      cards.forEach((card, i) => {
        gsap.killTweensOf(card);
        gsap.to(card, { opacity: 0, y: 52, duration: 0.4, delay: delays[i] * 0.5, ease: 'power2.in' });
      });
    },
    onEnterBack: () => {
      cards.forEach((card, i) => {
        gsap.killTweensOf(card);
        gsap.to(card, { opacity: 1, y: 0, duration: 0.75, delay: delays[i], ease: 'power2.out' });
      });
    },
  });
})();

/* ─── Performance Club title motion blur ─────────────────────────────────── */
(function initMotionBlur() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const title = document.querySelector('#performance-club h2');
  if (!title) return;

  let clearBlur;
  ScrollTrigger.create({
    trigger: '#performance-club',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate(self) {
      const blur = Math.min(Math.abs(self.getVelocity()) / 300, 10);
      gsap.to(title, { filter: `blur(${blur}px)`, duration: 0.05, overwrite: true });
      clearTimeout(clearBlur);
      clearBlur = setTimeout(() => {
        gsap.to(title, { filter: 'blur(0px)', duration: 0.4, overwrite: true });
      }, 80);
    },
  });
})();

/* ─── Countdown (apertura) ───────────────────────────────────────────────── */
(function initCountdown() {
  const timer = document.querySelector('.countdown-timer');
  if (!timer) return;

  const deadline = new Date(timer.dataset.deadline).getTime();
  if (Number.isNaN(deadline)) return;

  const units = {
    days: timer.querySelector('[data-unit="days"]'),
    hours: timer.querySelector('[data-unit="hours"]'),
    minutes: timer.querySelector('[data-unit="minutes"]'),
    seconds: timer.querySelector('[data-unit="seconds"]'),
  };

  function setValue(el, value) {
    if (!el) return;
    el.style.setProperty('--value', value);
    el.setAttribute('aria-label', value);
    el.textContent = value;
  }

  function tick() {
    const diff = Math.max(0, deadline - Date.now());
    const totalSeconds = Math.floor(diff / 1000);

    setValue(units.days, Math.floor(totalSeconds / 86400));
    setValue(units.hours, Math.floor((totalSeconds % 86400) / 3600));
    setValue(units.minutes, Math.floor((totalSeconds % 3600) / 60));
    setValue(units.seconds, totalSeconds % 60);

    if (diff === 0) clearInterval(interval);
  }

  tick();
  const interval = setInterval(tick, 1000);
})();

/* ─── Text rotator (tienda) ──────────────────────────────────────────────── */
(function initTextRotate() {
  const container = document.querySelector('.text-rotate > span');
  if (!container) return;
  const words = Array.from(container.querySelectorAll('span'));
  words.forEach((w, i) => { w.style.display = i === 0 ? 'inline' : 'none'; });
  let i = 0;
  setInterval(() => {
    words[i].style.display = 'none';
    i = (i + 1) % words.length;
    words[i].style.display = 'inline';
  }, 2000);
})();
