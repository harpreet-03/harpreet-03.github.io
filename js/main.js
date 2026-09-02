/* ============================================================================
   MAIN.JS
   Content lives in js/data.js — this file renders it and drives motion.
   Load order in index.html: js/data.js THEN js/main.js.
   ============================================================================ */

const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ═══════════════════════════════════════════════════════════════════════
   LOADER
   ═══════════════════════════════════════════════════════════════════════ */
const loaderEl = document.getElementById("loader");

function dismissLoader() {
  if (!loaderEl || loaderEl.classList.contains("is-done")) return;
  loaderEl.classList.add("is-done");
  setTimeout(() => {
    document.documentElement.classList.remove("is-loading");
  }, 500);
  setTimeout(() => {
    loaderEl.style.display = "none";
  }, 650);
}

if (loaderEl) {
  document.documentElement.classList.add("is-loading");
  setTimeout(dismissLoader, 1100);
}

/* ═══════════════════════════════════════════════════════════════════════
   RENDER: PROJECT CARDS
   ═══════════════════════════════════════════════════════════════════════ */
function renderProjects() {
  const grid = document.getElementById("grid");
  if (!grid || typeof PROJECTS === "undefined") return;

  grid.innerHTML = PROJECTS.map((p, i) => `
    <article class="proj-card" data-project-index="${i}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="View details for ${p.name}">
      <div class="proj-media">
        <div class="proj-media-abstract">
          <span class="proj-media-pattern"></span>
          <span class="proj-media-icon"><iconify-icon icon="${p.icon || "solar:code-square-linear"}" width="22"></iconify-icon></span>
          <span class="proj-media-num">${String(i + 1).padStart(2, "0")}</span>
        </div>
        ${p.status ? `<span class="absolute top-4 left-4 eyebrow uppercase bg-moss/80 text-surface px-3 py-1.5 rounded-full">${p.status}</span>` : p.featured ? `<span class="absolute top-4 left-4 eyebrow uppercase bg-sand/90 text-ink px-3 py-1.5 rounded-full">Featured</span>` : ""}
        <span class="absolute bottom-4 left-4 eyebrow uppercase bg-dark/70 backdrop-blur-sm text-surface/80 px-3 py-1.5 rounded-full">${p.tag}</span>
      </div>
      <div class="p-6">
        <h3 class="font-serif text-xl text-surface mb-1">${p.name}</h3>
        <div class="text-surface/50 text-xs font-light mb-4">${p.subtitle}</div>
        <p class="text-surface/60 text-sm font-light leading-relaxed mb-5">${p.description}</p>
        <div class="flex flex-wrap gap-2 mb-5">
          ${p.stack.map((s) => `<span class="eyebrow bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-surface/60">${s}</span>`).join("")}
        </div>
        <a href="${p.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-sand hover:text-surface transition-colors" data-project-link>
          View project ↗
        </a>
      </div>
    </article>
  `).join("");
}

/* ═══════════════════════════════════════════════════════════════════════
   RENDER: SKILL FIELD
   Skills in data.js are a flat list, so they're grouped here into
   readable categories for display. A skill that doesn't match any
   pattern below falls into "Other" rather than being dropped.
   ═══════════════════════════════════════════════════════════════════════ */
function renderSkills() {
  if (typeof CORE_SKILLS === "undefined") return;
  const tickerEl = document.getElementById("skillsTicker");
  const tabsEl = document.getElementById("skillsTabs");
  const panelEl = document.getElementById("skillsPanel");
  if (!tickerEl || !tabsEl || !panelEl) return;

  /* Foundational languages + universal tooling live in the always-visible
     scrolling ticker rather than a tab — the stuff everyone recognizes
     at a glance. */
  const TICKER_SKILLS = ["Python", "Java", "SQL", "Git", "GitHub", "Docker", "REST APIs"];

  /* Everything else, grouped into tabs with plain, specific headings —
     "AI & Frameworks" used to lump concepts, APIs, and libraries into
     one vague bucket, so it's now split by what each thing actually is.
     Every name below must exist in CORE_SKILLS — the "leftover" safety
     net further down means a future edit to CORE_SKILLS can never
     silently vanish from this section, it'll just land in an "Other"
     tab until it's sorted properly here. */
  const TABS = [
    {
      label: "AI Concepts",
      icon: "solar:brain-linear",
      match: ["LLMs", "RAG", "NLP", "Machine Learning", "Deep Learning", "Prompt Engineering",
        "A/B Prompt Testing", "Hyperparameter Tuning", "Agentic Workflows", "Agent Design",
        "Tool Calling", "MCP (Model Context Protocol)"],
    },
    {
      label: "LLM Tools & APIs",
      icon: "solar:link-round-angle-linear",
      match: ["OpenAI GPT-3.5/4", "Google Gemini API", "Anthropic Claude API", "Ollama", "n8n",
        "LangChain", "LangGraph"],
    },
    {
      label: "ML Frameworks",
      icon: "solar:widget-5-linear",
      match: ["PyTorch", "TensorFlow", "Scikit-learn", "FastAPI", "HuggingFace Transformers",
        "SentenceTransformers", "spaCy", "NumPy", "Pandas", "XGBoost"],
    },
    {
      label: "Infrastructure",
      icon: "solar:server-square-linear",
      match: ["Firebase", "Streamlit", "PostgreSQL", "ChromaDB"],
    },
    {
      label: "CS Fundamentals",
      icon: "solar:square-academic-cap-linear",
      match: ["Data Structures & Algorithms", "Operating Systems", "DBMS", "Object-Oriented Programming"],
    },
  ];

  /* ── Ticker: build the strip, then duplicate it once so the CSS
     marquee (translateX 0 → -50%) loops with no visible seam. ── */
  const tickerItems = TICKER_SKILLS.filter((s) => CORE_SKILLS.includes(s));
  const tickerHtml = tickerItems.map((s) => `<span class="ticker-chip">${s}</span>`).join("");
  tickerEl.innerHTML = tickerHtml + tickerHtml;

  /* ── Tabs + panel ── */
  const used = new Set(TICKER_SKILLS);
  const groups = TABS.map((t) => {
    const skills = t.match.filter((s) => CORE_SKILLS.includes(s));
    skills.forEach((s) => used.add(s));
    return { ...t, skills };
  }).filter((t) => t.skills.length);

  const leftover = CORE_SKILLS.filter((s) => !used.has(s));
  if (leftover.length) groups.push({ label: "Other", icon: "solar:widget-4-linear", skills: leftover });

  tabsEl.innerHTML = groups.map((t, i) => `
    <button type="button" class="skills-tab${i === 0 ? " is-active" : ""}" data-tab-index="${i}" role="tab" aria-selected="${i === 0 ? "true" : "false"}">
      <iconify-icon icon="${t.icon}" width="15"></iconify-icon>
      <span>${t.label}</span>
    </button>
  `).join("");

  const renderPanel = (index) => {
    const t = groups[index];
    if (!t) return;
    panelEl.classList.remove("is-visible");
    // brief pause lets the fade/slide-out finish before the new tags swap in
    setTimeout(() => {
      panelEl.innerHTML = t.skills.map((s) => `<span class="skill-node">${s}</span>`).join("");
      panelEl.classList.add("is-visible");
    }, 150);
  };
  renderPanel(0);

  tabsEl.querySelectorAll(".skills-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-active")) return;
      tabsEl.querySelectorAll(".skills-tab").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      renderPanel(Number(btn.dataset.tabIndex));
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   RENDER: CERTIFICATIONS
   ═══════════════════════════════════════════════════════════════════════ */
function renderCertifications() {
  const grid = document.getElementById("certGrid");
  if (!grid || typeof CERTIFICATIONS === "undefined") return;

  grid.innerHTML = CERTIFICATIONS.map((c, i) => `
    <a class="cert-card block" href="${c.file}" target="_blank" rel="noopener">
      <div class="cert-thumb">
        ${c.image ? `<img src="${c.image}" alt="${c.name} certificate" loading="lazy">` : ""}
      </div>
      <div class="p-5">
        <div class="eyebrow uppercase text-dark/40 mb-2">${c.issuer}</div>
        <div class="font-serif text-base text-dark mb-3 leading-snug">${c.name}</div>
        <div class="flex items-center justify-between">
          <span class="eyebrow uppercase text-dark/40">${c.meta}</span>
          <span class="eyebrow uppercase text-moss">View ↗</span>
        </div>
      </div>
    </a>
  `).join("");
}

/* ═══════════════════════════════════════════════════════════════════════
   APPLY: SITE_LINKS + PUBLICATION
   ═══════════════════════════════════════════════════════════════════════ */
function applySiteLinks() {
  if (typeof SITE_LINKS === "undefined") return;
  const hrefFor = { github: SITE_LINKS.github, linkedin: SITE_LINKS.linkedin, resume: SITE_LINKS.resume };
  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    if (key in hrefFor && hrefFor[key]) el.setAttribute("href", hrefFor[key]);
  });
  document.querySelectorAll('[data-link-text="email"]').forEach((el) => { el.textContent = SITE_LINKS.email; });
  document.querySelectorAll('[data-link-text="phone"]').forEach((el) => { el.textContent = SITE_LINKS.phone; });
}

function applyPublication() {
  if (typeof PUBLICATION === "undefined") return;
  const desc = document.getElementById("pubDesc");
  if (desc) desc.textContent = PUBLICATION.title + " — " + PUBLICATION.venue;

  const stack = document.getElementById("pubStack");
  if (stack && Array.isArray(PUBLICATION.stack)) {
    stack.innerHTML = PUBLICATION.stack.map((s) => `<span class="research-tag bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-surface/60">${s}</span>`).join("");
  }

  const linkMap = { "pub-paper": PUBLICATION.paperUrl, "pub-pdf": PUBLICATION.pdfFile, "pub-scholar": PUBLICATION.scholarUrl };
  Object.entries(linkMap).forEach(([key, url]) => {
    const el = document.querySelector(`[data-link="${key}"]`);
    if (el) {
      if (url && url !== "#") { el.setAttribute("href", url); el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener"); }
      else { el.remove(); }
    }
  });
}

applySiteLinks();
applyPublication();
renderProjects();
renderCertifications();
renderSkills();

/* ═══════════════════════════════════════════════════════════════════════
   PROJECT CAROUSEL ARROWS
   ═══════════════════════════════════════════════════════════════════════ */
(function projectCarousel() {
  const track = document.getElementById("grid");
  const prev = document.getElementById("pPrev");
  const next = document.getElementById("pNext");
  if (!track || !prev || !next) return;

  const step = () => {
    const card = track.querySelector(".proj-card");
    const gap = 24; // matches gap-6
    return card ? card.getBoundingClientRect().width + gap : 340;
  };

  prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));

  const syncButtons = () => {
    const max = track.scrollWidth - track.clientWidth - 4;
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= max;
    prev.classList.toggle("opacity-30", prev.disabled);
    next.classList.toggle("opacity-30", next.disabled);
  };
  track.addEventListener("scroll", syncButtons, { passive: true });
  window.addEventListener("resize", syncButtons);
  setTimeout(syncButtons, 300);
})();

/* ═══════════════════════════════════════════════════════════════════════
   CERTIFICATION CAROUSEL ARROWS
   ═══════════════════════════════════════════════════════════════════════ */
(function certCarousel() {
  const track = document.getElementById("certGrid");
  const prev = document.getElementById("cPrev");
  const next = document.getElementById("cNext");
  if (!track || !prev || !next) return;

  const step = () => {
    const card = track.querySelector(".cert-card");
    const gap = 24; // matches gap-6
    return card ? card.getBoundingClientRect().width + gap : 300;
  };

  prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));

  const syncButtons = () => {
    const max = track.scrollWidth - track.clientWidth - 4;
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= max;
    prev.classList.toggle("opacity-30", prev.disabled);
    next.classList.toggle("opacity-30", next.disabled);
  };
  track.addEventListener("scroll", syncButtons, { passive: true });
  window.addEventListener("resize", syncButtons);
  setTimeout(syncButtons, 300);
})();

/* ═══════════════════════════════════════════════════════════════════════
   CUSTOM CURSOR
   A small dot (tracks the pointer 1:1) plus a larger ring that trails it
   with a soft spring lag — widens over links/buttons, and grows into a
   "View" label over project/certification cards. Desktop only: gated on
   `pointer: fine` so touch devices never get cursor:none or the extra
   listeners. Independent of GSAP/reduced-motion gating used elsewhere —
   this only ever moves in direct response to real pointer input, never
   on its own, so it stays on even when other motion is dialed back; it
   just skips the trailing spring lag in that case (ring tracks 1:1).
   ═══════════════════════════════════════════════════════════════════════ */
(function customCursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const label = document.getElementById("cursorRingLabel");
  if (!dot || !ring || !label) return;

  document.documentElement.classList.add("has-custom-cursor");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  // Snappier trailing — the previous 0.18 took ~250ms to catch up, which
  // read as sluggish. 0.35 catches up in under 100ms while still keeping
  // a visible bit of spring so it doesn't feel like a rigid 1:1 clone.
  const lag = RM ? 1 : 0.35;

  // mousemove can fire far more often than the screen refreshes (some
  // trackpads/high-poll-rate mice fire well past 60/frame-second) — the
  // previous version wrote dot.style.transform directly in this handler
  // on every single one of those events, outside the browser's natural
  // paint cadence. That's what was actually causing the lag/heaviness.
  // Now the handler only updates two numbers; the one rAF loop below is
  // the sole place either cursor piece touches the DOM, once per frame.
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  (function raf() {
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    ringX += (mouseX - ringX) * lag;
    ringY += (mouseY - ringY) * lag;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(raf);
  })();

  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "";
    ring.style.opacity = "";
  });

  const HOVERABLE = 'a, button, [role="button"], .skills-tab, .ticker-chip, .skill-node';
  const VIEWABLE = ".proj-card, .cert-card";

  // Delegated on document — recomputed on every element the pointer
  // enters, so there's no separate "unhover" bookkeeping to get wrong.
  document.addEventListener("mouseover", (e) => {
    const viewCard = e.target.closest(VIEWABLE);
    const hoverEl = e.target.closest(HOVERABLE);
    if (viewCard) {
      ring.classList.add("is-view");
      ring.classList.remove("is-hover");
      dot.classList.add("is-hidden");
      label.textContent = viewCard.classList.contains("cert-card") ? "View" : "View project";
    } else if (hoverEl) {
      ring.classList.add("is-hover");
      ring.classList.remove("is-view");
      dot.classList.add("is-hidden");
    } else {
      ring.classList.remove("is-hover", "is-view");
      dot.classList.remove("is-hidden");
    }
  });
})();

/* ═══════════════════════════════════════════════════════════════════════
   PROJECT DETAIL MODAL
   ═══════════════════════════════════════════════════════════════════════ */
(function projectModal() {
  const grid = document.getElementById("grid");
  const modal = document.getElementById("pModal");
  if (!grid || !modal || typeof PROJECTS === "undefined") return;

  const media = document.getElementById("pmMedia");
  const badge = document.getElementById("pmBadge");
  const headline = document.getElementById("pmHeadline");
  const titleEl = document.getElementById("pmTitle");
  const subEl = document.getElementById("pmSub");
  const descEl = document.getElementById("pmDesc");
  const stackEl = document.getElementById("pmStack");
  const linkEl = document.getElementById("pmLink");
  const linkHostEl = document.getElementById("pmLinkHost");
  const demoBtn = document.getElementById("pmDemoBtn");
  const copyBtn = document.getElementById("pmCopyBtn");
  const closeBtn = document.getElementById("pmClose");
  const moreBtn = document.getElementById("pmMore");
  const moreMenu = document.getElementById("pmMoreMenu");
  const statCategory = document.getElementById("pmStatCategory");
  const statStack = document.getElementById("pmStatStack");
  const statStatus = document.getElementById("pmStatStatus");
  const playBtn = document.getElementById("pmPlayBtn");
  const pauseHint = document.getElementById("pmPauseHint");

  let lastFocused = null;
  let copyResetTimer = null;

  function readableLink(url) {
    try {
      const u = new URL(url);
      return (u.hostname + u.pathname).replace(/^www\./, "").replace(/\/$/, "");
    } catch { return url; }
  }

  async function copyLink(url) {
    try { await navigator.clipboard.writeText(url); return true; } catch { return false; }
  }

  function flashCopied(el, label) {
    const original = el.dataset.label || el.getAttribute("aria-label");
    el.classList.add("is-copied");
    if (label) el.setAttribute("aria-label", label);
    clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      el.classList.remove("is-copied");
      if (label && original) el.setAttribute("aria-label", original);
    }, 1400);
  }

  function closeMoreMenu() {
    moreMenu.classList.remove("is-open");
    moreBtn.setAttribute("aria-expanded", "false");
  }

  function open(index) {
    const p = PROJECTS[index];
    if (!p) return;

    media.innerHTML = p.video
      ? `<video src="${p.video}" ${p.image ? `poster="${p.image}"` : ""} autoplay muted loop playsinline preload="metadata"></video>`
      : p.image
        ? `<img src="${p.image}" alt="${p.name} project preview">`
        : `<div class="pmodal-mono">${String(index + 1).padStart(2, "0")}</div>`;

    const videoEl = media.querySelector("video");
    if (videoEl) {
      playBtn.style.display = "flex";
      playBtn.setAttribute("aria-label", "Pause video");
      playBtn.querySelector(".icon-pause").style.display = "block";
      playBtn.querySelector(".icon-play").style.display = "none";
      pauseHint.classList.remove("is-visible");
    } else {
      playBtn.style.display = "none";
      pauseHint.classList.remove("is-visible");
    }

    const badgeText = p.status || (p.featured ? "Featured" : "");
    badge.textContent = badgeText;
    badge.style.display = badgeText ? "inline-flex" : "none";

    const segments = [p.tag, p.status || (p.featured ? "Featured project" : "")].filter(Boolean);
    headline.innerHTML = segments.map((s, i) => `<span class="${i === 0 ? "pmodal-hl-tag" : "pmodal-hl-sub"}">${s}</span>`).join('<span class="pmodal-hl-dot">·</span>');

    titleEl.textContent = p.name || "";
    subEl.textContent = p.subtitle || "";
    descEl.textContent = p.longDescription || p.description || "";
    stackEl.innerHTML = (p.stack || []).map((s) => `<span>${s}</span>`).join("");

    linkEl.setAttribute("href", p.link || "#");
    linkHostEl.textContent = p.link ? readableLink(p.link) : "";

    if (p.demoUrl) { demoBtn.setAttribute("href", p.demoUrl); demoBtn.style.display = "flex"; }
    else { demoBtn.style.display = "none"; }

    statCategory.textContent = p.tag || "—";
    statStack.textContent = p.stack && p.stack.length ? `${p.stack.length} tools` : "—";
    statStatus.textContent = p.status || (p.featured ? "Featured" : "Completed");

    closeMoreMenu();
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("pmodal-lock");
    closeBtn.focus();
  }

  function close() {
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("pmodal-lock");
    closeMoreMenu();
    const video = media.querySelector("video");
    if (video) video.pause();
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  grid.addEventListener("click", (e) => {
    if (e.target.closest("[data-project-link]")) return;
    const card = e.target.closest("[data-project-index]");
    if (!card) return;
    open(Number(card.dataset.projectIndex));
  });

  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest("[data-project-index]");
    if (!card) return;
    e.preventDefault();
    open(Number(card.dataset.projectIndex));
  });

  closeBtn.addEventListener("click", close);
  modal.querySelector("[data-pmodal-close]").addEventListener("click", close);

  playBtn.addEventListener("click", () => {
    const video = media.querySelector("video");
    if (!video) return;
    const pauseIcon = playBtn.querySelector(".icon-pause");
    const playIcon = playBtn.querySelector(".icon-play");
    if (video.paused) {
      video.play();
      pauseIcon.style.display = "block";
      playIcon.style.display = "none";
      playBtn.setAttribute("aria-label", "Pause video");
      pauseHint.classList.remove("is-visible");
    } else {
      video.pause();
      pauseIcon.style.display = "none";
      playIcon.style.display = "block";
      playBtn.setAttribute("aria-label", "Resume video");
      pauseHint.classList.add("is-visible");
    }
  });

  pauseHint.addEventListener("click", () => playBtn.click());
  pauseHint.style.pointerEvents = "auto";
  pauseHint.style.cursor = "pointer";

  copyBtn.addEventListener("click", async () => {
    const ok = await copyLink(linkEl.getAttribute("href"));
    if (ok) flashCopied(copyBtn, "Link copied");
  });

  moreBtn.addEventListener("click", () => {
    const isOpen = moreMenu.classList.toggle("is-open");
    moreBtn.setAttribute("aria-expanded", String(isOpen));
  });

  moreMenu.addEventListener("click", async (e) => {
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (!action) return;
    const url = linkEl.getAttribute("href");
    if (action === "copy") { const ok = await copyLink(url); if (ok) flashCopied(moreBtn); }
    else if (action === "open") { window.open(url, "_blank", "noopener"); }
    closeMoreMenu();
  });

  document.addEventListener("click", (e) => {
    if (!moreMenu.classList.contains("is-open")) return;
    if (e.target.closest("#pmMore") || e.target.closest("#pmMoreMenu")) return;
    closeMoreMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (moreMenu.classList.contains("is-open")) { closeMoreMenu(); return; }
    close();
  });
})();

/* ═══════════════════════════════════════════════════════════════════════
   MOBILE NAV
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("navMobileMenu");
  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════════════
   GSAP MOTION + MAGNETIC BUTTONS + WEBGL BACKGROUND
   ═══════════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  if (RM || typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".gsap-hero-el", {
    y: 30, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.5,
  });

  /* Apple-style hero exit: the frame is already an inset rounded card
     at rest. As the hero scrolls out of view, it eases down in scale —
     a "closing into a card" feel instead of just cutting to the next
     section. Tied to scroll position (scrub), not time, so it tracks
     the gesture 1:1.
     Deliberately transform-only: earlier this also animated the CSS
     `inset` custom property, which forces a full layout reflow on a
     viewport-sized element every single scroll frame — that's what
     made scrolling feel heavy. `scale` is compositor-only (GPU), so
     shrinking the frame this way gets the same "closing card" look —
     it reveals more of the dark margin around it as it scales down —
     at a fraction of the cost. */
  const heroFrame = document.querySelector(".hero-frame");
  if (heroFrame && typeof ScrollTrigger !== "undefined") {
    gsap.to(heroFrame, {
      scale: 0.92,
      ease: "none",
      scrollTrigger: {
        trigger: "#top",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  gsap.utils.toArray(".gsap-fade-up").forEach((section) => {
    gsap.from(section, {
      scrollTrigger: { trigger: section, start: "top 85%" },
      y: 36, opacity: 0, duration: 0.9, ease: "power3.out",
    });
  });

  gsap.utils.toArray(".gsap-scale-up").forEach((img) => {
    gsap.from(img, {
      scrollTrigger: { trigger: img, start: "top 85%" },
      scale: 0.94, opacity: 0, duration: 1.1, ease: "expo.out",
    });
  });

  gsap.utils.toArray(".proj-card").forEach((card) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 90%" },
      y: 24, opacity: 0, duration: 0.7, ease: "power2.out",
    });
  });

  const skillsSection = document.querySelector(".skills-tabs-wrap");
  if (skillsSection) {
    gsap.from([".skills-ticker", ".skills-tabs-wrap"], {
      scrollTrigger: { trigger: skillsSection, start: "top 85%" },
      y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power2.out",
    });
  }

  document.querySelectorAll(".magnetic-wrap").forEach((el) => {
    const target = el.children[0];
    if (!target) return;
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(target, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(target, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    });
  });
});

/* ═══════════════════════════════════════════════════════════════════════
   HERO BACKGROUND PHOTO (optional)
   Drop a file at assets/images/hero-bg.jpg and it fades in automatically.
   If it's missing, the CSS pattern behind it stays as the background —
   nothing ever looks broken either way.
   ═══════════════════════════════════════════════════════════════════════ */
(function heroBackgroundPhoto() {
  const el = document.querySelector(".hero-bg-photo");
  if (!el) return;
  const src = el.dataset.bg;
  if (!src) return;
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url('${src}')`;
    el.classList.add("is-loaded");
  };
  img.src = src;
})();