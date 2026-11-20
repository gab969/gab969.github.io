// =====================================================
// 1. Build skills, projects and achievements from data.js
// =====================================================
const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
};

// Wrapped in try/catch: if data.js has a typo (for example a missing comma),
// the aura button and the nav below still work. Press F12 > Console to see the error.
try {
    const achGrid = document.getElementById("achGrid");
    ACHIEVEMENTS.forEach((a, i) => {
        const pic = a.image
            ? `<a class="ach-img" href="${a.image}" data-i="${i}" aria-label="View the ${a.title} certificate full size">
             <img src="${a.image}" alt="${a.title} certificate" loading="lazy">
           </a>`
            : "";
        const link = a.image ? `<a class="ach-link" href="${a.image}" data-i="${i}">View certificate</a>` : "";
        achGrid.appendChild(el(`
    <article class="frame ach">
      ${pic}
      <p class="label">${a.tag}</p>
      <h3>${a.title}</h3>
      <p>${a.text}</p>
      ${link}
    </article>`));
    });

    // One skill chip: with an icon from images/icons, or text only
    const chip = (item) => {
        const name = typeof item === "string" ? item : item.name;
        const icon = typeof item === "string" ? "" : item.icon;
        return icon
            ? `<li class="has-icon"><img class="chip-ico" src="images/icons/${icon}.svg" alt="" width="18" height="18" onerror="this.parentNode.classList.remove('has-icon'); this.remove()">${name}</li>`
            : `<li>${name}</li>`;
    };

    const skillsGrid = document.getElementById("skillsGrid");
    SKILLS.forEach((s) => {
        skillsGrid.appendChild(el(`
    <article class="frame skill">
      <p class="label">${s.label}</p>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
      <ul class="chips">${s.items.map(chip).join("")}</ul>
    </article>`));
    });

    const projGrid = document.getElementById("projGrid");
    PROJECTS.forEach((p) => {
        const ext = 'target="_blank" rel="noopener"';
        const buttons = [
            p.prototype ? `<a class="btn-solid" href="${p.prototype}" ${ext}>VIEW PROTOTYPE ↗</a>` : "",
            p.details ? `<a class="btn-solid" href="${p.details}">DETAILS ↗</a>` : "",
            p.live ? `<a class="btn-line" href="${p.live}" ${ext}>LIVE SITE ↗</a>` : ""
        ].join("");
        const alt = p.alt || `${p.title} cover`;
        projGrid.appendChild(el(`
    <article class="proj">
      <div class="proj-img ${p.fit === "contain" ? "fit-contain" : ""}"><img src="${p.image}" alt="${alt}" loading="lazy"></div>
      <p class="meta">${p.type} · ${p.year}</p>
      <h3>${p.title}</h3>
      <p class="proj-text">${p.text}</p>
      <ul class="tags">${p.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      ${buttons ? `<div class="btn-row">${buttons}</div>` : ""}
    </article>`));
    });

    // Certificate modal: opens on top of the page.
    // Closes with the ✕ button, the Close button, a click outside the box, or the Esc key.
    const modal = document.createElement("dialog");
    modal.className = "modal";
    modal.setAttribute("aria-labelledby", "modalTitle");
    modal.innerHTML = `
  <div class="modal-card">
    <div class="modal-head">
      <div>
        <p class="label modal-tag"></p>
        <h3 class="modal-title" id="modalTitle"></h3>
      </div>
      <button class="modal-x" type="button" aria-label="Close">✕</button>
    </div>
    <div class="modal-body"><img class="modal-img" alt=""></div>
    <div class="modal-foot"><button class="modal-close" type="button">Close</button></div>
  </div>`;
    document.body.appendChild(modal);
    const modalImg = modal.querySelector(".modal-img");
    modal.querySelectorAll(".modal-x, .modal-close").forEach((btn) => btn.addEventListener("click", () => modal.close()));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });   // click on the dark area
    modal.addEventListener("close", () => document.body.classList.remove("modal-open"));

    achGrid.addEventListener("click", (e) => {
        const link = e.target.closest("a.ach-img, a.ach-link");
        if (!link || typeof modal.showModal !== "function") return;   // very old browsers: just open the picture
        e.preventDefault();
        const a = ACHIEVEMENTS[Number(link.dataset.i)] || {};
        modal.querySelector(".modal-tag").textContent = a.tag || "";
        modal.querySelector(".modal-title").textContent = a.title || "Certificate";
        modalImg.src = link.getAttribute("href");
        modalImg.alt = (a.title || "") + " certificate";
        document.body.classList.add("modal-open");
        modal.showModal();
    });

    // Hero panel numbers follow your data
    document.getElementById("cProjects").textContent = PROJECTS.length;
    document.getElementById("cSkills").textContent = SKILLS.length;
    document.getElementById("skillCount").textContent = SKILLS.length + " areas";
    document.getElementById("cCerts").textContent = ACHIEVEMENTS.filter((a) => a.cert || a.tag === "CERTIFICATION").length;
    document.getElementById("latestTitle").textContent = PROJECTS[0].title;
    document.getElementById("latestMeta").textContent = PROJECTS[0].tags[0] + ", " + PROJECTS[0].year;
} catch (err) {
    console.error("Could not build sections from data.js:", err);
}

// =====================================================
// =====================================================
// 2. Portrait effects
//    a) Hover: a liquid blob with a yellow outline follows the
//       cursor, stretches into a tail as you move, and shows
//       images/aura.png inside it
//    b) "Show aura" button: the aura spreads over the portrait
//       in patches with glowing yellow edges (and back again)
// =====================================================
const portrait = document.getElementById("portrait");
const baseImg = portrait.querySelector(".p-base");
const auraImg = portrait.querySelector(".p-aura");
const auraBtn = document.getElementById("auraBtn");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SVG_NS = "http://www.w3.org/2000/svg";

const fx = portrait.querySelector(".p-fx");
// If any piece of the hover-circle drawing is missing from index.html, rebuild it here,
// so the effect cannot break the whole script
const FX_MARKUP = `
<defs>
  <filter id="fxGoo" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
  </filter>
  <filter id="fxRing" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="goo" />
    <feMorphology in="goo" operator="dilate" radius="3" result="fat" />
    <feComposite in="fat" in2="goo" operator="out" result="ring" />
    <feFlood flood-color="#f2c230" />
    <feComposite in2="ring" operator="in" result="line" />
    <feGaussianBlur in="line" stdDeviation="6" result="glow" />
    <feMerge><feMergeNode in="glow" /><feMergeNode in="line" /></feMerge>
  </filter>
  <filter id="fxSoft" x="-100%" y="-100%" width="300%" height="300%">
    <feGaussianBlur stdDeviation="12" />
  </filter>
  <mask id="fxMask" maskUnits="userSpaceOnUse">
    <g id="fxMaskBlobs" filter="url(#fxGoo)"></g>
  </mask>
</defs>
<image id="fxAura" preserveAspectRatio="xMidYMax meet" mask="url(#fxMask)" />
<g id="fxRingBlobs" filter="url(#fxRing)"></g>
<circle id="fxSpark" r="26" fill="#f2c230" filter="url(#fxSoft)" opacity="0" />`;

const FX_PARTS = ["#fxAura", "#fxMask", "#fxMaskBlobs", "#fxRingBlobs", "#fxSpark"];
if (!FX_PARTS.every((sel) => fx.querySelector(sel))) {
    console.warn("Hover circle markup was incomplete in index.html. Rebuilding it.");
    fx.innerHTML = FX_MARKUP;
    fx.querySelector("#fxAura").setAttribute("href", auraImg.getAttribute("src"));
}
const fxAura = fx.querySelector("#fxAura");

// Portrait copy shown inside the hover circle in aura mode (created here if index.html does not have it)
let fxBase = fx.querySelector("#fxBase");
if (!fxBase) {
    fxBase = document.createElementNS(SVG_NS, "image");
    fxBase.setAttribute("id", "fxBase");
    fxBase.setAttribute("href", baseImg.getAttribute("src"));
    fxBase.setAttribute("preserveAspectRatio", "xMidYMax meet");
    fxBase.setAttribute("mask", "url(#fxMask)");
}
if (fxBase.parentNode !== fx) fxAura.after(fxBase);   // must sit directly in the drawing, right after the aura image
const fxMask = fx.querySelector("#fxMask");
const fxMaskBlobs = fx.querySelector("#fxMaskBlobs");
const fxRingBlobs = fx.querySelector("#fxRingBlobs");
const fxSpark = fx.querySelector("#fxSpark");

const sw = portrait.querySelector(".p-switch");
const swCtx = sw.getContext("2d");
const DPR = Math.min(window.devicePixelRatio || 1, 2);

let boxW = 1, boxH = 1;
let switching = false;

// ---------- Sizes (re-measured when the window changes) ----------
function sizeEffects() {
    const b = portrait.getBoundingClientRect();
    boxW = Math.max(1, b.width);
    boxH = Math.max(1, b.height);
    fx.setAttribute("viewBox", `0 0 ${boxW} ${boxH}`);
    for (const el of [fxAura, fxBase, fxMask]) {
        el.setAttribute("x", 0); el.setAttribute("y", 0);
        el.setAttribute("width", boxW); el.setAttribute("height", boxH);
    }
    sw.width = Math.round(boxW * DPR);
    sw.height = Math.round(boxH * DPR);
}
sizeEffects();
if ("ResizeObserver" in window) new ResizeObserver(sizeEffects).observe(portrait);
else window.addEventListener("resize", sizeEffects);

// ---------- a) Hover blob ----------
const TRAIL = 12;          // number of circles that make up the blob and its tail
const HEAD = 95;           // radius of the blob under the cursor, in pixels
const HEAD_FOLLOW = 0.3;   // how quickly the blob catches the cursor (0 to 1)
const TAIL_FOLLOW = 0.38;  // lower = longer, stretchier tail

const pts = Array.from({ length: TRAIL }, () => ({ x: 0, y: 0 }));
const maskCircles = [];
const ringCircles = [];
for (let i = 0; i < TRAIL; i++) {
    for (const [group, list] of [[fxMaskBlobs, maskCircles], [fxRingBlobs, ringCircles]]) {
        const c = document.createElementNS(SVG_NS, "circle");
        c.setAttribute("fill", "#fff");
        c.setAttribute("r", 0);
        group.appendChild(c);
        list.push(c);
    }
}

// Normal mode: the circle shows the aura. Aura mode: the circle shows the portrait.
// Hidden while the switch animation runs.
function syncFx() {
    const aura = portrait.classList.contains("show-aura");
    fxAura.style.display = aura ? "none" : "";
    fxBase.style.display = aura ? "" : "none";
    fx.style.display = switching ? "none" : "block";
}

let target = { x: 0, y: 0 };
let scale = 0, scaleTarget = 0;
let hoverRunning = false, entered = false;

portrait.addEventListener("pointermove", (e) => {
    if (switching) return;
    const b = portrait.getBoundingClientRect();
    target.x = e.clientX - b.left;
    target.y = e.clientY - b.top;
    if (!entered) { pts.forEach((p) => { p.x = target.x; p.y = target.y; }); entered = true; }
    scaleTarget = 1;
    if (!hoverRunning) { hoverRunning = true; requestAnimationFrame(hoverTick); }
});
portrait.addEventListener("pointerleave", () => { scaleTarget = 0; });

function hoverTick(t) {
    pts[0].x += (target.x - pts[0].x) * HEAD_FOLLOW;
    pts[0].y += (target.y - pts[0].y) * HEAD_FOLLOW;
    for (let i = 1; i < TRAIL; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * TAIL_FOLLOW;
        pts[i].y += (pts[i - 1].y - pts[i].y) * TAIL_FOLLOW;
    }
    scale += (scaleTarget - scale) * 0.12;
    if (scaleTarget === 0 && scale < 0.01) scale = 0;

    const wobble = reduceMotion ? 0 : Math.sin(t / 220) * 0.06;
    for (let i = 0; i < TRAIL; i++) {
        const r = HEAD * (1 - (i / TRAIL) * 0.72) * scale * (1 + (i % 2 ? wobble : -wobble));
        for (const c of [maskCircles[i], ringCircles[i]]) {
            c.setAttribute("cx", pts[i].x);
            c.setAttribute("cy", pts[i].y);
            c.setAttribute("r", Math.max(0, r));
        }
    }
    // Yellow glow at the end of the tail, brighter when you move faster
    const tail = pts[TRAIL - 1];
    const stretch = Math.hypot(pts[0].x - tail.x, pts[0].y - tail.y);
    fxSpark.setAttribute("cx", tail.x);
    fxSpark.setAttribute("cy", tail.y);
    fxSpark.setAttribute("opacity", Math.min(stretch / 140, 1) * scale * 0.85);

    if (scale === 0) { hoverRunning = false; entered = false; return; }
    requestAnimationFrame(hoverTick);
}

syncFx();

// ---------- b) Switch animation ----------
// The portrait and the aura are blended on one canvas, patch by patch, so
// the original photo never shows through the aura (or the other way round).
const GRID = 120;       // detail of the patches: higher = smaller patches
const FEATHER = 0.22;   // softness of each patch edge: higher = softer, smoother blend
const DURATION = 1500;  // milliseconds
let gw, gh, noise, maskC, maskCtx, maskData, edgeC, edgeCtx, edgeData;
let baseFull, auraFull, invC, invCtx, invData, layerC, layerCtx, glowC, glowCtx, blurC, blurCtx, silC, silCtx, glowW, glowH;

function makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    return c;
}

// Smooth random "cloud" pattern. Values are spread evenly from 0 to 1, so the
// change moves across the portrait at a steady pace, with no slow leftovers at the end.
function makeNoise(w, h) {
    const seed = Math.random() * 1000;
    const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7 + seed) * 43758.5453; return s - Math.floor(s); };
    const smooth = (x, y) => {
        const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
        const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
        const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
        return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
    const raw = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            raw[y * w + x] = smooth(x / 16, y / 16) * 0.6 + smooth(x / 8, y / 8) * 0.3 + smooth(x / 4, y / 4) * 0.1;
        }
    }
    // Rank every value, so the result is evenly spread between 0 and 1
    const order = Array.from(raw.keys()).sort((i, j) => raw[i] - raw[j]);
    const out = new Float32Array(w * h);
    order.forEach((idx, rank) => { out[idx] = rank / (order.length - 1); });
    return out;
}

// Where an image sits inside the box (same as object-fit: contain; object-position: bottom)
function containRect(img, W, H) {
    const s = Math.min(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    return { x: (W - w) / 2, y: H - h, w, h };
}

function prepareSwitch() {
    const W = sw.width, H = sw.height;
    gw = GRID;
    gh = Math.max(1, Math.round(GRID * H / W));
    noise = makeNoise(gw, gh);
    maskC = makeCanvas(gw, gh); maskCtx = maskC.getContext("2d"); maskData = maskCtx.createImageData(gw, gh);
    edgeC = makeCanvas(gw, gh); edgeCtx = edgeC.getContext("2d"); edgeData = edgeCtx.createImageData(gw, gh);
    invC = makeCanvas(gw, gh); invCtx = invC.getContext("2d"); invData = invCtx.createImageData(gw, gh);
    layerC = makeCanvas(W, H); layerCtx = layerC.getContext("2d");
    // Both pictures are scaled to the box once here, so every frame only copies pixels
    baseFull = makeCanvas(W, H);
    auraFull = makeCanvas(W, H);
    for (const [img, c] of [[baseImg, baseFull], [auraImg, auraFull]]) {
        const r = containRect(img, W, H);
        c.getContext("2d").drawImage(img, r.x, r.y, r.w, r.h);
    }
    // The yellow glow is soft anyway, so it is drawn at half size to keep the animation fast
    glowW = Math.max(1, Math.round(W / 2)); glowH = Math.max(1, Math.round(H / 2));
    glowC = makeCanvas(glowW, glowH); glowCtx = glowC.getContext("2d");
    blurC = makeCanvas(glowW, glowH); blurCtx = blurC.getContext("2d");
    // Silhouette of the figure, so the yellow edges only appear on you, not the background
    silC = makeCanvas(glowW, glowH); silCtx = silC.getContext("2d");
    for (const c of [baseFull, auraFull]) silCtx.drawImage(c, 0, 0, glowW, glowH);
}

// t = 0: portrait only, t = 1: aura only
function drawSwitch(t) {
    const W = sw.width, H = sw.height;
    const k = t * (1 + FEATHER);               // the "front" moving through the pattern
    const md = maskData.data, id = invData.data, ed = edgeData.data;
    for (let i = 0; i < noise.length; i++) {
        const a = Math.min(Math.max((k - noise[i]) / FEATHER, 0), 1);
        const m = a * a * (3 - 2 * a);                              // smooth blend
        md[i * 4 + 3] = m * 255;                                    // where the aura shows
        id[i * 4 + 3] = (1 - m) * 255;                              // where the portrait still shows
        ed[i * 4 + 3] = (t > 0 && t < 1) ? 4 * a * (1 - a) * 255 : 0; // glow only on the moving edge
    }
    maskCtx.putImageData(maskData, 0, 0);
    invCtx.putImageData(invData, 0, 0);
    edgeCtx.putImageData(edgeData, 0, 0);

    // 1) The aura, only inside the patches that already turned
    swCtx.globalCompositeOperation = "source-over";
    swCtx.clearRect(0, 0, W, H);
    swCtx.drawImage(auraFull, 0, 0);
    swCtx.globalCompositeOperation = "destination-in";
    swCtx.drawImage(maskC, 0, 0, W, H);
    swCtx.globalCompositeOperation = "source-over";

    // 2) The portrait, only where the aura has not arrived yet
    layerCtx.globalCompositeOperation = "source-over";
    layerCtx.clearRect(0, 0, W, H);
    layerCtx.drawImage(baseFull, 0, 0);
    layerCtx.globalCompositeOperation = "destination-in";
    layerCtx.drawImage(invC, 0, 0, W, H);
    swCtx.drawImage(layerC, 0, 0);

    // 3) Glowing yellow edge along the front (drawn small, then scaled up)
    if (t > 0 && t < 1) {
        glowCtx.globalCompositeOperation = "source-over";
        glowCtx.clearRect(0, 0, glowW, glowH);
        glowCtx.fillStyle = "#f2c230";
        glowCtx.fillRect(0, 0, glowW, glowH);
        glowCtx.globalCompositeOperation = "destination-in";
        glowCtx.drawImage(edgeC, 0, 0, glowW, glowH);
        glowCtx.drawImage(silC, 0, 0);
        blurCtx.clearRect(0, 0, glowW, glowH);
        blurCtx.filter = `blur(${2.5 * DPR}px)`;
        blurCtx.drawImage(glowC, 0, 0);
        blurCtx.filter = "none";
        swCtx.drawImage(blurC, 0, 0, W, H);
        swCtx.globalAlpha = 0.9;
        swCtx.drawImage(glowC, 0, 0, W, H);
        swCtx.globalAlpha = 1;
    }
}

function setAura(on) {
    if (switching) return;
    auraBtn.querySelector("strong").textContent = on ? "Show portrait" : "Show aura";
    const finish = () => {
        portrait.classList.toggle("show-aura", on);
        portrait.classList.remove("is-switching");
        swCtx.clearRect(0, 0, sw.width, sw.height);
        switching = false;
        syncFx();
    };
    const ready = auraImg.complete && auraImg.naturalWidth && baseImg.complete && baseImg.naturalWidth;
    if (reduceMotion || !ready) { finish(); return; }

    switching = true;
    try {
        scaleTarget = 0;                       // close the hover blob
        prepareSwitch();
        drawSwitch(on ? 0 : 1);                // first frame looks exactly like what is on screen now
        portrait.classList.add("is-switching");            // the canvas now draws both pictures
        if (!on) portrait.classList.remove("show-aura");
        syncFx();
    } catch (err) {
        // If the animation cannot run, still switch the picture and never get stuck
        console.error("Aura animation could not start:", err);
        finish();
        return;
    }

    const t0 = performance.now();
    const step = (now) => {
        try {
            const p = Math.min((now - t0) / DURATION, 1);
            const eased = p * p * (3 - 2 * p);   // gentle start and finish
            drawSwitch(on ? eased : 1 - eased);
            if (p < 1) requestAnimationFrame(step);
            else finish();
        } catch (err) {
            console.error("Aura animation stopped:", err);
            finish();
        }
    };
    requestAnimationFrame(step);
}

// Button: works with mouse, keyboard and on phones
let introDone = false;
auraBtn.addEventListener("click", () => {
    introDone = true;                       // the visitor took over, so skip the intro
    setAura(!portrait.classList.contains("show-aura"));
});

// ---------- c) Intro: the page opens in aura mode, then turns into the portrait ----------
const INTRO_DELAY = 700;   // milliseconds to show the aura before the change starts

function playIntro() {
    if (introDone) return;
    introDone = true;
    if (!portrait.classList.contains("show-aura")) return;
    // If the page opened further down (for example at #projects), switch quietly with no animation
    const r = portrait.getBoundingClientRect();
    const onScreen = r.bottom > 0 && r.top < window.innerHeight;
    if (!onScreen) {
        portrait.classList.remove("show-aura");
        auraBtn.querySelector("strong").textContent = "Show aura";
        syncFx();
        return;
    }
    setAura(false);
}

if (document.readyState === "complete") setTimeout(playIntro, INTRO_DELAY);
else window.addEventListener("load", () => setTimeout(playIntro, INTRO_DELAY));

// =====================================================
// 3. Navigation: sliding hover highlight + split on scroll
// =====================================================
const navWrap = document.getElementById("navWrap");
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const navHl = navLinks.querySelector(".nav-hl");
const smallScreen = window.matchMedia("(max-width: 1080px)");

const SPLIT_AFTER = 60;          // pixels scrolled before the nav splits
const aboutSection = document.getElementById("about");
const HIDE_OFFSET = 80;          // hides when About is this many pixels from the top of the screen
function hideLine() {            // scroll position where the About section begins
    return aboutSection.getBoundingClientRect().top + window.scrollY - HIDE_OFFSET;
}

// 3a. Measure the natural width of the joined pill so it can animate
function measureNav() {
    nav.style.transition = "none";
    nav.style.width = "max-content";
    const w = nav.getBoundingClientRect().width;
    nav.style.width = "";
    nav.style.setProperty("--nav-w", Math.ceil(w) + "px");
    void nav.offsetWidth;          // apply before turning transitions back on
    nav.style.transition = "";
}
measureNav();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureNav);
window.addEventListener("resize", measureNav);

// 3b. Scroll behaviour:
//     top of page      -> one joined pill
//     scrolling down   -> nav slides away
//     scrolling up     -> nav comes back, split into three pieces
let lastY = window.scrollY;
function onScroll() {
    const y = window.scrollY;
    navWrap.classList.toggle("is-split", y > SPLIT_AFTER && !smallScreen.matches);

    if (y <= hideLine()) {                // above the About section: always visible
        navWrap.classList.remove("is-hidden");
        lastY = y;
        return;
    }
    const d = y - lastY;
    if (Math.abs(d) < 6) return;           // ignore tiny movements
    if (d > 0 && !nav.matches(":focus-within")) {
        navWrap.classList.add("is-hidden");  // scrolling down
    } else {
        navWrap.classList.remove("is-hidden"); // scrolling up
    }
    lastY = y;
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// 3c. Highlight slides to whichever link you hover or focus
let hlVisible = false;
function moveHl(a) {
    if (smallScreen.matches) return;
    if (!hlVisible) {              // first show: jump there, do not slide in from the left
        navHl.style.transition = "opacity 0.25s";
    }
    navHl.style.width = a.offsetWidth + "px";
    navHl.style.height = a.offsetHeight + "px";
    navHl.style.transform = `translate(${a.offsetLeft}px, ${a.offsetTop}px)`;
    navHl.style.opacity = 1;
    if (!hlVisible) {
        void navHl.offsetWidth;
        navHl.style.transition = "";
        hlVisible = true;
    }
}
function hideHl() { navHl.style.opacity = 0; hlVisible = false; }

navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("pointerenter", () => moveHl(a));
    a.addEventListener("focus", () => moveHl(a));
    // After clicking a link, let go of focus so the nav can hide again as you scroll
    a.addEventListener("click", () => a.blur());
});
navLinks.addEventListener("pointerleave", hideHl);
navLinks.addEventListener("focusout", hideHl);