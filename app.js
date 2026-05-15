/* Colomer Web + Hub Premium Demo · V3 corregida
   Demo estática para GitHub Pages: usa localStorage, datos ficticios y sin backend.
   Corrección: las claves de localStorage llevan namespace propio para evitar que
   una demo anterior deje la prueba caducada al publicar una nueva versión.
*/

(function () {
  "use strict";

  const DEMO_DAYS = 15;
  const STORAGE_PREFIX = "colomerPremiumDemoV3Fixed_20260516_";
  const LEGACY_KEYS = [
    "colomerDemoStart",
    "colomerLeads",
    "colomerDocs",
    "colomerClients",
    "colomerTasks",
    "colomerMessages",
    "colomerSessionRole",
    "colomerDemoExpired",
    "colomerTrialStart",
    "colomerTrialEnded"
  ];

  const KEYS = {
    start: STORAGE_PREFIX + "start",
    leads: STORAGE_PREFIX + "leads",
    docs: STORAGE_PREFIX + "docs",
    clients: STORAGE_PREFIX + "clients",
    tasks: STORAGE_PREFIX + "tasks",
    messages: STORAGE_PREFIX + "messages",
    session: STORAGE_PREFIX + "sessionRole"
  };

  function clearLegacyDemoKeys() {
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  }

  function hasResetFlag() {
    const params = new URLSearchParams(window.location.search);
    return params.has("resetdemo") || params.has("reset") || params.get("demo") === "reset";
  }

  const now = () => new Date();
  const fmt = (dateLike) => {
    const d = new Date(dateLike);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  };
  const fmtTime = (dateLike) => {
    const d = new Date(dateLike);
    return d.toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getDemoStart() {
    let start = localStorage.getItem(KEYS.start);
    let parsed = start ? new Date(start) : null;

    if (!start || Number.isNaN(parsed.getTime())) {
      start = new Date().toISOString();
      localStorage.setItem(KEYS.start, start);
      parsed = new Date(start);
    }

    return parsed;
  }

  function getDaysLeft() {
    const start = getDemoStart();
    const elapsed = Math.max(0, now().getTime() - start.getTime());
    const elapsedDays = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    return Math.max(0, DEMO_DAYS - elapsedDays);
  }

  function isExpired() {
    return getDaysLeft() <= 0;
  }

  function resetDemoData(resetStart = true) {
    if (resetStart) localStorage.setItem(KEYS.start, new Date().toISOString());
    write(KEYS.leads, seedLeads());
    write(KEYS.clients, seedClients());
    write(KEYS.docs, seedDocs());
    write(KEYS.tasks, seedTasks());
    write(KEYS.messages, seedMessages());
  }

  function ensureSeedData() {
    if (!localStorage.getItem(KEYS.clients)) write(KEYS.clients, seedClients());
    if (!localStorage.getItem(KEYS.docs)) write(KEYS.docs, seedDocs());
    if (!localStorage.getItem(KEYS.tasks)) write(KEYS.tasks, seedTasks());
    if (!localStorage.getItem(KEYS.messages)) write(KEYS.messages, seedMessages());
    if (!localStorage.getItem(KEYS.leads)) write(KEYS.leads, seedLeads());
  }

  function seedClients() {
    return [
      {
        id: "c1",
        name: "Ibernova Solar S.L.",
        type: "Sociedad",
        manager: "Equipo Fiscal",
        risk: "Medio",
        docs: 8,
        pending: 2,
        next: "Modelo 303 · 18/07/2026",
        status: "Activo"
      },
      {
        id: "c2",
        name: "Marta Vidal Studio",
        type: "Autónoma",
        manager: "Equipo Contable",
        risk: "Bajo",
        docs: 5,
        pending: 1,
        next: "IRPF trimestral · 20/07/2026",
        status: "Activo"
      },
      {
        id: "c3",
        name: "Restauración Norte S.L.",
        type: "Pyme",
        manager: "Equipo Laboral",
        risk: "Medio",
        docs: 12,
        pending: 4,
        next: "Seguros sociales · 30/06/2026",
        status: "Revisión"
      }
    ];
  }

  function seedDocs() {
    return [
      { id: uid(), name: "factura-proveedor-junio.pdf", client: "Ibernova Solar S.L.", type: "Factura recibida", status: "pendiente", date: new Date().toISOString() },
      { id: uid(), name: "nominas-equipo-mayo.zip", client: "Restauración Norte S.L.", type: "Nómina", status: "revisado", date: addDays(-2).toISOString() },
      { id: uid(), name: "modelo-303-borrador.pdf", client: "Ibernova Solar S.L.", type: "Modelo fiscal", status: "validado", date: addDays(-3).toISOString() },
      { id: uid(), name: "contrato-alta-trabajador.pdf", client: "Restauración Norte S.L.", type: "Contrato", status: "falta", date: addDays(-1).toISOString() },
      { id: uid(), name: "facturas-emitidas-mayo.xlsx", client: "Marta Vidal Studio", type: "Factura emitida", status: "recibido", date: addDays(-4).toISOString() }
    ];
  }

  function seedLeads() {
    return [
      { id: uid(), date: addDays(-1).toISOString(), name: "Empresa Demo Consultoría", email: "contacto@empresa-demo.es", service: "Fiscal", message: "Necesitamos revisar nuestros modelos trimestrales.", status: "nuevo" },
      { id: uid(), date: addDays(-3).toISOString(), name: "Autónomo Demo", email: "hola@autonomo-demo.es", service: "Alta como nuevo cliente", message: "Quiero ordenar facturas y obligaciones.", status: "contactado" }
    ];
  }

  function seedTasks() {
    return [
      { id: uid(), title: "Revisar factura proveedor Ibernova", client: "Ibernova Solar S.L.", status: "pendiente", due: "Hoy" },
      { id: uid(), title: "Solicitar justificante bancario", client: "Restauración Norte S.L.", status: "pendiente", due: "Mañana" },
      { id: uid(), title: "Preparar borrador Modelo 303", client: "Ibernova Solar S.L.", status: "en_proceso", due: "Esta semana" },
      { id: uid(), title: "Validar nóminas de mayo", client: "Restauración Norte S.L.", status: "hecho", due: "Completado" },
      { id: uid(), title: "Enviar resumen contable", client: "Marta Vidal Studio", status: "en_proceso", due: "Viernes" }
    ];
  }

  function seedMessages() {
    return [
      { id: uid(), author: "Equipo Colomer", role: "team", text: "Hemos recibido la documentación de mayo. Quedan pendientes dos justificantes.", date: addDays(-2).toISOString() },
      { id: uid(), author: "Cliente Demo", role: "client", text: "Perfecto, los subo esta tarde al Hub.", date: addDays(-2).toISOString() },
      { id: uid(), author: "Equipo Colomer", role: "team", text: "Gracias. Una vez revisados, actualizaremos el estado en la bandeja documental.", date: addDays(-1).toISOString() }
    ];
  }

  function addDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  function uid() {
    return "id_" + Math.random().toString(36).slice(2, 10);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function updateDemoLabels() {
    const days = getDaysLeft();
    const text = days === 1 ? "1 día restante" : `${days} días restantes`;
    setText("demoDaysLeft", text);
    setText("sidebarDaysLeft", text);
  }

  function toast(message) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(() => el.classList.remove("show"), 3600);
  }

  function setupPublicSite() {
    const menuBtn = document.getElementById("mobileMenuBtn");
    const header = document.querySelector(".site-header");
    if (menuBtn && header) {
      menuBtn.addEventListener("click", () => header.classList.toggle("open"));
    }

    const leadForm = document.getElementById("leadForm");
    if (leadForm) {
      leadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = new FormData(leadForm);
        const lead = {
          id: uid(),
          date: new Date().toISOString(),
          name: String(form.get("name") || "").trim(),
          email: String(form.get("email") || "").trim(),
          service: String(form.get("service") || "").trim(),
          message: String(form.get("message") || "").trim(),
          status: "nuevo"
        };

        const leads = read(KEYS.leads, seedLeads());
        leads.unshift(lead);
        write(KEYS.leads, leads);

        leadForm.reset();
        toast("Solicitud demo guardada. Ya aparece en el Hub como nuevo lead.");
      });
    }
  }

  let role = localStorage.getItem(KEYS.session) || "team";
  let currentView = location.hash ? location.hash.replace("#", "") : "dashboard";

  function setupHub() {
    const login = document.getElementById("loginScreen");
    const shell = document.getElementById("hubShell");
    const expired = document.getElementById("expiredScreen");

    if (!login || !shell) return;

    if (isExpired()) {
      login.hidden = true;
      shell.hidden = true;
      if (expired) expired.hidden = false;
      return;
    }

    const session = localStorage.getItem(KEYS.session);
    if (session) showHub(session);

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(loginForm);
        const email = String(data.get("email") || "").trim();
        const pass = String(data.get("password") || "").trim();
        const selectedRole = String(data.get("role") || "team");

        if (email !== "demo@colomerhub.es" || pass !== "demo2026") {
          toast("Credenciales incorrectas. Usa demo@colomerhub.es · demo2026");
          return;
        }
        showHub(selectedRole);
      });
    }

    const resetBtn = document.getElementById("resetDemoBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        resetDemoData(true);
        toast("Datos demo reiniciados.");
      });
    }

    const extendBtn = document.getElementById("extendDemoBtn");
    if (extendBtn) {
      extendBtn.addEventListener("click", () => {
        resetDemoData(true);
        location.reload();
      });
    }
  }

  function showHub(selectedRole) {
    role = selectedRole;
    localStorage.setItem(KEYS.session, role);

    const login = document.getElementById("loginScreen");
    const shell = document.getElementById("hubShell");
    const expired = document.getElementById("expiredScreen");
    if (expired) expired.hidden = true;
    if (login) login.hidden = true;
    if (shell) shell.hidden = false;

    configureRole();
    bindHubEvents();
    renderAll();

    const initialView = document.getElementById(`view-${currentView}`) ? currentView : "dashboard";
    switchView(initialView);
  }

  let eventsBound = false;

  function bindHubEvents() {
    if (eventsBound) return;
    eventsBound = true;

    document.querySelectorAll("#hubNav button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        switchView(view);
      });
    });

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(KEYS.session);
        location.href = "hub.html";
      });
    }

    const roleToggleBtn = document.getElementById("roleToggleBtn");
    if (roleToggleBtn) {
      roleToggleBtn.addEventListener("click", () => {
        role = role === "team" ? "client" : "team";
        localStorage.setItem(KEYS.session, role);
        configureRole();
        renderAll();
        switchView("dashboard");
        toast(role === "team" ? "Vista de equipo activada." : "Vista de cliente activada.");
      });
    }

    const docForm = document.getElementById("documentForm");
    if (docForm) {
      docForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = new FormData(docForm);
        const docs = read(KEYS.docs, []);
        docs.unshift({
          id: uid(),
          name: String(form.get("filename") || "").trim(),
          client: String(form.get("client") || "").trim(),
          type: String(form.get("type") || "").trim(),
          status: "recibido",
          date: new Date().toISOString()
        });
        write(KEYS.docs, docs);
        docForm.reset();
        renderAll();
        toast("Documento registrado en la bandeja demo.");
      });
    }

    const addLeadBtn = document.getElementById("addDemoLeadBtn");
    if (addLeadBtn) {
      addLeadBtn.addEventListener("click", () => {
        const leads = read(KEYS.leads, []);
        leads.unshift({
          id: uid(),
          date: new Date().toISOString(),
          name: "Nuevo Lead Demo " + Math.floor(Math.random() * 90 + 10),
          email: "lead.demo@empresa.es",
          service: ["Fiscal", "Laboral", "Contable", "Mercantil"][Math.floor(Math.random() * 4)],
          message: "Solicitud ficticia creada desde el Hub para mostrar el flujo.",
          status: "nuevo"
        });
        write(KEYS.leads, leads);
        renderAll();
        toast("Lead ficticio añadido.");
      });
    }

    const exportBtn = document.getElementById("exportDocsBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const docs = read(KEYS.docs, []);
        const blob = new Blob([JSON.stringify(docs, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "colomer-documentos-demo.json";
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const aiForm = document.getElementById("aiForm");
    if (aiForm) {
      aiForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = new FormData(aiForm);
        renderAiResult(String(form.get("docId")), String(form.get("mode")));
      });
    }

    const msgForm = document.getElementById("messageForm");
    if (msgForm) {
      msgForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = new FormData(msgForm);
        const text = String(form.get("message") || "").trim();
        if (!text) return;

        const messages = read(KEYS.messages, []);
        messages.push({
          id: uid(),
          author: role === "team" ? "Equipo Colomer" : "Cliente Demo",
          role,
          text,
          date: new Date().toISOString()
        });
        write(KEYS.messages, messages);
        msgForm.reset();
        renderMessages();
        toast("Mensaje demo añadido.");
      });
    }
  }

  function configureRole() {
    setText("roleLabel", role === "team" ? "Equipo" : "Cliente");
    const toggle = document.getElementById("roleToggleBtn");
    if (toggle) toggle.textContent = role === "team" ? "Cambiar a cliente" : "Cambiar a equipo";
    document.querySelectorAll("[data-team-only]").forEach((el) => {
      el.hidden = role !== "team";
    });

    if (role !== "team" && ["leads", "clients"].includes(currentView)) {
      currentView = "dashboard";
    }
  }

  function switchView(view) {
    if (role !== "team" && ["leads", "clients"].includes(view)) view = "dashboard";
    currentView = view;

    document.querySelectorAll(".hub-view").forEach((el) => el.classList.remove("active"));
    const viewEl = document.getElementById(`view-${view}`);
    if (viewEl) viewEl.classList.add("active");

    document.querySelectorAll("#hubNav button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });

    const titles = {
      dashboard: "Dashboard",
      leads: "Leads web",
      clients: "Clientes",
      documents: "Documentos",
      ai: "IA asistida",
      tasks: "Tareas",
      calendar: "Vencimientos",
      messages: "Mensajes"
    };
    setText("viewTitle", titles[view] || "Dashboard");
    if (history.replaceState) history.replaceState(null, "", `#${view}`);
  }

  function renderAll() {
    updateDemoLabels();
    renderStats();
    renderActivity();
    renderDonut();
    renderUpcoming();
    renderLeads();
    renderClients();
    renderDocuments();
    renderClientSelects();
    renderKanban();
    renderCalendar();
    renderMessages();
  }

  function renderStats() {
    const docs = filteredDocs();
    const leads = read(KEYS.leads, []);
    const tasks = read(KEYS.tasks, []);
    const clients = role === "team" ? read(KEYS.clients, []) : [read(KEYS.clients, [])[0]].filter(Boolean);

    const pendingDocs = docs.filter(d => ["pendiente", "recibido", "falta"].includes(d.status)).length;
    const doneDocs = docs.filter(d => ["revisado", "validado"].includes(d.status)).length;
    const openTasks = tasks.filter(t => t.status !== "hecho").length;

    const items = role === "team"
      ? [
          ["Clientes activos", clients.length, "Base operativa"],
          ["Leads web", leads.length, "Entradas desde web"],
          ["Docs pendientes", pendingDocs, "Requieren revisión"],
          ["Tareas abiertas", openTasks, "Equipo Colomer"]
        ]
      : [
          ["Documentos", docs.length, "En tu área"],
          ["Validados", doneDocs, "Revisados"],
          ["Pendientes", pendingDocs, "En seguimiento"],
          ["Vencimientos", 3, "Próximos avisos"]
        ];

    const row = document.getElementById("statsRow");
    if (!row) return;
    row.innerHTML = items.map(([label, value, note]) => `
      <div class="stat-card">
        <span>${escapeHtml(label)}</span>
        <b>${escapeHtml(String(value))}</b>
        <em>${escapeHtml(note)}</em>
      </div>
    `).join("");
  }

  function renderActivity() {
    const docs = filteredDocs().slice(0, 4);
    const leads = read(KEYS.leads, []).slice(0, 2);
    const feed = document.getElementById("activityFeed");
    if (!feed) return;

    const activity = [
      ...docs.map(d => ({
        title: `${d.name}`,
        meta: `${d.client} · ${labelStatus(d.status)} · ${fmtTime(d.date)}`,
        dot: d.status === "falta" ? "danger" : d.status === "validado" ? "ok" : "warn"
      })),
      ...(role === "team" ? leads.map(l => ({
        title: `Nuevo lead: ${l.name}`,
        meta: `${l.service} · ${fmtTime(l.date)}`,
        dot: "info"
      })) : [])
    ].slice(0, 6);

    feed.innerHTML = activity.map(item => `
      <div class="activity-item">
        <b><span class="status-dot ${item.dot}"></span>${escapeHtml(item.title)}</b>
        <span>${escapeHtml(item.meta)}</span>
      </div>
    `).join("");
  }

  function renderDonut() {
    const docs = filteredDocs();
    const done = docs.filter(d => ["revisado", "validado"].includes(d.status)).length;
    const pct = docs.length ? Math.round(done / docs.length * 100) : 0;
    const donut = document.getElementById("docDonut");
    const text = document.getElementById("docDonutText");
    const legend = document.getElementById("docLegend");

    if (donut) donut.style.setProperty("--p", pct);
    if (text) text.textContent = `${pct}%`;
    if (legend) {
      legend.innerHTML = `
        <div><span><span class="status-dot ok"></span>Revisados/validados</span><b>${done}</b></div>
        <div><span><span class="status-dot warn"></span>Pendientes</span><b>${Math.max(0, docs.length - done)}</b></div>
      `;
    }
  }

  function renderUpcoming() {
    const list = document.getElementById("upcomingList");
    if (!list) return;
    const items = [
      ["Modelo 303", "IVA trimestral · Ibernova Solar S.L. · 18/07/2026"],
      ["IRPF trimestral", "Marta Vidal Studio · 20/07/2026"],
      ["Seguros sociales", "Restauración Norte S.L. · 30/06/2026"]
    ];

    list.innerHTML = items.map(([title, meta]) => `
      <div class="mini-item">
        <b>${escapeHtml(title)}</b>
        <span>${escapeHtml(meta)}</span>
      </div>
    `).join("");
  }

  function renderLeads() {
    const tbody = document.querySelector("#leadsTable tbody");
    if (!tbody) return;
    const leads = read(KEYS.leads, []);
    tbody.innerHTML = leads.map(lead => `
      <tr>
        <td>${fmt(lead.date)}</td>
        <td><strong>${escapeHtml(lead.name)}</strong><br><small>${escapeHtml(lead.message || "")}</small></td>
        <td>${escapeHtml(lead.service)}</td>
        <td>${escapeHtml(lead.email)}</td>
        <td><span class="badge ${escapeHtml(lead.status)}">${escapeHtml(labelStatus(lead.status))}</span></td>
        <td><button class="inline-btn" data-lead-id="${escapeHtml(lead.id)}">Avanzar</button></td>
      </tr>
    `).join("");

    tbody.querySelectorAll("[data-lead-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.leadId;
        const leads = read(KEYS.leads, []);
        const lead = leads.find(l => l.id === id);
        if (lead) {
          lead.status = lead.status === "nuevo" ? "contactado" : lead.status === "contactado" ? "convertido" : "nuevo";
          write(KEYS.leads, leads);
          renderAll();
          toast("Estado del lead actualizado.");
        }
      });
    });
  }

  function renderClients() {
    const grid = document.getElementById("clientsGrid");
    if (!grid) return;
    const clients = read(KEYS.clients, []);
    grid.innerHTML = clients.map(c => `
      <article class="client-card">
        <h2>${escapeHtml(c.name)}</h2>
        <p>${escapeHtml(c.type)} · ${escapeHtml(c.status)}</p>
        <div class="client-meta">
          <div><span>Responsable</span><b>${escapeHtml(c.manager)}</b></div>
          <div><span>Riesgo</span><b>${escapeHtml(c.risk)}</b></div>
          <div><span>Documentos</span><b>${escapeHtml(String(c.docs))}</b></div>
          <div><span>Pendientes</span><b>${escapeHtml(String(c.pending))}</b></div>
        </div>
        <p><strong>Próximo:</strong> ${escapeHtml(c.next)}</p>
      </article>
    `).join("");
  }

  function filteredDocs() {
    const docs = read(KEYS.docs, []);
    if (role === "team") return docs;
    const firstClient = read(KEYS.clients, [])[0];
    return firstClient ? docs.filter(d => d.client === firstClient.name) : docs.slice(0, 3);
  }

  function renderDocuments() {
    const tbody = document.querySelector("#documentsTable tbody");
    if (!tbody) return;

    const docs = filteredDocs();
    tbody.innerHTML = docs.map(doc => `
      <tr>
        <td><strong>${escapeHtml(doc.name)}</strong></td>
        <td>${escapeHtml(doc.client)}</td>
        <td>${escapeHtml(doc.type)}</td>
        <td><span class="badge ${escapeHtml(doc.status)}">${escapeHtml(labelStatus(doc.status))}</span></td>
        <td>${fmt(doc.date)}</td>
        <td>${role === "team" ? `<button class="inline-btn" data-doc-id="${escapeHtml(doc.id)}">Cambiar estado</button>` : "—"}</td>
      </tr>
    `).join("");

    tbody.querySelectorAll("[data-doc-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const docs = read(KEYS.docs, []);
        const doc = docs.find(d => d.id === btn.dataset.docId);
        if (doc) {
          const sequence = ["recibido", "pendiente", "revisado", "validado", "falta"];
          const i = sequence.indexOf(doc.status);
          doc.status = sequence[(i + 1) % sequence.length];
          write(KEYS.docs, docs);
          renderAll();
          toast("Estado documental actualizado.");
        }
      });
    });
  }

  function renderClientSelects() {
    const allClients = read(KEYS.clients, []);
    const clients = role === "team" ? allClients : allClients.slice(0, 1);
    const select = document.getElementById("clientSelect");
    if (select) {
      select.innerHTML = clients.map(c => `<option>${escapeHtml(c.name)}</option>`).join("");
    }

    const aiSelect = document.getElementById("aiDocumentSelect");
    if (aiSelect) {
      const docs = filteredDocs();
      aiSelect.innerHTML = docs.map(d => `<option value="${escapeHtml(d.id)}">${escapeHtml(d.name)} · ${escapeHtml(d.client)}</option>`).join("");
    }
  }

  function renderAiResult(docId, mode) {
    const docs = filteredDocs();
    const doc = docs.find(d => d.id === docId) || docs[0];
    const card = document.getElementById("aiResultCard");
    if (!card || !doc) return;

    const modes = {
      invoice: {
        title: "Lectura de factura",
        fields: [
          ["Proveedor", "Proveedor Demo S.L."],
          ["Fecha", "12/06/2026"],
          ["Base imponible", "1.240,00 €"],
          ["IVA", "260,40 €"],
          ["Total", "1.500,40 €"],
          ["Categoría", "Servicios profesionales"]
        ],
        alert: "Revisar que el NIF y el concepto coinciden con la actividad."
      },
      contract: {
        title: "Lectura de contrato",
        fields: [
          ["Tipo", "Contrato laboral indefinido"],
          ["Fecha inicio", "01/07/2026"],
          ["Jornada", "40 horas"],
          ["Categoría", "Administración"],
          ["Periodo prueba", "2 meses"],
          ["Observación", "Pendiente firma digital"]
        ],
        alert: "Validar cláusulas y datos laborales antes de registrar."
      },
      payroll: {
        title: "Lectura de nómina",
        fields: [
          ["Empleado", "Persona Demo"],
          ["Periodo", "Junio 2026"],
          ["Devengos", "2.100,00 €"],
          ["Deducciones", "420,00 €"],
          ["Líquido", "1.680,00 €"],
          ["Estado", "Coherente"]
        ],
        alert: "Revisión humana obligatoria antes de validación final."
      },
      tax: {
        title: "Lectura de modelo fiscal",
        fields: [
          ["Modelo", "303"],
          ["Periodo", "2T 2026"],
          ["IVA devengado", "4.280,00 €"],
          ["IVA deducible", "2.960,00 €"],
          ["Resultado", "1.320,00 €"],
          ["Estado", "Borrador"]
        ],
        alert: "Comprobar conciliación con libros antes de presentar."
      }
    };

    const result = modes[mode] || modes.invoice;
    const confidence = Math.floor(86 + Math.random() * 10);

    card.innerHTML = `
      <div class="ai-output">
        <div class="card-head">
          <div>
            <h2>${escapeHtml(result.title)}</h2>
            <p>${escapeHtml(doc.name)} · ${escapeHtml(doc.client)}</p>
          </div>
          <span class="pill">${confidence}% confianza demo</span>
        </div>
        <div>
          <p><strong>Nivel de confianza simulado</strong></p>
          <div class="confidence"><span style="width:${confidence}%"></span></div>
        </div>
        <div class="extracted-grid">
          ${result.fields.map(([k, v]) => `
            <div><span>${escapeHtml(k)}</span><b>${escapeHtml(v)}</b></div>
          `).join("")}
        </div>
        <p class="risk-note"><strong>Observación:</strong> ${escapeHtml(result.alert)}</p>
        <button class="btn btn-primary" id="validateAiBtn" type="button">Marcar como revisado</button>
      </div>
    `;

    const validateBtn = document.getElementById("validateAiBtn");
    if (validateBtn) {
      validateBtn.addEventListener("click", () => {
        const allDocs = read(KEYS.docs, []);
        const found = allDocs.find(d => d.id === doc.id);
        if (found) {
          found.status = "revisado";
          write(KEYS.docs, allDocs);
          renderAll();
          toast("Documento marcado como revisado.");
        }
      });
    }
  }

  function renderKanban() {
    const board = document.getElementById("kanbanBoard");
    if (!board) return;
    const tasks = read(KEYS.tasks, []);
    const cols = [
      ["pendiente", "Pendiente"],
      ["en_proceso", "En proceso"],
      ["hecho", "Hecho"]
    ];

    board.innerHTML = cols.map(([key, title]) => `
      <section class="kanban-column">
        <h2>${escapeHtml(title)}</h2>
        ${tasks.filter(t => t.status === key).map(t => `
          <article class="task-card">
            <b>${escapeHtml(t.title)}</b>
            <span>${escapeHtml(t.client)}</span>
            <span>${escapeHtml(t.due)}</span>
            ${role === "team" ? `<button class="inline-btn" data-task-id="${escapeHtml(t.id)}">Mover</button>` : ""}
          </article>
        `).join("") || `<p class="form-note">Sin tareas en esta columna.</p>`}
      </section>
    `).join("");

    board.querySelectorAll("[data-task-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const tasks = read(KEYS.tasks, []);
        const task = tasks.find(t => t.id === btn.dataset.taskId);
        if (task) {
          task.status = task.status === "pendiente" ? "en_proceso" : task.status === "en_proceso" ? "hecho" : "pendiente";
          write(KEYS.tasks, tasks);
          renderKanban();
          renderStats();
          toast("Tarea movida.");
        }
      });
    });
  }

  function renderCalendar() {
    const list = document.getElementById("calendarList");
    if (!list) return;

    const events = [
      { title: "Modelo 303 · IVA trimestral", client: "Ibernova Solar S.L.", date: "18 julio 2026", type: "Fiscal" },
      { title: "IRPF trimestral", client: "Marta Vidal Studio", date: "20 julio 2026", type: "Fiscal" },
      { title: "Seguros sociales", client: "Restauración Norte S.L.", date: "30 junio 2026", type: "Laboral" },
      { title: "Cierre contable mensual", client: "Ibernova Solar S.L.", date: "5 julio 2026", type: "Contable" },
      { title: "Revisión contrato trabajador", client: "Restauración Norte S.L.", date: "27 junio 2026", type: "Laboral" }
    ];

    const filtered = role === "team" ? events : events.filter(e => e.client === "Ibernova Solar S.L.");

    list.innerHTML = filtered.map(e => `
      <div class="calendar-item">
        <b><span class="status-dot info"></span>${escapeHtml(e.title)}</b>
        <span>${escapeHtml(e.client)} · ${escapeHtml(e.date)} · ${escapeHtml(e.type)}</span>
      </div>
    `).join("");
  }

  function renderMessages() {
    const thread = document.getElementById("messageThread");
    if (!thread) return;
    const messages = read(KEYS.messages, []);

    thread.innerHTML = messages.map(m => `
      <div class="message-bubble ${m.role === role ? "me" : ""}">
        <b>${escapeHtml(m.author)}</b>
        ${escapeHtml(m.text)}
        <span>${fmtTime(m.date)}</span>
      </div>
    `).join("");

    thread.scrollTop = thread.scrollHeight;
  }

  function labelStatus(status) {
    const labels = {
      recibido: "Recibido",
      pendiente: "Pendiente",
      revisado: "Revisado",
      validado: "Validado",
      falta: "Falta info",
      nuevo: "Nuevo",
      contactado: "Contactado",
      convertido: "Convertido"
    };
    return labels[status] || status;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (hasResetFlag()) {
      clearLegacyDemoKeys();
      resetDemoData(true);
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    getDemoStart();
    ensureSeedData();
    updateDemoLabels();
    setupPublicSite();
    setupHub();
  });
})();
