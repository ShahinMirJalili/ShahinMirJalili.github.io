(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* ===== Sprache ===== */
  const langBtn = document.getElementById('langToggle');
  let lang = localStorage.getItem('lang') || 'de';
  let statementSplit = null;
  let statementTween = null;

  function applyLang(next) {
    lang = next;
    document.documentElement.lang = next;
    localStorage.setItem('lang', next);
    langBtn.textContent = next === 'de' ? 'EN' : 'DE';
    resetStatement(); // SplitText zurücksetzen BEVOR neue Texte gesetzt werden
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const val = I18N[next][el.dataset.i18n];
      if (val === undefined) return;
      if (val.indexOf('<') !== -1) { el.innerHTML = val; }
      else { el.textContent = val; }
    });
    splitStatement();
  }

  function resetStatement() {
    if (statementTween) {
      if (statementTween.scrollTrigger) statementTween.scrollTrigger.kill();
      statementTween.kill();
      statementTween = null;
    }
    if (statementSplit) { statementSplit.revert(); statementSplit = null; }
  }

  langBtn.addEventListener('click', function () {
    applyLang(lang === 'de' ? 'en' : 'de');
  });

  /* ===== Reveals (leichtgewichtig, ohne GSAP) ===== */
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  if (reduceMotion || typeof gsap === 'undefined') {
    if (lang !== 'de') applyLang(lang);
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ===== Lenis — nur Desktop, auf Touch aus ===== */
  if (!isTouch && typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ===== Hero ===== */
  gsap.from('.hero__title .line > span', {
    yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.15
  });
  gsap.from('.hero__portrait', {
    opacity: 0, scale: 1.06, duration: 1.4, ease: 'power3.out', delay: 0.3
  });
  gsap.from('.hero__tag, .hero__meta', {
    opacity: 0, y: 20, duration: 0.9, ease: 'power2.out', delay: 0.8, stagger: 0.1
  });
  gsap.to('.hero__portrait img', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero__title', {
    yPercent: -18, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* ===== Statement — Wörter scrubben rein ===== */
  function splitStatement() {
    const el = document.getElementById('statementText');
    if (!el || reduceMotion || typeof SplitText === 'undefined' || typeof gsap === 'undefined') return;
    statementSplit = new SplitText(el, { type: 'words', wordsClass: 'word' });
    gsap.set(statementSplit.words, { opacity: 0.12 });
    statementTween = gsap.to(statementSplit.words, {
      opacity: 1, stagger: 0.06, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true }
    });
  }

  /* ===== Cases — Media-Parallax ===== */
  document.querySelectorAll('.case__media').forEach(function (media) {
    const inner = media.querySelector('img, .ph');
    if (!inner) return;
    gsap.fromTo(inner, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ===== Timeline — Linie zeichnet sich ===== */
  gsap.to('#tlProgress', {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 60%', scrub: true }
  });

  /* Initiale Sprache anwenden — erst wenn Fonts geladen sind (SplitText misst sonst falsch) */
  Promise.all([
    document.fonts.load('600 1em "Clash Display"'),
    document.fonts.load('400 1em "Hanken Grotesk"')
  ]).then(function () { return document.fonts.ready; })
    .then(function () { applyLang(lang); });
})();
