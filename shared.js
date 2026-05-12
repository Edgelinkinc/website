/* ===== EDGELINK SITE — SHARED RENDERING UTILITIES (ES5) ===== */

var EDGELINK = (function() {
  'use strict';

  var DEFAULT_CONTENT_URL = 'content.json';
  var LOCAL_DRAFT_KEY = 'edgelink_content_draft';

  // ===== LOAD CONTENT =====
  // Priority: localStorage draft (for admin preview) > content.json fetch > error
  function loadContent(useDraft, callback) {
    if (useDraft) {
      var draft = localStorage.getItem(LOCAL_DRAFT_KEY);
      if (draft) {
        try {
          callback(null, JSON.parse(draft));
          return;
        } catch (e) {
          // fall through to fetch
        }
      }
    }
    fetch(DEFAULT_CONTENT_URL + '?t=' + Date.now())
      .then(function(r) {
        if (!r.ok) throw new Error('content.json not found');
        return r.json();
      })
      .then(function(data) { callback(null, data); })
      .catch(function(err) { callback(err, null); });
  }

  // ===== SAFE HTML (allows <em> for headlines) =====
  function safeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s);
  }

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/"/g, '&quot;');
  }

  // ===== LOGO SVG =====
  function logoSvg() {
    return '<svg viewBox="0 0 32 32" width="32" height="32" fill="none">' +
      '<path d="M16 2 L28 16 L16 30 L4 16 Z" fill="#5F249F"/>' +
      '<rect x="11" y="18" width="2" height="4" fill="white" rx="0.5"/>' +
      '<rect x="14" y="15" width="2" height="7" fill="white" rx="0.5"/>' +
      '<rect x="17" y="12" width="2" height="10" fill="white" rx="0.5"/>' +
      '<rect x="20" y="9" width="2" height="13" fill="white" rx="0.5"/>' +
      '</svg>';
  }

  // ===== ICON SVGS =====
  var ICONS = {
    store: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5F249F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1-5h16l1 5"/><path d="M5 9v11h14V9"/><path d="M9 22V12h6v10"/></svg>',
    people: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5F249F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    growth: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5F249F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    training: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5F249F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    bilingual: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5F249F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
  };

  function iconHtml(name) {
    return ICONS[name] || ICONS.store;
  }

  // ===== NAV =====
  function renderNav(content) {
    var nav = content.nav || {};
    var links = nav.links || [];
    var brand = content.branding || {};

    var html = '<div class="nav-inner">';
    html += '<a href="index.html" class="logo">';
    html += '<div class="logo-mark">' + logoSvg() + '</div>';
    html += '<span class="logo-text">' + escapeHtml(brand.companyName || 'Edgelink') + '</span>';
    html += '</a>';
    html += '<div class="nav-links">';
    for (var i = 0; i < links.length; i++) {
      html += '<a href="' + escapeAttr(links[i].href) + '">' + escapeHtml(links[i].label) + '</a>';
    }
    if (nav.ctaLabel) {
      html += '<a href="' + escapeAttr(nav.ctaHref || '#') + '" class="nav-cta">' + escapeHtml(nav.ctaLabel) + '</a>';
    }
    html += '</div></div>';
    return html;
  }

  // ===== HERO (HOME) =====
  function renderHomeHero(hero) {
    if (!hero) return '';
    var html = '<div class="hero-inner">';
    html += '<div>';
    if (hero.eyebrow) {
      html += '<div class="hero-eyebrow"><span class="dot"></span>' + escapeHtml(hero.eyebrow) + '</div>';
    }
    html += '<h1>' + safeHtml(hero.headline) + '</h1>';
    if (hero.subhead) html += '<p class="hero-sub">' + escapeHtml(hero.subhead) + '</p>';

    if (hero.stats && hero.stats.length) {
      html += '<div class="hero-stats">';
      for (var i = 0; i < hero.stats.length; i++) {
        html += '<div class="hero-pill"><strong>' + escapeHtml(hero.stats[i].value) + '</strong> ' + escapeHtml(hero.stats[i].label) + '</div>';
      }
      html += '</div>';
    }

    html += '<div class="hero-cta">';
    if (hero.primaryCtaLabel) {
      html += '<a href="' + escapeAttr(hero.primaryCtaHref || '#') + '" class="btn btn-primary">' + escapeHtml(hero.primaryCtaLabel) + ' →</a>';
    }
    if (hero.secondaryCtaLabel) {
      html += '<a href="' + escapeAttr(hero.secondaryCtaHref || '#') + '" class="btn btn-ghost">' + escapeHtml(hero.secondaryCtaLabel) + '</a>';
    }
    html += '</div></div>';

    // Hero visual: image if provided, else phone mockup
    if (hero.heroImageUrl && hero.heroImageUrl.length > 0) {
      html += '<div class="hero-image-wrap"><img src="' + escapeAttr(hero.heroImageUrl) + '" alt="Edgelink"></div>';
    } else {
      html += renderHomePhoneMockup();
    }

    html += '</div>';
    return html;
  }

  function renderHomePhoneMockup() {
    var html = '<div class="phone-stage">';
    html += '<div class="phone phone-back"><div class="phone-screen" style="background: linear-gradient(160deg, #B47CD9 0%, #5F249F 100%);"><div class="phone-notch"></div></div></div>';
    html += '<div class="phone phone-front"><div class="phone-screen">';
    html += '<div class="phone-notch"></div>';
    html += '<div class="phone-content">';
    html += '<div class="phone-eyebrow-mini">Team Edgelink</div>';
    html += '<div class="phone-headline">One family. Five states.</div>';
    html += '<div class="phone-card"><div class="phone-card-row"><span class="phone-card-label">Active Stores</span><span class="phone-card-value">35</span></div></div>';
    html += '<div class="phone-card"><div class="phone-team-row"><div class="phone-avatar-stack"><div class="phone-avatar"></div><div class="phone-avatar"></div><div class="phone-avatar"></div><div class="phone-avatar"></div></div><div style="color: white; font-size: 12px;"><div style="opacity: 0.7;">Team</div><div style="font-weight: 600;">200+ Members</div></div></div></div>';
    html += '<div class="phone-card" style="margin-top: auto;"><div style="color: white; font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Our Mission</div><div style="color: white; font-family: \'Fraunces\', serif; font-size: 14px; line-height: 1.3;">Connect communities. Build careers. Grow together.</div></div>';
    html += '</div></div></div>';

    html += '<div class="phone-stat-bubble bubble-top"><div class="bubble-label">Family Owned</div><div class="bubble-value">Team First</div></div>';
    html += '<div class="phone-stat-bubble bubble-bottom"><div class="bubble-label">Hiring In</div><div class="bubble-value">5 States</div></div>';
    html += '</div>';
    return html;
  }

  // ===== STATS STRIP =====
  function renderStatsStrip(stats) {
    if (!stats || !stats.length) return '';
    var html = '<div class="stats-grid">';
    for (var i = 0; i < stats.length; i++) {
      html += '<div><div class="stat-num">' + escapeHtml(stats[i].value) + '</div><div class="stat-label">' + escapeHtml(stats[i].label) + '</div></div>';
    }
    html += '</div>';
    return html;
  }

  // ===== ABOUT =====
  function renderAbout(about) {
    if (!about) return '';
    var html = '<div class="section-inner"><div class="about-grid">';
    html += '<div class="about-image">';
    if (about.imageUrl && about.imageUrl.length > 0) {
      html += '<img src="' + escapeAttr(about.imageUrl) + '" alt="' + escapeAttr(about.eyebrow || 'About') + '">';
    } else {
      html += '<div class="about-image-pattern"></div>';
      html += '<div class="about-quote">';
      html += '<div class="quote-mark">&ldquo;</div>';
      html += '<div class="quote-text">' + escapeHtml(about.quote || '') + '</div>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div>';
    if (about.eyebrow) html += '<div class="section-eyebrow">' + escapeHtml(about.eyebrow) + '</div>';
    html += '<h2 class="section-h">' + safeHtml(about.headline) + '</h2>';
    var paragraphs = about.paragraphs || [];
    for (var i = 0; i < paragraphs.length; i++) {
      html += '<p class="section-lead" style="margin-bottom: 20px;">' + escapeHtml(paragraphs[i]) + '</p>';
    }
    html += '</div>';
    html += '</div></div>';
    return html;
  }

  // ===== SECTION HEADER (eyebrow + h2 + lead) =====
  function renderSectionHeader(eyebrow, headline, lead) {
    var html = '';
    if (eyebrow) html += '<div class="section-eyebrow">' + escapeHtml(eyebrow) + '</div>';
    if (headline) html += '<h2 class="section-h">' + safeHtml(headline) + '</h2>';
    if (lead) html += '<p class="section-lead">' + escapeHtml(lead) + '</p>';
    return html;
  }

  // ===== SERVICE / VALUE CARDS =====
  function renderCards(items, options) {
    options = options || {};
    var cols = options.cols || 3;
    var html = '<div class="cards-grid' + (cols === 4 ? ' cols-4' : '') + '">';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      html += '<div class="card">';
      if (item.icon) {
        html += '<div class="card-icon">' + iconHtml(item.icon) + '</div>';
      }
      if (item.label) {
        html += '<div class="card-eyebrow">' + escapeHtml(item.label) + '</div>';
      }
      html += '<h3>' + escapeHtml(item.title) + '</h3>';
      html += '<p>' + escapeHtml(item.description) + '</p>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ===== LOCATIONS =====
  function renderLocations(states) {
    if (!states || !states.length) return '';

    // Determine if any state has stores — if so, use wider card layout
    var hasAnyStores = false;
    for (var i = 0; i < states.length; i++) {
      if (states[i].stores && states[i].stores.length > 0) {
        hasAnyStores = true; break;
      }
    }

    var html = '<div class="states-row' + (hasAnyStores ? ' with-stores' : '') + '">';
    for (var j = 0; j < states.length; j++) {
      var state = states[j];
      var stores = state.stores || [];
      var hasStores = stores.length > 0;

      html += '<div class="state-card' + (hasStores ? ' has-stores' : '') + '">';

      if (hasStores) {
        html += '<div class="state-header">';
        html += '<div class="state-abbr">' + escapeHtml(state.abbr) + '</div>';
        html += '<div class="state-name">' + escapeHtml(state.name) + '</div>';
        html += '<div class="state-count">' + stores.length + ' store' + (stores.length === 1 ? '' : 's') + '</div>';
        html += '</div>';
        html += '<ul class="store-list">';
        for (var k = 0; k < stores.length; k++) {
          html += '<li class="store-item">';
          html += '<div>';
          html += '<span class="store-name">' + escapeHtml(stores[k].name || '') + '</span>';
          if (stores[k].address && stores[k].address.length > 0) {
            html += '<span class="store-address">' + escapeHtml(stores[k].address) + '</span>';
          }
          html += '</div>';
          html += '</li>';
        }
        html += '</ul>';
      } else {
        html += '<div class="state-abbr">' + escapeHtml(state.abbr) + '</div>';
        html += '<div class="state-name">' + escapeHtml(state.name) + '</div>';
      }

      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ===== CALLOUT (careers callout, apply CTA) =====
  function renderCallout(callout) {
    if (!callout) return '';
    var html = '<div class="callout-card"><div class="callout-content">';
    if (callout.eyebrow) html += '<div class="callout-eyebrow">' + escapeHtml(callout.eyebrow) + '</div>';
    html += '<h2>' + safeHtml(callout.headline) + '</h2>';
    if (callout.description) html += '<p>' + escapeHtml(callout.description) + '</p>';
    if (callout.ctaLabel) {
      html += '<a href="' + escapeAttr(callout.ctaHref || '#') + '" class="btn btn-light"' + (callout.ctaHref && callout.ctaHref.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + '>' + escapeHtml(callout.ctaLabel) + ' →</a>';
    }
    html += '</div></div>';
    return html;
  }

  // ===== GROWTH PATH =====
  function renderGrowthPath(steps) {
    if (!steps || !steps.length) return '';
    var html = '<div class="growth-path">';
    for (var i = 0; i < steps.length; i++) {
      html += '<div class="growth-step">';
      html += '<div class="growth-step-num">' + (i + 1) + '</div>';
      html += '<h3>' + escapeHtml(steps[i].title) + '</h3>';
      if (steps[i].subtitle) html += '<div class="growth-step-sub">' + escapeHtml(steps[i].subtitle) + '</div>';
      html += '<p>' + escapeHtml(steps[i].description) + '</p>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ===== BENEFITS =====
  function renderBenefits(items) {
    if (!items || !items.length) return '';
    var html = '<div class="benefits-list">';
    for (var i = 0; i < items.length; i++) {
      html += '<div class="benefit-item">';
      html += '<div class="benefit-check">' + iconHtml('check') + '</div>';
      html += '<div class="benefit-text">' + escapeHtml(items[i]) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ===== APPLICATION PROCESS =====
  function renderAppProcess(steps) {
    if (!steps || !steps.length) return '';
    var html = '<div class="app-process">';
    for (var i = 0; i < steps.length; i++) {
      html += '<div class="app-step">';
      html += '<div class="app-step-num">' + escapeHtml(steps[i].number || (i + 1)) + '</div>';
      html += '<h3>' + escapeHtml(steps[i].title) + '</h3>';
      html += '<p>' + escapeHtml(steps[i].description) + '</p>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ===== TESTIMONIALS =====
  function renderTestimonials(items) {
    if (!items || !items.length) return '';
    var html = '<div class="testimonials-grid">';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      html += '<div class="testimonial">';
      if (item.imageUrl && item.imageUrl.length > 0) {
        html += '<img src="' + escapeAttr(item.imageUrl) + '" alt="' + escapeAttr(item.name) + '" class="testimonial-photo">';
      } else {
        // Use initial as placeholder
        var initial = (item.name || '?').charAt(0).toUpperCase();
        html += '<div class="testimonial-photo-placeholder">' + escapeHtml(initial) + '</div>';
      }
      html += '<p class="testimonial-quote">' + escapeHtml(item.quote) + '</p>';
      html += '<div class="testimonial-name">' + escapeHtml(item.name) + '</div>';
      if (item.role) html += '<div class="testimonial-role">' + escapeHtml(item.role) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ===== CONTACT FORM =====
  function renderContactForm(form) {
    if (!form || form.enabled === false) return '';
    var info = form.contactInfo || {};
    var subjects = form.subjects || ['General Question'];
    var hasEndpoint = form.formspreeEndpoint && form.formspreeEndpoint.length > 0;

    var html = '<div class="section-inner">';
    html += renderSectionHeader(form.eyebrow, form.headline, form.lead);
    html += '<div class="contact-grid">';

    // LEFT: Contact info
    html += '<div class="contact-info">';
    if (info.email) {
      html += '<a class="contact-info-item" href="mailto:' + escapeAttr(info.email) + '" style="text-decoration:none;">';
      html += '<div class="contact-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>';
      html += '<div><div class="contact-info-label">Email</div>';
      html += '<span class="contact-info-value">' + escapeHtml(info.email) + '</span></div>';
      html += '</a>';
    }
    if (info.phoneLabel && info.phoneLabel.length > 0) {
      html += '<div class="contact-info-item">';
      html += '<div class="contact-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>';
      html += '<div><div class="contact-info-label">Phone</div>';
      html += '<span class="contact-info-value">' + escapeHtml(info.phoneLabel) + '</span></div>';
      html += '</div>';
    }
    if (info.addressLabel && info.addressLabel.length > 0) {
      html += '<div class="contact-info-item">';
      html += '<div class="contact-info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>';
      html += '<div><div class="contact-info-label">Headquarters</div>';
      html += '<span class="contact-info-value">' + escapeHtml(info.addressLabel) + '</span></div>';
      html += '</div>';
    }
    html += '</div>';

    // RIGHT: Form
    html += '<div class="contact-form" id="contact-form-wrap">';
    if (!hasEndpoint) {
      html += '<div class="contact-notice">⚠️ Contact form not yet configured. Admin: add a Formspree endpoint in the Contact Form admin tab.</div>';
    }
    html += '<form id="contact-form-el" data-endpoint="' + escapeAttr(form.formspreeEndpoint || '') + '" data-success-msg="' + escapeAttr(form.successMessage || 'Thanks!') + '" novalidate>';

    html += '<div class="contact-form-row">';
    html += '<div class="contact-form-field"><label>Name <span class="req">*</span></label>';
    html += '<input type="text" name="name" required></div>';
    html += '<div class="contact-form-field"><label>Email <span class="req">*</span></label>';
    html += '<input type="email" name="email" required></div>';
    html += '</div>';

    html += '<div class="contact-form-row">';
    html += '<div class="contact-form-field"><label>Phone (optional)</label>';
    html += '<input type="tel" name="phone"></div>';
    html += '<div class="contact-form-field"><label>Subject <span class="req">*</span></label>';
    html += '<select name="subject" required>';
    for (var s = 0; s < subjects.length; s++) {
      html += '<option value="' + escapeAttr(subjects[s]) + '">' + escapeHtml(subjects[s]) + '</option>';
    }
    html += '</select></div>';
    html += '</div>';

    html += '<div class="contact-form-field"><label>Message <span class="req">*</span></label>';
    html += '<textarea name="message" required placeholder="How can we help?"></textarea></div>';

    // Honeypot for spam
    html += '<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">';

    html += '<button type="submit" class="contact-submit">' + escapeHtml(form.submitButtonLabel || 'Send Message') + '</button>';

    html += '<div class="contact-status" id="contact-status"></div>';
    html += '</form>';
    html += '</div>'; // form wrap

    html += '</div></div>';

    return html;
  }

  // ===== ATTACH CONTACT FORM HANDLER =====
  // Called by index.html after content is rendered
  function attachContactFormHandler() {
    var form = document.getElementById('contact-form-el');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var endpoint = form.getAttribute('data-endpoint');
      var successMsg = form.getAttribute('data-success-msg');
      var statusEl = document.getElementById('contact-status');
      var submitBtn = form.querySelector('button[type="submit"]');

      if (!endpoint || endpoint.length === 0) {
        statusEl.className = 'contact-status show error';
        statusEl.textContent = 'Form not configured yet. Admin needs to add a Formspree endpoint.';
        return;
      }

      // Honeypot check
      var honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) return; // silently ignore bot

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      statusEl.className = 'contact-status';

      var formData = new FormData(form);
      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function(response) {
        if (response.ok) {
          statusEl.className = 'contact-status show success';
          statusEl.textContent = successMsg;
          form.reset();
        } else {
          return response.json().then(function(data) {
            throw new Error((data.errors && data.errors[0] && data.errors[0].message) || 'Submission failed');
          });
        }
      })
      .catch(function(err) {
        statusEl.className = 'contact-status show error';
        statusEl.textContent = 'Could not send: ' + err.message + '. Try again or email us directly.';
      })
      .then(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
    });
  }

  // ===== FOOTER =====
  function renderFooter(content) {
    var footer = content.footer || {};
    var brand = content.branding || {};
    var cols = footer.columns || [];
    var social = footer.social || {};

    var html = '<div class="footer-inner"><div class="footer-grid">';

    // Brand column
    html += '<div class="footer-brand">';
    html += '<a href="index.html" class="logo">';
    html += '<div class="logo-mark">' + logoSvg() + '</div>';
    html += '<span class="logo-text">' + escapeHtml(brand.companyName || 'Edgelink') + '</span>';
    html += '</a>';
    if (footer.tagline) html += '<p>' + escapeHtml(footer.tagline) + '</p>';

    // Social icons
    var socialHtml = renderSocialIcons(social);
    if (socialHtml) html += socialHtml;
    html += '</div>';

    // Other columns
    for (var i = 0; i < cols.length; i++) {
      html += '<div class="footer-col">';
      html += '<h4>' + escapeHtml(cols[i].heading) + '</h4>';
      var links = cols[i].links || [];
      for (var j = 0; j < links.length; j++) {
        html += '<a href="' + escapeAttr(links[j].href) + '">' + escapeHtml(links[j].label) + '</a>';
      }
      html += '</div>';
    }

    html += '</div>'; // footer-grid
    html += '<div class="footer-bottom">';
    html += '<div>' + escapeHtml(footer.copyright || '') + '</div>';
    html += '<div>' + escapeHtml(footer.legal || '') + '</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function renderSocialIcons(social) {
    var any = false;
    var keys = ['facebook', 'instagram', 'linkedin', 'tiktok', 'youtube'];
    for (var k = 0; k < keys.length; k++) {
      if (social[keys[k]] && social[keys[k]].length > 0) { any = true; break; }
    }
    if (!any) return '';

    var icons = {
      facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
      instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
      linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
      tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.5a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.93z"/></svg>',
      youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
    };

    var html = '<div class="footer-social">';
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (social[key] && social[key].length > 0) {
        html += '<a href="' + escapeAttr(social[key]) + '" target="_blank" rel="noopener" title="' + key + '" aria-label="' + key + '">' + icons[key] + '</a>';
      }
    }
    html += '</div>';
    return html;
  }

  // ===== OPEN POSITIONS / JOBS =====
  function renderOpenPositions(openPositions) {
    if (!openPositions || openPositions.enabled === false) return '';
    var allJobs = (openPositions.items || []).filter(function(j) { return j.active !== false; });

    var html = '<div class="section-inner">';
    html += renderSectionHeader(openPositions.eyebrow, openPositions.headline, openPositions.lead);

    if (allJobs.length === 0) {
      html += '<div class="jobs-list"><div class="jobs-empty">';
      html += '<strong>No openings posted right now</strong>';
      html += escapeHtml(openPositions.noJobsMessage || 'Check back soon — we are always growing.');
      html += '</div></div>';
      html += '</div>';
      return html;
    }

    // Build state filter — count jobs per state
    var stateCounts = {};
    for (var i = 0; i < allJobs.length; i++) {
      var st = allJobs[i].state || 'OTHER';
      stateCounts[st] = (stateCounts[st] || 0) + 1;
    }
    var states = Object.keys(stateCounts).sort();

    html += '<div class="jobs-filter" id="jobs-filter">';
    html += '<button class="jobs-filter-btn active" data-state="ALL">All <span class="jobs-filter-count">(' + allJobs.length + ')</span></button>';
    for (var s = 0; s < states.length; s++) {
      html += '<button class="jobs-filter-btn" data-state="' + escapeAttr(states[s]) + '">' + escapeHtml(states[s]) + ' <span class="jobs-filter-count">(' + stateCounts[states[s]] + ')</span></button>';
    }
    html += '</div>';

    html += '<div class="jobs-list" id="jobs-list">';
    for (var j = 0; j < allJobs.length; j++) {
      html += renderJobCard(allJobs[j]);
    }
    html += '</div>';
    html += '</div>';
    return html;
  }

  function renderJobCard(job) {
    var payRange = formatPayRange(job);
    var typeLabel = formatEmploymentType(job.employmentType);

    var html = '<article class="job-card" data-state="' + escapeAttr(job.state || '') + '">';

    html += '<div class="job-header">';
    html += '<div style="flex:1;">';
    html += '<h3 class="job-title">' + escapeHtml(job.title) + '</h3>';
    html += '<div class="job-store">' + escapeHtml(job.storeName || job.city || '') + (job.state ? ' &middot; ' + escapeHtml(job.state) : '') + '</div>';
    html += '</div>';
    if (job.state) html += '<div class="job-state-badge">' + escapeHtml(job.state) + '</div>';
    html += '</div>';

    html += '<div class="job-meta-row">';
    if (typeLabel) {
      html += '<div class="job-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' + escapeHtml(typeLabel) + '</div>';
    }
    if (payRange) {
      html += '<div class="job-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg><strong>' + escapeHtml(payRange) + '</strong></div>';
    }
    if (job.datePosted) {
      html += '<div class="job-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Posted ' + escapeHtml(relativeDate(job.datePosted)) + '</div>';
    }
    html += '</div>';

    var summary = (job.description || '').split('\n')[0];
    if (summary) html += '<p class="job-summary">' + escapeHtml(summary) + '</p>';

    html += '<div class="job-actions">';
    var applyHref = job.applyUrl && job.applyUrl.length > 0 ? job.applyUrl : 'mailto:hr@edgelinkinc.net?subject=Application: ' + encodeURIComponent(job.title);
    var isExternal = applyHref.indexOf('http') === 0;
    html += '<a href="job.html?id=' + escapeAttr(job.id) + '" class="job-details-btn">View Details</a>';
    html += '<a href="' + escapeAttr(applyHref) + '" class="job-apply-btn"' + (isExternal ? ' target="_blank" rel="noopener"' : '') + '>Apply Now →</a>';
    html += '</div>';

    html += '</article>';
    return html;
  }

  function formatEmploymentType(t) {
    if (!t) return '';
    var map = {
      'FULL_TIME': 'Full-time',
      'PART_TIME': 'Part-time',
      'CONTRACTOR': 'Contractor',
      'TEMPORARY': 'Temporary',
      'INTERN': 'Internship',
      'VOLUNTEER': 'Volunteer',
      'PER_DIEM': 'Per diem',
      'OTHER': 'Other'
    };
    return map[t] || t;
  }

  function formatPayRange(job) {
    if (!job.payMin && !job.payMax) return '';
    var unit = (job.payUnit || 'HOUR').toLowerCase();
    var unitLabel = unit === 'hour' ? '/hr' : (unit === 'year' ? '/yr' : (unit === 'week' ? '/wk' : (unit === 'day' ? '/day' : '/' + unit)));
    var currency = job.payCurrency === 'USD' ? '$' : (job.payCurrency || '$');
    if (job.payMin && job.payMax && job.payMin !== job.payMax) {
      return currency + job.payMin + '-' + job.payMax + unitLabel;
    }
    return currency + (job.payMin || job.payMax) + unitLabel;
  }

  function relativeDate(dateStr) {
    if (!dateStr) return '';
    var parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    var posted = new Date(parseInt(parts[0],10), parseInt(parts[1],10)-1, parseInt(parts[2],10));
    var diffMs = Date.now() - posted.getTime();
    var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'just now';
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return diffDays + ' days ago';
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
    if (diffDays < 60) return '1 month ago';
    return Math.floor(diffDays / 30) + ' months ago';
  }

  function attachJobsFilter() {
    var filter = document.getElementById('jobs-filter');
    var list = document.getElementById('jobs-list');
    if (!filter || !list) return;

    var btns = filter.querySelectorAll('.jobs-filter-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function(e) {
        var state = e.currentTarget.getAttribute('data-state');
        // Update active button
        for (var k = 0; k < btns.length; k++) btns[k].classList.remove('active');
        e.currentTarget.classList.add('active');
        // Filter cards
        var cards = list.querySelectorAll('.job-card');
        for (var c = 0; c < cards.length; c++) {
          var cardState = cards[c].getAttribute('data-state');
          if (state === 'ALL' || cardState === state) {
            cards[c].style.display = '';
          } else {
            cards[c].style.display = 'none';
          }
        }
      });
    }
  }

  // ===== NEWS / ANNOUNCEMENTS =====
  function renderNews(news) {
    if (!news || news.enabled === false) return '';
    var items = news.items || [];
    if (!items.length) return '';

    var html = '<div class="section-inner">';
    html += renderSectionHeader(news.eyebrow, news.headline, news.lead);
    html += '<div class="news-grid">';

    // Sort by date desc, take top 3
    var sorted = items.slice().sort(function(a, b) {
      return (b.date || '').localeCompare(a.date || '');
    }).slice(0, 3);

    for (var i = 0; i < sorted.length; i++) {
      var item = sorted[i];
      var dateStr = formatNewsDate(item.date);
      var href = item.link || '#';
      var tag = (href === '#' || !href) ? 'div' : 'a';
      html += '<' + tag + ' class="news-card"' + (tag === 'a' ? ' href="' + escapeAttr(href) + '"' : '') + '>';
      html += '<div class="news-img">';
      if (item.imageUrl && item.imageUrl.length > 0) {
        html += '<img src="' + escapeAttr(item.imageUrl) + '" alt="' + escapeAttr(item.title) + '">';
      } else {
        html += '<div class="news-img-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg></div>';
      }
      html += '</div>';
      html += '<div class="news-body">';
      html += '<div class="news-meta">';
      if (item.category) html += '<span class="news-category">' + escapeHtml(item.category) + '</span>';
      if (dateStr) html += '<span class="news-date">' + escapeHtml(dateStr) + '</span>';
      html += '</div>';
      html += '<div class="news-title">' + escapeHtml(item.title) + '</div>';
      html += '<p class="news-summary">' + escapeHtml(item.summary || '') + '</p>';
      if (tag === 'a') {
        html += '<span class="news-read-more">Read more →</span>';
      }
      html += '</div>';
      html += '</' + tag + '>';
    }

    html += '</div></div>';
    return html;
  }

  function formatNewsDate(dateStr) {
    if (!dateStr) return '';
    // dateStr expected as YYYY-MM-DD
    var parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var monthIdx = parseInt(parts[1], 10) - 1;
    if (monthIdx < 0 || monthIdx > 11) return dateStr;
    return months[monthIdx] + ' ' + parseInt(parts[2], 10) + ', ' + parts[0];
  }

  // ===== FAQ =====
  function renderFAQ(faq) {
    if (!faq || faq.enabled === false) return '';
    var items = faq.items || [];
    if (!items.length) return '';

    var html = '<div class="section-inner">';
    html += renderSectionHeader(faq.eyebrow, faq.headline, faq.lead);
    html += '<div class="faq-list">';
    for (var i = 0; i < items.length; i++) {
      html += '<details class="faq-item">';
      html += '<summary>' + escapeHtml(items[i].question) + '</summary>';
      html += '<div class="faq-answer">' + escapeHtml(items[i].answer) + '</div>';
      html += '</details>';
    }
    html += '</div></div>';
    return html;
  }

  // ===== SCROLL REVEAL =====
  function attachScrollReveal() {
    // Skip if no IntersectionObserver (older browsers)
    if (!('IntersectionObserver' in window)) {
      var revealEls = document.querySelectorAll('.reveal');
      for (var i = 0; i < revealEls.length; i++) {
        revealEls[i].classList.add('visible');
      }
      return;
    }
    // Add .reveal to all main sections after nav
    var sections = document.querySelectorAll('main section');
    for (var j = 0; j < sections.length; j++) {
      sections[j].classList.add('reveal');
    }
    var observer = new IntersectionObserver(function(entries) {
      for (var k = 0; k < entries.length; k++) {
        if (entries[k].isIntersecting) {
          entries[k].target.classList.add('visible');
          observer.unobserve(entries[k].target);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    var els = document.querySelectorAll('.reveal');
    for (var m = 0; m < els.length; m++) {
      observer.observe(els[m]);
    }
  }

  // ===== SEO HEAD INJECTION =====
  function injectSeoTags(content, pageInfo) {
    var seo = content.seo || {};
    var brand = content.branding || {};
    var siteUrl = seo.siteUrl || '';
    var title = pageInfo.title || (brand.companyName || 'Edgelink') + ' Inc.';
    var desc = pageInfo.description || seo.defaultDescription || '';
    var imageUrl = pageInfo.imageUrl || seo.defaultImageUrl || '';
    var pageUrl = pageInfo.url || siteUrl;

    document.title = title;

    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', pageInfo.type || 'website');
    setMeta('property', 'og:url', pageUrl);
    if (imageUrl && imageUrl.length > 0) {
      // Make absolute if relative
      var absImg = imageUrl.indexOf('http') === 0 ? imageUrl : siteUrl + (siteUrl.slice(-1) === '/' ? '' : '/') + imageUrl;
      setMeta('property', 'og:image', absImg);
      setMeta('name', 'twitter:image', absImg);
    }
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);
    if (seo.twitterHandle) setMeta('name', 'twitter:site', seo.twitterHandle);

    // Organization structured data
    injectOrgSchema(content);
  }

  function setMeta(attr, name, value) {
    if (!value) return;
    var selector = 'meta[' + attr + '="' + name + '"]';
    var existing = document.querySelector(selector);
    if (existing) {
      existing.setAttribute('content', value);
    } else {
      var el = document.createElement('meta');
      el.setAttribute(attr, name);
      el.setAttribute('content', value);
      document.head.appendChild(el);
    }
  }

  function injectOrgSchema(content) {
    var brand = content.branding || {};
    var seo = content.seo || {};
    var footer = content.footer || {};
    var social = (footer.social || {});

    var sameAs = [];
    var socialKeys = ['facebook', 'instagram', 'linkedin', 'tiktok', 'youtube'];
    for (var i = 0; i < socialKeys.length; i++) {
      if (social[socialKeys[i]] && social[socialKeys[i]].length > 0) sameAs.push(social[socialKeys[i]]);
    }

    var schema = {
      '@context': 'https://schema.org',
      '@type': seo.organizationType || 'Organization',
      'name': (brand.companyName || 'Edgelink') + ' Inc.',
      'url': seo.siteUrl || '',
      'description': seo.defaultDescription || '',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '719 Bald Hill Rd.',
        'addressLocality': 'Warwick',
        'addressRegion': 'RI',
        'postalCode': '02886',
        'addressCountry': 'US'
      }
    };
    if (sameAs.length > 0) schema.sameAs = sameAs;
    if (seo.defaultImageUrl && seo.defaultImageUrl.length > 0) {
      var imgUrl = seo.defaultImageUrl;
      if (imgUrl.indexOf('http') !== 0 && seo.siteUrl) {
        imgUrl = seo.siteUrl + (seo.siteUrl.slice(-1) === '/' ? '' : '/') + imgUrl;
      }
      schema.logo = imgUrl;
    }

    // Remove existing schema if present
    var existing = document.querySelector('script[type="application/ld+json"][data-edgelink-schema]');
    if (existing) existing.remove();

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-edgelink-schema', 'org');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // ===== PUBLIC API =====
  return {
    loadContent: loadContent,
    renderNav: renderNav,
    renderHomeHero: renderHomeHero,
    renderStatsStrip: renderStatsStrip,
    renderAbout: renderAbout,
    renderSectionHeader: renderSectionHeader,
    renderCards: renderCards,
    renderLocations: renderLocations,
    renderCallout: renderCallout,
    renderGrowthPath: renderGrowthPath,
    renderBenefits: renderBenefits,
    renderAppProcess: renderAppProcess,
    renderTestimonials: renderTestimonials,
    renderContactForm: renderContactForm,
    attachContactFormHandler: attachContactFormHandler,
    renderNews: renderNews,
    renderFAQ: renderFAQ,
    renderOpenPositions: renderOpenPositions,
    attachJobsFilter: attachJobsFilter,
    attachScrollReveal: attachScrollReveal,
    injectSeoTags: injectSeoTags,
    renderFooter: renderFooter,
    escapeHtml: escapeHtml,
    LOCAL_DRAFT_KEY: LOCAL_DRAFT_KEY
  };
})();
