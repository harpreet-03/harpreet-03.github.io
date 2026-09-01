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
function renderSkillField() {
  const field = document.getElementById("skillField");
  if (!field || typeof CORE_SKILLS === "undefined") return;

  /* Order here is the bento fill order: a "wide" tile (2 cols) paired
     with a "narrow" tile (1 col) fills each row evenly on a 3-column
     desktop grid — see .bento-grid in style.css. */
  const groups = [
    {
      label: "Frameworks & Libraries",
      icon: "solar:widget-5-linear",
      size: "wide",
      match: ["PyTorch", "TensorFlow", "Scikit-learn", "LangChain", "LangGraph", "FastAPI",
        "HuggingFace Transformers", "SentenceTransformers", "spaCy", "NumPy", "Pandas", "XGBoost"],
    },
    { label: "Languages", icon: "solar:code-square-linear", size: "narrow", match: ["Python", "Java", "JavaScript", "SQL"] },
    {
      label: "Infra & Data",
      icon: "solar:server-square-linear",
      size: "wide",
      match: ["Google Cloud Platform", "Firebase", "Docker", "Git", "GitHub", "REST APIs",
        "Streamlit", "PostgreSQL (pgvector)", "ChromaDB", "Redis"],
    },
    {
      label: "Models & APIs",
      icon: "solar:link-round-angle-linear",
      size: "narrow",
      match: ["OpenAI GPT-3.5/4", "Google Gemini API", "Anthropic Claude API", "Ollama", "n8n"],
    },
    {
      label: "AI / LLMs",
      icon: "solar:cpu-bolt-linear",
      size: "wide",
      match: ["LLMs", "RAG", "NLP", "Deep Learning", "Agentic Workflows", "Agent Design",
        "Prompt Engineering", "A/B Prompt Testing", "Hyperparameter Tuning"],
    },
    { label: "Fundamentals", icon: "solar:square-academic-cap-linear", size: "narrow", match: ["Data Structures & Algorithms", "Operating Systems", "DBMS", "OOP"] },
  ];

  const bucketed = new Set();
  const grouped = groups.map((g) => ({
    ...g,
    skills: CORE_SKILLS.filter((s) => g.match.includes(s) && (bucketed.add(s), true)),
  })).filter((g) => g.skills.length);

  const leftover = CORE_SKILLS.filter((s) => !bucketed.has(s));
  if (leftover.length) grouped.push({ label: "Other", icon: "solar:widget-4-linear", size: "narrow", skills: leftover });

  field.innerHTML = grouped.map((g) => `
    <div class="skill-card bento-${g.size}" data-skill-card>
      <div class="skill-card-head">
        <span class="skill-icon"><iconify-icon icon="${g.icon}" width="18"></iconify-icon></span>
        <span class="skill-group-label">${g.label}</span>
      </div>
      <div class="skill-chip-row">
        ${g.skills.map((s) => `<span class="skill-node" tabindex="0">${s}</span>`).join("")}
      </div>
    </div>
  `).join("");
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
renderSkillField();

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
     at rest. As the hero scrolls out of view, it insets and rounds
     further and eases back slightly in scale — a "closing into a
     card" feel instead of just cutting to the next section. Tied to
     scroll position (scrub), not time, so it tracks the gesture 1:1. */
  const heroFrame = document.querySelector(".hero-frame");
  if (heroFrame && typeof ScrollTrigger !== "undefined") {
    gsap.matchMedia().add(
      {
        isDesktop: "(min-width: 1024px)",
        isTablet: "(min-width: 640px) and (max-width: 1023.98px)",
        isMobile: "(max-width: 639.98px)",
      },
      (context) => {
        const { isDesktop, isTablet } = context.conditions;
        const endInset = isDesktop ? "48px" : isTablet ? "36px" : "22px";
        const endRadius = isDesktop ? "60px" : isTablet ? "46px" : "34px";
        gsap.to(heroFrame, {
          "--hero-inset": endInset,
          "--hero-radius": endRadius,
          scale: 0.95,
          ease: "none",
          scrollTrigger: {
            trigger: "#top",
            start: "top top",
            end: "bottom top",
            scrub: 0.4,
          },
        });
      }
    );
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

  const skillCards = gsap.utils.toArray(".skill-card");
  if (skillCards.length) {
    gsap.from(skillCards, {
      scrollTrigger: { trigger: "#skillField", start: "top 85%" },
      y: 28, opacity: 0, scale: 0.97, duration: 0.6, stagger: 0.08, ease: "power2.out",
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

/* Custom mouse-tracker spotlight on skill cards — a hover affordance,
   kept active even under reduced-motion since nothing here autoplays. */
document.addEventListener("pointermove", (e) => {
  const card = e.target.closest(".skill-card");
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  card.style.setProperty("--my", `${e.clientY - rect.top}px`);
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