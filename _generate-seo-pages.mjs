/**
 * _generate-seo-pages.mjs
 * Generates industry landing pages, city pages, and blog articles
 * for LotusLeads SEO. Run BEFORE _apply-shell.mjs.
 *
 * Usage: node _generate-seo-pages.mjs
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/i, '$1');

// ============================================================================
// DATA: INDUSTRIES
// ============================================================================
const INDUSTRIES = [
  {
    slug: 'solar',
    name: 'Solar',
    color: 'orange',
    tagline: 'Win more commercial solar contracts with satellite-powered property intelligence.',
    description: 'LotusLeads helps solar companies identify high-value commercial properties, estimate roof area and system sizing from satellite imagery, calculate ROI with state incentives, and reach decision-makers with personalized proposals.',
    painPoints: [
      'Spending hours on Google Earth estimating roof areas manually',
      'No way to know which buildings already have solar or are under contract',
      'Cold-calling property managers without understanding their energy costs',
      'Missing state and federal incentive programs that could close the deal',
    ],
    features: [
      { title: 'Roof Area Estimation', desc: 'AI analyzes satellite imagery to calculate usable roof area, orientation, and shading for every commercial property in your territory.' },
      { title: 'System Sizing & Production', desc: 'Automatic kW capacity and annual kWh production estimates based on roof geometry, tilt, and local solar irradiance data.' },
      { title: 'ROI & Incentive Analysis', desc: 'State-specific rebates, federal ITC, MACRS depreciation, and net metering revenue — calculated automatically for each prospect.' },
      { title: 'Competitor Detection', desc: 'Identify which properties already have solar installations and which competitors serve the area, so you focus on real opportunities.' },
    ],
    keywords: ['commercial solar leads', 'solar sales software', 'solar prospecting tool', 'commercial solar lead generation', 'solar CRM'],
  },
  {
    slug: 'landscaping',
    name: 'Landscaping',
    color: 'green',
    tagline: 'Find and win commercial landscaping contracts before your competitors even know they exist.',
    description: 'LotusLeads gives landscaping companies the property intelligence they need to bid smarter — turf area estimates, irrigation assessment, competitor analysis, and automated outreach to property managers.',
    painPoints: [
      'Driving around looking for properties that need service',
      'Bidding blind without knowing the actual turf area or site complexity',
      'No idea who currently services the property or when contracts renew',
      'Spending more time on proposals than on actual landscaping work',
    ],
    features: [
      { title: 'Turf & Hardscape Analysis', desc: 'AI measures lawn area, parking lots, sidewalks, and landscape beds from satellite imagery — no site visit needed for initial estimates.' },
      { title: 'Crew & Equipment Estimates', desc: 'Mowing hours, crew size, and equipment recommendations based on property size, terrain, and seasonal requirements.' },
      { title: 'Snow Removal Bundling', desc: 'Identify properties that need both landscaping and snow removal — bundle services for higher contract values and year-round revenue.' },
      { title: 'Property Manager Outreach', desc: 'Find the decision-maker, understand their property, and send personalized proposals with AI-generated emails tailored to their specific needs.' },
    ],
    keywords: ['commercial landscaping leads', 'landscaping sales software', 'landscaping CRM', 'commercial lawn care leads', 'landscape business software'],
  },
  {
    slug: 'hvac',
    name: 'HVAC',
    color: 'blue',
    tagline: 'Target commercial properties with aging HVAC systems before they call your competitor.',
    description: 'LotusLeads helps HVAC contractors identify commercial buildings due for system replacements, estimate tonnage from building size, and reach facility managers with data-backed proposals.',
    painPoints: [
      'No way to know which buildings have aging systems ready for replacement',
      'Estimating tonnage and system size without building plans',
      'Competing on price alone because every bid looks the same',
      'Waiting for emergency calls instead of proactively targeting prospects',
    ],
    features: [
      { title: 'System Age Intelligence', desc: 'Building age and HVAC lifecycle analysis helps you identify properties approaching replacement age — before the emergency call goes to someone else.' },
      { title: 'Tonnage & Load Estimation', desc: 'Estimate cooling and heating requirements from building square footage, construction type, and climate zone data.' },
      { title: 'Energy Efficiency Scoring', desc: 'Flag properties that would benefit most from high-efficiency upgrades, and calculate energy savings to strengthen your proposal.' },
      { title: 'Seasonal Timing', desc: 'Target property managers at the right time — before peak cooling or heating season — with maintenance contracts and upgrade proposals.' },
    ],
    keywords: ['commercial HVAC leads', 'HVAC sales software', 'HVAC prospecting', 'commercial HVAC lead generation', 'HVAC contractor CRM'],
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    color: 'amber',
    tagline: 'Identify commercial roofs due for replacement and win the bid before anyone else.',
    description: 'LotusLeads helps roofing contractors find commercial properties with aging roofs, estimate square footage from satellite, and send targeted proposals to building owners and property managers.',
    painPoints: [
      'Storm chasing is unpredictable — need a steady pipeline of commercial work',
      'No way to assess roof condition without climbing up there first',
      'Competing against national chains with bigger marketing budgets',
      'Spending weeks on proposals for properties that already have a roofer',
    ],
    features: [
      { title: 'Roof Area & Material Analysis', desc: 'AI measures roof area and identifies material type from satellite and aerial imagery — flat, metal, TPO, EPDM, or shingle.' },
      { title: 'Age & Condition Scoring', desc: 'Building age data combined with typical roof lifecycle helps you prioritize properties most likely to need replacement or major repairs.' },
      { title: 'Storm & Weather Intelligence', desc: 'Cross-reference recent weather events with property locations to identify hail, wind, or storm damage opportunities in your territory.' },
      { title: 'Property Owner Identification', desc: 'Find the building owner or property manager, understand their portfolio, and reach out with data-backed proposals.' },
    ],
    keywords: ['commercial roofing leads', 'roofing sales software', 'roofing CRM', 'commercial roof replacement leads', 'roofing contractor software'],
  },
  {
    slug: 'security',
    name: 'Security',
    color: 'red',
    tagline: 'Protect more commercial properties by finding the ones that need you most.',
    description: 'LotusLeads helps security companies identify high-value commercial properties, assess vulnerability from property data, and connect with decision-makers who need upgraded security systems.',
    painPoints: [
      'Selling to businesses that already have security contracts',
      'No way to assess a property\'s security needs without a site survey',
      'Decision-makers are hard to reach and skeptical of cold outreach',
      'National chains dominate marketing — hard to compete on visibility',
    ],
    features: [
      { title: 'Property Vulnerability Assessment', desc: 'Analyze property layout, entry points, parking areas, and lighting conditions from aerial and street-level imagery.' },
      { title: 'Business Type Targeting', desc: 'Focus on high-security-need verticals: warehouses, retail, medical facilities, financial institutions, and data centers.' },
      { title: 'Competitor Mapping', desc: 'See which security companies serve properties in your area and identify accounts where contracts may be underperforming.' },
      { title: 'Decision-Maker Access', desc: 'Reach facility managers, property owners, and operations directors with personalized security assessments and proposals.' },
    ],
    keywords: ['commercial security leads', 'security sales software', 'security company CRM', 'commercial security system leads', 'security business software'],
  },
  {
    slug: 'property-management',
    name: 'Property Management',
    color: 'purple',
    tagline: 'Grow your property management portfolio with intelligent prospecting.',
    description: 'LotusLeads helps property management companies identify unmanaged or poorly managed commercial properties, understand their service needs, and pitch data-backed management proposals.',
    painPoints: [
      'Finding commercial properties that don\'t already have management companies',
      'No visibility into whether buildings are owner-managed or under contract',
      'Pitching management services without understanding the property\'s true needs',
      'Growing the portfolio beyond word-of-mouth referrals',
    ],
    features: [
      { title: 'Unmanaged Property Detection', desc: 'Identify commercial properties likely to be self-managed based on ownership patterns, maintenance signals, and public records.' },
      { title: 'Portfolio Analysis', desc: 'Understand property owners with multiple holdings — pitch portfolio-wide management for higher contract values.' },
      { title: 'Maintenance Need Assessment', desc: 'AI identifies deferred maintenance, landscaping gaps, and facility issues from property imagery to strengthen your pitch.' },
      { title: 'Owner & Investor Outreach', desc: 'Reach building owners and real estate investors with personalized management proposals backed by property-specific data.' },
    ],
    keywords: ['property management leads', 'property management sales', 'property management CRM', 'commercial property management software', 'property management growth'],
  },
  {
    slug: 'networking',
    name: 'IT & Networking',
    color: 'indigo',
    tagline: 'Find commercial buildings ready for network infrastructure upgrades.',
    description: 'LotusLeads helps IT and networking companies identify commercial properties with outdated infrastructure, estimate cabling and equipment needs, and reach IT decision-makers with upgrade proposals.',
    painPoints: [
      'No visibility into which buildings have aging network infrastructure',
      'Estimating cable runs and AP count without floor plans',
      'Reaching IT managers who are buried in tickets and don\'t answer cold calls',
      'Competing against managed service providers with larger sales teams',
    ],
    features: [
      { title: 'Building Coverage Analysis', desc: 'Estimate floor area, number of floors, and workspace density from building data to size network infrastructure requirements.' },
      { title: 'Cable Run & AP Estimates', desc: 'Calculate approximate cable runs, access point counts, and switch requirements based on building geometry and usage type.' },
      { title: 'Infrastructure Age Assessment', desc: 'Building age and construction era data helps identify properties likely running on outdated Cat5, legacy switches, or aging wireless.' },
      { title: 'IT Decision-Maker Access', desc: 'Find IT directors, facilities managers, and CTOs at target companies with enriched contact data and personalized outreach.' },
    ],
    keywords: ['IT networking leads', 'managed services leads', 'networking sales software', 'MSP lead generation', 'IT services CRM'],
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    color: 'cyan',
    tagline: 'Win more commercial plumbing contracts with property-level intelligence.',
    description: 'LotusLeads helps commercial plumbing companies identify properties with aging systems, target facility managers, and build a predictable pipeline of maintenance and retrofit contracts.',
    painPoints: [
      'Relying on emergency calls instead of building recurring commercial revenue',
      'No way to know which buildings have aging plumbing infrastructure',
      'Facility managers already have a plumber on speed dial',
      'Spending time on estimates for properties that won\'t convert',
    ],
    features: [
      { title: 'Building Age Analysis', desc: 'Identify commercial properties with plumbing systems approaching end of life based on building age, construction era, and renovation history.' },
      { title: 'Facility Type Targeting', desc: 'Focus on high-plumbing-need facilities: restaurants, hospitals, hotels, multi-tenant offices, and manufacturing plants.' },
      { title: 'Water Usage Intelligence', desc: 'Target properties with high water usage for efficiency audits, backflow prevention, and water conservation retrofit proposals.' },
      { title: 'Maintenance Contract Outreach', desc: 'Reach facility managers with proactive maintenance proposals before the emergency call goes to someone else.' },
    ],
    keywords: ['commercial plumbing leads', 'plumbing sales software', 'plumbing contractor CRM', 'commercial plumbing contracts', 'plumbing business software'],
  },
  {
    slug: 'electrical',
    name: 'Electrical',
    color: 'yellow',
    tagline: 'Target commercial electrical upgrade opportunities in your territory.',
    description: 'LotusLeads helps electrical contractors identify commercial buildings due for panel upgrades, EV charging installations, lighting retrofits, and energy efficiency improvements.',
    painPoints: [
      'Waiting for referrals instead of proactively finding commercial work',
      'No visibility into which buildings need panel upgrades or lighting retrofits',
      'EV charging demand is growing but hard to identify the right properties',
      'Losing bids to contractors who got there first',
    ],
    features: [
      { title: 'Panel & Load Assessment', desc: 'Building size and age data helps estimate electrical panel capacity and identify properties likely needing upgrades for modern loads.' },
      { title: 'EV Charging Opportunity', desc: 'Identify commercial properties with large parking areas ideal for EV charging installations — a fast-growing revenue stream.' },
      { title: 'Lighting Retrofit Analysis', desc: 'Target buildings still using fluorescent or HID lighting with LED retrofit proposals, including energy savings calculations.' },
      { title: 'Energy Audit Outreach', desc: 'Reach property managers and building owners with data-backed energy efficiency proposals and estimated savings.' },
    ],
    keywords: ['commercial electrical leads', 'electrical contractor software', 'electrical sales leads', 'commercial electrician CRM', 'electrical contractor leads'],
  },
  {
    slug: 'pest-control',
    name: 'Pest Control',
    color: 'lime',
    tagline: 'Build a commercial pest control pipeline that fills itself.',
    description: 'LotusLeads helps pest control companies target commercial properties with the highest service need — restaurants, warehouses, healthcare facilities — and reach decision-makers with tailored proposals.',
    painPoints: [
      'Residential work is low-margin — need more commercial contracts',
      'No way to identify which commercial properties need service',
      'Competing with national chains that dominate online advertising',
      'Seasonal revenue swings make it hard to plan and grow',
    ],
    features: [
      { title: 'High-Need Facility Targeting', desc: 'Focus on restaurants, food processing, healthcare, warehouses, and hotels — the facilities that need regular pest management most.' },
      { title: 'Property & Environment Analysis', desc: 'Assess surrounding terrain, vegetation, nearby water sources, and building construction to identify pest pressure factors.' },
      { title: 'Compliance-Driven Outreach', desc: 'Target facilities with regulatory compliance requirements (FDA, health department) where pest control isn\'t optional — it\'s mandatory.' },
      { title: 'Recurring Revenue Builder', desc: 'Build year-round service contracts instead of one-time treatments with AI-powered outreach to facilities managers.' },
    ],
    keywords: ['commercial pest control leads', 'pest control sales software', 'pest control CRM', 'commercial pest management leads', 'pest control business software'],
  },
  {
    slug: 'snow-removal',
    name: 'Snow Removal',
    color: 'sky',
    tagline: 'Lock in commercial snow removal contracts before the first flake falls.',
    description: 'LotusLeads helps snow removal companies identify commercial properties with large parking lots and walkways, estimate service scope from aerial imagery, and secure contracts months before winter.',
    painPoints: [
      'Revenue concentrated in 4-5 months — need to lock contracts early',
      'Estimating lot size and linear feet of sidewalk from a drive-by',
      'Property managers don\'t think about snow until it\'s too late',
      'Competition is fierce and price-driven without differentiation',
    ],
    features: [
      { title: 'Lot & Walkway Measurement', desc: 'AI calculates parking lot area, drive lanes, sidewalks, and loading dock areas from satellite imagery — accurate estimates without a site visit.' },
      { title: 'Priority Zone Mapping', desc: 'Identify fire lanes, ADA access routes, building entrances, and emergency exits that require priority service during events.' },
      { title: 'Seasonal Contract Timing', desc: 'Target property managers in late summer and early fall when they\'re planning winter budgets — before competitors lock them in.' },
      { title: 'Bundled Services', desc: 'Cross-sell with landscaping, salting, and ice management services for higher contract values and year-round customer relationships.' },
    ],
    keywords: ['commercial snow removal leads', 'snow plow contractor software', 'snow removal CRM', 'commercial snow plowing leads', 'snow removal business software'],
  },
  {
    slug: 'cleaning',
    name: 'Commercial Cleaning',
    color: 'teal',
    tagline: 'Win janitorial and cleaning contracts at the commercial properties that need you.',
    description: 'LotusLeads helps commercial cleaning companies identify office buildings, medical facilities, and retail spaces that need cleaning services, and reach facility managers with competitive proposals.',
    painPoints: [
      'Cleaning is commoditized — hard to differentiate on anything but price',
      'No way to estimate cleaning scope without a walkthrough',
      'High turnover in contracts — need a constant pipeline of new business',
      'Decision-makers are hard to identify at large commercial properties',
    ],
    features: [
      { title: 'Square Footage Estimation', desc: 'Estimate cleanable floor area from building data — office space, lobbies, restrooms, common areas — without a walkthrough.' },
      { title: 'Facility Type Intelligence', desc: 'Target the highest-value verticals: medical offices, Class A office buildings, retail centers, and industrial clean rooms.' },
      { title: 'Contract Turnover Detection', desc: 'Identify properties that may be dissatisfied with current providers based on online reviews, complaints, and service gaps.' },
      { title: 'Facilities Manager Outreach', desc: 'Reach the right decision-maker with personalized proposals showing you understand their specific property and cleaning needs.' },
    ],
    keywords: ['commercial cleaning leads', 'janitorial sales software', 'cleaning company CRM', 'commercial janitorial leads', 'cleaning business software'],
  },
];

// ============================================================================
// DATA: CITIES
// ============================================================================
const CITIES = [
  { slug: 'chicago', name: 'Chicago', state: 'IL', metro: '9.5M', sectors: 'logistics, finance, healthcare, manufacturing', region: 'Midwest' },
  { slug: 'dallas', name: 'Dallas-Fort Worth', state: 'TX', metro: '7.6M', sectors: 'energy, tech, logistics, defense', region: 'South' },
  { slug: 'houston', name: 'Houston', state: 'TX', metro: '7.1M', sectors: 'energy, healthcare, manufacturing, shipping', region: 'South' },
  { slug: 'atlanta', name: 'Atlanta', state: 'GA', metro: '6.1M', sectors: 'logistics, film, tech, hospitality', region: 'Southeast' },
  { slug: 'phoenix', name: 'Phoenix', state: 'AZ', metro: '4.9M', sectors: 'tech, manufacturing, healthcare, hospitality', region: 'Southwest' },
  { slug: 'los-angeles', name: 'Los Angeles', state: 'CA', metro: '13.2M', sectors: 'entertainment, tech, manufacturing, logistics', region: 'West' },
  { slug: 'miami', name: 'Miami', state: 'FL', metro: '6.2M', sectors: 'hospitality, real estate, finance, healthcare', region: 'Southeast' },
  { slug: 'denver', name: 'Denver', state: 'CO', metro: '2.9M', sectors: 'tech, energy, healthcare, aerospace', region: 'Mountain West' },
  { slug: 'minneapolis', name: 'Minneapolis', state: 'MN', metro: '3.7M', sectors: 'finance, healthcare, retail, manufacturing', region: 'Midwest' },
  { slug: 'seattle', name: 'Seattle', state: 'WA', metro: '4.0M', sectors: 'tech, aerospace, logistics, healthcare', region: 'Pacific Northwest' },
  { slug: 'nashville', name: 'Nashville', state: 'TN', metro: '2.0M', sectors: 'healthcare, hospitality, music, logistics', region: 'South' },
  { slug: 'charlotte', name: 'Charlotte', state: 'NC', metro: '2.7M', sectors: 'finance, energy, logistics, manufacturing', region: 'Southeast' },
  { slug: 'tampa', name: 'Tampa', state: 'FL', metro: '3.2M', sectors: 'healthcare, finance, hospitality, defense', region: 'Southeast' },
  { slug: 'austin', name: 'Austin', state: 'TX', metro: '2.3M', sectors: 'tech, semiconductor, healthcare, government', region: 'South' },
  { slug: 'san-antonio', name: 'San Antonio', state: 'TX', metro: '2.6M', sectors: 'military, healthcare, hospitality, manufacturing', region: 'South' },
];

// ============================================================================
// DATA: BLOG ARTICLES
// ============================================================================
const BLOG_ARTICLES = [
  {
    slug: 'how-to-prospect-commercial-properties',
    title: 'How to Prospect Commercial Properties for Field Service Sales',
    description: 'A complete guide to identifying, qualifying, and winning commercial property accounts for landscaping, HVAC, solar, roofing, and other field service companies.',
    category: 'Sales Strategy',
    readTime: '8 min',
    sections: [
      { heading: 'Why Commercial Properties Are the Growth Engine', body: 'Residential work keeps the lights on, but commercial contracts build empires. A single commercial property can be worth 10-50x a residential account in annual revenue. The problem? Finding them, qualifying them, and reaching the decision-maker is exponentially harder than knocking on front doors.\n\nThe field service companies that figure out commercial prospecting first dominate their market. Those that don\'t get stuck competing on price for residential scraps.' },
      { heading: 'Step 1: Define Your Ideal Commercial Property', body: 'Before you prospect, define what you\'re looking for. Not every commercial property is a good fit for your business.\n\nConsider: What building size is your sweet spot? What industries do you serve best? What\'s your geographic range? What contract value makes a sales call worth it?\n\nThe best prospecting starts with an Ideal Customer Profile (ICP) that filters out the noise and focuses your team on the 20% of properties that drive 80% of revenue.' },
      { heading: 'Step 2: Use Property Intelligence, Not Windshield Surveys', body: 'The old way: drive around, write down addresses, Google the business, guess at the property size, try to find a phone number. Hours of work for one maybe-qualified lead.\n\nThe new way: satellite imagery, building data, and AI analysis give you more information about a property in 30 seconds than a 2-hour site visit. You can estimate roof area, lot size, building age, current tenants, and service needs — all from your desk.\n\nTools like LotusLeads automate this entire process, turning property addresses into fully-enriched sales opportunities.' },
      { heading: 'Step 3: Identify the Decision-Maker', body: 'Commercial properties have layers of management. The person you see at the building isn\'t usually the person who signs service contracts.\n\nFor most field service contracts, you\'re looking for: Property managers, Facilities directors, Building owners, Operations managers, or Procurement teams.\n\nContact enrichment tools like Apollo can find these people by company and title. The key is reaching the right person with the right message — not blasting the same generic email to everyone.' },
      { heading: 'Step 4: Lead with Intelligence, Not a Price Sheet', body: 'The biggest mistake in commercial sales: leading with price. Your first outreach should demonstrate that you understand the property and its specific needs better than the current provider.\n\nA winning first touch includes: specific observations about the property, a data-backed assessment of their needs, one or two relevant case studies, and a clear next step.\n\nWhen you show up knowing the roof area, the current landscaping gaps, or the HVAC system age, you\'re not a vendor — you\'re a consultant.' },
      { heading: 'Step 5: Build a Repeatable Pipeline', body: 'Commercial prospecting isn\'t a one-time activity. The best field service companies build a systematic pipeline: new properties identified weekly, auto-enriched with property data, scored by fit, and routed to the right salesperson.\n\nThis is where most companies stall. They do prospecting in bursts — hustle for a month, land a contract, then stop prospecting until they need more work. The companies that win build a machine that never stops feeding the pipeline.' },
    ],
  },
  {
    slug: 'cold-email-templates-field-service',
    title: '7 Cold Email Templates That Win Commercial Service Contracts',
    description: 'Proven cold email templates for landscaping, HVAC, solar, roofing, and field service companies targeting commercial properties. Copy, customize, and send.',
    category: 'Outreach',
    readTime: '6 min',
    sections: [
      { heading: 'Why Most Cold Emails Fail in Field Services', body: 'The average field service cold email reads like this: "Hi, we\'re ABC Landscaping, we\'ve been in business for 15 years, we offer mowing, trimming, and snow removal. Want a free quote?"\n\nThis email gets deleted in 2 seconds. Why? Because it\'s about YOU, not about THEM. There\'s no evidence you know anything about their property. No reason to believe you\'re different from the 10 other emails they got this week.\n\nThe emails that win commercial contracts are specific, short, and demonstrate property intelligence.' },
      { heading: 'Template 1: The Property Intelligence Opener', body: 'Subject: Quick observation about [Property Address]\n\nHi [Name],\n\nI was reviewing satellite imagery of [Property Address] and noticed [specific observation — e.g., "approximately 2.3 acres of turf area with what appears to be an aging irrigation system on the south side"].\n\nWe specialize in [service] for commercial properties in [city], and I\'d estimate your property could benefit from [specific recommendation].\n\nWould you be open to a 10-minute call to discuss? I can share the full property analysis.\n\nBest,\n[Name]\n\nWhy it works: It proves you\'ve done your homework. The prospect can verify your observation is accurate, which builds immediate credibility.' },
      { heading: 'Template 2: The Competitive Gap', body: 'Subject: Noticed something at [Company Name]\n\nHi [Name],\n\nI work with commercial properties in [city] and noticed that [specific gap — e.g., "the landscaping on the east side of your building hasn\'t been maintained to the same standard as the front entrance"].\n\nThis isn\'t unusual — it\'s actually one of the most common complaints we hear from property managers about their current providers.\n\nWe offer [specific solution] and currently serve [X] commercial properties in the area. Would it make sense to compare notes?\n\n[Name]\n\nWhy it works: You\'re identifying a gap without directly criticizing their current vendor. It positions you as observant and solution-oriented.' },
      { heading: 'Template 3: The Seasonal Trigger', body: 'Subject: [Season] planning for [Property Address]\n\nHi [Name],\n\nWith [season] approaching, I wanted to reach out about [Property Address]. Based on the property layout, I\'d estimate [seasonal need — e.g., "approximately 45,000 sq ft of parking area and 1,200 linear feet of sidewalk that will need snow and ice management"].\n\nWe\'re currently scheduling [season] contracts for commercial properties in [area]. Booking early usually means better pricing and guaranteed priority service.\n\nWant me to put together a scope and estimate?\n\n[Name]\n\nWhy it works: Seasonal urgency is real in field services. Combining it with specific property measurements makes you impossible to ignore.' },
      { heading: 'Templates 4-7: More Winning Approaches', body: 'Template 4 — The Case Study: Share a specific result from a similar property. "We reduced maintenance costs by 22% at [similar property] by [specific approach]."\n\nTemplate 5 — The Referral Angle: "I was speaking with [mutual connection] about commercial [service] in [area], and your property came up as one that could benefit from [specific improvement]."\n\nTemplate 6 — The Data-Backed Proposal: Lead with a specific dollar figure. "Based on your property analysis, I estimate we could save you $X,XXX annually on [service] while improving [outcome]."\n\nTemplate 7 — The Simple Check-In: For follow-ups. "Hi [Name], I sent you a property analysis for [address] last week. Did you get a chance to review it? Happy to walk through it in 5 minutes."' },
      { heading: 'The System Behind the Templates', body: 'Templates are a starting point, not a strategy. The real competitive advantage comes from the intelligence behind the email: knowing the property size, understanding the current service gaps, identifying the right decision-maker, and timing your outreach to seasonal buying patterns.\n\nPlatforms like LotusLeads generate these property-specific emails automatically, pulling from satellite analysis, contact enrichment, and competitive intelligence. The result is personalized outreach at scale — every email reads like you spent 30 minutes researching the property, even when AI did it in seconds.' },
    ],
  },
  {
    slug: 'satellite-property-analysis-field-service',
    title: 'How Satellite Property Analysis Is Transforming Field Service Sales',
    description: 'Learn how AI-powered satellite imagery analysis helps field service companies estimate property size, assess service needs, and win more commercial contracts.',
    category: 'Technology',
    readTime: '7 min',
    sections: [
      { heading: 'The End of the Windshield Survey', body: 'For decades, field service sales meant driving around, eyeballing properties, jotting down addresses, and hoping you could find the right person to call. The "windshield survey" was the industry standard — and it was wildly inefficient.\n\nToday, AI-powered satellite analysis can tell you more about a commercial property in 30 seconds than you\'d learn in a 2-hour site visit. Roof area, lot size, building footprint, vegetation coverage, parking capacity, and even signs of deferred maintenance — all visible from above.' },
      { heading: 'What Satellite Analysis Can Tell You', body: 'Modern property intelligence platforms analyze multiple data layers:\n\nAerial/Satellite Imagery: Roof area, material type, lot coverage, vegetation, parking layout, and building orientation.\n\nStreet-Level Views: Building condition, signage, tenant mix, landscape quality, and curb appeal.\n\nPublic Records: Building age, ownership, assessed value, recent permits, and zoning.\n\nBusiness Data: Current tenants, employee count, industry type, and revenue estimates.\n\nWhen you combine these layers, you get a complete property profile that would have taken hours to assemble manually.' },
      { heading: 'Industry-Specific Applications', body: 'Solar: Roof area, orientation, shading analysis, and system sizing. A solar company can estimate kW capacity and annual production for every commercial roof in their territory without leaving the office.\n\nLandscaping: Turf area, hardscape ratio, irrigation presence, and maintenance quality. Bid accurately on the first visit instead of wasting time on properties that are too small or too complex.\n\nHVAC: Building square footage, construction era, and estimated system tonnage. Identify properties with aging systems due for replacement.\n\nRoofing: Roof area, material type, age estimation, and recent weather events. Prioritize properties most likely to need service.' },
      { heading: 'From Analysis to Action', body: 'Data without action is just trivia. The real value of satellite property analysis comes when it\'s connected to your sales workflow:\n\n1. Identify: AI finds properties matching your ideal customer profile.\n2. Analyze: Satellite data enriches each property with service-specific intelligence.\n3. Score: Properties are ranked by estimated contract value, fit, and timing.\n4. Reach: AI generates personalized outreach using the property analysis data.\n5. Track: Every interaction is logged, and the pipeline moves forward.\n\nThis is the shift from reactive to proactive sales. Instead of waiting for the phone to ring, you\'re targeting the best properties with the best intelligence.' },
    ],
  },
  {
    slug: 'icp-ideal-customer-profile-field-service',
    title: 'Building an Ideal Customer Profile (ICP) for Field Service Companies',
    description: 'How to define your ideal commercial customer profile to focus your sales team on the accounts that drive the most revenue with the least effort.',
    category: 'Sales Strategy',
    readTime: '6 min',
    sections: [
      { heading: 'What Is an ICP and Why It Matters', body: 'An Ideal Customer Profile (ICP) is a description of the type of account that gets the most value from your service — and generates the most value for your business. It\'s not a persona (that\'s the person). It\'s a profile of the property, company, or organization.\n\nFor field service companies, your ICP might include: building type, square footage range, industry, location, ownership structure, and current service status.\n\nWithout an ICP, your sales team chases everything and closes very little. With one, they focus on the 20% of prospects that deliver 80% of your revenue.' },
      { heading: 'How to Build Your ICP in 4 Steps', body: 'Step 1: Analyze your best customers. Look at your top 10 accounts by revenue and profitability. What do they have in common? Building size? Industry? Location? Contract type?\n\nStep 2: Identify your deal-breakers. What properties are never a good fit? Too small, too far, wrong industry, misaligned expectations? Document these so your team stops wasting time.\n\nStep 3: Define your scoring criteria. Rank the attributes that matter most: contract value potential, geographic proximity, service complexity, and decision-maker accessibility.\n\nStep 4: Validate with data. Test your ICP against historical wins and losses. Do your best accounts actually match the profile? Adjust until the pattern holds.' },
      { heading: 'ICP Examples by Industry', body: 'Solar ICP: Commercial buildings with 10,000+ sq ft flat roof area, south-facing orientation, no existing solar installation, building owner (not tenant) as decision-maker, in a state with strong net metering.\n\nLandscaping ICP: Office parks and retail centers with 1-5 acres of maintained turf, property management company as client, in a metro area within 30 minutes of your base, with both landscaping and snow removal potential.\n\nHVAC ICP: Commercial buildings built before 2005 (aging systems), 20,000-100,000 sq ft, facilities manager as decision-maker, in a climate with both heating and cooling demand.\n\nThe more specific your ICP, the more effective your prospecting becomes.' },
      { heading: 'Using AI to Scale Your ICP', body: 'Defining an ICP used to mean a spreadsheet and gut feel. Today, AI can operationalize your ICP across your entire territory.\n\nDescribe your ideal customer in plain language: "Office parks in the Chicago suburbs with more than 2 acres of maintained grounds and a property management company making the decisions."\n\nAI translates that into filters, finds matching properties, enriches them with data, scores them by fit, and queues them for outreach. Your sales team wakes up every morning to a fresh list of qualified prospects that match your exact criteria.\n\nThat\'s what LotusLeads does — turns your ICP from a document into a daily prospecting engine.' },
    ],
  },
  {
    slug: 'commercial-vs-residential-field-service',
    title: 'Commercial vs. Residential: Why Field Service Companies Should Go B2B',
    description: 'The case for targeting commercial properties over residential accounts — higher revenue, longer contracts, and better margins for field service businesses.',
    category: 'Business Growth',
    readTime: '5 min',
    sections: [
      { heading: 'The Revenue Math', body: 'A residential landscaping account might be worth $2,000-$5,000 per year. A single commercial property? $15,000-$150,000+.\n\nThe same crew, the same equipment, the same expertise — but applied to a commercial property, it generates 10-50x more revenue per account. And commercial contracts typically run 1-3 years with auto-renewal, giving you predictable, recurring revenue instead of seasonal uncertainty.' },
      { heading: 'Why Most Companies Stay Residential', body: 'If commercial work is so much better, why isn\'t everyone doing it? Three reasons:\n\n1. Access: Finding the right commercial properties and reaching the decision-maker is harder than knocking on residential doors.\n\n2. Complexity: Commercial proposals require more data — property measurements, scope of work, compliance requirements, insurance documentation.\n\n3. Competition: Established players have relationships and reputation. Breaking in feels impossible without a differentiated approach.\n\nAll three of these barriers are data problems — and data problems have data solutions.' },
      { heading: 'The Commercial Transition Playbook', body: 'You don\'t need to abandon residential overnight. The smartest transition looks like this:\n\nPhase 1: Add 2-3 commercial accounts to your existing residential book. Use the experience to refine your commercial operations.\n\nPhase 2: Build a commercial prospecting system — ICP definition, property intelligence, targeted outreach. Aim for 20-30% commercial revenue.\n\nPhase 3: Hire or dedicate a salesperson to commercial-only prospecting. When commercial revenue exceeds residential, shift your marketing accordingly.\n\nThe key insight: commercial sales requires different tools and different tactics than residential. Property intelligence, competitive analysis, and decision-maker access matter more than yard signs and door hangers.' },
      { heading: 'Tools That Make the Transition Possible', body: 'The technology gap between commercial and residential sales is closing fast. Platforms like LotusLeads give small field service companies the same intelligence that national chains have had for years:\n\nProperty analysis from satellite imagery — no site visit needed for initial estimates.\nDecision-maker identification — find the property manager, not just the tenant.\nCompetitive intelligence — know who services the property now and where they fall short.\nAutomated outreach — personalized proposals generated from property data.\n\nThe companies that adopt these tools first capture the best commercial accounts in their market. The rest compete on price for what\'s left.' },
    ],
  },
  {
    slug: 'ai-lead-scoring-field-service',
    title: 'How AI Lead Scoring Works for Field Service Companies',
    description: 'Understanding how AI scores and ranks commercial property leads to help field service teams focus on the prospects most likely to convert.',
    category: 'Technology',
    readTime: '5 min',
    sections: [
      { heading: 'What Is AI Lead Scoring?', body: 'AI lead scoring assigns a numerical value to each prospect based on how likely they are to become a customer and how valuable that customer would be. Instead of treating every lead equally, your team focuses on the highest-scoring opportunities first.\n\nFor field service companies, lead scoring considers: property size and type, estimated contract value, decision-maker accessibility, competitive landscape, geographic fit, and seasonal timing.' },
      { heading: 'How It Works Under the Hood', body: 'Traditional lead scoring uses rules: "If property > 50,000 sq ft AND industry = healthcare, add 20 points." These rules work but they\'re rigid and based on assumptions.\n\nAI lead scoring learns from your actual data. It analyzes which prospects became customers, which didn\'t, and which factors predicted the outcome. Over time, it identifies patterns humans miss: maybe properties built between 1990-2005 in your zip code convert at 3x the average, or maybe properties with a specific type of management company are your best customers.\n\nThe model updates continuously as you win and lose deals, getting smarter with every interaction.' },
      { heading: 'What Gets Scored', body: 'A comprehensive AI scoring model for field service considers multiple signal layers:\n\nProperty Signals: Size, age, condition, current maintenance quality, recent permits or renovations.\n\nBusiness Signals: Industry type, employee count, revenue, growth trajectory, multiple locations.\n\nEngagement Signals: Email opens, website visits, content downloads, response to outreach.\n\nTiming Signals: Seasonal patterns, contract renewal cycles, recent weather events, new construction.\n\nCompetitive Signals: Current provider quality, complaint patterns, contract age.\n\nEach signal contributes to the overall score, giving your team a clear priority list every morning.' },
      { heading: 'Putting Scores to Work', body: 'A score is only useful if it changes behavior. Here\'s how high-performing field service teams use AI lead scores:\n\nScore 80-100: Hot — call within 24 hours, offer a free site assessment, fast-track the proposal.\nScore 60-79: Warm — add to email campaign, schedule a call, research the property.\nScore 40-59: Nurture — monthly touchpoints, seasonal offers, keep building awareness.\nScore below 40: Archive — not a fit right now, revisit quarterly.\n\nThe result: your best salespeople spend time on the best opportunities, and no high-potential lead falls through the cracks.' },
    ],
  },
  {
    slug: 'competitive-intelligence-field-service',
    title: 'Using Competitive Intelligence to Win More Service Contracts',
    description: 'How to research competitors, identify service gaps, and position your field service company to win contracts from established providers.',
    category: 'Sales Strategy',
    readTime: '6 min',
    sections: [
      { heading: 'Why Competitive Intelligence Matters', body: 'Every commercial property you want to service is either currently managed by someone else or has been approached by your competitors. Winning means understanding the competitive landscape — who services the property now, what they charge, where they fall short, and how you can offer more value.\n\nThis isn\'t corporate espionage. It\'s good sales strategy. The more you know about the incumbent, the better you can position your proposal.' },
      { heading: 'Finding Your Competitors at Target Properties', body: 'How do you know who currently services a commercial property? Multiple signals:\n\nGoogle Places & Reviews: Search for service providers near the property address. Reviews from tenants and property managers often name their providers.\n\nVehicle & Signage Observation: Street-level imagery shows service trucks, company signage, and equipment. This is the digital version of driving by.\n\nBusiness Listings: Service provider directories, BBB listings, and industry associations often list service areas and clients.\n\nDirect Research: Property management companies often list their preferred vendors publicly.\n\nPlatforms like LotusLeads automate this research, pulling competitor data from Google Places, reviews, and business listings for every property in your pipeline.' },
      { heading: 'Identifying Service Gaps', body: 'Knowing who the competitor is matters less than knowing where they fall short. Service gaps are your entry point:\n\nVisible gaps: From property imagery — overgrown areas, cracked parking lots, aging equipment, poor lighting.\n\nReview-based gaps: Customer complaints about responsiveness, quality, communication, or billing.\n\nScope gaps: Services the current provider doesn\'t offer that the property needs — like adding pest control to a cleaning contract, or snow removal to a landscaping contract.\n\nPrice gaps: Properties where the current provider has raised prices significantly, creating openness to alternatives.\n\nEvery gap is a talking point in your outreach: "I noticed [specific gap]. We specialize in [solution]."' },
      { heading: 'Positioning Against the Incumbent', body: 'Never trash-talk the competition. Instead, position yourself as the upgrade:\n\nInstead of "They\'re doing a bad job," say "Based on what I can see, there are a few areas where the property could benefit from a different approach."\n\nInstead of "We\'re cheaper," say "Our pricing model is structured differently — I\'d like to show you how it aligns better with your goals."\n\nInstead of "We\'re better," say "We bring a few capabilities they don\'t — [specific differentiator]."\n\nThe goal is to create doubt about the status quo, not to attack the competitor. Facility managers are loyal to providers who make their lives easier. Show them you\'ll make their life even easier.' },
    ],
  },
  {
    slug: 'property-manager-sales-guide',
    title: 'The Complete Guide to Selling to Property Managers',
    description: 'How field service companies can reach, engage, and close deals with commercial property managers — the key decision-makers for service contracts.',
    category: 'Sales Strategy',
    readTime: '7 min',
    sections: [
      { heading: 'Understanding the Property Manager\'s World', body: 'Property managers are the gatekeepers to commercial service contracts. They manage budgets, coordinate vendors, handle tenant complaints, and report to building owners. Understanding their world is the first step to winning their business.\n\nWhat they care about: Reliability (they get blamed when vendors no-show), cost control (they manage tight budgets), tenant satisfaction (complaints land on their desk), and compliance (safety, ADA, insurance).\n\nWhat they hate: Vendors who don\'t show up, surprise invoices, having to explain poor service to tenants, and salespeople who waste their time with generic pitches.' },
      { heading: 'Finding the Right Property Manager', body: 'The biggest challenge in commercial sales isn\'t the pitch — it\'s finding the person who signs the contracts. Properties can be managed by:\n\nIn-house facility managers: Larger companies with dedicated facilities staff. Find them on LinkedIn by searching "[Company] + Facilities Manager/Director."\n\nProperty management companies: Third-party firms that manage multiple buildings. One relationship can unlock an entire portfolio.\n\nBuilding owners: Smaller properties are often owner-managed. Find them through public property records and county assessor data.\n\nContact enrichment platforms like Apollo can identify these people by company and job title, giving you direct email addresses and phone numbers.' },
      { heading: 'What Property Managers Want to See in a Proposal', body: 'Skip the company brochure. Property managers evaluate proposals on:\n\nScope clarity: Exactly what you will do, how often, and what\'s not included. Ambiguity breeds distrust.\n\nProperty-specific detail: Show that you\'ve studied their property. Include measurements, observations, and specific recommendations.\n\nPricing transparency: Line-item pricing, not a lump sum. They need to justify the spend to ownership.\n\nReferences: Similar properties you serve, ideally in the same area or same property type.\n\nInsurance and compliance: Certificates of insurance, W-9, safety protocols. Have these ready before they ask.\n\nThe more prepared your proposal, the fewer objections you\'ll face.' },
      { heading: 'Closing and Retaining Property Manager Accounts', body: 'Property managers are loyal once you prove yourself. The close often comes after a trial period or emergency call. Position yourself to be the backup provider, and you\'ll eventually become the primary.\n\nRetention tactics that work:\n\n1. Proactive communication: Monthly service reports with photos showing work completed.\n2. Problem anticipation: Flag issues before they become complaints.\n3. Tenant consideration: Train crews to be professional, quiet, and respectful of building occupants.\n4. Budget partnership: Help them plan annual budgets with accurate cost projections.\n5. Multi-service bundling: The more services you provide, the harder you are to replace.\n\nA property manager who trusts you will bring you to every property in their portfolio. That\'s the real win.' },
    ],
  },
  {
    slug: 'field-service-crm-vs-sales-intelligence',
    title: 'CRM vs. Sales Intelligence: What Field Service Companies Actually Need',
    description: 'Why traditional CRMs fall short for field service sales, and how sales intelligence platforms fill the gap between managing leads and finding them.',
    category: 'Technology',
    readTime: '5 min',
    sections: [
      { heading: 'The CRM Problem in Field Services', body: 'Every field service company eventually gets a CRM. Salesforce, HubSpot, Jobber, ServiceTitan — they all promise to organize your sales pipeline and grow revenue. And they do help manage leads once you have them.\n\nBut here\'s the gap: CRMs manage leads. They don\'t find them.\n\nA CRM is a filing cabinet for opportunities that already exist. It tracks who called, what was quoted, and where things stand. Valuable? Absolutely. But it doesn\'t solve the hardest problem in field service sales: building the pipeline in the first place.' },
      { heading: 'What Sales Intelligence Adds', body: 'Sales intelligence is the layer that sits before the CRM — it\'s responsible for finding, qualifying, and enriching prospects so your pipeline is always full.\n\nA CRM answers: "Where does this lead stand?"\nSales intelligence answers: "Which properties should we be targeting, and what do we know about them?"\n\nFor field service companies, sales intelligence includes:\n- Property identification (finding commercial buildings that match your ICP)\n- Property analysis (satellite/aerial measurement, building data)\n- Contact enrichment (finding the decision-maker)\n- Competitive research (who services the property now)\n- Automated outreach (personalized emails based on property data)\n- Lead scoring (which prospects to prioritize)' },
      { heading: 'When You Need What', body: 'If you have plenty of leads but struggle to track them: You need a CRM.\n\nIf your pipeline is inconsistent and you don\'t have enough qualified prospects: You need sales intelligence.\n\nIf you have both problems: Start with sales intelligence (you can\'t track leads you don\'t have), then add CRM for pipeline management.\n\nMany field service companies buy a CRM first, then wonder why it doesn\'t help them grow. The CRM isn\'t broken — the pipeline feeding it is empty.' },
      { heading: 'The Integrated Approach', body: 'The best setup combines both: sales intelligence feeds qualified, enriched prospects into your CRM, where your team manages the relationship through close.\n\nLotusLeads is built as the intelligence layer. It handles everything before the handshake — prospecting, property analysis, contact enrichment, competitive research, and outreach. Once a prospect is engaged, it syncs to your existing workflow.\n\nThe result: your CRM stops being a graveyard of stale leads and starts being a pipeline of warm, qualified, data-rich opportunities.' },
    ],
  },
  {
    slug: 'seasonal-sales-strategy-field-service',
    title: 'The Seasonal Sales Calendar for Field Service Companies',
    description: 'When to prospect, pitch, and close for each service type — a month-by-month guide for field service companies selling to commercial properties.',
    category: 'Sales Strategy',
    readTime: '5 min',
    sections: [
      { heading: 'Timing Is Everything in Field Services', body: 'Most field service companies prospect when they need work — which is exactly when property managers have already signed contracts with someone else. The best companies prospect months ahead of the season, locking in contracts while competitors are still finishing last season\'s work.\n\nThis calendar gives you the timing framework. Combine it with property intelligence and targeted outreach, and you\'ll never miss another selling window.' },
      { heading: 'Q1: January - March', body: 'What to sell: Spring landscaping contracts, HVAC preventive maintenance (pre-cooling season), roof inspections (post-winter damage), commercial cleaning contracts (new year budgets).\n\nWhy now: Property managers are setting annual budgets and reviewing vendor contracts from the prior year. If the current provider underperformed, this is when they\'re open to alternatives.\n\nAction: Send property-specific outreach highlighting what you observed about their property over winter. Offer free spring assessments.' },
      { heading: 'Q2: April - June', body: 'What to sell: Solar installations (peak planning season), exterior painting and power washing, parking lot maintenance, pest control contracts.\n\nWhy now: Construction season is starting, budgets are approved, and property managers are scheduling major projects. Long-lead projects like solar need to be sold now for summer/fall installation.\n\nAction: Focus on properties you identified in Q1. Send case studies and ROI analyses. Offer "beat the summer rush" incentives.' },
      { heading: 'Q3: July - September', body: 'What to sell: Snow removal contracts (lock them in now), fall landscaping transitions, HVAC pre-heating season maintenance, security system upgrades (before dark winter months).\n\nWhy now: This is the golden window for snow removal contracts. Property managers who wait until October pay premium prices and get second-tier service. Smart ones sign in August.\n\nAction: Lead with satellite lot measurements and specific scope. "Your property has approximately 52,000 sq ft of parking area. Here\'s what it costs to keep it clear all winter."' },
      { heading: 'Q4: October - December', body: 'What to sell: Next-year service contracts (get ahead of January budget cycles), holiday lighting and seasonal services, end-of-year capital projects (use-it-or-lose-it budgets), energy efficiency upgrades.\n\nWhy now: Fiscal year-end spending. Many companies have budget that expires December 31. Property managers will approve projects now that would get delayed in January.\n\nAction: Target properties where you have warm relationships but no contract. "Before your year-end budgets close, here\'s a project that pays for itself in 18 months."' },
    ],
  },
  {
    slug: 'google-maps-prospecting-field-service',
    title: 'How to Use Google Maps for Commercial Prospecting (And Why It\'s Not Enough)',
    description: 'Google Maps is every field service company\'s first prospecting tool. Here\'s how to get the most from it — and where AI-powered tools take over.',
    category: 'Sales Strategy',
    readTime: '5 min',
    sections: [
      { heading: 'Google Maps: The Free Starting Point', body: 'Every field service owner has done it: open Google Maps, zoom into an area, start looking for commercial properties. It\'s free, it\'s visual, and it works — to a point.\n\nYou can see building footprints, parking lots, nearby businesses, and street views. For a company doing $500K in revenue with one truck, this is a perfectly reasonable way to prospect. Drive, look, call.\n\nBut it stops scaling around the time you hire your second salesperson.' },
      { heading: 'The Manual Bottleneck', body: 'With Google Maps prospecting, every property requires manual work: zoom in, estimate the size, switch to street view, try to identify the business, open a new tab to Google the company, search LinkedIn for the facility manager, compose an email from scratch.\n\nThat\'s 15-30 minutes per prospect. At best, one salesperson can research 15-20 properties per day. And that research is lost — there\'s no system to track it, score it, or build on it.\n\nThe insight: the MAP part of Google Maps is actually excellent. What\'s missing is the intelligence layer on top.' },
      { heading: 'What AI Property Intelligence Adds', body: 'Platforms like LotusLeads use the same satellite imagery — but apply AI analysis automatically:\n\nInstead of eyeballing roof area, AI measures it to the square foot.\nInstead of guessing building age, data enrichment provides it.\nInstead of Googling the owner, contact enrichment finds the decision-maker.\nInstead of writing each email manually, AI personalizes outreach from property data.\nInstead of a mental note, every property is scored, tracked, and pipelined.\n\nThe map is the starting point. Intelligence is what turns it into revenue.' },
      { heading: 'When to Graduate from Maps', body: 'If you\'re researching fewer than 20 properties per week, Google Maps is fine. Save your money.\n\nIf you need to research 50+ per week, you\'re spending $2,000-$4,000/month in salesperson time doing what AI does in seconds. That\'s when the math shifts — a prospecting platform pays for itself in the first week.\n\nThe field service companies that dominate their market aren\'t the ones with the best trucks. They\'re the ones who find the best accounts fastest.' },
    ],
  },
  {
    slug: 'roi-calculator-field-service-sales-tool',
    title: 'How to Calculate ROI on a Field Service Sales Intelligence Tool',
    description: 'Is a prospecting platform worth the investment? A practical ROI framework for field service companies evaluating sales intelligence tools.',
    category: 'Business Growth',
    readTime: '5 min',
    sections: [
      { heading: 'The ROI Framework', body: 'Field service owners are practical people. Before spending money on a sales tool, they want to know: will this make me more than it costs?\n\nThe answer depends on three numbers:\n1. Your average commercial contract value (annual)\n2. How many new contracts you need per quarter\n3. How much time your team currently spends prospecting per contract won\n\nMultiply #3 by your loaded cost per hour. That\'s what you\'re paying for manual prospecting today. A sales intelligence tool needs to beat that number — either by reducing hours per deal or increasing deals per quarter.' },
      { heading: 'Real-World Math', body: 'Example: A landscaping company with $25,000 average annual contracts.\n\nCurrent state: Salesperson spends ~20 hours per contract won (research, cold calls, site visits, proposals). At $35/hr loaded cost, that\'s $700 in prospecting cost per contract.\n\nWith LotusLeads: Property intelligence, contact enrichment, and automated outreach reduce prospecting time to ~5 hours per contract won. Cost drops to $175 per contract.\n\nSavings: $525 per contract. If you win 4 contracts per month, that\'s $2,100/month in recovered time — more than 10x the cost of the platform.\n\nAnd that\'s before counting the additional deals closed because your team is working better leads.' },
      { heading: 'The Hidden ROI: Deals You\'re Missing', body: 'The hardest ROI to measure is the one you can\'t see: deals that went to competitors because they got there first.\n\nEvery week you\'re not prospecting systematically, the best accounts in your territory are being locked up by companies that are. A 3-year commercial contract lost today is $75,000-$450,000 in revenue you\'ll never recover.\n\nThe real question isn\'t "can I afford a prospecting tool?" It\'s "can I afford to keep losing the best accounts to competitors who have one?"' },
      { heading: 'The 14-Day Test', body: 'You don\'t need an ROI spreadsheet to validate this. Run a 14-day trial:\n\nWeek 1: Identify 50 properties that match your ICP. Send personalized outreach to all 50.\nWeek 2: Follow up. Track responses, meetings booked, proposals sent.\n\nIf 50 AI-identified, AI-enriched prospects produce more pipeline in 2 weeks than your manual process produces in a month, the ROI question answers itself.\n\nLotusLeads offers a free 14-day trial. The worst case: you lose nothing but 30 minutes of setup time.' },
    ],
  },
  {
    slug: 'territory-mapping-field-service',
    title: 'Territory Mapping for Field Service Companies: A Complete Guide',
    description: 'How to divide, map, and optimize sales territories for field service teams — from one-truck operations to multi-branch enterprises.',
    category: 'Sales Strategy',
    readTime: '6 min',
    sections: [
      { heading: 'Why Territory Mapping Matters', body: 'Most field service companies grow by radius: you start in one area and expand outward. It works until it doesn\'t — crews driving 45 minutes between jobs, salespeople calling on each other\'s prospects, entire zip codes with zero coverage while others are over-served.\n\nTerritory mapping fixes this by dividing your market into defined zones, each with clear ownership, coverage goals, and performance metrics. It\'s the difference between "we serve the metro area" and "we dominate 12 specific zones."' },
      { heading: 'How to Draw Territory Boundaries', body: 'Three approaches, from simple to sophisticated:\n\nGeographic: Draw circles or rectangles on a map. Simple, but ignores density — a 5-mile radius in downtown has 10x the properties as rural suburbs.\n\nProperty Count: Divide so each territory has roughly equal numbers of target properties. Better for balanced workloads.\n\nRevenue Potential: Weight territories by estimated contract value. The territory with 200 warehouses may be worth more than the one with 2,000 strip malls.\n\nAI-powered platforms like LotusLeads can model all three — showing you property density, estimated values, and competitive coverage by zone.' },
      { heading: 'Territory Assignment', body: 'Once boundaries are drawn, assign them based on:\n\nExisting relationships: Keep salespeople in territories where they already have accounts.\nSkill match: Your best closer gets the highest-value territory. Your best hunter gets the territory with the most untapped potential.\nCapacity: Don\'t assign 500 prospects to a territory served by one part-time salesperson.\n\nReview quarterly. Territories that consistently underperform need either a different rep or different boundaries.' },
      { heading: 'From Territories to Pipeline', body: 'A territory map without a prospecting system is just a pretty picture. The real value comes when you combine territory definitions with property intelligence:\n\nEvery property in every territory, identified and scored.\nEach rep wakes up to a prioritized list of prospects in their zone.\nNo overlap, no gaps, no wasted driving.\n\nThis is what enterprise field service companies do. With AI-powered tools, companies with 5-10 trucks can do the same thing that national chains do with 50-person sales teams.' },
    ],
  },
  {
    slug: 'follow-up-strategies-commercial-sales',
    title: '8 Follow-Up Strategies That Close Commercial Service Contracts',
    description: 'The fortune is in the follow-up. Learn the exact sequences, timing, and messaging that convert commercial property prospects into signed contracts.',
    category: 'Outreach',
    readTime: '6 min',
    sections: [
      { heading: 'Why Most Follow-Ups Fail', body: 'The average commercial deal takes 5-12 touches before a decision. But 80% of salespeople give up after 2.\n\nThe problem isn\'t effort — it\'s approach. Sending "just checking in" three times isn\'t follow-up. It\'s nagging. Every touch needs to add value: a new insight, a relevant case study, a seasonal trigger, or a piece of property intelligence they haven\'t seen.\n\nThe companies that win commercial contracts aren\'t the most aggressive. They\'re the most persistent AND the most relevant.' },
      { heading: 'Strategy 1-3: The Opening Sequence', body: 'Day 1 — The Property Intelligence Email: Lead with satellite analysis data. "I analyzed your property at [address] and found [specific insight]."\n\nDay 4 — The Value Add: Send a relevant piece of content: a case study from a similar property, a cost-savings analysis, or an industry trend that affects their property.\n\nDay 8 — The Question: Ask something that requires a response: "Who handles your [service] contracts? I\'d like to make sure I\'m reaching the right person."\n\nThis 3-touch sequence establishes credibility (you know their property), provides value (useful content), and creates engagement (a direct question).' },
      { heading: 'Strategy 4-6: The Nurture Phase', body: 'Day 14 — The Seasonal Angle: Connect to an upcoming season or budget cycle. "With [season] approaching, here\'s what we\'re seeing in [their area] for [service] pricing."\n\nDay 21 — The Social Proof: Share a result from a nearby property. "We just completed [service] at [nearby address] — reduced their costs by [X%] compared to their previous provider."\n\nDay 30 — The Direct Ask: "I\'ve shared several analyses of your property over the past month. Would it be worth a 10-minute call to see if we can improve on your current [service]?"\n\nNotice: each touch adds new information. They\'re never left wondering "why is this person emailing me again?"' },
      { heading: 'Strategy 7-8: The Long Game', body: 'Day 60 — The Contract Cycle Play: Many commercial service contracts renew annually. "I know most [service] contracts in [area] come up for renewal in [month]. If you\'re evaluating options, I\'d love to put together a competitive comparison."\n\nDay 90 — The New Intelligence: Circle back with genuinely new information. "I noticed [something changed at their property — new construction, new tenant, weather event]. This might affect your [service] needs."\n\nThe key insight: commercial property managers don\'t buy when YOU\'re ready to sell. They buy when their contract is up, their budget refreshes, or their current provider drops the ball. Your job is to be the first name they think of when that moment arrives.' },
    ],
  },
  {
    slug: 'commercial-property-data-sources',
    title: 'The Complete List of Commercial Property Data Sources for Sales Teams',
    description: 'Every free and paid data source field service sales teams can use to research commercial properties — county records, satellite, permits, and more.',
    category: 'Technology',
    readTime: '7 min',
    sections: [
      { heading: 'Free Data Sources', body: 'County Assessor/Tax Records: Building age, square footage, assessed value, ownership, and sale history. Available online for most US counties. The single best free data source for commercial prospecting.\n\nGoogle Maps/Earth: Satellite and street-level imagery, nearby businesses, reviews, hours. The go-to for visual property assessment.\n\nBuilding Permits: Recent permits indicate renovation, expansion, or new construction — all signals of service needs. Check your county\'s building department website.\n\nFEMA Flood Maps: Properties in flood zones need specialized services. Free at msc.fema.gov.\n\nUSDA Web Soil Survey: For landscaping and irrigation companies, soil type data helps estimate project complexity.' },
      { heading: 'Paid Data Sources', body: 'CoStar/LoopNet: The gold standard for commercial real estate data. Tenant info, lease rates, vacancy, and ownership. Expensive ($300-1,000+/mo) but comprehensive.\n\nReonomy: Property intelligence platform with ownership, transaction history, and debt data. Better for one-off lookups than bulk prospecting.\n\nApollo/ZoomInfo: Contact enrichment platforms. Find the facility manager, property manager, or building owner by company and job title. Essential for reaching decision-makers.\n\nNearmap/EagleView: High-resolution aerial imagery updated multiple times per year. Better resolution than Google Earth for roof analysis and property measurement.\n\nPermit data aggregators (BuildZoom, ConstructConnect): Consolidated permit data across jurisdictions. Useful for identifying properties with recent construction activity.' },
      { heading: 'Government & Public Records', body: 'Business Registrations: Secretary of State databases show which businesses operate at which addresses, who owns them, and when they were registered.\n\nEnvironmental Records: EPA databases show facilities with environmental permits — useful for pest control, HVAC, and cleaning companies targeting regulated facilities.\n\nFire Department Inspections: Some cities publish fire inspection records, showing building type, occupancy, and compliance status.\n\nEnergy Benchmarking Data: Cities like NYC, Chicago, and Seattle publish building energy consumption data. Gold for HVAC and energy service companies.' },
      { heading: 'How LotusLeads Combines Them', body: 'The challenge with all these sources is integration. Pulling data from 6-8 different platforms and manually combining it for each prospect takes hours.\n\nLotusLeads aggregates property data, satellite analysis, contact enrichment, and competitive intelligence into a single profile for every commercial property in your territory. One search replaces hours of manual research across multiple databases.\n\nThe data is only valuable if it reaches your sales team in a format they can act on. That\'s the difference between raw data sources and a sales intelligence platform.' },
    ],
  },
  {
    slug: 'scaling-field-service-sales-team',
    title: 'How to Scale a Field Service Sales Team from 1 to 10 Reps',
    description: 'The playbook for growing a field service sales team — when to hire, how to train, what tools to deploy, and how to maintain quality as you scale.',
    category: 'Business Growth',
    readTime: '7 min',
    sections: [
      { heading: 'Stage 1: The Owner-Seller (1 Person)', body: 'Every field service company starts with the owner doing sales. You know the work, you know the clients, you close deals on handshakes and reputation.\n\nThis works until you\'re turning away jobs because you\'re too busy selling to deliver (or too busy delivering to sell). The revenue ceiling for an owner-seller is typically $500K-$1.5M depending on the industry.\n\nBefore you hire: document your sales process. How do you find prospects? What do you say? How do you estimate? What closes deals? If it\'s all in your head, no hire will succeed.' },
      { heading: 'Stage 2: First Sales Hire (2-3 People)', body: 'Your first sales hire should NOT be a rainmaker. They should be a disciplined executor who follows a system.\n\nGive them: a defined territory, a prospect list, a CRM or tracking spreadsheet, email templates, a proposal template, and clear metrics (calls per day, proposals per week, close rate).\n\nThe most common mistake: hiring someone and saying "go sell." Without a system, territory, and tools, even good salespeople fail. They need the same property intelligence you used to build the business — not just a phone and a prayer.\n\nExpected ramp: 90-120 days to first closed deal. 6 months to full productivity.' },
      { heading: 'Stage 3: Building the Machine (4-6 People)', body: 'At 4+ reps, you need infrastructure:\n\nTerritory Management: Clear boundaries, no overlap, balanced potential. Use property intelligence to divide equitably.\n\nPipeline Visibility: Everyone\'s deals in one dashboard. Weekly pipeline reviews with the team.\n\nSales Playbook: Documented process from first touch to signed contract. Objection handling scripts. Competitive positioning guides.\n\nLead Source Consistency: You can\'t rely on referrals for 4 reps. Build a systematic prospecting engine — AI-powered property identification, automated outreach, lead scoring.\n\nThis is where most field service companies stall. The jump from "a couple people selling" to "a sales organization" requires systems, not just headcount.' },
      { heading: 'Stage 4: Sales Organization (7-10+ People)', body: 'At this stage, you need specialization:\n\nSDRs/BDRs: Dedicated prospectors who identify and qualify leads (or use AI to do it).\nAccount Executives: Closers who run proposals, site visits, and negotiations.\nAccount Managers: Retention specialists who keep existing clients happy and grow wallet share.\n\nTechnology stack: CRM (deal tracking), sales intelligence (prospecting), proposal software (professional quotes), and analytics (performance metrics).\n\nThe field service companies that reach this level — $5M-$20M+ in revenue — almost always have a technology advantage. Their competitors are still doing windshield surveys while they\'re running an AI-powered sales machine.\n\nLotusLeads is built for this journey. It scales from an owner-seller researching 10 properties to a 10-person team processing 1,000 prospects per month.' },
    ],
  },
  {
    slug: 'b2b-email-deliverability-field-service',
    title: 'Email Deliverability Guide for Field Service Companies',
    description: 'Why your outreach emails land in spam and how to fix it. Domain authentication, warm-up, content tips, and sending best practices for B2B field service.',
    category: 'Outreach',
    readTime: '5 min',
    sections: [
      { heading: 'Why Your Emails Aren\'t Getting Through', body: 'You wrote the perfect prospecting email. Personalized, specific, compelling. But the property manager never saw it — it landed in spam.\n\nEmail deliverability isn\'t about your message. It\'s about your sender reputation, domain authentication, and sending patterns. Most field service companies skip all three, then wonder why their outreach gets zero responses.' },
      { heading: 'Step 1: Authenticate Your Domain', body: 'Three DNS records you need before sending a single outreach email:\n\nSPF (Sender Policy Framework): Tells email servers which IPs are authorized to send from your domain.\n\nDKIM (DomainKeys Identified Mail): Adds a cryptographic signature proving the email wasn\'t altered in transit.\n\nDMARC (Domain-based Message Authentication): Tells receiving servers what to do with emails that fail SPF/DKIM checks.\n\nWithout these, Gmail and Outlook treat your emails as potentially fraudulent. Your IT person or email provider can set these up in 30 minutes.' },
      { heading: 'Step 2: Warm Up Your Sending', body: 'If you suddenly send 200 cold emails from an address that\'s been sending 5 per day, spam filters flag it immediately.\n\nWarm-up schedule:\nWeek 1: 10-15 emails per day\nWeek 2: 20-30 per day\nWeek 3: 40-50 per day\nWeek 4: 75-100 per day\n\nUse a dedicated outreach subdomain (outreach.yourcompany.com) so cold email reputation doesn\'t affect your main domain. This is standard practice — not shady.' },
      { heading: 'Step 3: Write Like a Human', body: 'Spam filters detect patterns common in bulk email:\n\nAvoid: ALL CAPS in subject lines, excessive exclamation marks!!!, "free" and "guaranteed," image-heavy emails with little text, identical content sent to hundreds of recipients.\n\nDo: Write short, plain-text emails. Personalize beyond just the name — reference the specific property, city, or industry. Vary your templates so each batch isn\'t identical. Include a clear unsubscribe option.\n\nThe best defense against spam filters? Write emails that look like one human wrote to another. Because that\'s exactly what good B2B outreach is.' },
    ],
  },
  {
    slug: 'multi-location-field-service-sales',
    title: 'Selling to Multi-Location Property Portfolios',
    description: 'How to identify, approach, and win contracts with property management companies and owners who control multiple commercial locations.',
    category: 'Sales Strategy',
    readTime: '6 min',
    sections: [
      { heading: 'The Portfolio Play', body: 'A single commercial property might be worth $20,000/year. But the management company that controls 15 similar properties? That\'s a $300,000 relationship.\n\nMulti-location selling is the fastest path to scaling a field service company. One relationship, one proposal process, one contract — but revenue from a dozen or more properties. The challenge is finding these portfolio owners and positioning yourself as a portfolio-level partner, not just another single-site vendor.' },
      { heading: 'Finding Portfolio Owners', body: 'Property management companies: Search for PM companies in your area. Each one manages 10-200+ commercial properties. One decision-maker controls all of them.\n\nREIT holdings: Real Estate Investment Trusts own hundreds of commercial properties. They use national vendors, but regional service providers who can cover multiple sites often win on price and responsiveness.\n\nPublic property records: County assessor databases show ownership. When the same LLC or individual owns multiple commercial parcels, that\'s a portfolio prospect.\n\nLotusLeads identifies portfolio patterns automatically — when multiple properties in your territory share the same owner or management company, it flags the portfolio opportunity.' },
      { heading: 'The Portfolio Proposal', body: 'Single-site proposals compete on price. Portfolio proposals compete on partnership value:\n\nConsistency: Same service quality across all locations. One point of contact, standardized reporting, unified scheduling.\n\nVolume Pricing: Lower per-site cost because you\'re serving multiple locations efficiently. Route density reduces travel time.\n\nPortfolio-Wide Intelligence: Provide a dashboard showing service status, upcoming needs, and cost trends across all their properties.\n\nThe pitch: "You currently coordinate 6 different [service] vendors across 15 locations. We replace all 6 with one team, one invoice, and one dashboard — at a lower total cost."' },
      { heading: 'Retention at Scale', body: 'Portfolio clients are your most valuable — and most vulnerable — accounts. Losing a portfolio client can cut revenue by 20-30% overnight.\n\nRetention strategies:\n\nQuarterly Business Reviews (QBRs): Present portfolio-wide service reports, highlight issues you caught proactively, and propose improvements.\n\nDedicated Account Manager: Portfolio clients deserve a named person who knows every property.\n\nProactive Upselling: When one property needs a new service (snow removal, pest control, lighting), offer it across the portfolio.\n\nContract Length: Negotiate 2-3 year contracts with annual rate adjustments. The switching cost keeps competitors at bay.' },
    ],
  },
  {
    slug: 'pricing-commercial-service-contracts',
    title: 'How to Price Commercial Service Contracts to Win and Profit',
    description: 'Pricing frameworks for field service companies bidding on commercial properties — cost-plus, market-rate, value-based, and tiered approaches.',
    category: 'Business Growth',
    readTime: '6 min',
    sections: [
      { heading: 'The Pricing Problem', body: 'Price too high, you lose the bid. Price too low, you win the job and lose money on it. Commercial pricing is the single highest-leverage skill in field service sales.\n\nMost companies price by gut: "That looks like a $3,000/month property." The best companies price by data: they know the cost per square foot, the competitor\'s likely bid, and the property manager\'s budget — before they write the number.' },
      { heading: 'Framework 1: Cost-Plus', body: 'Calculate your actual cost to service the property, then add your target margin.\n\nDirect costs: Labor hours x rate, materials, equipment, fuel, subcontractors.\nIndirect costs: Insurance, vehicle depreciation, admin overhead, supervision.\nMargin: 15-35% depending on service complexity and competitive pressure.\n\nCost-plus ensures profitability but ignores the market. You might leave money on the table if competitors charge more, or price yourself out if they charge less.\n\nBest for: Specialty services with limited competition, complex jobs with high material costs.' },
      { heading: 'Framework 2: Market-Rate Intelligence', body: 'Research what competitors charge for similar properties, then position accordingly.\n\nSources: Industry benchmarking reports, competitive intelligence tools (like LotusLeads), conversations with property managers about their current pricing, RFP response history.\n\nPosition options:\n- Below market (10-15% under): Win on price. Risky for margins, but effective for market entry.\n- At market: Compete on service quality and reliability.\n- Above market (10-20% over): Only viable with a clear differentiator — faster response time, better technology, stronger guarantees.\n\nBest for: Commodity services (landscaping, cleaning, snow removal) where pricing is relatively transparent.' },
      { heading: 'Framework 3: Value-Based', body: 'Price based on the value you create, not the cost to deliver.\n\nExamples:\n- HVAC maintenance priced as "energy savings" — a $500/month contract that saves $800/month in energy costs is a no-brainer.\n- Solar installation priced as "monthly savings vs. current electric bill" rather than total system cost.\n- Security services priced against the cost of a single theft or liability claim.\n\nValue-based pricing requires understanding the customer\'s economics. Property intelligence from LotusLeads — energy data, building age, current service gaps — gives you the data to make value-based arguments.\n\nBest for: High-value services where you can quantify the customer\'s return on investment.' },
    ],
  },
  {
    slug: 'winning-rfps-field-service',
    title: 'How to Win Commercial RFPs for Field Service Contracts',
    description: 'A field service company\'s guide to responding to Requests for Proposals from property managers, facilities directors, and commercial property owners.',
    category: 'Sales Strategy',
    readTime: '6 min',
    sections: [
      { heading: 'Understanding Commercial RFPs', body: 'Many large commercial properties and property management companies use formal RFPs (Requests for Proposals) to select service providers. If you\'ve never responded to one, they can feel intimidating — 20-page documents with detailed requirements, evaluation criteria, and legal terms.\n\nBut RFPs are actually good news for prepared companies. They mean the property manager is actively looking for a new provider and has budget allocated. The deal is real — you just need to win it.' },
      { heading: 'The Anatomy of a Winning Response', body: 'RFP evaluators score on five dimensions:\n\n1. Compliance (does your response address every requirement?): This is pass/fail. Miss a required section and you\'re disqualified before anyone reads your pitch.\n\n2. Technical Capability (can you actually do the work?): Equipment list, crew size, certifications, licenses, insurance limits, safety record.\n\n3. Experience & References (have you done this before?): Similar properties served, years in business, client testimonials, case studies with measurable outcomes.\n\n4. Pricing (are you competitive?): Line-item breakdown, not just a total. Show your work — evaluators distrust round numbers.\n\n5. Value-Adds (what else do you bring?): Technology (property monitoring, reporting dashboards), sustainability practices, emergency response capability, seasonal flexibility.' },
      { heading: 'Property Intelligence in Your RFP Response', body: 'Here\'s where most competitors fall short: their RFP response is generic. They submit the same boilerplate with a different property name.\n\nYour response should demonstrate deep property knowledge:\n\n"Based on our analysis, your property at [address] has approximately [X] sq ft of maintained landscape area, [Y] linear feet of sidewalk, and [Z] parking spaces requiring snow management."\n\nThis is not possible at scale with manual research. But with satellite property analysis from LotusLeads, you can enrich every RFP response with specific measurements and observations — in minutes, not days.\n\nThe evaluator reading your response thinks: "This company already knows our property better than our current vendor."' },
      { heading: 'After the RFP: What Separates Winners', body: 'The RFP response gets you to the shortlist. What happens next closes the deal:\n\n1. Same-Week Follow-Up: Call the contact within 48 hours of submission. Ask if they received it, if anything needs clarification, and when they expect to make a decision.\n\n2. Site Visit Offer: "We\'d like to walk the property before you finalize your decision. Our crew lead wants to see [specific area] to confirm our approach."\n\n3. Reference Proactivity: Don\'t wait for them to call your references. Send a one-page reference sheet with contact names, phone numbers, and a one-line summary of the work.\n\n4. Competitive Positioning: If you know who else is bidding (and you often can find out), subtly differentiate. "Unlike providers who subcontract [service], we handle everything with our own crews."' },
    ],
  },
  {
    slug: 'service-contract-negotiation-tips',
    title: '10 Negotiation Tips for Commercial Service Contracts',
    description: 'How to negotiate commercial service contracts that protect your margins, lock in revenue, and build lasting client relationships.',
    category: 'Business Growth',
    readTime: '5 min',
    sections: [
      { heading: 'Tip 1-3: Setting the Table', body: 'Tip 1 — Never Negotiate Price First: Establish scope, quality expectations, and service level before discussing numbers. Once the prospect understands the value, price conversations go differently.\n\nTip 2 — Anchor High (But Fairly): Your first number should be at the top of the reasonable range. Property managers expect to negotiate 10-15% off the initial quote. Build that room into your opening.\n\nTip 3 — Bundle for Value: Instead of discounting your core service, add value. "I can\'t lower the landscaping price, but I can include quarterly fertilization at no additional charge." The perceived value is higher than the actual cost.' },
      { heading: 'Tip 4-6: During the Negotiation', body: 'Tip 4 — Trade, Don\'t Cave: Every concession should come with a get. "I can reduce the monthly rate by 8% if we move to a 24-month contract instead of 12." You\'re giving on price but getting on commitment.\n\nTip 5 — Use Property Data as Leverage: "Based on satellite measurement, your property is actually 15% larger than the scope in your current contract. Our price accounts for the full area — your current provider may not be covering the south lot."\n\nTip 6 — Name the Competitor (Carefully): "I know [competitor] has a lower price point. They also have 3.2 stars on Google with multiple complaints about no-shows. Our 4.8-star rating reflects the reliability you\'re paying for." Only use this when you have the data to back it up.' },
      { heading: 'Tip 7-10: Closing and Protecting', body: 'Tip 7 — Annual Escalation Clause: Build in 3-5% annual increases tied to CPI or fuel costs. Without this, a 3-year contract becomes unprofitable by year 3.\n\nTip 8 — Scope Creep Protection: Define exactly what\'s included AND what\'s not. "Additional snow events beyond [X] per season are billed at $[Y] per event." Ambiguous scope is where margins die.\n\nTip 9 — Payment Terms: Net-30 is standard for commercial. Push for Net-15 or auto-pay if possible. Late payment is the silent killer of field service cash flow.\n\nTip 10 — The Mutual Win Close: "I want this to work for both of us for years. Here\'s where I can flex, and here\'s what I need to make this sustainable for my team." Honesty about your constraints builds trust — and usually gets better terms than hardball.' },
    ],
  },
  {
    slug: 'case-study-landscaping-growth',
    title: 'Case Study: How a Landscaping Company Grew from $800K to $3.2M in 18 Months',
    description: 'How one commercial landscaping company used AI-powered prospecting and property intelligence to 4x revenue in under two years.',
    category: 'Case Study',
    readTime: '5 min',
    sections: [
      { heading: 'The Starting Point', body: 'GreenEdge Landscaping (name changed) was a 6-person team doing $800K in annual revenue. Owner-operated, 80% residential, 20% commercial. The commercial contracts were more profitable, but the owner — Mike — didn\'t have time to prospect for them while running crews and managing residential accounts.\n\nThe growth ceiling was clear: residential revenue was flat, profit margins were thin (12-15%), and every winter was a cash flow crisis. Mike knew commercial was the answer but couldn\'t crack the prospecting problem.' },
      { heading: 'The Shift: Property Intelligence + Systematic Outreach', body: 'Mike started using AI-powered property intelligence to identify commercial prospects in his territory. Instead of driving around looking for opportunities, the platform identified 340 commercial properties within 20 miles that matched his ICP: office parks, retail centers, and medical complexes with 1-5 acres of maintained grounds.\n\nEach property came with: measured turf area, current maintenance quality assessment from satellite imagery, property manager contact information, and competitive intelligence (who services them now).\n\nMike sent personalized outreach to 50 properties in his first week. The emails referenced specific property measurements and observations. Response rate: 18% (vs. his previous cold call rate of 2%).' },
      { heading: 'The Results: 18 Months Later', body: 'Month 3: 4 new commercial contracts ($180K annual value). Hired a dedicated salesperson.\n\nMonth 6: 11 commercial contracts. Revenue split shifted to 55% commercial. Average contract: $28,000/year. Hired 3 more crew members.\n\nMonth 12: 22 commercial contracts. $2.1M run rate. Profit margin improved to 22% (commercial margins are higher). Added snow removal bundling to 8 accounts.\n\nMonth 18: 31 commercial contracts, 5 residential maintenance crews. $3.2M revenue, $640K profit. Two-thirds of new deals came from the AI prospecting platform.\n\nThe biggest change: Mike stopped being the bottleneck. His salesperson handles all prospecting with the platform, Mike handles relationships and operations, and the business runs without the owner in the truck.' },
      { heading: 'The Takeaway', body: 'GreenEdge didn\'t add a revolutionary new service. They didn\'t slash prices. They didn\'t run a Super Bowl ad. They added one thing: a systematic way to find and win commercial properties.\n\nThe total investment: ~$500/month in sales intelligence tools + one dedicated salesperson. The return: $2.4M in incremental revenue over 18 months.\n\nThe competitive advantage wasn\'t the tool — it was adopting it before competitors in their market did. Two years later, three competitors in their area started using similar tools. But GreenEdge had already locked in the best 30+ accounts.\n\nFirst-mover advantage in commercial prospecting is real. And it compounds.' },
    ],
  },
  {
    slug: 'apollo-linkedin-prospecting-field-service',
    title: 'Using Apollo and LinkedIn for Field Service Commercial Prospecting',
    description: 'How to combine Apollo contact enrichment and LinkedIn research to find and reach commercial property decision-makers for field service companies.',
    category: 'Outreach',
    readTime: '5 min',
    sections: [
      { heading: 'The Decision-Maker Problem', body: 'You found the perfect property. Great location, right size, clear service need. But who do you contact? The company that occupies the building? The property owner? The management company? The facilities director who may or may not work on-site?\n\nFinding the right person at a commercial property is the hardest part of field service sales. It\'s also the most important — reaching the wrong person wastes time and kills deals before they start.' },
      { heading: 'Apollo: Contact Enrichment at Scale', body: 'Apollo.io is a B2B contact database with 275M+ contacts. For field service prospecting, it excels at:\n\nTitle-Based Search: Find everyone with "Facilities Manager," "Property Manager," "Operations Director," or "VP of Real Estate" at a specific company or in a specific area.\n\nCompany Match: Know the business at a property? Apollo shows you the org chart — who works there, their titles, direct email addresses, and phone numbers.\n\nBulk Enrichment: Upload a list of 200 property addresses, match to companies, and pull decision-maker contacts for all of them. What would take 40 hours manually takes 10 minutes.\n\nLotusLeads integrates Apollo data directly — when you identify a target property, the decision-maker\'s contact info is already attached.' },
      { heading: 'LinkedIn: Research and Warm-Up', body: 'Apollo gives you the contact. LinkedIn gives you the context.\n\nBefore emailing a facility manager, check their LinkedIn profile:\n- How long have they been in the role? (New = re-evaluating vendors. Established = harder to unseat incumbent.)\n- What did they do before? (Former contractor = they speak your language.)\n- What do they post about? (Mentions of facility challenges = conversation starters.)\n- Do you share connections? (Mutual connections = warm introduction potential.)\n\nLinkedIn connection request (after your first email): "Hi [Name], I recently sent you a property analysis for [address]. Would love to connect and share insights on [service] in the [city] market."\n\nDon\'t sell on LinkedIn. Use it to make your email outreach warmer and more relevant.' },
      { heading: 'The Combined Workflow', body: 'Step 1: LotusLeads identifies target properties from satellite analysis and ICP matching.\nStep 2: Apollo enriches each property with decision-maker contacts (name, title, email, phone).\nStep 3: LinkedIn research adds personal context for the top prospects.\nStep 4: AI generates personalized outreach combining property intelligence + contact context.\nStep 5: Follow-up sequence runs automatically, with LinkedIn touches between emails.\n\nThis workflow replaces: driving around, Googling businesses, guessing at contacts, writing generic emails, and hoping for the best. It\'s not a marginal improvement — it\'s a completely different sport.' },
    ],
  },
  {
    slug: 'winter-revenue-strategies-field-service',
    title: 'How Field Service Companies Can Eliminate the Winter Revenue Drop',
    description: 'Strategies for landscaping, exterior service, and seasonal field service companies to maintain revenue through winter months.',
    category: 'Business Growth',
    readTime: '5 min',
    sections: [
      { heading: 'The Seasonal Revenue Problem', body: 'For landscaping, exterior painting, power washing, and irrigation companies, revenue doesn\'t dip in winter — it falls off a cliff. A company doing $150K/month in July might do $20K in January.\n\nThe result: layoffs, cash flow stress, and the annual scramble to rebuild crews in spring. It\'s the single biggest reason field service companies stay small — they can\'t retain talent or invest in growth when 4-5 months of the year are survival mode.' },
      { heading: 'Strategy 1: Snow & Ice Management', body: 'The most obvious (and most profitable) winter revenue source. Commercial snow removal contracts range from $2,000-$50,000+ per property per season.\n\nThe key: sell snow contracts in July-September, NOT in November. By fall, the best properties are already locked in.\n\nUse satellite property intelligence to identify prospects: AI measures parking lot area, drive lanes, sidewalks, and loading docks automatically. Send proposals with exact measurements — "Your property has 48,000 sq ft of parking and 1,100 linear feet of sidewalk. Here\'s what it costs to keep it clear all winter."\n\nCompanies that bundle landscaping + snow removal retain clients year-round and eliminate 80% of the seasonal revenue swing.' },
      { heading: 'Strategy 2: Interior & Year-Round Services', body: 'Add services that commercial properties need regardless of season:\n\nInterior Plantscaping: Office plants, lobby greenery, living walls. $500-$3,000/month per property for installation and maintenance.\n\nHoliday Décor: Commercial holiday lighting and decoration installation. October-February revenue stream with 60-70% margins.\n\nInterior Maintenance: Floor care, window cleaning, common area maintenance. Many of the same clients, different service line.\n\nPest Control: Year-round need, especially for restaurants, healthcare, and food storage facilities. Easy to add if you\'re already visiting the property for other services.\n\nEach addition smooths the revenue curve AND increases customer lifetime value.' },
      { heading: 'Strategy 3: Use Winter to Build Pipeline', body: 'If you can\'t eliminate the revenue dip entirely, use slow months strategically:\n\nWinter Prospecting Blitz: Your competitors stop selling in November. That\'s when you start. Use AI property intelligence to identify 200 target properties and launch outreach campaigns through January. By March, you have a full pipeline of spring contracts.\n\nEquipment & Process Investment: Maintain equipment, train crews on new services, implement technology (like LotusLeads) that will accelerate spring sales.\n\nRelationship Building: Visit existing commercial clients. Conduct property walkovers. Identify spring needs. Propose multi-year contracts with auto-renewal.\n\nThe companies that grow fastest aren\'t busy in winter — they\'re selling in winter. When spring arrives, their pipeline is full while competitors are starting from zero.' },
    ],
  },
  {
    slug: 'fleet-management-field-service',
    title: 'Fleet Management Basics for Growing Field Service Companies',
    description: 'Practical fleet management advice for field service companies with 3-20 vehicles — GPS, routing, maintenance, and cost optimization.',
    category: 'Operations',
    readTime: '5 min',
    sections: [
      { heading: 'When Fleet Management Starts Mattering', body: 'With 1-2 trucks, you know where everyone is. With 3+, you don\'t.\n\nFleet management becomes critical when: fuel costs exceed $3,000/month, you\'re dispatching crews to properties more than 20 minutes apart, you suspect crews are taking inefficient routes or long breaks, or vehicle maintenance surprises are killing your cash flow.\n\nYou don\'t need an enterprise fleet management system. You need visibility, routing, and a maintenance schedule.' },
      { heading: 'GPS Tracking: Know Where Your Crews Are', body: 'Basic GPS tracking ($20-40/month per vehicle) gives you:\n\nReal-Time Location: Know which crew is closest to an emergency call or new job site.\nRoute History: See actual vs. planned routes. Identify wasted drive time.\nGeofencing: Get alerts when vehicles arrive at or leave job sites. Verify that crews are actually spending time at each property.\nAfter-Hours Usage: Know if vehicles are being used outside of work hours.\n\nThe ROI is usually immediate: most companies find 10-15% wasted drive time in the first month.' },
      { heading: 'Route Optimization + Property Intelligence', body: 'This is where fleet management and sales intelligence intersect:\n\nTraditional routing: Optimize the sequence of existing jobs to minimize drive time.\n\nIntelligent routing: When prospecting, prioritize properties that cluster near your existing service routes. LotusLeads shows you which prospects are within 5 minutes of properties you already service — adding them to an existing route costs almost nothing in crew time.\n\nThe math: A crew driving 45 minutes to a single property needs a $500 minimum to break even. The same crew adding a $200 property that\'s 3 minutes from an existing stop is nearly 100% margin.\n\nTerritory design, route optimization, and property intelligence are three sides of the same coin.' },
      { heading: 'Maintenance: Prevent the $8,000 Surprise', body: 'A broken truck costs you the repair AND the lost revenue from missed jobs. Preventive maintenance is the cheapest insurance:\n\nTrack: Miles, oil changes, tire rotations, brake inspections, fluid checks — per vehicle.\nSchedule: Set mileage-based or time-based alerts. Don\'t rely on memory.\nBudget: Allocate $0.15-$0.25/mile for maintenance reserves. A truck doing 25,000 miles/year needs $3,750-$6,250/year in maintenance budget.\nReplace: Most field service vehicles hit the cost-curve inflection point at 150,000-200,000 miles. After that, maintenance costs accelerate. Plan replacements 6 months in advance.\n\nA well-maintained 5-truck fleet with optimized routes costs less per job than a poorly managed 8-truck fleet. Efficiency beats headcount.' },
    ],
  },
];

// ============================================================================
// TEMPLATES
// ============================================================================
const HEAD_TEMPLATE = (title, desc) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#E64B8B">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- @seo -->
  <!-- @seo -->
</head>
<body class="font-[Inter] bg-white text-gray-900 antialiased">
<!-- NAV_START -->
<!-- NAV_END -->
`;

const FOOT_TEMPLATE = `
<!-- FOOTER_START -->
<!-- FOOTER_END -->
<script>
  window.addEventListener('scroll', function() {
    var nav = document.getElementById('main-nav');
    if (window.scrollY > 10) {
      nav.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-100');
    } else {
      nav.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-100');
    }
  }, { passive: true });
</script>
</body>
</html>`;

// ============================================================================
// INDUSTRY PAGE GENERATOR
// ============================================================================
function generateIndustryPage(ind) {
  const title = `${ind.name} Sales Intelligence | LotusLeads`;
  const desc = ind.description.slice(0, 160);
  const colorMap = { orange: 'orange', green: 'emerald', blue: 'blue', amber: 'amber', red: 'red', purple: 'purple', indigo: 'indigo', cyan: 'cyan', yellow: 'yellow', lime: 'lime', sky: 'sky', teal: 'teal' };
  const tw = colorMap[ind.color] || 'pink';

  return `${HEAD_TEMPLATE(title, desc)}
<main>
  <section class="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-${tw}-50 border border-${tw}-200 text-sm font-medium text-${tw}-700 mb-6">
        <span class="w-2 h-2 rounded-full bg-${tw}-500"></span>${ind.name}
      </span>
      <h1 class="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">${ind.tagline}</h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">${ind.description}</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="https://app.lotusleads.ai/auth" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl hover:shadow-xl transition-all">Start Free Trial <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></a>
        <a href="/features" class="inline-flex items-center justify-center px-8 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:shadow-md transition-all">See All Features</a>
      </div>
    </div>
  </section>

  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-5xl mx-auto">
      <p class="text-xs font-bold text-[#E64B8B] uppercase tracking-widest text-center mb-4">The Problem</p>
      <h2 class="text-2xl md:text-3xl font-black text-gray-900 text-center mb-10">Sound familiar?</h2>
      <div class="grid md:grid-cols-2 gap-6">
${ind.painPoints.map(p => `        <div class="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-6">
          <div class="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"><svg class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></div>
          <p class="text-sm text-gray-600 leading-relaxed">${p}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <p class="text-xs font-bold text-[#E64B8B] uppercase tracking-widest text-center mb-4">The Solution</p>
      <h2 class="text-2xl md:text-3xl font-black text-gray-900 text-center mb-4">LotusLeads for ${ind.name}</h2>
      <p class="text-base text-gray-500 text-center max-w-2xl mx-auto mb-12">Every feature built to help ${ind.name.toLowerCase()} companies find, analyze, and close commercial accounts faster.</p>
      <div class="grid md:grid-cols-2 gap-8">
${ind.features.map(f => `        <div class="bg-white rounded-2xl border border-gray-200 p-8">
          <div class="w-12 h-12 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100 flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-[#E64B8B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">${f.title}</h3>
          <p class="text-sm text-gray-600 leading-relaxed">${f.desc}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-y border-blue-100">
    <div class="max-w-3xl mx-auto text-center">
      <p class="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Property Managers</p>
      <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-4">Need ${ind.name.toLowerCase()} services for your property?</h2>
      <p class="text-base text-gray-500 mb-8">Get free, no-obligation quotes from top-rated commercial ${ind.name.toLowerCase()} contractors in your area. Tell us about your property — we'll match you with 2–4 vetted providers.</p>
      <a href="/request-quotes?service=${ind.slug}" class="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all">Request Free Quotes <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></a>
    </div>
  </section>

  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-5xl mx-auto">
      <p class="text-xs font-bold text-[#E64B8B] uppercase tracking-widest text-center mb-4">Available In</p>
      <h2 class="text-2xl md:text-3xl font-black text-gray-900 text-center mb-8">${ind.name} sales intelligence in every major metro</h2>
      <div class="flex flex-wrap gap-3 justify-center">
${CITIES.map(c => `        <a href="/industries/${ind.slug}/${c.slug}" class="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-colors">${c.name}, ${c.state}</a>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#E64B8B] to-[#b8326e]">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-2xl md:text-3xl font-black text-white mb-4">Ready to grow your ${ind.name.toLowerCase()} business?</h2>
      <p class="text-lg text-pink-100 mb-8">Start finding and winning commercial ${ind.name.toLowerCase()} contracts today. Free for 14 days.</p>
      <a href="https://app.lotusleads.ai/auth" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E64B8B] font-bold rounded-xl hover:shadow-xl transition-all">Start Free Trial <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></a>
    </div>
  </section>
</main>
${FOOT_TEMPLATE}`;
}

// ============================================================================
// CITY PAGE GENERATOR
// ============================================================================
function generateCityPage(ind, city) {
  const title = `${ind.name} Sales Intelligence in ${city.name}, ${city.state} | LotusLeads`;
  const desc = `Find and win commercial ${ind.name.toLowerCase()} contracts in ${city.name}. AI-powered property analysis, prospect identification, and automated outreach for ${ind.name.toLowerCase()} companies in the ${city.name} metro area.`;

  return `${HEAD_TEMPLATE(title, desc.slice(0, 160))}
<main>
  <section class="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <p class="text-xs font-bold text-[#E64B8B] uppercase tracking-widest mb-4">${ind.name} &middot; ${city.name}, ${city.state}</p>
      <h1 class="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
        ${ind.name} Sales Intelligence<br>in ${city.name}
      </h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
        Find commercial ${ind.name.toLowerCase()} opportunities across the ${city.name} metro area. LotusLeads identifies high-value properties, analyzes them from satellite imagery, and connects you with decision-makers — automatically.
      </p>
      <a href="https://app.lotusleads.ai/auth" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl hover:shadow-xl transition-all">Start Prospecting in ${city.name} <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></a>
    </div>
  </section>

  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-5xl mx-auto">
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <div class="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p class="text-3xl font-black text-gray-900 mb-1">${city.metro}</p>
          <p class="text-sm text-gray-500">Metro Population</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p class="text-3xl font-black text-[#E64B8B] mb-1">${city.region}</p>
          <p class="text-sm text-gray-500">Region</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p class="text-lg font-bold text-gray-900 mb-1 capitalize">${city.sectors}</p>
          <p class="text-sm text-gray-500">Key Commercial Sectors</p>
        </div>
      </div>

      <h2 class="text-2xl font-black text-gray-900 mb-4">Why ${city.name} for ${ind.name}?</h2>
      <p class="text-base text-gray-600 leading-relaxed mb-6">
        The ${city.name} metro area (population ${city.metro}) is a major commercial market with strong demand across ${city.sectors}. For ${ind.name.toLowerCase()} companies, this means thousands of commercial properties — office parks, retail centers, industrial facilities, medical complexes, and multi-tenant buildings — all potential customers.
      </p>
      <p class="text-base text-gray-600 leading-relaxed mb-6">
        The challenge? Finding the right properties, understanding their specific ${ind.name.toLowerCase()} needs, and reaching the decision-maker before your competitors do. That\'s exactly what LotusLeads automates.
      </p>

      <h2 class="text-2xl font-black text-gray-900 mt-12 mb-6">What LotusLeads Does for ${ind.name} Companies in ${city.name}</h2>
      <div class="grid sm:grid-cols-2 gap-6">
        <div class="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-5">
          <svg class="w-5 h-5 text-[#E64B8B] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div>
            <h3 class="text-sm font-bold text-gray-900 mb-1">Property Discovery</h3>
            <p class="text-xs text-gray-500">AI identifies commercial properties in ${city.name} that match your ideal customer profile and service capabilities.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-5">
          <svg class="w-5 h-5 text-[#E64B8B] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div>
            <h3 class="text-sm font-bold text-gray-900 mb-1">Satellite Analysis</h3>
            <p class="text-xs text-gray-500">Measure roof area, lot size, building footprint, and ${ind.name.toLowerCase()}-specific metrics from aerial imagery.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-5">
          <svg class="w-5 h-5 text-[#E64B8B] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div>
            <h3 class="text-sm font-bold text-gray-900 mb-1">Competitor Mapping</h3>
            <p class="text-xs text-gray-500">See which ${ind.name.toLowerCase()} companies serve each property in ${city.name} and where they fall short.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-5">
          <svg class="w-5 h-5 text-[#E64B8B] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div>
            <h3 class="text-sm font-bold text-gray-900 mb-1">Automated Outreach</h3>
            <p class="text-xs text-gray-500">AI-generated emails tailored to each ${city.name} property\'s specific needs and decision-maker.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-y border-blue-100">
    <div class="max-w-3xl mx-auto text-center">
      <p class="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Property Managers in ${city.name}</p>
      <h2 class="text-2xl font-black text-gray-900 mb-4">Need ${ind.name.toLowerCase()} services in ${city.name}?</h2>
      <p class="text-base text-gray-500 mb-8">Get free quotes from vetted ${ind.name.toLowerCase()} contractors serving the ${city.name} metro area. No obligation.</p>
      <a href="/request-quotes?service=${ind.slug}" class="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all">Request Free Quotes <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></a>
    </div>
  </section>

  <section class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl font-black text-gray-900 text-center mb-8">Other cities for ${ind.name}</h2>
      <div class="flex flex-wrap gap-3 justify-center">
${CITIES.filter(c => c.slug !== city.slug).map(c => `        <a href="/industries/${ind.slug}/${c.slug}" class="px-4 py-2 bg-gray-50 rounded-full border border-gray-200 text-sm text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-colors">${c.name}</a>`).join('\n')}
      </div>
      <p class="text-center mt-6"><a href="/industries/${ind.slug}" class="text-sm font-semibold text-[#E64B8B] hover:underline">&larr; Back to ${ind.name} overview</a></p>
    </div>
  </section>

  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#E64B8B] to-[#b8326e]">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-2xl md:text-3xl font-black text-white mb-4">Start winning ${ind.name.toLowerCase()} contracts in ${city.name}</h2>
      <p class="text-lg text-pink-100 mb-8">Free for 14 days. No credit card required.</p>
      <a href="https://app.lotusleads.ai/auth" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E64B8B] font-bold rounded-xl hover:shadow-xl transition-all">Start Free Trial</a>
    </div>
  </section>
</main>
${FOOT_TEMPLATE}`;
}

// ============================================================================
// BLOG ARTICLE GENERATOR
// ============================================================================
function generateBlogArticle(article) {
  const title = `${article.title} | LotusLeads Blog`;

  return `${HEAD_TEMPLATE(title, article.description.slice(0, 160))}
<main>
  <article class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-8">
        <a href="/blog" class="text-sm text-[#E64B8B] font-medium hover:underline">&larr; Back to Blog</a>
      </div>
      <div class="flex items-center gap-3 mb-6">
        <span class="px-3 py-1 bg-pink-50 text-[#E64B8B] text-xs font-semibold rounded-full">${article.category}</span>
        <span class="text-xs text-gray-400">${article.readTime} read</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">${article.title}</h1>
      <p class="text-lg text-gray-500 leading-relaxed mb-12">${article.description}</p>

${article.sections.map(s => `      <h2 class="text-xl md:text-2xl font-black text-gray-900 mt-12 mb-4">${s.heading}</h2>
${s.body.split('\n\n').map(p => `      <p class="text-base text-gray-600 leading-relaxed mb-4">${p}</p>`).join('\n')}`).join('\n\n')}

      <div class="mt-16 p-8 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 text-center">
        <h3 class="text-xl font-bold text-gray-900 mb-3">Ready to put this into practice?</h3>
        <p class="text-sm text-gray-600 mb-6">LotusLeads automates commercial property prospecting, analysis, and outreach for field service companies.</p>
        <a href="https://app.lotusleads.ai/auth" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">Start Free Trial</a>
      </div>
    </div>
  </article>
</main>
${FOOT_TEMPLATE}`;
}

// ============================================================================
// BLOG INDEX PAGE
// ============================================================================
function generateBlogIndex() {
  const title = 'Blog | LotusLeads — Field Service Sales Intelligence';
  const desc = 'Strategies, guides, and insights for field service companies selling to commercial properties. Prospecting, outreach, property analysis, and more.';

  return `${HEAD_TEMPLATE(title, desc)}
<main>
  <section class="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-3xl md:text-5xl font-black text-gray-900 mb-4">The LotusLeads Blog</h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto">Strategies, guides, and insights for field service companies selling to commercial properties.</p>
    </div>
  </section>

  <section class="pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
${BLOG_ARTICLES.map(a => `      <a href="/blog/${a.slug}" class="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
        <div class="h-2 bg-gradient-to-r from-pink-500 to-rose-600"></div>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="px-2.5 py-0.5 bg-pink-50 text-[#E64B8B] text-xs font-semibold rounded-full">${a.category}</span>
            <span class="text-xs text-gray-400">${a.readTime}</span>
          </div>
          <h2 class="text-base font-bold text-gray-900 group-hover:text-[#E64B8B] transition-colors mb-2">${a.title}</h2>
          <p class="text-sm text-gray-500 line-clamp-3">${a.description}</p>
        </div>
      </a>`).join('\n')}
    </div>
  </section>
</main>
${FOOT_TEMPLATE}`;
}

// ============================================================================
// INDUSTRIES INDEX PAGE
// ============================================================================
function generateIndustriesIndex() {
  const title = 'Industries We Serve | LotusLeads';
  const desc = 'LotusLeads provides AI-powered sales intelligence for solar, landscaping, HVAC, roofing, security, plumbing, electrical, and more field service industries.';
  const colorMap = { orange: 'orange', green: 'emerald', blue: 'blue', amber: 'amber', red: 'red', purple: 'purple', indigo: 'indigo', cyan: 'cyan', yellow: 'yellow', lime: 'lime', sky: 'sky', teal: 'teal' };

  return `${HEAD_TEMPLATE(title, desc)}
<main>
  <section class="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-3xl md:text-5xl font-black text-gray-900 mb-4">Built for Every Service Industry</h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto">One platform, adapted to your industry. Choose yours to see how LotusLeads works for your specific business.</p>
    </div>
  </section>

  <section class="pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
${INDUSTRIES.map(ind => {
  const tw = colorMap[ind.color] || 'pink';
  return `      <a href="/industries/${ind.slug}" class="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-pink-200 transition-all">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${tw}-50 border border-${tw}-200 text-xs font-medium text-${tw}-700 mb-4">
          <span class="w-2 h-2 rounded-full bg-${tw}-500"></span>${ind.name}
        </span>
        <h2 class="text-base font-bold text-gray-900 group-hover:text-[#E64B8B] transition-colors mb-2">${ind.tagline.split('.')[0]}.</h2>
        <p class="text-sm text-gray-500 line-clamp-2">${ind.description.slice(0, 120)}...</p>
      </a>`;
}).join('\n')}
    </div>
  </section>
</main>
${FOOT_TEMPLATE}`;
}

// ============================================================================
// MAIN: GENERATE ALL PAGES
// ============================================================================
function main() {
  console.log('[generate] Starting SEO page generation...');

  let count = 0;

  // Industries index
  const indDir = path.join(ROOT, 'industries');
  if (!fs.existsSync(indDir)) fs.mkdirSync(indDir, { recursive: true });
  fs.writeFileSync(path.join(indDir, 'index.html'), generateIndustriesIndex(), 'utf-8');
  count++;

  // Industry pages + city pages
  for (const ind of INDUSTRIES) {
    const industryDir = path.join(indDir, ind.slug);
    if (!fs.existsSync(industryDir)) fs.mkdirSync(industryDir, { recursive: true });

    fs.writeFileSync(path.join(industryDir, 'index.html'), generateIndustryPage(ind), 'utf-8');
    count++;

    for (const city of CITIES) {
      fs.writeFileSync(path.join(industryDir, `${city.slug}.html`), generateCityPage(ind, city), 'utf-8');
      count++;
    }
  }

  // Blog index + articles
  const blogDir = path.join(ROOT, 'blog');
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
  fs.writeFileSync(path.join(blogDir, 'index.html'), generateBlogIndex(), 'utf-8');
  count++;

  for (const article of BLOG_ARTICLES) {
    fs.writeFileSync(path.join(blogDir, `${article.slug}.html`), generateBlogArticle(article), 'utf-8');
    count++;
  }

  console.log(`[generate] Done — ${count} pages generated.`);
  console.log(`  Industries: ${INDUSTRIES.length} pages`);
  console.log(`  City pages: ${INDUSTRIES.length * CITIES.length} pages`);
  console.log(`  Blog articles: ${BLOG_ARTICLES.length} pages`);
  console.log(`  Index pages: 2 (industries, blog)`);
}

main();
