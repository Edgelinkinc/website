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
