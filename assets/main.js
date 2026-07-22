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

  /* Initiale Sprache anwenden — erst wenn Fonts geladen sind (SplitText misst sonst falsch) */
  Promise.all([
    document.fonts.load('600 1em "Clash Display"'),
    document.fonts.load('400 1em "Hanken Grotesk"')
  ]).then(function () { return document.fonts.ready; })
    .then(function () { applyLang(lang); });
})();
