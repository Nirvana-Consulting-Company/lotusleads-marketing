/**
 * _apply-shell.mjs
 * Build script for LotusLeads marketing site.
 * Injects shared nav, footer, SEO meta, and generates sitemap + robots.txt.
 * Idempotent -- safe to run multiple times.
 *
 * Usage:  node _apply-shell.mjs
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/i, '$1');
const BASE_URL = 'https://lotusleads.ai';

// ---------------------------------------------------------------------------
// SHARED NAV
// ---------------------------------------------------------------------------
const SHARED_NAV = `
<nav id="main-nav" class="fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-300" aria-label="Main navigation">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">

      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 shrink-0">
        <img src="/images/logo-icon.png" alt="LotusLeads" class="h-10">
        <span class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Lotus</span>
      </a>

      <!-- Desktop Links -->
      <div class="hidden lg:flex items-center gap-8">
        <!-- Marketplace Dropdown -->
        <div class="relative group">
          <button class="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
            Marketplace
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-gray-900/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
            <a href="/pros" class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Find Contractors</a>
            <a href="/request-quotes" class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Request Quotes</a>
            <a href="/estimate" class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Cost Estimator</a>
            <a href="/claim" class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Claim Your Business</a>
          </div>
        </div>
        <!-- Industries Dropdown -->
        <div class="relative group">
          <button class="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
            Industries
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="absolute left-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-[480px] bg-white rounded-xl shadow-lg ring-1 ring-gray-900/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4">
            <div class="grid grid-cols-2 gap-x-4 gap-y-1">
              <a href="/industries/solar" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">Solar</a>
              <a href="/industries/plumbing" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">Plumbing</a>
              <a href="/industries/landscaping" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">Landscaping</a>
              <a href="/industries/electrical" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">Electrical</a>
              <a href="/industries/hvac" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">HVAC</a>
              <a href="/industries/pest-control" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">Pest Control</a>
              <a href="/industries/roofing" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">Roofing</a>
              <a href="/industries/snow-removal" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">Snow Removal</a>
              <a href="/industries/security" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">Security</a>
              <a href="/industries/cleaning" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">Commercial Cleaning</a>
              <a href="/industries/property-management" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">Property Management</a>
              <a href="/industries/networking" class="block px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md">IT &amp; Networking</a>
            </div>
            <hr class="my-2 border-gray-100"/>
            <a href="/industries" class="block px-3 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50 rounded-md">View All Industries &rarr;</a>
          </div>
        </div>
        <a href="/blog" class="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">Blog</a>
        <a href="/about" class="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">About</a>
        <a href="/partner" class="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">Partner</a>
      </div>

      <!-- Right: Login + CTA + Hamburger -->
      <div class="flex items-center gap-4">
        <a href="https://app.lotusleads.ai" class="hidden lg:inline-block text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">Login</a>
        <a href="/claim" class="hidden lg:inline-flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-sm transition-all">List Your Business</a>
        <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100" aria-label="Toggle menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-gray-100">
    <div class="px-4 py-4 space-y-2">
      <p class="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Marketplace</p>
      <a href="/pros" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Find Contractors</a>
      <a href="/request-quotes" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Request Quotes</a>
      <a href="/estimate" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Cost Estimator</a>
      <a href="/claim" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Claim Your Business</a>
      <hr class="my-2 border-gray-100"/>
      <p class="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Industries</p>
      <a href="/industries" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">All Industries</a>
      <a href="/industries/solar" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Solar</a>
      <a href="/industries/landscaping" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Landscaping</a>
      <a href="/industries/hvac" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">HVAC</a>
      <a href="/industries/roofing" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Roofing</a>
      <a href="/industries/security" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Security</a>
      <a href="/industries/cleaning" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Commercial Cleaning</a>
      <hr class="my-2 border-gray-100"/>
      <a href="/blog" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Blog</a>
      <a href="/about" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">About</a>
      <a href="/partner" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Partner</a>
      <hr class="my-2 border-gray-100"/>
      <a href="https://app.lotusleads.ai" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Login</a>
      <a href="/claim" class="block mx-3 mt-2 text-center px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-pink-500 to-rose-600">List Your Business</a>
    </div>
  </div>
</nav>
<!-- Spacer for fixed nav -->
<div class="h-16"></div>
<script>
  document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });
</script>
<script>
  (function(){
    var nav = document.getElementById('main-nav');
    window.addEventListener('scroll', function(){
      if(window.scrollY > 10){ nav.classList.add('shadow-md'); }
      else { nav.classList.remove('shadow-md'); }
    });
  })();
</script>
`;

// ---------------------------------------------------------------------------
// SHARED FOOTER
// ---------------------------------------------------------------------------
const SHARED_FOOTER = `
<footer class="bg-[#111827] text-gray-300">
  <!-- CTA Banner -->
  <div class="border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 class="text-xl font-bold text-white mb-1">Ready to win more commercial contracts?</h3>
          <p class="text-sm text-gray-400">Join 24,000+ contractors already listed on LotusLeads. Free to claim your profile.</p>
        </div>
        <div class="flex items-center gap-3">
          <a href="/claim" class="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">List Your Business</a>
          <a href="/pros" class="px-6 py-3 bg-gray-800 text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-700 hover:text-white transition-all">Find Contractors</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Footer Grid -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">

      <!-- Col 1: Brand -->
      <div class="col-span-2 md:col-span-3 lg:col-span-2">
        <a href="/" class="flex items-center gap-2 mb-4">
          <img src="/images/logo-icon.png" alt="LotusLeads" class="h-10 brightness-0 invert">
          <span class="text-2xl font-bold text-white">Lotus</span>
        </a>
        <p class="text-sm leading-relaxed text-gray-400 mb-4">The marketplace connecting commercial property managers with vetted service contractors. 24,000+ businesses across 12 industries, all 50 states.</p>
        <p class="text-xs text-gray-500 mb-5">A product of <a href="https://nirvanaconsultingcompany.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">Nirvana Consulting</a></p>
        <a href="https://www.linkedin.com/showcase/lotusleads-ai/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          Follow us on LinkedIn
        </a>
      </div>

      <!-- Col 2: Platform -->
      <div>
        <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
        <ul class="space-y-2.5 text-sm">
          <li><a href="/pros" class="hover:text-white transition-colors">Find Contractors</a></li>
          <li><a href="/request-quotes" class="hover:text-white transition-colors">Request Quotes</a></li>
          <li><a href="/estimate" class="hover:text-white transition-colors">Cost Estimator</a></li>
          <li><a href="/claim" class="hover:text-white transition-colors">Claim Your Business</a></li>
          <li><a href="/industries" class="hover:text-white transition-colors">All Industries</a></li>
          <li><a href="/features" class="hover:text-white transition-colors">How It Works</a></li>
        </ul>
      </div>

      <!-- Col 3: Industries -->
      <div>
        <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Industries</h4>
        <ul class="space-y-2.5 text-sm">
          <li><a href="/industries/solar" class="hover:text-white transition-colors">Solar</a></li>
          <li><a href="/industries/landscaping" class="hover:text-white transition-colors">Landscaping</a></li>
          <li><a href="/industries/hvac" class="hover:text-white transition-colors">HVAC</a></li>
          <li><a href="/industries/roofing" class="hover:text-white transition-colors">Roofing</a></li>
          <li><a href="/industries/security" class="hover:text-white transition-colors">Security</a></li>
          <li><a href="/industries/plumbing" class="hover:text-white transition-colors">Plumbing</a></li>
          <li><a href="/industries/electrical" class="hover:text-white transition-colors">Electrical</a></li>
          <li><a href="/industries/cleaning" class="hover:text-white transition-colors">Commercial Cleaning</a></li>
          <li><a href="/industries/snow-removal" class="hover:text-white transition-colors">Snow Removal</a></li>
          <li><a href="/industries/pest-control" class="hover:text-white transition-colors">Pest Control</a></li>
          <li><a href="/industries" class="text-pink-400 hover:text-pink-300 font-medium transition-colors">All Industries &rarr;</a></li>
        </ul>
      </div>

      <!-- Col 4: Top Cities -->
      <div>
        <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Top Cities</h4>
        <ul class="space-y-2.5 text-sm">
          <li><a href="/industries/solar/chicago" class="hover:text-white transition-colors">Chicago</a></li>
          <li><a href="/industries/solar/dallas" class="hover:text-white transition-colors">Dallas-Fort Worth</a></li>
          <li><a href="/industries/solar/houston" class="hover:text-white transition-colors">Houston</a></li>
          <li><a href="/industries/solar/atlanta" class="hover:text-white transition-colors">Atlanta</a></li>
          <li><a href="/industries/solar/phoenix" class="hover:text-white transition-colors">Phoenix</a></li>
          <li><a href="/industries/solar/los-angeles" class="hover:text-white transition-colors">Los Angeles</a></li>
          <li><a href="/industries/solar/miami" class="hover:text-white transition-colors">Miami</a></li>
          <li><a href="/industries/solar/denver" class="hover:text-white transition-colors">Denver</a></li>
          <li><a href="/industries/solar/seattle" class="hover:text-white transition-colors">Seattle</a></li>
          <li><a href="/industries/solar/austin" class="hover:text-white transition-colors">Austin</a></li>
          <li><a href="/industries/solar/new-york-city" class="hover:text-white transition-colors">New York City</a></li>
          <li><a href="/industries/solar/boston" class="hover:text-white transition-colors">Boston</a></li>
        </ul>
      </div>

      <!-- Col 5: Company & Resources -->
      <div>
        <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
        <ul class="space-y-2.5 text-sm mb-6">
          <li><a href="/about" class="hover:text-white transition-colors">About Us</a></li>
          <li><a href="/blog" class="hover:text-white transition-colors">Blog</a></li>
          <li><a href="https://app.lotusleads.ai" class="hover:text-white transition-colors">Login</a></li>
        </ul>
        <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h4>
        <ul class="space-y-2.5 text-sm">
          <li><a href="/blog/how-to-prospect-commercial-properties" class="hover:text-white transition-colors">Prospecting Guide</a></li>
          <li><a href="/blog/cold-email-templates-field-service" class="hover:text-white transition-colors">Email Templates</a></li>
          <li><a href="/blog/icp-ideal-customer-profile-field-service" class="hover:text-white transition-colors">ICP Framework</a></li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
      <span>&copy; 2026 LotusLeads. All rights reserved.</span>
      <span>Built by <a href="https://nirvanaconsultingcompany.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">Nirvana Consulting</a></span>
    </div>
  </div>
</footer>
`;

// ---------------------------------------------------------------------------
// PAGE META — SEO metadata per page
// ---------------------------------------------------------------------------
const PAGE_META = {
  'index.html': {
    title: 'LotusLeads \u2014 The Commercial Service Contractor Marketplace',
    description: 'The AI-powered marketplace connecting commercial service contractors with property managers. Marketplace intelligence, property analysis, and automated outreach to help you win more jobs.',
    canonical: '/',
  },
  'features.html': {
    title: 'Marketplace Intelligence Platform | LotusLeads',
    description: 'AI-powered marketplace tools for commercial service contractors: property intelligence, lead discovery, competitive analysis, campaign outreach, and analytics.',
    canonical: '/features',
  },
  'pricing.html': {
    title: 'Pricing Plans | LotusLeads',
    description: 'Simple, transparent pricing for marketplace intelligence. Choose the plan that fits your team and start winning more commercial service contracts.',
    canonical: '/pricing',
  },
  'about.html': {
    title: 'About \u2014 LotusLeads | The Service Contractor Marketplace',
    description: 'LotusLeads is the AI-powered marketplace connecting commercial service contractors with property managers who need them. Built by contractors, for contractors.',
    canonical: '/about',
  },
  'icp.html': {
    title: 'AI Lead Discovery | LotusLeads',
    description: 'Discover your ideal commercial properties and contacts with AI. Automatically find, rank, and qualify the leads most likely to convert.',
    canonical: '/icp',
  },
  'property-intelligence.html': {
    title: 'Property Intelligence | LotusLeads',
    description: 'Enrich every lead with property data: square footage, roof age, lot size, ownership, and more. Prioritize accounts with real building insights.',
    canonical: '/property-intelligence',
  },
  'lead-management.html': {
    title: 'Lead Management | LotusLeads',
    description: 'Organize, score, and track every commercial lead in one place. AI-powered pipeline management built for service contractors.',
    canonical: '/lead-management',
  },
  'campaigns.html': {
    title: 'Campaign Outreach | LotusLeads',
    description: 'Launch personalized email and multi-channel campaigns at scale. Automate follow-ups and track engagement across your pipeline.',
    canonical: '/campaigns',
  },
  'competitive-intel.html': {
    title: 'Market Intelligence | LotusLeads',
    description: 'See which competitors serve your target properties. Win more bids with data-driven marketplace insights and competitive positioning.',
    canonical: '/competitive-intel',
  },
  'analytics.html': {
    title: 'Analytics & Reporting | LotusLeads',
    description: 'Real-time dashboards for pipeline health, win rates, territory coverage, and team performance. Make data-driven decisions to grow your business.',
    canonical: '/analytics',
  },
  'request-quotes.html': {
    title: 'Request Free Quotes from Commercial Service Providers | LotusLeads',
    description: 'Get free, no-obligation quotes from vetted commercial field service companies in your area. Landscaping, HVAC, solar, roofing, cleaning, and more.',
    canonical: '/request-quotes',
  },
  'for-property-managers.html': {
    title: 'Find Commercial Service Contractors | LotusLeads for Property Managers',
    description: 'Get free quotes from vetted commercial contractors — landscaping, HVAC, solar, roofing, cleaning, and more. LotusLeads matches property managers with top-rated service providers.',
    canonical: '/for-property-managers',
  },
  'playbook.html': {
    title: 'Free Download: The Commercial Prospecting Playbook | LotusLeads',
    description: 'Download the free guide used by top field service companies to find, qualify, and win commercial property contracts. 30+ pages of strategies, templates, and frameworks.',
    canonical: '/playbook',
  },
  'estimate.html': {
    title: 'Free Property Cost Estimator | LotusLeads',
    description: 'Get instant AI-powered cost estimates for your property project. Search your address, mark service areas on satellite imagery, and compare Pro vs DIY options.',
    canonical: '/estimate',
  },
  'claim.html': {
    title: 'Claim Your Business Profile | LotusLeads',
    description: 'Claim your free contractor profile on LotusLeads. Receive qualified commercial property leads, manage your listing, and grow your business.',
    canonical: '/claim',
  },
  'partner.html': {
    title: 'Partner with LotusLeads — Sponsored Placement & Advertising',
    description: 'Reach commercial property managers and contractors at the moment of intent. Sponsored placement in search results and advertising across the LotusLeads marketplace.',
    canonical: '/partner',
  },
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** Replace content between two marker comments (inclusive of markers). */
function replaceBlock(html, startMarker, endMarker, replacement) {
  const re = new RegExp(
    `(${escapeRegex(startMarker)})[\\s\\S]*?(${escapeRegex(endMarker)})`,
    'g',
  );
  return html.replace(re, `$1\n${replacement}\n$2`);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Build SEO <head> block for a given page. */
function buildSeoBlock(pageName, meta) {
  const fullUrl = BASE_URL + meta.canonical;
  const ogImage = BASE_URL + '/images/dashboard-overview.png';

  let block = `
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}"/>
  <link rel="canonical" href="${fullUrl}"/>
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/images/favicon-192.png" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">

  <!-- Open Graph -->
  <meta property="og:title" content="${meta.title}"/>
  <meta property="og:description" content="${meta.description}"/>
  <meta property="og:url" content="${fullUrl}"/>
  <meta property="og:image" content="${ogImage}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="LotusLeads"/>

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${meta.title}"/>
  <meta name="twitter:description" content="${meta.description}"/>
  <meta name="twitter:image" content="${ogImage}"/>

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-56EC8T5DJ2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-56EC8T5DJ2');
  </script>`;

  // Schema.org LD+JSON for index.html only
  if (pageName === 'index.html') {
    const ldJson = JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'LotusLeads',
        url: BASE_URL,
        logo: BASE_URL + '/images/logo.png',
        sameAs: [],
        description: meta.description,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'LotusLeads',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: BASE_URL,
        description: meta.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free trial available',
        },
      },
    ], null, 2);

    block += `\n\n  <!-- Schema.org LD+JSON -->\n  <script type="application/ld+json">\n${ldJson}\n  </script>`;
  }

  return block;
}

/** Generate sitemap.xml from the list of HTML files. */
function generateSitemap(htmlFiles) {
  const urls = htmlFiles.map((file) => {
    const name = path.basename(file);
    const stat = fs.statSync(file);
    const lastmod = stat.mtime.toISOString().split('T')[0];
    const loc =
      name === 'index.html'
        ? BASE_URL + '/'
        : BASE_URL + '/' + name.replace('.html', '');
    const priority = name === 'index.html' ? '1.0' : '0.8';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

/** Generate robots.txt. */
function generateRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
}

// ---------------------------------------------------------------------------
// HELPERS: recursive HTML file discovery
// ---------------------------------------------------------------------------
function findHtmlFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      results = results.concat(findHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

function fileToCanonical(filePath) {
  let rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.replace('/index.html', '');
  return '/' + rel.replace('.html', '');
}

function autoMeta(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : 'LotusLeads';
  const description = descMatch ? descMatch[1] : '';
  return { title, description, canonical: fileToCanonical(filePath) };
}

/** Generate sitemap.xml from the list of HTML files (supports subdirectories). */
function generateSitemapAll(htmlFiles) {
  const urls = htmlFiles.map((file) => {
    const stat = fs.statSync(file);
    const lastmod = stat.mtime.toISOString().split('T')[0];
    const canonical = fileToCanonical(file);
    const loc = BASE_URL + (canonical === '/' ? '/' : canonical);
    let priority = '0.5';
    if (canonical === '/') priority = '1.0';
    else if (!canonical.includes('/industries/') && !canonical.includes('/blog/') && !canonical.includes('/compare/') && !canonical.includes('/pros/')) priority = '0.8';
    else if (canonical.match(/^\/industries\/[^/]+$/) || canonical === '/industries' || canonical === '/blog' || canonical === '/compare' || canonical === '/pros') priority = '0.7';
    else if (canonical.startsWith('/compare/') || canonical.startsWith('/pros/')) priority = '0.6';
    else priority = '0.5';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
function main() {
  console.log('[apply-shell] Starting build...');

  const htmlFiles = findHtmlFiles(ROOT);

  if (htmlFiles.length === 0) {
    console.log('[apply-shell] No .html files found. Nothing to do.');
    return;
  }

  console.log(`[apply-shell] Found ${htmlFiles.length} HTML file(s).`);

  for (const filePath of htmlFiles) {
    const pageName = path.basename(filePath);
    const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
    let html = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 1. Replace NAV block
    if (html.includes('<!-- NAV_START -->') && html.includes('<!-- NAV_END -->')) {
      html = replaceBlock(html, '<!-- NAV_START -->', '<!-- NAV_END -->', SHARED_NAV);
      changed = true;
    }

    // 2. Replace FOOTER block
    if (html.includes('<!-- FOOTER_START -->') && html.includes('<!-- FOOTER_END -->')) {
      html = replaceBlock(html, '<!-- FOOTER_START -->', '<!-- FOOTER_END -->', SHARED_FOOTER);
      changed = true;
    }

    // 3. Inject SEO block
    if (html.includes('<!-- @seo -->')) {
      const meta = PAGE_META[pageName] || autoMeta(filePath);
      const seoBlock = buildSeoBlock(pageName, meta);
      const parts = html.split('<!-- @seo -->');
      if (parts.length >= 3) {
        html = parts[0] + '<!-- @seo -->' + seoBlock + '\n  <!-- @seo -->' + parts.slice(2).join('<!-- @seo -->');
        changed = true;
      } else if (parts.length === 2) {
        html = parts[0] + '<!-- @seo -->' + seoBlock + '\n  <!-- @seo -->' + parts[1];
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, html, 'utf-8');
      console.log(`  [ok] ${relPath}`);
    } else {
      console.log(`  [skip] ${relPath} (no markers found)`);
    }
  }

  // 4. Generate sitemap.xml
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, generateSitemapAll(htmlFiles), 'utf-8');
  console.log(`  [ok] sitemap.xml (${htmlFiles.length} URLs)`);

  // 5. Generate robots.txt
  const robotsPath = path.join(ROOT, 'robots.txt');
  fs.writeFileSync(robotsPath, generateRobots(), 'utf-8');
  console.log('  [ok] robots.txt');

  console.log('[apply-shell] Done.');
}

main();
