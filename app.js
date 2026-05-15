(() => {
  const DAY = 24 * 60 * 60 * 1000;
  const DEMO_DAYS = 15;
  const KEYS = {
    start: 'colomer_demo_v4_dark_start',
    leads: 'colomer_demo_v4_dark_leads',
    docs: 'colomer_demo_v4_dark_docs',
    auth: 'colomer_demo_v4_dark_auth',
    activity: 'colomer_demo_v4_dark_activity'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const uid = () => Math.random().toString(36).slice(2, 9);
  const today = () => new Date().toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });
  const nowTime = () => new Date().toLocaleString('es-ES', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });

  function readJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function resetDemo() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.setItem(KEYS.start, String(Date.now()));
    seedData(true);
    location.href = location.pathname;
  }

  function setupDemoPeriod() {
    const params = new URLSearchParams(location.search);
    if (params.has('resetdemo')) {
      Object.values(KEYS).forEach(key => localStorage.removeItem(key));
      localStorage.setItem(KEYS.start, String(Date.now()));
      seedData(true);
      history.replaceState(null, '', location.pathname);
    }

    let start = Number(localStorage.getItem(KEYS.start));
    if (!start || Number.isNaN(start)) {
      start = Date.now();
      localStorage.setItem(KEYS.start, String(start));
      seedData(false);
    } else {
      seedData(false);
    }

    const elapsed = Date.now() - start;
    const remainingMs = Math.max(0, DEMO_DAYS * DAY - elapsed);
    const remainingDays = Math.ceil(remainingMs / DAY);
    const expired = elapsed > DEMO_DAYS * DAY;

    $$('[data-demo-days]').forEach(el => {
      el.textContent = expired ? 'Demo finalizada' : `${remainingDays} ${remainingDays === 1 ? 'día restante' : 'días restantes'}`;
    });

    if (expired) {
      const modal = $('[data-expired-modal]');
      if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
      }
    }
  }

  function seedData(force = false) {
    const existingLeads = readJSON(KEYS.leads, null);
    const existingDocs = readJSON(KEYS.docs, null);
    const existingActivity = readJSON(KEYS.activity, null);

    if (force || !existingLeads) {
      writeJSON(KEYS.leads, [
        { id: uid(), name:'Marta Soler · Nova Retail S.L.', email:'marta@novaretail.es', service:'Contabilidad', message:'Necesitamos ordenar facturas, modelos trimestrales y documentación laboral.', status:'Nuevo', date:today() },
        { id: uid(), name:'Javier Martín · Talleres JM', email:'javier@talleresjm.es', service:'Asesoría laboral', message:'Buscamos centralizar contratos, nóminas y avisos de vencimiento.', status:'Contactar', date:today() }
      ]);
    }

    if (force || !existingDocs) {
      writeJSON(KEYS.docs, [
        { id: uid(), client:'Nova Retail S.L.', type:'Factura proveedor', note:'Factura trimestral recibida desde área cliente.', status:'Recibido', date:today() },
        { id: uid(), client:'Martínez Talleres', type:'Contrato', note:'Falta anexo firmado por trabajador.', status:'Falta información', date:today() },
        { id: uid(), client:'Luna Studio', type:'Modelo fiscal', note:'Preparado para revisión final.', status:'Validado', date:today() },
        { id: uid(), client:'Orion Logistics', type:'Justificante bancario', note:'Pendiente de conciliación.', status:'Pendiente revisión', date:today() }
      ]);
    }

    if (force || !existingActivity) {
      writeJSON(KEYS.activity, [
        { id: uid(), kind:'doc', text:'Factura proveedor recibida de Nova Retail S.L.', time:nowTime() },
        { id: uid(), kind:'lead', text:'Nuevo lead web creado desde el formulario de diagnóstico.', time:nowTime() },
        { id: uid(), kind:'ok', text:'Modelo fiscal validado para Luna Studio.', time:nowTime() }
      ]);
    }
  }

  function addActivity(kind, text) {
    const activity = readJSON(KEYS.activity, []);
    activity.unshift({ id: uid(), kind, text, time:nowTime() });
    writeJSON(KEYS.activity, activity.slice(0, 12));
    renderHub();
  }

  function statusClass(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('valid')) return 'green';
    if (s.includes('falta') || s.includes('pendiente')) return 'amber';
    if (s.includes('contact')) return 'blue';
    return 'blue';
  }

  function setupMenu() {
    const menu = $('[data-menu]');
    const nav = $('[data-nav]');
    if (!menu || !nav) return;
    menu.addEventListener('click', () => nav.classList.toggle('open'));
  }

  function setupResetButtons() {
    $$('[data-reset-demo]').forEach(btn => btn.addEventListener('click', resetDemo));
  }

  function setupLeadForm() {
    const form = $('[data-lead-form]');
    if (!form) return;

    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const lead = {
        id: uid(),
        name: String(data.get('name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        service: String(data.get('service') || '').trim(),
        message: String(data.get('message') || '').trim(),
        status: 'Nuevo',
        date: today()
      };

      const leads = readJSON(KEYS.leads, []);
      leads.unshift(lead);
      writeJSON(KEYS.leads, leads);
      addActivity('lead', `Solicitud web recibida: ${lead.name} · ${lead.service}.`);

      const result = $('[data-form-result]');
      if (result) {
        result.innerHTML = 'Solicitud demo creada correctamente. Ahora puedes verla en <a href="hub.html" class="text-link-inline">Leads web del Hub</a>.';
      }
      form.reset();
    });
  }

  function setupLogin() {
    const loginView = $('[data-login-view]');
    const dashView = $('[data-dashboard-view]');
    const form = $('[data-login-form]');
    if (!loginView || !dashView || !form) return;

    const showDashboard = () => {
      loginView.classList.add('hidden');
      dashView.classList.remove('hidden');
      renderHub();
    };

    if (localStorage.getItem(KEYS.auth) === '1') showDashboard();

    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const email = String(data.get('email') || '').trim().toLowerCase();
      const password = String(data.get('password') || '').trim();
      const result = $('[data-login-result]');

      if (email === 'demo@colomerhub.es' && password === 'demo2026') {
        localStorage.setItem(KEYS.auth, '1');
        if (result) result.textContent = 'Acceso correcto.';
        showDashboard();
      } else if (result) {
        result.textContent = 'Credenciales incorrectas. Usa demo@colomerhub.es · demo2026';
      }
    });

    const logout = $('[data-logout]');
    if (logout) {
      logout.addEventListener('click', () => {
        localStorage.removeItem(KEYS.auth);
        location.reload();
      });
    }
  }

  function setupTabs() {
    const buttons = $$('[data-tab]');
    if (!buttons.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        buttons.forEach(b => b.classList.toggle('active', b === btn));
        $$('[data-section]').forEach(section => section.classList.toggle('active', section.dataset.section === tab));
        const titles = {
          overview: 'Dashboard operativo',
          leads: 'Leads web',
          documents: 'Bandeja documental',
          clients: 'Clientes',
          ai: 'Lectura IA asistida',
          client: 'Vista cliente'
        };
        const title = $('[data-section-title]');
        if (title) title.textContent = titles[tab] || 'Colomer Hub';
      });
    });
  }

  function setupDocForm() {
    const form = $('[data-doc-form]');
    if (!form) return;

    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const doc = {
        id: uid(),
        client: String(data.get('client') || '').trim(),
        type: String(data.get('type') || '').trim(),
        note: String(data.get('note') || '').trim() || 'Documento subido desde demo.',
        status: 'Recibido',
        date: today()
      };
      const docs = readJSON(KEYS.docs, []);
      docs.unshift(doc);
      writeJSON(KEYS.docs, docs);
      addActivity('doc', `${doc.type} recibido de ${doc.client}.`);
      form.reset();
      renderHub();
    });
  }

  function addDemoLead() {
    const leads = readJSON(KEYS.leads, []);
    const samples = [
      ['Clínica Balance', 'Asesoría laboral', 'Queremos ordenar nóminas, contratos y vencimientos.'],
      ['Estudio Norte', 'Fiscal', 'Necesitamos una asesoría con área privada para documentación.'],
      ['Café Atlántico', 'Autónomos y pymes', 'Buscamos simplificar impuestos y recordatorios.']
    ];
    const sample = samples[Math.floor(Math.random() * samples.length)];
    leads.unshift({ id: uid(), name: sample[0], email:'contacto@demo.es', service: sample[1], message: sample[2], status:'Nuevo', date: today() });
    writeJSON(KEYS.leads, leads);
    addActivity('lead', `Lead demo creado: ${sample[0]} · ${sample[1]}.`);
    renderHub();
  }

  function addDemoDoc(client = 'Nova Retail S.L.') {
    const types = ['Factura proveedor', 'Nómina', 'Contrato', 'Justificante bancario', 'Modelo fiscal'];
    const type = types[Math.floor(Math.random() * types.length)];
    const docs = readJSON(KEYS.docs, []);
    docs.unshift({ id: uid(), client, type, note:'Documento demo registrado para revisión.', status:'Recibido', date:today() });
    writeJSON(KEYS.docs, docs);
    addActivity('doc', `${type} recibido de ${client}.`);
    renderHub();
  }

  function setupQuickActions() {
    $$('[data-add-lead]').forEach(btn => btn.addEventListener('click', addDemoLead));
    $$('[data-quick-doc]').forEach(btn => btn.addEventListener('click', () => addDemoDoc()));
    $$('[data-client-upload]').forEach(btn => btn.addEventListener('click', () => addDemoDoc('Nova Retail S.L.')));
    const ai = $('[data-run-ai]');
    if (ai) ai.addEventListener('click', runAI);
  }

  function runAI() {
    const result = $('[data-ai-result]');
    if (!result) return;
    result.innerHTML = `
      <span class="scan-line"></span>
      <h3>Análisis simulado completado</h3>
      <p>Documento clasificado como factura de proveedor. La IA propone campos extraídos para revisión del equipo.</p>
      <div class="ai-data">
        <div><small>Tipo detectado</small><b>Factura proveedor</b></div>
        <div><small>Proveedor</small><b>Suministros Levante S.L.</b></div>
        <div><small>Importe</small><b>1.284,60 €</b></div>
        <div><small>Confianza</small><b>94%</b></div>
      </div>
      <p style="margin-top:18px"><strong>Acción recomendada:</strong> revisar CIF, fecha e importe antes de validar.</p>
    `;
    addActivity('ai', 'Lectura IA simulada completada sobre factura de proveedor.');
  }

  function updateDocStatus(id, status) {
    const docs = readJSON(KEYS.docs, []);
    const doc = docs.find(item => item.id === id);
    if (!doc) return;
    doc.status = status;
    writeJSON(KEYS.docs, docs);
    addActivity(status.includes('Valid') ? 'ok' : 'doc', `${doc.type} de ${doc.client}: estado cambiado a ${status}.`);
    renderHub();
  }

  function renderHub() {
    if (!$('[data-dashboard-view]')) return;
    const leads = readJSON(KEYS.leads, []);
    const docs = readJSON(KEYS.docs, []);
    const activity = readJSON(KEYS.activity, []);

    const pending = docs.filter(doc => !/validado/i.test(doc.status)).length;
    const setText = (selector, value) => {
      const el = $(selector);
      if (el) el.textContent = value;
    };
    setText('[data-metric-leads]', leads.length);
    setText('[data-metric-docs]', docs.length);
    setText('[data-metric-pending]', pending);
    setText('[data-priority-docs]', `${pending} elementos`);
    setText('[data-priority-leads]', `${leads.length} solicitudes`);

    const activityList = $('[data-activity-list]');
    if (activityList) {
      activityList.innerHTML = activity.map(item => `
        <div class="timeline-item">
          <span class="status-dot ${item.kind === 'ok' ? 'ok' : item.kind === 'lead' ? 'blue' : item.kind === 'ai' ? 'warn' : 'blue'}"></span>
          <div><strong>${escapeHTML(item.text)}</strong><p>Registro automático generado por la demo.</p></div>
          <time>${escapeHTML(item.time)}</time>
        </div>
      `).join('');
    }

    const leadsTable = $('[data-leads-table]');
    if (leadsTable) {
      leadsTable.innerHTML = leads.map(lead => `
        <tr>
          <td><strong>${escapeHTML(lead.name)}</strong><br><small>${escapeHTML(lead.email)}</small></td>
          <td>${escapeHTML(lead.service)}</td>
          <td>${escapeHTML(lead.message || 'Sin mensaje')}</td>
          <td><span class="tag ${statusClass(lead.status)}">${escapeHTML(lead.status)}</span></td>
          <td>${escapeHTML(lead.date)}</td>
        </tr>
      `).join('');
    }

    const renderDocs = (root, clientOnly = false) => {
      const list = $(root);
      if (!list) return;
      const items = clientOnly ? docs.filter(doc => doc.client === 'Nova Retail S.L.').slice(0, 6) : docs;
      list.innerHTML = items.map(doc => `
        <div class="doc-item">
          <div>
            <h3>${escapeHTML(doc.type)} · ${escapeHTML(doc.client)}</h3>
            <p>${escapeHTML(doc.note)} · ${escapeHTML(doc.date)}</p>
          </div>
          <div class="doc-actions">
            <span class="tag ${statusClass(doc.status)}">${escapeHTML(doc.status)}</span>
            ${clientOnly ? '' : `
              <button data-doc-status="${doc.id}|Pendiente revisión">Pendiente</button>
              <button data-doc-status="${doc.id}|Falta información">Falta info</button>
              <button data-doc-status="${doc.id}|Validado">Validar</button>
            `}
          </div>
        </div>
      `).join('');
    };

    renderDocs('[data-doc-list]', false);
    renderDocs('[data-client-doc-list]', true);

    $$('[data-doc-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [id, status] = btn.dataset.docStatus.split('|');
        updateDocStatus(id, status);
      });
    });
  }

  function escapeHTML(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function updateWebCounters() {
    const docs = readJSON(KEYS.docs, []);
    $$('[data-count-docs]').forEach(el => el.textContent = docs.length || 18);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupDemoPeriod();
    setupResetButtons();
    setupMenu();
    setupLeadForm();
    setupLogin();
    setupTabs();
    setupDocForm();
    setupQuickActions();
    updateWebCounters();
    renderHub();
  });
})();
