(() => {
  const KEY_PREFIX = "colomerPremiumDemoV2";
  const START_KEY = `${KEY_PREFIX}:start`;
  const EXPIRED_KEY = `${KEY_PREFIX}:expired`;
  const ROLE_KEY = `${KEY_PREFIX}:role`;
  const LEADS_KEY = `${KEY_PREFIX}:leads`;
  const DOCS_KEY = `${KEY_PREFIX}:docs`;
  const MESSAGES_KEY = `${KEY_PREFIX}:messages`;
  const DEADLINES_KEY = `${KEY_PREFIX}:deadlines`;
  const ACTIVITY_KEY = `${KEY_PREFIX}:activity`;
  const CLIENT_KEY = `${KEY_PREFIX}:client`;
  const DAY = 24 * 60 * 60 * 1000;
  const DEMO_DAYS = 15;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const page = document.body.dataset.page;

  const seedClients = [
    { name: "Grupo Liria S.L.", type: "Empresa", manager: "Laura Colomer", status: "Pendiente de IVA T2", docs: 12, pending: 3, next: "28/06 · Modelo 303" },
    { name: "Estudio Norte Autónomos", type: "Autónomos", manager: "Equipo Fiscal", status: "Documentación incompleta", docs: 8, pending: 2, next: "30/06 · Gastos deducibles" },
    { name: "Clínica Prado S.L.", type: "Empresa con empleados", manager: "Equipo Laboral", status: "Nóminas validadas", docs: 16, pending: 1, next: "25/06 · Seguros sociales" }
  ];

  const sampleLeads = [
    { name: "Marta Rivas", company: "Rivas Retail S.L.", service: "Asesoría fiscal", urgency: "Alta", status: "Nuevo", channel: "Web" },
    { name: "Javier Montes", company: "Montes Arquitectura", service: "Autónomos y pymes", urgency: "Normal", status: "Contactar", channel: "Formulario" },
    { name: "Elena Ruiz", company: "Clínica Dental Ruiz", service: "Asesoría laboral", urgency: "Alta", status: "Reunión", channel: "Web" }
  ];

  const sampleDocs = [
    { client: "Grupo Liria S.L.", type: "Factura recibida", file: "factura-proveedor-438.pdf", status: "Pendiente de revisión", period: "T2 2026", created: todayLabel() },
    { client: "Estudio Norte Autónomos", type: "Ticket de gasto", file: "ticket-combustible.jpg", status: "Validado", period: "Junio 2026", created: todayLabel() },
    { client: "Clínica Prado S.L.", type: "Nómina", file: "nominas-mayo.pdf", status: "Recibido", period: "Mayo 2026", created: todayLabel() }
  ];

  const sampleMessages = [
    { client: "Grupo Liria S.L.", from: "Asesoría", message: "Faltan dos facturas recibidas para cerrar el trimestre.", date: todayLabel() },
    { client: "Clínica Prado S.L.", from: "Cliente", message: "Hemos subido el contrato actualizado para revisión laboral.", date: todayLabel() }
  ];

  const sampleDeadlines = [
    { day: "20", month: "Jun", title: "Modelo 111", client: "Grupo Liria S.L.", status: "Preparando" },
    { day: "28", month: "Jun", title: "Modelo 303", client: "Varios clientes", status: "Pendiente documentación" },
    { day: "30", month: "Jun", title: "Cierre mensual", client: "Clínica Prado S.L.", status: "En revisión" }
  ];

  function now() { return Date.now(); }
  function getJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function setJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function todayLabel() {
    const d = new Date();
    return d.toLocaleDateString("es-ES", { day:"2-digit", month:"2-digit", year:"numeric" });
  }
  function timeLabel() {
    return new Date().toLocaleTimeString("es-ES", { hour:"2-digit", minute:"2-digit" });
  }

  function ensureDemoStart() {
    let start = Number(localStorage.getItem(START_KEY));
    if (!start) {
      start = now();
      localStorage.setItem(START_KEY, String(start));
    }
    return start;
  }
  function daysLeft() {
    const start = ensureDemoStart();
    const elapsed = Math.floor((now() - start) / DAY);
    return Math.max(0, DEMO_DAYS - elapsed);
  }
  function isExpired() {
    return localStorage.getItem(EXPIRED_KEY) === "1" || daysLeft() <= 0;
  }
  function updateDemoUI() {
    const left = daysLeft();
    $$("[data-days-left]").forEach(el => el.textContent = String(left));
    $$("[data-start-date]").forEach(el => {
      const d = new Date(ensureDemoStart());
      el.textContent = d.toLocaleDateString("es-ES", { day:"2-digit", month:"long", year:"numeric" });
    });
    const gate = $("#demoGate");
    if (gate) gate.hidden = !isExpired();
  }

  function resetDemo() {
    [START_KEY, EXPIRED_KEY, ROLE_KEY, LEADS_KEY, DOCS_KEY, MESSAGES_KEY, DEADLINES_KEY, ACTIVITY_KEY, CLIENT_KEY].forEach(k => localStorage.removeItem(k));
    ensureDemoStart();
    toast("Demo reiniciada. Vuelve a empezar el periodo local de 15 días.");
    setTimeout(() => location.reload(), 650);
  }
  function simulateExpiry() {
    localStorage.setItem(EXPIRED_KEY, "1");
    updateDemoUI();
    toast("Caducidad simulada. Puedes reiniciar la demo desde el aviso.");
  }

  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => el.classList.remove("show"), 3400);
  }

  function addActivity(title, detail) {
    const items = getJSON(ACTIVITY_KEY, []);
    items.unshift({ title, detail, time: timeLabel() });
    setJSON(ACTIVITY_KEY, items.slice(0, 12));
  }

  function ensureSeedData() {
    if (!localStorage.getItem(DOCS_KEY)) setJSON(DOCS_KEY, sampleDocs);
    if (!localStorage.getItem(MESSAGES_KEY)) setJSON(MESSAGES_KEY, sampleMessages);
    if (!localStorage.getItem(DEADLINES_KEY)) setJSON(DEADLINES_KEY, sampleDeadlines);
    if (!localStorage.getItem(ACTIVITY_KEY)) {
      setJSON(ACTIVITY_KEY, [
        { title: "Factura recibida", detail: "Grupo Liria S.L. subió una factura para validación.", time: "09:41" },
        { title: "Lead nuevo", detail: "Solicitud desde web para asesoría fiscal.", time: "10:12" },
        { title: "Documento validado", detail: "Nóminas de Clínica Prado S.L. revisadas por el equipo.", time: "11:03" }
      ]);
    }
  }

  function bindCommon() {
    ensureDemoStart();
    updateDemoUI();
    $$("[data-reset-demo]").forEach(btn => btn.addEventListener("click", resetDemo));
    $$("[data-simulate-expiry]").forEach(btn => btn.addEventListener("click", simulateExpiry));

    const toggle = $("[data-menu-toggle]");
    const header = $(".site-header");
    if (toggle && header) toggle.addEventListener("click", () => header.classList.toggle("open"));

    const fakeUpload = $("[data-fake-upload]");
    if (fakeUpload) {
      fakeUpload.addEventListener("submit", (e) => {
        e.preventDefault();
        toast("Factura demo simulada. Abre el Hub para ver el flujo documental.");
        addActivity("Factura demo simulada", "Se ha generado una subida visual desde la web.");
      });
    }
  }

  function initWeb() {
    const form = $("#diagnosticForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        const leads = getJSON(LEADS_KEY, []);
        leads.unshift({
          name: data.name || "Lead demo",
          company: data.company || "Empresa demo",
          service: data.service || "Asesoría fiscal",
          urgency: "Normal",
          status: "Nuevo",
          channel: "Web",
          email: data.email,
          phone: data.phone,
          message: data.message,
          created: todayLabel()
        });
        setJSON(LEADS_KEY, leads);
        addActivity("Nuevo lead desde web", `${data.company || "Empresa demo"} solicita ${data.service || "servicio"}.`);
        form.reset();
        toast("Solicitud registrada en modo demo. Ya aparece en el CRM del Hub.");
      });
    }

    $$("[data-open-service]").forEach(btn => {
      btn.addEventListener("click", () => {
        const dialog = $("#serviceDialog");
        const title = $("#serviceDialogTitle");
        if (title) title.textContent = btn.dataset.openService;
        if (dialog?.showModal) dialog.showModal();
      });
    });
    $$("[data-close-dialog]").forEach(btn => btn.addEventListener("click", () => $("#serviceDialog")?.close()));
  }

  function login(role = "team") {
    localStorage.setItem(ROLE_KEY, role);
    showHubApp();
  }

  function showHubApp() {
    ensureSeedData();
    const role = localStorage.getItem(ROLE_KEY) || "team";
    $("#hubLogin")?.setAttribute("hidden", "");
    $("#hubApp")?.removeAttribute("hidden");
    $$("[data-role-label]").forEach(el => el.textContent = role === "client" ? "Cliente demo" : "Equipo demo");
    renderHub();
  }

  function initHub() {
    if (localStorage.getItem(ROLE_KEY)) showHubApp();

    $("#loginForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      if (data.email === "demo@colomerhub.es" && data.password === "demo2026") {
        login("team");
      } else {
        toast("Usa las credenciales demo: demo@colomerhub.es · demo2026");
      }
    });

    $$("[data-login-role]").forEach(btn => btn.addEventListener("click", () => login(btn.dataset.loginRole)));
    $("[data-logout]")?.addEventListener("click", () => {
      localStorage.removeItem(ROLE_KEY);
      location.reload();
    });

    $$(".app-nav button").forEach(btn => {
      btn.addEventListener("click", () => setView(btn.dataset.view));
    });

    $("[data-seed-demo]")?.addEventListener("click", () => {
      setJSON(LEADS_KEY, sampleLeads);
      setJSON(DOCS_KEY, sampleDocs);
      setJSON(MESSAGES_KEY, sampleMessages);
      setJSON(DEADLINES_KEY, sampleDeadlines);
      addActivity("Datos demo generados", "Se han cargado leads, documentos, mensajes y vencimientos ficticios.");
      renderHub();
      toast("Datos demo generados.");
    });

    $("[data-add-lead]")?.addEventListener("click", () => {
      const leads = getJSON(LEADS_KEY, []);
      const examples = sampleLeads;
      const lead = { ...examples[Math.floor(Math.random() * examples.length)], created: todayLabel(), status: "Nuevo" };
      leads.unshift(lead);
      setJSON(LEADS_KEY, leads);
      addActivity("Lead creado", `${lead.company} solicita ${lead.service}.`);
      renderHub();
      toast("Lead ejemplo añadido.");
    });

    $("#documentForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      const fileInput = e.currentTarget.querySelector('input[type="file"]');
      const docs = getJSON(DOCS_KEY, []);
      const fileName = fileInput?.files?.[0]?.name || "documento-demo.pdf";
      docs.unshift({ client: data.client, type: data.type, file: fileName, status: "Pendiente de revisión", period: "Demo 2026", created: todayLabel() });
      setJSON(DOCS_KEY, docs);
      addActivity("Documento recibido", `${data.client} subió ${data.type}.`);
      e.currentTarget.reset();
      renderHub();
      toast("Documento registrado en la bandeja demo.");
    });

    $("[data-run-ai]")?.addEventListener("click", () => {
      setJSON(`${KEY_PREFIX}:ai`, generateAIReading());
      addActivity("Lectura IA simulada", "Se ha extraído información de una factura demo.");
      renderAIPanel();
      renderKPIs();
      toast("Lectura IA simulada generada.");
    });

    $("[data-approve-ai]")?.addEventListener("click", () => {
      const ai = getJSON(`${KEY_PREFIX}:ai`, null);
      if (!ai) return toast("Primero simula una lectura IA.");
      ai.status = "Validada por asesor";
      setJSON(`${KEY_PREFIX}:ai`, ai);
      addActivity("Factura validada", "El asesor ha aprobado la propuesta de lectura IA.");
      renderAIPanel();
      renderKPIs();
      toast("Validación aprobada en modo demo.");
    });

    $("[data-flag-ai]")?.addEventListener("click", () => {
      const ai = getJSON(`${KEY_PREFIX}:ai`, generateAIReading());
      ai.status = "Pendiente de revisión";
      setJSON(`${KEY_PREFIX}:ai`, ai);
      addActivity("Factura marcada para revisión", "Se ha detectado una posible inconsistencia en el IVA.");
      renderAIPanel();
      toast("Marcada para revisión.");
    });

    $("[data-add-deadline]")?.addEventListener("click", () => {
      const deadlines = getJSON(DEADLINES_KEY, []);
      deadlines.unshift({ day: "05", month: "Jul", title: "Revisión contable", client: "Grupo Liria S.L.", status: "Nuevo aviso" });
      setJSON(DEADLINES_KEY, deadlines);
      addActivity("Vencimiento añadido", "Nueva revisión contable programada.");
      renderDeadlines();
      toast("Vencimiento demo añadido.");
    });

    $("#messageForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      const messages = getJSON(MESSAGES_KEY, []);
      messages.unshift({ client: data.client, from: "Asesoría", message: data.message || "Mensaje de seguimiento demo.", date: todayLabel() });
      setJSON(MESSAGES_KEY, messages);
      addActivity("Mensaje guardado", `Aviso enviado a ${data.client}.`);
      e.currentTarget.reset();
      renderMessages();
      toast("Mensaje demo guardado.");
    });

    $("[data-add-client-note]")?.addEventListener("click", () => {
      addActivity("Nota interna añadida", "Se ha creado una nota de seguimiento en la ficha cliente.");
      renderActivity();
      toast("Nota interna demo añadida.");
    });
  }

  function setView(view) {
    $$(".app-nav button").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
    $$(".app-view").forEach(panel => panel.classList.toggle("active", panel.dataset.viewPanel === view));
    const titles = {
      dashboard: "Panel de control",
      crm: "CRM de leads",
      clients: "Clientes",
      documents: "Bandeja documental",
      ai: "Lectura IA simulada",
      calendar: "Vencimientos",
      messages: "Mensajes",
      settings: "Control demo"
    };
    const title = $("#viewTitle");
    if (title) title.textContent = titles[view] || "Colomer Hub";
  }

  function renderHub() {
    renderKPIs();
    renderActivity();
    renderLeads();
    renderClients();
    renderDocuments();
    renderAIPanel();
    renderDeadlines();
    renderMessages();
  }

  function renderKPIs() {
    const leads = getJSON(LEADS_KEY, []);
    const docs = getJSON(DOCS_KEY, []);
    const ai = getJSON(`${KEY_PREFIX}:ai`, null);
    const pending = docs.filter(d => /Pendiente|Recibido/i.test(d.status)).length + (ai?.status === "Pendiente de revisión" ? 1 : 0);
    const hours = Math.max(0, Math.round((docs.length * 0.35 + leads.length * 0.2 + (ai ? 0.4 : 0)) * 10) / 10);
    setText('[data-kpi="leads"]', leads.length);
    setText('[data-kpi="docs"]', docs.length);
    setText('[data-kpi="pending"]', pending);
    setText('[data-kpi="hours"]', `${hours}h`);
  }

  function setText(sel, value) {
    const el = $(sel);
    if (el) el.textContent = value;
  }

  function renderActivity() {
    const feed = $("#activityFeed");
    if (!feed) return;
    const items = getJSON(ACTIVITY_KEY, []);
    feed.innerHTML = items.length ? items.map(item => `
      <div class="activity-item"><span></span><div><b>${escapeHTML(item.title)}</b><small>${escapeHTML(item.detail)} · ${escapeHTML(item.time || "")}</small></div></div>
    `).join("") : `<p class="small">Sin actividad todavía. Genera datos demo para visualizar el flujo.</p>`;
  }

  function renderLeads() {
    const tbody = $("#leadTable");
    if (!tbody) return;
    const leads = getJSON(LEADS_KEY, []);
    tbody.innerHTML = leads.length ? leads.map((lead, i) => `
      <tr>
        <td><strong>${escapeHTML(lead.name || "Lead demo")}</strong></td>
        <td>${escapeHTML(lead.company || "Empresa demo")}</td>
        <td>${escapeHTML(lead.service || "Servicio")}</td>
        <td><span class="badge ${lead.urgency === "Alta" ? "warn" : ""}">${escapeHTML(lead.urgency || "Normal")}</span></td>
        <td>${escapeHTML(lead.status || "Nuevo")}</td>
        <td>${escapeHTML(lead.channel || "Web")}</td>
        <td><button class="action-mini" data-advance-lead="${i}">Avanzar</button></td>
      </tr>
    `).join("") : `<tr><td colspan="7">Todavía no hay leads. Envía el formulario de la web o crea uno de ejemplo.</td></tr>`;
    $$("[data-advance-lead]").forEach(btn => btn.addEventListener("click", () => {
      const all = getJSON(LEADS_KEY, []);
      const lead = all[Number(btn.dataset.advanceLead)];
      const states = ["Nuevo", "Contactar", "Reunión", "Propuesta", "Ganado"];
      const current = states.indexOf(lead.status);
      lead.status = states[Math.min(states.length - 1, current + 1)];
      setJSON(LEADS_KEY, all);
      addActivity("Lead actualizado", `${lead.company} pasa a estado ${lead.status}.`);
      renderHub();
    }));
  }

  function renderClients() {
    const list = $("#clientList");
    const detail = $("#clientDetail");
    if (!list || !detail) return;
    const selected = Number(localStorage.getItem(CLIENT_KEY) || 0);
    list.innerHTML = seedClients.map((c, i) => `
      <button class="client-button ${i === selected ? "active" : ""}" data-client="${i}">
        <b>${escapeHTML(c.name)}</b><span>${escapeHTML(c.type)} · ${escapeHTML(c.status)}</span>
      </button>
    `).join("");
    $$("[data-client]").forEach(btn => btn.addEventListener("click", () => {
      localStorage.setItem(CLIENT_KEY, btn.dataset.client);
      renderClients();
    }));
    const c = seedClients[selected] || seedClients[0];
    detail.innerHTML = `
      <span class="eyebrow">Ficha cliente</span>
      <h2>${escapeHTML(c.name)}</h2>
      <p>${escapeHTML(c.type)} · Responsable: <strong>${escapeHTML(c.manager)}</strong></p>
      <div class="client-detail-grid">
        <div><b>${c.docs}</b><span>documentos</span></div>
        <div><b>${c.pending}</b><span>pendientes</span></div>
        <div><b>${escapeHTML(c.next)}</b><span>próxima acción</span></div>
      </div>
      <h3>Estado</h3>
      <p>${escapeHTML(c.status)}</p>
      <div class="activity-feed">
        <div class="activity-item"><span></span><div><b>Documentación trimestral</b><small>Revisar facturas pendientes y validar IVA.</small></div></div>
        <div class="activity-item"><span></span><div><b>Aviso automático</b><small>Recordatorio preparado para cliente.</small></div></div>
      </div>
    `;
  }

  function renderDocuments() {
    const queue = $("#documentQueue");
    if (!queue) return;
    const docs = getJSON(DOCS_KEY, []);
    queue.innerHTML = docs.length ? docs.map((doc, i) => `
      <div class="queue-item">
        <span class="doc-icon">${doc.type?.includes("Factura") ? "PDF" : doc.type?.includes("Ticket") ? "IMG" : "DOC"}</span>
        <div class="meta"><b>${escapeHTML(doc.file || "documento-demo.pdf")}</b><small>${escapeHTML(doc.client)} · ${escapeHTML(doc.type)} · ${escapeHTML(doc.period || "Demo")} · ${escapeHTML(doc.created || "")}</small></div>
        <span class="badge ${/Pendiente|Recibido/i.test(doc.status) ? "warn" : "ok"}">${escapeHTML(doc.status)}</span>
      </div>
    `).join("") : `<p class="small">Sin documentos. Sube un documento demo para iniciar el flujo.</p>`;
  }

  function generateAIReading() {
    const suppliers = ["Suministros Castellana S.L.", "IberOffice Proveedores", "Servicios Madrid Centro", "Global Telecom Empresas"];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const base = Math.floor(180 + Math.random() * 1800);
    const iva = Math.round(base * 0.21 * 100) / 100;
    const total = Math.round((base + iva) * 100) / 100;
    return {
      file: "factura-demo-" + Math.floor(1000 + Math.random() * 9000) + ".pdf",
      supplier,
      date: todayLabel(),
      invoice: "F-" + Math.floor(10000 + Math.random() * 90000),
      base: base.toLocaleString("es-ES", { style:"currency", currency:"EUR" }),
      iva: iva.toLocaleString("es-ES", { style:"currency", currency:"EUR" }),
      total: total.toLocaleString("es-ES", { style:"currency", currency:"EUR" }),
      category: "Servicios exteriores",
      confidence: Math.floor(86 + Math.random() * 10),
      status: "Pendiente de revisión"
    };
  }

  function renderAIPanel() {
    const panel = $("#aiPanel");
    if (!panel) return;
    const ai = getJSON(`${KEY_PREFIX}:ai`, null);
    if (!ai) {
      panel.innerHTML = `<p class="small">Todavía no se ha simulado ninguna lectura. Pulsa “Simular lectura” para generar una factura ficticia.</p>`;
      return;
    }
    panel.innerHTML = `
      <div class="ai-field"><span>Archivo</span><strong>${escapeHTML(ai.file)}</strong></div>
      <div class="ai-field"><span>Proveedor</span><strong>${escapeHTML(ai.supplier)}</strong></div>
      <div class="ai-field"><span>Fecha</span><strong>${escapeHTML(ai.date)}</strong></div>
      <div class="ai-field"><span>Nº factura</span><strong>${escapeHTML(ai.invoice)}</strong></div>
      <div class="ai-field"><span>Base</span><strong>${escapeHTML(ai.base)}</strong></div>
      <div class="ai-field"><span>IVA</span><strong>${escapeHTML(ai.iva)}</strong></div>
      <div class="ai-field"><span>Total</span><strong>${escapeHTML(ai.total)}</strong></div>
      <div class="ai-field"><span>Categoría</span><strong>${escapeHTML(ai.category)}</strong></div>
      <div class="ai-field"><span>Estado</span><strong>${escapeHTML(ai.status)}</strong></div>
      <div>
        <div class="ai-field"><span>Confianza simulada</span><strong>${ai.confidence}%</strong></div>
        <div class="ai-confidence"><span style="width:${ai.confidence}%"></span></div>
      </div>
    `;
  }

  function renderDeadlines() {
    const grid = $("#deadlineGrid");
    if (!grid) return;
    const items = getJSON(DEADLINES_KEY, []);
    grid.innerHTML = items.map(d => `
      <article class="deadline-card">
        <b>${escapeHTML(d.day)} ${escapeHTML(d.month)}</b>
        <h3>${escapeHTML(d.title)}</h3>
        <p>${escapeHTML(d.client)}</p>
        <span>${escapeHTML(d.status)}</span>
      </article>
    `).join("");
  }

  function renderMessages() {
    const list = $("#messageList");
    if (!list) return;
    const items = getJSON(MESSAGES_KEY, []);
    list.innerHTML = items.length ? items.map(m => `
      <div class="message-item">
        <b>${escapeHTML(m.client)} · ${escapeHTML(m.from)}</b>
        <p>${escapeHTML(m.message)}</p>
        <small>${escapeHTML(m.date)}</small>
      </div>
    `).join("") : `<p class="small">Sin mensajes todavía.</p>`;
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (m) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[m]));
  }

  bindCommon();
  if (page === "web") initWeb();
  if (page === "hub") initHub();
})();
