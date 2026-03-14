/* ============================================================
   ClawBot Design System — JS Components
   Dépendances : tokens.css, components.css, animations.css
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════════ */
const DSToast = (() => {
  let container = null;

  const ICONS = {
    success: '✓',
    error:   '✕',
    warning: '⚠',
    info:    'ℹ',
  };

  function init() {
    if (container) return;
    container = document.createElement('div');
    container.className = 'ds-toast-container';
    document.body.appendChild(container);
  }

  /**
   * @param {Object} opts
   * @param {'success'|'error'|'warning'|'info'} opts.type
   * @param {string} opts.title
   * @param {string} [opts.message]
   * @param {number} [opts.duration=4000] ms, 0 = persistent
   */
  function show({ type = 'info', title, message = '', duration = 4000 }) {
    init();

    const toast = document.createElement('div');
    toast.className = `ds-toast ds-toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="ds-toast__icon" aria-hidden="true">${ICONS[type] || ICONS.info}</span>
      <div class="ds-toast__body">
        ${title ? `<div class="ds-toast__title">${_esc(title)}</div>` : ''}
        ${message ? `<div class="ds-toast__message">${_esc(message)}</div>` : ''}
      </div>
      <button class="ds-toast__close" aria-label="Fermer">×</button>
    `;

    toast.querySelector('.ds-toast__close').addEventListener('click', () => dismiss(toast));
    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => dismiss(toast), duration);
    }

    return toast;
  }

  function dismiss(toast) {
    if (!toast || toast.classList.contains('dismissing')) return;
    toast.classList.add('dismissing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }

  function _esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  return { init, show, dismiss };
})();


/* ══════════════════════════════════════════════════════════
   PANEL — toggle collapse
   ══════════════════════════════════════════════════════════ */
const DSPanel = (() => {
  function init(el) {
    const header = el.querySelector('.ds-panel__header');
    if (!header) return;

    header.addEventListener('click', () => toggle(el));

    // Accessibilité
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(el);
      }
    });
  }

  function toggle(el) {
    el.classList.toggle('collapsed');
    const expanded = !el.classList.contains('collapsed');
    const header = el.querySelector('.ds-panel__header');
    if (header) header.setAttribute('aria-expanded', expanded);
  }

  /** Init tous les panels dans un conteneur */
  function initAll(root = document) {
    root.querySelectorAll('.ds-panel').forEach(init);
  }

  return { init, toggle, initAll };
})();


/* ══════════════════════════════════════════════════════════
   SIDEBAR — toggle collapse
   ══════════════════════════════════════════════════════════ */
const DSSidebar = (() => {
  function init(el) {
    const toggle = el.querySelector('.ds-sidebar__toggle');
    if (toggle) {
      toggle.addEventListener('click', () => DSSidebar.toggle(el));
    }

    // Items nav → afficher tooltip en mode collapsed
    el.querySelectorAll('.ds-sidebar__item').forEach(item => {
      const label = item.querySelector('.ds-sidebar__label');
      if (!label) return;

      // Tooltip natif sur l'item pour le mode collapsed
      if (!item.title) {
        item.title = label.textContent.trim();
      }
    });
  }

  function toggle(el) {
    el.classList.toggle('collapsed');
    const collapsed = el.classList.contains('collapsed');
    // Persister préférence (sans localStorage — via session API si besoin)
    el.dispatchEvent(new CustomEvent('ds:sidebar-toggle', { detail: { collapsed } }));
  }

  function collapse(el)  { el.classList.add('collapsed'); }
  function expand(el)    { el.classList.remove('collapsed'); }

  return { init, toggle, collapse, expand };
})();


/* ══════════════════════════════════════════════════════════
   MODAL
   ══════════════════════════════════════════════════════════ */
const DSModal = (() => {
  function open(el) {
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    // Focus trap basique : focus le premier élément interactif
    const first = el.querySelector('button, input, textarea, select, [tabindex="0"]');
    if (first) setTimeout(() => first.focus(), 50);
    // Fermer sur click overlay
    el.addEventListener('click', _overlayClose, { once: true });
  }

  function close(el) {
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
  }

  function _overlayClose(e) {
    if (e.target === e.currentTarget) close(e.currentTarget);
  }

  function initAll(root = document) {
    root.querySelectorAll('[data-modal-close]').forEach(btn => {
      const modal = btn.closest('.ds-modal-overlay');
      if (modal) btn.addEventListener('click', () => close(modal));
    });
    // Fermer sur Escape
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.ds-modal-overlay.open').forEach(close);
    });
  }

  return { open, close, initAll };
})();


/* ══════════════════════════════════════════════════════════
   TEXTAREA AUTO-RESIZE
   ══════════════════════════════════════════════════════════ */
function DSAutoResize(el) {
  function resize() {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }
  el.addEventListener('input', resize);
  resize();
}


/* ══════════════════════════════════════════════════════════
   THEME TOGGLE
   ══════════════════════════════════════════════════════════ */
const DSTheme = (() => {
  function set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Pas de localStorage — stocker via l'API config si besoin
    document.dispatchEvent(new CustomEvent('ds:theme-change', { detail: { theme } }));
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    set(current === 'light' ? 'dark' : 'light');
  }

  function get() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  return { set, toggle, get };
})();


/* ══════════════════════════════════════════════════════════
   INIT GLOBAL
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  DSToast.init();
  DSPanel.initAll();
  DSModal.initAll();

  // Sidebar principale
  const sidebar = document.querySelector('.ds-sidebar');
  if (sidebar) DSSidebar.init(sidebar);

  // Auto-resize textareas ds-textarea
  document.querySelectorAll('.ds-textarea').forEach(DSAutoResize);
});
