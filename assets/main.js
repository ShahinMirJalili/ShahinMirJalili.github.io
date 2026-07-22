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
  document.querySelectorAll('.tl__item').forEach(function (el) { io.observe(el); });

  if (reduceMotion || typeof gsap === 'undefined') {
    if (lang !== 'de') applyLang(lang);
    return;
  }

  document.documentElement.classList.add('anim');
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ===== Lenis — nur Desktop, auf Touch aus ===== */
  if (!isTouch && typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ===== Hero-Intro (alle Viewports) ===== */
  gsap.from('.hero__title .line > span', {
    yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.15
  });
  gsap.from('.hero__portrait', {
    opacity: 0, scale: 1.06, duration: 1.4, ease: 'power3.out', delay: 0.3
  });
  gsap.from('.hero__tag, .hero__meta', {
    opacity: 0, y: 20, duration: 0.9, ease: 'power2.out', delay: 0.8, stagger: 0.1
  });

  /* ===== Statement — Wörter scrubben rein ===== */
  function splitStatement() {
    const el = document.getElementById('statementText');
    if (!el || reduceMotion || typeof SplitText === 'undefined' || typeof gsap === 'undefined') return;
    statementSplit = new SplitText(el, { type: 'words', wordsClass: 'word' });
    gsap.set(statementSplit.words, { opacity: 0.12 });
    const cfg = {
      trigger: el, start: 'top 80%', end: 'top 25%', scrub: true
    };
    if (window.innerWidth >= 768) cfg.pinnedContainer = '.statement';
    statementTween = gsap.to(statementSplit.words, {
      opacity: 1, stagger: 0.06, ease: 'none', scrollTrigger: cfg
    });
  }

  /* ===== Timeline — Linie zeichnet sich (alle Viewports) ===== */
  gsap.to('#tlProgress', {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 60%', scrub: true }
  });

  const mm = gsap.matchMedia();

  /* ===== Desktop: Fenster-Übergänge ===== */
  mm.add('(min-width: 768px)', function () {

    /* Hero pinnen — Statement schiebt sich als Fenster darüber */
    ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: '+=100%',
      pin: true, pinSpacing: false
    });
    gsap.timeline({
      scrollTrigger: { trigger: '.statement', start: 'top bottom', end: 'top top', scrub: true }
    })
      .to('.hero__stage', { scale: 0.94, opacity: 0.3, ease: 'none' }, 0)
      .to('.hero__meta', { opacity: 0, ease: 'none' }, 0)
      .to('.hero__title--back', { xPercent: -6, ease: 'none' }, 0)
      .to('.hero__title--front', { xPercent: 6, ease: 'none' }, 0);

    /* Statement pinnen — Work öffnet sich als Fenster darüber */
    ScrollTrigger.create({
      trigger: '.statement', start: 'top top', end: '+=100%',
      pin: true, pinSpacing: false
    });
    gsap.timeline({
      scrollTrigger: { trigger: '.work', start: 'top bottom', end: 'top top', scrub: true }
    })
      .to('.statement .wrap', { scale: 0.96, opacity: 0.25, ease: 'none' }, 0)
      .fromTo('.work',
        { clipPath: 'inset(8% 6% 0% 6% round 24px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' }, 0);

    /* Journey + Kontakt: Fenster-Reveal beim Reinscrollen */
    ['.journey', '.contact'].forEach(function (sel) {
      gsap.fromTo(sel,
        { clipPath: 'inset(10% 6% 0% 6% round 24px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
          scrollTrigger: { trigger: sel, start: 'top 95%', end: 'top 25%', scrub: true }
        });
    });

    /* Card-Stack: vorherige Karte schrumpft, wenn die nächste drüberschiebt */
    const cases = gsap.utils.toArray('.case');
    cases.forEach(function (card, i) {
      const next = cases[i + 1];
      if (!next) return;
      gsap.to(card, {
        scale: 0.94, opacity: 0.5, ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true }
      });
    });

    /* Ghost-Nummern ziehen beim Scroll vorbei */
    gsap.utils.toArray('.case__ghost').forEach(function (g) {
      gsap.fromTo(g, { yPercent: 18 }, {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: g.closest('.case'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* Ghost-Jahre in der Timeline */
    gsap.utils.toArray('.tl__ghostyear').forEach(function (g) {
      gsap.fromTo(g, { xPercent: 8, opacity: 0 }, {
        xPercent: -6, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: g.closest('.tl__item'), start: 'top bottom', end: 'bottom center', scrub: true }
      });
    });

    /* Case-Media: inneres Parallax */
    document.querySelectorAll('.case__media').forEach(function (media) {
      const inner = media.querySelector('img');
      if (!inner || media.classList.contains('case__media--phones')) return;
      gsap.fromTo(inner, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* Journey-Fotos: inneres Parallax */
    document.querySelectorAll('.tl__photo img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: img.closest('.tl__photo'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    return function () {}; // cleanup übernimmt matchMedia
  });

  /* ===== Mobile: nur leichtes Portrait-Parallax ===== */
  mm.add('(max-width: 767px)', function () {
    gsap.to('.hero__portrait img', {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  });

  /* ===== Maus-Blobs — Lerp-Follow + Idle-Drift (nur Pointer fine) ===== */
  const pointerFine = window.matchMedia('(pointer: fine)').matches;
  if (pointerFine) {
    const blobA = document.getElementById('blobA');
    const blobB = document.getElementById('blobB');
    let mx = window.innerWidth * 0.5, my = window.innerHeight * 0.45;
    let ax = mx, ay = my, bx = mx, by = my;
    let lastMove = performance.now();
    let idleAmp = 0;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      lastMove = performance.now();
    }, { passive: true });

    gsap.ticker.add(function () {
      const now = performance.now();
      const idle = now - lastMove > 2500;
      idleAmp += ((idle ? 1 : 0) - idleAmp) * 0.02;
      const t = now * 0.00022;
      const tx = mx + Math.sin(t * 1.3) * 90 * idleAmp;
      const ty = my + Math.cos(t) * 70 * idleAmp;
      ax += (tx - ax) * 0.055;
      ay += (ty - ay) * 0.055;
      bx += (tx - bx) * 0.028;
      by += (ty - by) * 0.028;
      blobA.style.transform = 'translate3d(' + ax + 'px,' + ay + 'px,0)';
      blobB.style.transform = 'translate3d(' + bx + 'px,' + by + 'px,0)';
    });
  }

  /* ===== Custom-Cursor-Dot (nur Pointer fine) ===== */
  if (pointerFine) {
    document.documentElement.classList.add('has-cursor');
    const dot = document.getElementById('cursorDot');
    let cx = -100, cy = -100, dx = -100, dy = -100;
    window.addEventListener('mousemove', function (e) { cx = e.clientX; cy = e.clientY; }, { passive: true });
    gsap.ticker.add(function () {
      dx += (cx - dx) * 0.3;
      dy += (cy - dy) * 0.3;
      dot.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
    });
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, .case')) dot.classList.add('is-grown');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, .case')) dot.classList.remove('is-grown');
    });
  }

  /* ===== Marquee — Endlos-Band, Tempo an Scroll-Speed gekoppelt ===== */
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    const marqueeTween = gsap.to(marqueeTrack, { xPercent: -50, ease: 'none', duration: 22, repeat: -1 });
    let speed = 1, speedTarget = 1;
    ScrollTrigger.create({
      onUpdate: function (self) {
        speedTarget = 1 + Math.min(Math.abs(self.getVelocity()) / 1200, 3);
      }
    });
    gsap.ticker.add(function () {
      speedTarget += (1 - speedTarget) * 0.05; // fällt von selbst auf 1 zurück
      speed += (speedTarget - speed) * 0.08;
      marqueeTween.timeScale(speed);
    });
  }

  /* Initiale Sprache anwenden — erst wenn Fonts geladen sind (SplitText misst sonst falsch) */
  Promise.all([
    document.fonts.load('600 1em "Clash Display"'),
    document.fonts.load('400 1em "Hanken Grotesk"')
  ]).then(function () { return document.fonts.ready; })
    .then(function () { applyLang(lang); });
})();
