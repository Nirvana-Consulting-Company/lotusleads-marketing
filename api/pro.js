const SUPABASE_URL = process.env.SUPABASE_URL || "https://avwzoatmlljinuejaqwv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** HTML-escape to prevent XSS */
function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Render star characters for a numeric rating */
function renderStars(rating) {
  const r = parseFloat(rating) || 0;
  const full = Math.floor(r);
  const half = r - full >= 0.25 && r - full < 0.75 ? 1 : 0;
  const empty = 5 - full - half;
  let s = "";
  for (let i = 0; i < full; i++) s += "★";
  if (half) s += "½";
  for (let i = 0; i < empty; i++) s += "☆";
  return s;
}

function notFoundPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#E64B8B">
  <title>Business Not Found | LotusLeads</title>
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: { extend: { colors: { lotus: { DEFAULT: '#E64B8B', dark: '#d43d7a', darker: '#b8326e' } } } }
    }
  </script>
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-56EC8T5DJ2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-56EC8T5DJ2');
  </script>
</head>
<body class="font-[Inter] bg-white text-gray-900 antialiased">
  <nav class="fixed top-0 inset-x-0 z-50 bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="flex items-center gap-2 shrink-0">
          <img src="/images/logo-icon.png" alt="LotusLeads" class="h-10">
          <span class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Lotus</span>
        </a>
        <div class="flex items-center gap-6">
          <a href="/pros" class="text-sm font-semibold text-blue-600 hover:text-blue-700">Find Contractors</a>
          <a href="/request-quotes" class="text-sm font-semibold text-blue-600 hover:text-blue-700">Request Quotes</a>
          <a href="https://app.lotusleads.ai" class="text-sm font-medium text-gray-700 hover:text-pink-600">Sign In</a>
        </div>
      </div>
    </div>
  </nav>
  <div class="h-16"></div>
  <main class="py-32 px-4">
    <div class="max-w-xl mx-auto text-center">
      <div class="text-6xl mb-6">&#128269;</div>
      <h1 class="text-3xl font-black text-gray-900 mb-4">Business Not Found</h1>
      <p class="text-lg text-gray-500 mb-8">The business profile you're looking for doesn't exist or may have been removed.</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/pros" class="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">Browse Contractors</a>
        <a href="/request-quotes" class="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">Request a Quote</a>
      </div>
    </div>
  </main>
  <footer class="bg-[#111827] text-gray-400 py-8 text-center text-sm">
    <p>&copy; ${new Date().getFullYear()} LotusLeads. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

function profilePage(b) {
  const name = esc(b.name || "Unnamed Business");
  const industry = esc(b.industry || b.category || "Service Provider");
  const category = esc(b.category || b.industry || "");
  const city = esc(b.city || "");
  const state = esc(b.state || "");
  const location = [city, state].filter(Boolean).join(", ");
  const phone = esc(b.phone || "");
  const email = esc(b.email || "");
  const website = esc(b.website || "");
  const address = esc(b.address || "");
  const postalCode = esc(b.postal_code || "");
  const fullAddress = [address, city, state, postalCode].filter(Boolean).join(", ");
  const rating = parseFloat(b.rating) || 0;
  const reviewCount = parseInt(b.review_count, 10) || 0;
  const stars = renderStars(rating);
  const id = esc(b.id);
  const canonicalUrl = "https://lotusleads.ai/pro?id=" + encodeURIComponent(b.id);
  const metaDesc = `${name} is a ${industry.toLowerCase()} contractor in ${location}. ${rating ? rating.toFixed(1) + " stars, " + reviewCount + " reviews. " : ""}Get a free quote on LotusLeads.`;

  // Schema.org JSON-LD — escape for safe embedding in <script>
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": b.name || "Unnamed Business",
    "description": `${b.industry || "Service"} contractor in ${[b.city, b.state].filter(Boolean).join(", ")}`,
    "url": canonicalUrl,
    "telephone": b.phone || undefined,
    "email": b.email || undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": b.address || undefined,
      "addressLocality": b.city || undefined,
      "addressRegion": b.state || undefined,
      "postalCode": b.postal_code || undefined,
      "addressCountry": "US"
    },
    "aggregateRating": rating ? {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount || 1
    } : undefined
  }).replace(/<\//g, "<\\/"); // prevent script injection via </script>

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#E64B8B">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/images/favicon-192.png" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  <title>${name} | ${industry} in ${location} | LotusLeads</title>
  <meta name="description" content="${esc(metaDesc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${esc(canonicalUrl)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: { extend: { colors: { lotus: { DEFAULT: '#E64B8B', dark: '#d43d7a', darker: '#b8326e' } } } }
    }
  </script>

  <!-- Open Graph -->
  <meta property="og:title" content="${name} | ${industry} in ${location} | LotusLeads">
  <meta property="og:description" content="${esc(metaDesc)}">
  <meta property="og:url" content="${esc(canonicalUrl)}">
  <meta property="og:type" content="business.business">
  <meta property="og:image" content="https://lotusleads.ai/images/dashboard-overview.png">
  <meta property="og:site_name" content="LotusLeads">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${name} | ${industry} in ${location} | LotusLeads">
  <meta name="twitter:description" content="${esc(metaDesc)}">
  <meta name="twitter:image" content="https://lotusleads.ai/images/dashboard-overview.png">

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-56EC8T5DJ2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-56EC8T5DJ2');
  </script>

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body class="font-[Inter] bg-white text-gray-900 antialiased">

<!-- NAV -->
<nav id="main-nav" class="fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-300" aria-label="Main navigation">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="flex items-center gap-2 shrink-0">
        <img src="/images/logo-icon.png" alt="LotusLeads" class="h-10">
        <span class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Lotus</span>
      </a>
      <div class="hidden md:flex items-center gap-6">
        <a href="/pros" class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Find Contractors</a>
        <a href="/request-quotes" class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Request Quotes</a>
        <a href="https://app.lotusleads.ai" class="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">Sign In</a>
        <a href="https://app.lotusleads.ai/auth" class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-sm transition-all">Start Free Trial</a>
      </div>
      <button id="mobile-menu-btn" class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100" aria-label="Toggle menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
  <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-gray-100">
    <div class="px-4 py-4 space-y-2">
      <a href="/pros" class="block px-3 py-2 rounded-md text-sm font-semibold text-blue-600">Find Contractors</a>
      <a href="/request-quotes" class="block px-3 py-2 rounded-md text-sm font-semibold text-blue-600">Request Quotes</a>
      <a href="https://app.lotusleads.ai" class="block px-3 py-2 rounded-md text-sm text-gray-700">Sign In</a>
      <a href="https://app.lotusleads.ai/auth" class="block mx-3 mt-2 text-center px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-pink-500 to-rose-600">Start Free Trial</a>
    </div>
  </div>
</nav>
<div class="h-16"></div>
<script>
  document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });
  (function(){
    var nav = document.getElementById('main-nav');
    window.addEventListener('scroll', function(){
      if(window.scrollY > 10){ nav.classList.add('shadow-md'); }
      else { nav.classList.remove('shadow-md'); }
    });
  })();
</script>

<main>
  <!-- Breadcrumb -->
  <section class="pt-24 pb-4 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <a href="/pros" class="text-sm text-[#E64B8B] font-medium hover:underline">&larr; All Contractors</a>
    </div>
  </section>

  <!-- Hero -->
  <section class="pb-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="h-3 bg-gradient-to-r from-[#E64B8B] to-[#C93B75]"></div>
        <div class="p-8 lg:p-10">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 class="text-2xl md:text-3xl font-black text-gray-900 mb-2">${name}</h1>
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 text-[#E64B8B] border border-pink-100">${industry}</span>
                ${location ? `<span class="text-sm text-gray-500">${location}</span>` : ""}
              </div>
            </div>
            ${rating ? `
            <div class="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 shrink-0">
              <span class="text-amber-500 text-lg">${stars}</span>
              <span class="text-sm font-bold text-gray-900">${rating.toFixed(1)}</span>
              <span class="text-xs text-gray-500">(${reviewCount} review${reviewCount !== 1 ? "s" : ""})</span>
            </div>` : ""}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Business Details -->
  <section class="pb-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="p-8 lg:p-10">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Business Details</h2>
          <div class="grid sm:grid-cols-2 gap-6">
            ${phone ? `
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-[#E64B8B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Phone</p>
                <a href="tel:${phone}" onclick="trackClick('phone_click')" class="text-sm font-semibold text-[#E64B8B] hover:underline">${phone}</a>
              </div>
            </div>` : ""}
            ${email ? `
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-[#E64B8B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Email</p>
                <a href="mailto:${email}" onclick="trackClick('email_click')" class="text-sm font-semibold text-[#E64B8B] hover:underline">${email}</a>
              </div>
            </div>` : ""}
            ${website ? `
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-[#E64B8B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Website</p>
                <a href="${website.startsWith("http") ? website : "https://" + website}" target="_blank" rel="noopener noreferrer" onclick="trackClick('website_click')" class="text-sm font-semibold text-[#E64B8B] hover:underline">${website}</a>
              </div>
            </div>` : ""}
            ${fullAddress ? `
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-[#E64B8B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Address</p>
                <p class="text-sm font-medium text-gray-900">${esc(fullAddress)}</p>
              </div>
            </div>` : ""}
          </div>
          ${rating ? `
          <div class="mt-8 pt-6 border-t border-gray-100">
            <div class="flex items-center gap-3">
              <span class="text-amber-500 text-xl">${stars}</span>
              <span class="text-lg font-bold text-gray-900">${rating.toFixed(1)} out of 5</span>
              <span class="text-sm text-gray-500">(${reviewCount} review${reviewCount !== 1 ? "s" : ""})</span>
            </div>
          </div>` : ""}
        </div>
      </div>
    </div>
  </section>

  <!-- Claim CTA -->
  <section class="pb-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 overflow-hidden p-8 lg:p-10">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">&#127919;</span>
              <h2 class="text-xl font-black text-gray-900">Is this your business?</h2>
            </div>
            <p class="text-base text-gray-600 mb-5">Claim this listing for free and take control of your presence on LotusLeads.</p>
            <ul class="space-y-2">
              <li class="flex items-center gap-2 text-sm text-gray-700">
                <svg class="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                Get verified badge
              </li>
              <li class="flex items-center gap-2 text-sm text-gray-700">
                <svg class="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                Receive qualified leads
              </li>
              <li class="flex items-center gap-2 text-sm text-gray-700">
                <svg class="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                Manage your profile
              </li>
              <li class="flex items-center gap-2 text-sm text-gray-700">
                <svg class="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                14-day free trial
              </li>
            </ul>
          </div>
          <div class="shrink-0">
            <a href="/claim?id=${id}" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E64B8B] to-[#C93B75] text-white font-bold rounded-xl hover:shadow-xl transition-all text-base">
              Claim Now &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Request a Quote -->
  <section class="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-y border-blue-100">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-2xl font-black text-gray-900 mb-4">Need ${industry.toLowerCase()} service in ${city || "your area"}?</h2>
      <p class="text-base text-gray-500 mb-8">Request a free, no-obligation quote. We'll connect you with top-rated ${industry.toLowerCase()} contractors${city ? " in " + city : ""}.</p>
      <a href="/request-quotes?industry=${encodeURIComponent(b.industry || b.category || "")}&city=${encodeURIComponent(b.city || "")}" class="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all">Request Free Quote</a>
    </div>
  </section>
</main>

<!-- Footer -->
<footer class="bg-[#111827] text-gray-300">
  <div class="border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 class="text-xl font-bold text-white mb-1">Ready to win more commercial contracts?</h3>
          <p class="text-sm text-gray-400">Join the marketplace and start landing jobs in minutes. Free 14-day trial.</p>
        </div>
        <div class="flex items-center gap-3">
          <a href="https://app.lotusleads.ai/auth" class="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">Start Free Trial</a>
          <a href="/features" class="px-6 py-3 bg-gray-800 text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-700 hover:text-white transition-all">See How It Works</a>
        </div>
      </div>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h4 class="text-sm font-semibold text-white mb-4">Product</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/features" class="hover:text-white transition-colors">Features</a></li>
          <li><a href="/pricing" class="hover:text-white transition-colors">Pricing</a></li>
          <li><a href="/industries" class="hover:text-white transition-colors">Industries</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-white mb-4">Marketplace</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/pros" class="hover:text-white transition-colors">Find Contractors</a></li>
          <li><a href="/request-quotes" class="hover:text-white transition-colors">Request Quotes</a></li>
          <li><a href="/estimate" class="hover:text-white transition-colors">Cost Estimator</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-white mb-4">Company</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/about" class="hover:text-white transition-colors">About</a></li>
          <li><a href="/blog" class="hover:text-white transition-colors">Blog</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-white mb-4">Get Started</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="https://app.lotusleads.ai/auth" class="hover:text-white transition-colors">Free Trial</a></li>
          <li><a href="https://app.lotusleads.ai" class="hover:text-white transition-colors">Sign In</a></li>
        </ul>
      </div>
    </div>
    <div class="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
      <p>&copy; ${new Date().getFullYear()} LotusLeads. All rights reserved.</p>
    </div>
  </div>
</footer>

<!-- Event Tracking -->
<script>
  function trackClick(eventType) {
    fetch('/api/track-event', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({business_id: '${id}', event_type: eventType, source: 'web'})
    }).catch(function(){});
  }
</script>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const id = req.query.id;

  // Validate ID
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(404).send(notFoundPage());
  }

  try {
    // Fetch business from Supabase
    const url = `${SUPABASE_URL}/rest/v1/marketplace_businesses?id=eq.${encodeURIComponent(id)}&select=id,name,category,industry,phone,email,website,address,city,state,postal_code,rating,review_count,status`;
    const response = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!response.ok) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(404).send(notFoundPage());
    }

    const data = await response.json();
    if (!data || !data.length) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(404).send(notFoundPage());
    }

    const business = data[0];

    // Fire-and-forget: record profile_view event
    fetch(`${SUPABASE_URL}/rest/v1/marketplace_events`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_id: id,
        event_type: "profile_view",
        source: "web",
      }),
    }).catch(() => {});

    // Return the profile page
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).send(profilePage(business));
  } catch (err) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send(notFoundPage());
  }
};
