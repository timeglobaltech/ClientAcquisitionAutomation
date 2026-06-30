
import {
  Users, TrendingUp, Mail, Calendar, Target, Brain, BarChart2, Settings,
  Search, Bell, ChevronRight, Star, Zap, Shield, Globe, DollarSign,
  ArrowRight, Play, Check, X, Menu, Bot, FileText, Send, Clock, Eye,
  Download, Plus, Filter, RefreshCw, MessageSquare, Activity,
  Database, Lock, Rocket, LogOut, ExternalLink, MoreVertical,
  Edit, Trash2, Phone, ChevronDown, CheckCircle, AlertCircle,
  Building2, Coffee, Dumbbell, ShoppingBag, MapPin, TrendingDown,
  LayoutDashboard, ChevronUp, User, CreditCard, Sparkles,
  Home, Layers, Columns3, MonitorSmartphone, Wifi, ChevronLeft,
  MousePointer, Gauge, Cpu, Hash, Scissors
} from "lucide-react";

export const LEADS = [
  { id: 1, name: "Marco's Italian Kitchen", type: "Restaurant", site: "marcoskitchen.com", score: 94, status: "Hot", location: "New York, NY", phone: "+1 212 555 0142", email: "marco@marcoskitchen.com", revenue: "$1.2M", employees: "25", response: null, meetingBooked: false, followUpSent: false },
  { id: 2, name: "FitZone Gym", type: "Gym", site: "fitzonegym.io", score: 87, status: "Hot", location: "Austin, TX", phone: "+1 512 555 0198", email: "info@fitzonegym.io", revenue: "$480K", employees: "12", response: null, meetingBooked: false, followUpSent: false },
  { id: 3, name: "Apex Digital Agency", type: "Agency", site: "apexdigital.co", score: 76, status: "Warm", location: "Chicago, IL", phone: "+1 312 555 0074", email: "hello@apexdigital.co", revenue: "$2.1M", employees: "18", response: null, meetingBooked: false, followUpSent: false },
  { id: 4, name: "The Cozy Coffee Roasters", type: "Coffee Shop", site: "cozycoffee.com", score: 82, status: "Hot", location: "Portland, OR", phone: "+1 503 555 0211", email: "brew@cozycoffee.com", revenue: "$340K", employees: "8", response: null, meetingBooked: false, followUpSent: false },
  { id: 5, name: "StyleHaus Boutique", type: "Retail", site: "stylehaus.shop", score: 61, status: "Warm", location: "Miami, FL", phone: "+1 305 555 0167", email: "style@stylehaus.shop", revenue: "$890K", employees: "15", response: null, meetingBooked: false, followUpSent: false },
  { id: 6, name: "BlueSky Plumbing Co", type: "Service", site: "blueskyplumbing.net", score: 45, status: "Cold", location: "Phoenix, AZ", phone: "+1 602 555 0033", email: "service@blueskyplumbing.net", revenue: "$620K", employees: "22", response: null, meetingBooked: false, followUpSent: false },
  { id: 7, name: "Radiance Med Spa", type: "Beauty", site: "radiancemedspa.com", score: 91, status: "Hot", location: "Los Angeles, CA", phone: "+1 310 555 0289", email: "hello@radiancemedspa.com", revenue: "$1.8M", employees: "30", response: null, meetingBooked: false, followUpSent: false },
  { id: 8, name: "GreenThumb Landscaping", type: "Service", site: "greenthumb.io", score: 55, status: "Cold", location: "Denver, CO", phone: "+1 720 555 0154", email: "grow@greenthumb.io", revenue: "$290K", employees: "10", response: null, meetingBooked: false, followUpSent: false },
];

export const NEW_LEADS = [
  { id: 9, name: "Peak Performance CrossFit", type: "Gym", site: "peakcrossfit.com", score: 88, status: "Hot", location: "Seattle, WA", phone: "+1 206 555 0301", email: "coach@peakcrossfit.com", revenue: "$560K", employees: "14" },
  { id: 10, name: "Luminary Creative Studio", type: "Agency", site: "luminarystudio.co", score: 79, status: "Warm", location: "Nashville, TN", phone: "+1 615 555 0412", email: "create@luminarystudio.co", revenue: "$1.4M", employees: "21" },
  { id: 11, name: "Harvest Moon Bistro", type: "Restaurant", site: "harvestmoon.cafe", score: 85, status: "Hot", location: "Boston, MA", phone: "+1 617 555 0523", email: "reservations@harvestmoon.cafe", revenue: "$760K", employees: "18" },
];

export const KANBAN_STAGES = [
  { id: "new", label: "New Lead", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", count: 8 },
  { id: "qualified", label: "Qualified", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", count: 5 },
  { id: "audit", label: "Audit Sent", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", count: 4 },
  { id: "meeting", label: "Meeting Set", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30", count: 3 },
  { id: "proposal", label: "Proposal", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", count: 2 },
  { id: "won", label: "Won", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", count: 7 },
];

export const KANBAN_CARDS = {
  new: [
    { name: "Marco's Italian", value: "$1,200/mo" },
    { name: "FitZone Gym", value: "$800/mo" },
    { name: "Radiance Spa", value: "$1,500/mo" },
  ],
  qualified: [
    { name: "Apex Agency", value: "$2,100/mo" },
    { name: "StyleHaus", value: "$890/mo" },
  ],
  audit: [
    { name: "Cozy Coffee", value: "$340/mo" },
    { name: "BlueSky Plumbing", value: "$620/mo" },
  ],
  meeting: [
    { name: "GreenThumb", value: "$290/mo" },
    { name: "Peak CrossFit", value: "$560/mo" },
  ],
  proposal: [
    { name: "Luminary Studio", value: "$1,400/mo" },
  ],
  won: [
    { name: "Harvest Moon", value: "$760/mo" },
    { name: "Summit Dental", value: "$940/mo" },
  ],
};

export const REVENUE_DATA = [
  { month: "Jan", revenue: 12400, leads: 34 },
  { month: "Feb", revenue: 18200, leads: 42 },
  { month: "Mar", revenue: 15800, leads: 38 },
  { month: "Apr", revenue: 24600, leads: 57 },
  { month: "May", revenue: 31200, leads: 68 },
  { month: "Jun", revenue: 28900, leads: 62 },
  { month: "Jul", revenue: 38400, leads: 81 },
  { month: "Aug", revenue: 42100, leads: 94 },
];

export const OPEN_RATE_DATA = [
  { day: "Mon", rate: 38 }, { day: "Tue", rate: 52 }, { day: "Wed", rate: 47 },
  { day: "Thu", rate: 61 }, { day: "Fri", rate: 43 }, { day: "Sat", rate: 29 }, { day: "Sun", rate: 22 },
];

export const CHAT_MESSAGES_INIT = [
  { role: "ai", text: "👋 Hey! I'm your AI Sales Copilot. I've analyzed your pipeline and have some hot insights ready. What would you like to know?" },
  { role: "user", text: "What leads should I prioritize today?" },
  { role: "ai", text: "🔥 Top 3 to contact NOW:\n\n1. **Marco's Italian Kitchen** (Score: 94) — Website is loading 6.8s on mobile. Lead is primed for a speed audit pitch.\n2. **Radiance Med Spa** (Score: 91) — No Google Business posts in 47 days. Social media gap is a strong angle.\n3. **FitZone Gym** (Score: 87) — Their competitor just ran a Google Ads campaign. Good urgency hook.\n\nWant me to draft personalized emails for all three?" },
];

export const AI_RESPONSES = [
  "Based on their website analytics, I'd recommend leading with their mobile performance gap — 7.2s load time on 4G. That's a 68% bounce rate trigger. Here's a suggested opener:\n\n*'Hi [Name], I noticed your site is losing visitors on mobile...'*",
  "🎯 **Predicted close probability: 73%**\n\nKey buying signals detected:\n• Checked your booking link 3x\n• Opened follow-up email within 2 minutes\n• Their competitor just launched a new website\n\nRecommended next step: Send the ROI calculator now.",
  "I've analyzed 47 similar businesses in their niche. The #1 objection you'll face is *'We already have a marketing person.'*\n\nCounter with: *'That's great — our system works alongside your team to handle the repetitive outreach so they can focus on strategy.'*",
  "📊 **This week's pipeline health:**\n• 8 leads in 'New' — 3 are 48h old (follow up!)\n• Marco's Italian opened your email 4x — they're interested!\n• 2 meetings scheduled this week\n• Estimated close value: $4,200/mo",
];

export const PIPELINE_STEPS = [
  { icon: Search, label: "Find Leads", desc: "AI scrapes Google Maps, LinkedIn & directories for businesses matching your ideal customer profile.", color: "from-blue-500 to-blue-600" },
  { icon: Target, label: "Qualify Leads", desc: "ML scoring engine grades each lead 0–100 based on 40+ signals: site quality, social activity, reviews, ad spend.", color: "from-purple-500 to-purple-600" },
  { icon: Globe, label: "Website Audit", desc: "Automated audit generates a custom 12-point report: speed, SEO, mobile, security, and competitors.", color: "from-violet-500 to-purple-600" },
  { icon: Mail, label: "Personalized Outreach", desc: "GPT-4 writes hyper-personalized cold emails using audit data, industry context, and lead intel.", color: "from-pink-500 to-rose-600" },
  { icon: RefreshCw, label: "Follow-Up Sequences", desc: "5-touch automated sequences: email, LinkedIn, SMS — spaced perfectly for maximum reply rates.", color: "from-orange-500 to-red-600" },
  { icon: Calendar, label: "Auto Booking", desc: "AI assistant handles replies, answers objections, and books qualified meetings directly to your calendar.", color: "from-cyan-500 to-blue-600" },
  { icon: Users, label: "CRM Pipeline", desc: "Every interaction tracked. Leads move through your custom pipeline with deal values and probability scores.", color: "from-teal-500 to-cyan-600" },
  { icon: Brain, label: "AI Copilot", desc: "Real-time suggestions, reply drafts, objection handling scripts, and close probability predictions.", color: "from-indigo-500 to-purple-600" },
];

export const FEATURES = [
  { icon: Bot, title: "AI Lead Discovery", desc: "Finds 200+ qualified local businesses per day automatically" },
  { icon: Gauge, title: "Smart Scoring", desc: "40-signal AI model ranks leads by close probability" },
  { icon: FileText, title: "Auto Audit Reports", desc: "12-point website audit PDF sent to every prospect" },
  { icon: Mail, title: "Personalized Outreach", desc: "GPT-4 emails tailored to each lead's specific pain points" },
  { icon: Calendar, title: "Seamless Booking", desc: "AI books meetings on your calendar without lifting a finger" },
  { icon: Users, title: "Visual CRM Pipeline", desc: "Kanban board tracking every deal from lead to close" },
  { icon: Brain, title: "AI Sales Copilot", desc: "Real-time coaching, reply drafts & objection handling" },
  { icon: BarChart2, title: "Revenue Analytics", desc: "Full-funnel insights: open rates, reply rates, close rates" },
  { icon: Shield, title: "Anti-Spam Technology", desc: "Domain warming, inbox rotation, deliverability protection" },
];

export const PRICING_TIERS = [
  {
    name: "Starter", price: 97, color: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/30",
    badge: null, features: [
      "Up to 100 leads/month", "AI website audits", "Email outreach (500/mo)", "Basic CRM pipeline",
      "1 email inbox", "Email support", "Analytics dashboard"
    ]
  },
  {
    name: "Growth", price: 247, color: "from-purple-500/20 to-violet-600/20", border: "border-purple-500/50",
    badge: "Most Popular", features: [
      "Up to 500 leads/month", "AI audits + PDF reports", "Multi-channel outreach", "Full CRM + Kanban",
      "5 email inboxes", "AI Copilot (unlimited)", "Calendar booking", "Priority support", "White-label reports"
    ]
  },
  {
    name: "Enterprise", price: 497, color: "from-cyan-500/20 to-teal-600/20", border: "border-cyan-500/30",
    badge: null, features: [
      "Unlimited leads", "Everything in Growth", "Custom AI training", "API access",
      "Dedicated account manager", "Custom integrations", "SLA guarantee", "Team seats (unlimited)", "Done-for-you setup"
    ]
  },
];

export const TECH_STACK = [
  { name: "GPT-4 Turbo", category: "AI Engine", icon: Brain, color: "text-purple-400" },
  { name: "Google Maps API", category: "Lead Source", icon: MapPin, color: "text-green-400" },
  { name: "LinkedIn Scraper", category: "Lead Source", icon: Users, color: "text-blue-400" },
  { name: "SendGrid", category: "Email Delivery", icon: Mail, color: "text-cyan-400" },
  { name: "Twilio", category: "SMS & Voice", icon: Phone, color: "text-red-400" },
  { name: "Stripe", category: "Payments", icon: CreditCard, color: "text-yellow-400" },
  { name: "Google Calendar", category: "Booking", icon: Calendar, color: "text-orange-400" },
  { name: "PostgreSQL", category: "Database", icon: Database, color: "text-teal-400" },
];

export const NAV_ITEMS = [
  { id: "main", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Users },
  { id: "scraper", label: "Scraper", icon: Search },
  { id: "audit", label: "Audits", icon: FileText },
  { id: "outreach", label: "Outreach", icon: Mail },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "copilot", label: "AI Copilot", icon: Bot },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];
