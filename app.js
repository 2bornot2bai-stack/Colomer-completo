(() => {
  "use strict";

  const DEMO_DAYS = 15;
  const DAY = 24 * 60 * 60 * 1000;
  const keys = {
    start: "colomerDemoStartAt",
    logged: "colomerHubLoggedIn",
    docs: "colomerHubDocs",
    notices: "colomerHubNotices"
  };

  const baseDocs = [
    { client: "García Solar SL", type: "Modelo fiscal", name: "Modelo 303 · Segundo trimestre", status: "validado", date: "2026-05-12", owner: "Fiscal" },
    { client: "López Retail", type: "Factura", name: "Facturas emitidas Q2", status: "pendiente", date: "2026-05-14", owner: "Contabilidad" },
    { client: "Natura Clinic", type: "Nómina", name: "Nóminas mayo", status: "proceso", date: "2026-05-15", owner: "Laboral" },
    { client: "Proyectos Levante", type: "Justificante bancario", name: "Certificado titularidad cuenta", status: "falta", date: "2026-05-15", owner: "Mercantil" },
    { client: "Autónomo Marta Ruiz", type: "Factura", name: "Facturas recibidas abril", status: "recibido", date: "2026-05-16", owner: "Fiscal" },
    { client: "García Solar SL", type: "Contrato", name: "Contrato nuevo trabajador", status: "pendiente", date: "2026-05-16", owner: "Laboral" }
  ];

  const clients = [
    { name: "García Solar SL", service: "Fiscal + Contabilidad", owner: "Ana", status: "Documentación validada", docs: 12 },
    { name: "López Retail", service: "Contabilidad + Laboral", owner: "Pablo", status: "Pendiente de facturas", docs: 8 },
    { name: "Natura Clinic", service: "Laboral", owner: "Clara", status: "Nóminas en proceso", docs: 6 },
    { name: "Proyectos Levante", service: "Mercantil + Fiscal", owner: "Miguel", status: "Falta información", docs: 9 },
    { name: "Autónomo Marta Ruiz", service: "Fiscal", owner: "Ana", status: "Recibido", docs: 4 },
    { name: "Blue Market SL", service: "Integral empresa", owner: "Pablo", status: "Revisión mensual", docs: 11 }
  ];

  const statusLabels = {
    validado: "Validado",
    pendiente: "Pendiente",
    falta: "Falta información",
    proceso: "En proceso",
    recibido: "Recibido"
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function toast(message) {
    const el = $("[data-toast]");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => el.classList.remove("show"), 3200);
  }

  function initTrial() {
    const url = new URL(window.location.href);
    if (url.searchParams.get("resetDemo") === "1") {
      localStorage.removeItem(keys.start);
      localStorage.removeItem(keys.logged);
      localStorage.removeItem(keys.docs);
      localStorage.removeItem(keys.notices);
      url.searchParams.delete("resetDemo");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }

    let start = localStorage.getItem(keys.start);
    if (!start) {
      start = new Date().toISOString();
      localStorage.setItem(keys.start, start);
    }

    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + DEMO_DAYS * DAY);
    const diff = endDate.getTime() - Date.now();
    const remaining = Math.max(0, Math.ceil(diff / DAY));
    const expired = diff <= 0;

    const text = expired
      ? "Periodo finalizado. Solicita una versión real para continuar."
      : `Quedan ${remaining} día${remaining === 1 ? "" : "s"} de demostración.`;

    $all("[data-trial-text]").forEach(el => { el.textContent = text; });
    $all("[data-trial-pill]").forEach(el => { el.textContent = expired ? "Demo finalizada" : `Demo activa · ${remaining} día${remaining === 1 ? "" : "s"}`; });

    if (document.body.classList.contains("hub-page") && expired) {
      const overlay = $("[data-expired-overlay]");
      if (overlay) overlay.hidden = false;
    }

    return { startDate, endDate, remaining, expired };
  }

  function loadDocs() {
    const raw = localStorage.getItem(keys.docs);
    if (!raw) {
      localStorage.setItem(keys.docs, JSON.stringify(baseDocs));
      return [...baseDocs];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [...baseDocs];
    } catch {
      return [...baseDocs];
    }
  }

  function saveDocs(docs) {
    localStorage.setItem(keys.docs, JSON.stringify(docs));
  }

  function fmtDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(date);
  }

  function statusHTML(status) {
    const label = statusLabels[status] || "Recibido";
    return `<span class="status ${status}">${label}</span>`;
  }

  function renderDocs(filter = "all") {
    const docs = loadDocs();
    const filtered = filter === "all" ? docs : docs.filter(doc => doc.status === filter);
    const dashboard = $("[data-doc-table='dashboard']");
    const full = $("[data-doc-table='full']");

    if (dashboard) {
      dashboard.innerHTML = docs.slice(0, 5).map(doc => `
        <tr>
          <td><strong>${escapeHTML(doc.client)}</strong></td>
          <td>${escapeHTML(doc.name)}</td>
          <td>${statusHTML(doc.status)}</td>
          <td>${fmtDate(doc.date)}</td>
        </tr>
      `).join("");
    }

    if (full) {
      full.innerHTML = filtered.map(doc => `
        <tr>
          <td><strong>${escapeHTML(doc.client)}</strong></td>
          <td>${escapeHTML(doc.type)}</td>
          <td>${escapeHTML(doc.name)}</td>
          <td>${statusHTML(doc.status)}</td>
          <td>${fmtDate(doc.date)}</td>
          <td>${escapeHTML(doc.owner)}</td>
        </tr>
      `).join("");
    }

    const pending = docs.filter(d => ["pendiente", "falta", "proceso", "recibido"].includes(d.status)).length;
    const kpiDocs = $("[data-kpi-docs]");
    const kpiPending = $("[data-kpi-pending]");
    const kpiClients = $("[data-kpi-clients]");
    if (kpiDocs) kpiDocs.textContent = docs.length + 36;
    if (kpiPending) kpiPending.textContent = pending;
    if (kpiClients) kpiClients.textContent = clients.length + 12;
  }

  function renderClients() {
    const grid = $("[data-client-grid]");
    if (!grid) return;
    grid.innerHTML = clients.map(client => `
      <article class="client-card">
        <span class="eyebrow">Cliente</span>
        <h3>${escapeHTML(client.name)}</h3>
        <p>${escapeHTML(client.status)}</p>
        <div class="client-meta">
          <span>${escapeHTML(client.service)}</span>
          <span>Resp. ${escapeHTML(client.owner)}</span>
          <span>${client.docs} docs</span>
        </div>
      </article>
    `).join("");
  }

  function renderActivity() {
    const list = $("[data-activity-list]");
    if (!list) return;
    const docs = loadDocs();
    const items = docs.slice(0, 5).map(doc => ({
      title: `${statusLabels[doc.status] || "Recibido"} · ${doc.client}`,
      desc: `${doc.name} · ${fmtDate(doc.date)}`
    }));
    list.innerHTML = items.map(item => `
      <div class="activity">
        <strong>${escapeHTML(item.title)}</strong>
        <span>${escapeHTML(item.desc)}</span>
      </div>
    `).join("");
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function initNavigation() {
    const toggle = $("[data-nav-toggle]");
    const links = $("[data-nav-links]");
    if (toggle && links) {
      toggle.addEventListener("click", () => links.classList.toggle("open"));
      links.addEventListener("click", (event) => {
        if (event.target.closest("a")) links.classList.remove("open");
      });
    }
  }

  function initContactForms() {
    const contact = $("[data-contact-form]");
    if (contact) {
      contact.addEventListener("submit", (event) => {
        event.preventDefault();
        contact.reset();
        toast("Solicitud guardada en modo demo. En versión real se enviaría al equipo.");
      });
    }

    const notice = $("[data-notice-form]");
    if (notice) {
      notice.addEventListener("submit", (event) => {
        event.preventDefault();
        toast("Aviso simulado guardado correctamente.");
        notice.reset();
      });
    }
  }

  function initHub() {
    if (!document.body.classList.contains("hub-page")) return;

    const trial = initTrial();
    const loginView = $("[data-login-view]");
    const appView = $("[data-app-view]");
    const loginForm = $("[data-login-form]");
    const isLogged = localStorage.getItem(keys.logged) === "true";

    function showApp() {
      if (loginView) loginView.hidden = true;
      if (appView) appView.hidden = false;
      renderDocs();
      renderClients();
      renderActivity();
    }

    if (isLogged && !trial.expired) showApp();

    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const fd = new FormData(loginForm);
        const email = String(fd.get("email") || "").trim().toLowerCase();
        const password = String(fd.get("password") || "");
        if (email === "demo@colomerhub.es" && password === "demo2026") {
          localStorage.setItem(keys.logged, "true");
          showApp();
          toast("Acceso demo concedido.");
        } else {
          toast("Credenciales demo incorrectas.");
        }
      });
    }

    $all("[data-logout]").forEach(button => {
      button.addEventListener("click", () => {
        localStorage.removeItem(keys.logged);
        window.location.reload();
      });
    });

    $all("[data-tab-button], [data-tab-link]").forEach(button => {
      button.addEventListener("click", () => {
        const tab = button.dataset.tabButton || button.dataset.tabLink;
        activateTab(tab);
      });
    });

    $all("[data-filter]").forEach(button => {
      button.addEventListener("click", () => {
        $all("[data-filter]").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        renderDocs(button.dataset.filter);
      });
    });

    const modal = $("[data-upload-modal]");
    $all("[data-open-upload]").forEach(button => {
      button.addEventListener("click", () => {
        if (modal && typeof modal.showModal === "function") modal.showModal();
      });
    });

    const upload = $("[data-upload-form]");
    if (upload) {
      upload.addEventListener("submit", (event) => {
        event.preventDefault();
        const fd = new FormData(upload);
        const file = fd.get("file");
        const fileName = file && file.name ? file.name : `${fd.get("type")} demo`;
        const docs = loadDocs();
        docs.unshift({
          client: String(fd.get("client")),
          type: String(fd.get("type")),
          name: fileName,
          status: "recibido",
          date: new Date().toISOString().slice(0, 10),
          owner: "Bandeja"
        });
        saveDocs(docs);
        renderDocs();
        renderActivity();
        upload.reset();
        if (modal) modal.close();
        toast("Documento añadido a la bandeja demo.");
      });
    }

    const reset = $("[data-reset-demo]");
    if (reset) {
      reset.addEventListener("click", () => {
        const ok = window.confirm("¿Reiniciar la demo en este navegador? Se borrarán datos simulados y el contador empezará de nuevo.");
        if (!ok) return;
        localStorage.removeItem(keys.start);
        localStorage.removeItem(keys.logged);
        localStorage.removeItem(keys.docs);
        localStorage.removeItem(keys.notices);
        window.location.href = "hub.html";
      });
    }
  }

  function activateTab(tabName) {
    $all("[data-tab]").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });
    $all("[data-tab-button]").forEach(button => {
      button.classList.toggle("active", button.dataset.tabButton === tabName);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTrial();
    initNavigation();
    initContactForms();
    initHub();
  });
})();
