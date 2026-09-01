/* ============================================================================
   RESUME.JS
   Renders the resume page from js/data.js (same source of truth as the
   main portfolio) and drives the light/dark toggle.
   ============================================================================ */

/* ── contact block ─────────────────────────────────────────────────── */

(function renderContact() {
  const el = document.getElementById("rContact");

  if (!el || typeof SITE_LINKS === "undefined") return;

  el.innerHTML = `
    <a href="mailto:${SITE_LINKS.email}">${SITE_LINKS.email}</a>
    <span>${SITE_LINKS.phone}</span>
    <a href="${SITE_LINKS.github}" target="_blank" rel="noopener">GitHub ↗</a>
    <a href="${SITE_LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
  `;
})();

/* ── projects ───────────────────────────────────────────────────────── */

(function renderProjects() {
  const el = document.getElementById("rProjects");

  if (!el || typeof PROJECTS === "undefined") return;

  el.innerHTML = PROJECTS.map(
    (p) => `
      <article class="r-project">
        <div class="r-project-head">
          <h3>${p.name}</h3>
          <a href="${p.link}" target="_blank" rel="noopener">View ↗</a>
        </div>
        <div class="r-project-sub">${p.subtitle}${p.status ? ` · ${p.status}` : ""}</div>
        <p>${p.description}</p>
        <div class="r-project-stack">
          ${p.stack.map((s) => `<span>${s}</span>`).join("")}
        </div>
      </article>
    `,
  ).join("");
})();

/* ── certifications ─────────────────────────────────────────────────── */

(function renderCerts() {
  const el = document.getElementById("rCerts");

  if (!el || typeof CERTIFICATIONS === "undefined") return;

  el.innerHTML = CERTIFICATIONS.map(
    (c) => `
      <div class="r-cert">
        <div class="r-cert-issuer">${c.issuer}</div>
        <div class="r-cert-name">${c.name}</div>
        <div class="r-cert-meta">${c.meta}</div>
      </div>
    `,
  ).join("");
})();

/* ── publication ────────────────────────────────────────────────────── */

(function renderPublication() {
  const el = document.getElementById("rPublication");

  if (!el || typeof PUBLICATION === "undefined") return;

  el.innerHTML = `
    <div class="r-entry-head">
      <h3>${PUBLICATION.title}</h3>
    </div>
    <div class="r-entry-sub">${PUBLICATION.venue}</div>
    <div class="r-project-stack" style="margin-top: 12px">
      ${PUBLICATION.stack.map((s) => `<span>${s}</span>`).join("")}
    </div>
  `;
})();

/* ── resume download link (from SITE_LINKS) ───────────────────────────── */

(function applyResumeLink() {
  if (typeof SITE_LINKS === "undefined") return;

  document.querySelectorAll('[data-link="resume"]').forEach((a) => {
    a.setAttribute("href", SITE_LINKS.resume);
  });
})();

/* ── theme toggle ──────────────────────────────────────────────────────
   The initial theme is already set on <html> by the inline script in
   <head> (before first paint, to avoid a flash). This just wires up the
   switch and persists the choice. */

(function themeToggle() {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");

  if (!btn) return;

  const sync = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    btn.setAttribute("aria-checked", String(isDark));
  };

  sync();

  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    localStorage.setItem("siteTheme", next);

    sync();
  });
})();