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
    var html = '<div class="states-row">';
    for (var i = 0; i < states.length; i++) {
      html += '<div class="state-card">';
      html += '<div class="state-abbr">' + escapeHtml(states[i].abbr) + '</div>';
      html += '<div class="state-name">' + escapeHtml(states[i].name) + '</div>';
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
      html += '<div class="testimonial">';
      html += '<p class="testimonial-quote">' + escapeHtml(items[i].quote) + '</p>';
      html += '<div class="testimonial-name">' + escapeHtml(items[i].name) + '</div>';
      if (items[i].role) html += '<div class="testimonial-role">' + escapeHtml(items[i].role) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // ===== FOOTER =====
  function renderFooter(content) {
    var footer = content.footer || {};
    var brand = content.branding || {};
    var cols = footer.columns || [];

    var html = '<div class="footer-inner"><div class="footer-grid">';

    // Brand column
    html += '<div class="footer-brand">';
    html += '<a href="index.html" class="logo">';
    html += '<div class="logo-mark">' + logoSvg() + '</div>';
    html += '<span class="logo-text">' + escapeHtml(brand.companyName || 'Edgelink') + '</span>';
    html += '</a>';
    if (footer.tagline) html += '<p>' + escapeHtml(footer.tagline) + '</p>';
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
    renderFooter: renderFooter,
    escapeHtml: escapeHtml,
    LOCAL_DRAFT_KEY: LOCAL_DRAFT_KEY
  };
})();
