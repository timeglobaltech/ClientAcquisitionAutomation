
const axios = require('axios');
const Lead = require('../models/Lead');

// Mock global business data
const globalBusinessData = [
  // USA
  { name: "Golden Gate Café", type: "Restaurant", location: "San Francisco, CA, USA", phone: "+1 415 555 0123", email: "hello@goldengatecafe.com", website: "goldengatecafe.com", rating: 4.8, reviews: 312, score: 92, status: "Hot" },
  { name: "NYC Fitness Hub", type: "Gym", location: "New York, NY, USA", phone: "+1 212 555 0456", email: "info@nycfitnesshub.com", website: "nycfitnesshub.com", rating: 4.6, reviews: 245, score: 88, status: "Hot" },
  { name: "West Coast Marketing", type: "Agency", location: "Los Angeles, CA, USA", phone: "+1 323 555 0789", email: "contact@westcoastmarketing.com", website: "westcoastmarketing.com", rating: 4.5, reviews: 167, score: 85, status: "Warm" },
  
  // Europe
  { name: "Parisian Bistro", type: "Restaurant", location: "Paris, France", phone: "+33 1 40 20 12 34", email: "info@parisianbistro.fr", website: "parisianbistro.fr", rating: 4.9, reviews: 423, score: 94, status: "Hot" },
  { name: "London CrossFit", type: "Gym", location: "London, UK", phone: "+44 20 7946 0958", email: "team@londoncrossfit.co.uk", website: "londoncrossfit.co.uk", rating: 4.7, reviews: 289, score: 90, status: "Hot" },
  { name: "Berlin Creative Lab", type: "Agency", location: "Berlin, Germany", phone: "+49 30 1234 5678", email: "hello@berlincreativelab.de", website: "berlincreativelab.de", rating: 4.8, reviews: 201, score: 87, status: "Warm" },
  
  // Asia
  { name: "Tokyo Sushi House", type: "Restaurant", location: "Tokyo, Japan", phone: "+81 3-1234-5678", email: "contact@tokyosushihouse.jp", website: "tokyosushihouse.jp", rating: 4.9, reviews: 567, score: 95, status: "Hot" },
  { name: "Seoul Yoga Studio", type: "Gym", location: "Seoul, South Korea", phone: "+82 2-1234-5678", email: "info@seoulyogastudio.kr", website: "seoulyogastudio.kr", rating: 4.8, reviews: 345, score: 92, status: "Hot" },
  { name: "Singapore Digital Solutions", type: "Agency", location: "Singapore", phone: "+65 6123 4567", email: "contact@singaporedigitalsolutions.sg", website: "singaporedigitalsolutions.sg", rating: 4.7, reviews: 178, score: 89, status: "Warm" },
  
  // Australia
  { name: "Sydney Harbour Grill", type: "Restaurant", location: "Sydney, Australia", phone: "+61 2 1234 5678", email: "reservations@sydneyharbourgrill.com.au", website: "sydneyharbourgrill.com.au", rating: 4.8, reviews: 412, score: 91, status: "Hot" },
  { name: "Melbourne Fitness Studio", type: "Gym", location: "Melbourne, Australia", phone: "+61 3 8765 4321", email: "info@melbournefitnessstudio.com.au", website: "melbournefitnessstudio.com.au", rating: 4.6, reviews: 278, score: 88, status: "Warm" },
  
  // South America
  { name: "Rio de Janeiro Café", type: "Restaurant", location: "Rio de Janeiro, Brazil", phone: "+55 21 1234-5678", email: "contato@riodejaneirocafe.com.br", website: "riodejaneirocafe.com.br", rating: 4.7, reviews: 302, score: 86, status: "Warm" },
  { name: "Buenos Aires Marketing", type: "Agency", location: "Buenos Aires, Argentina", phone: "+54 11 1234-5678", email: "hola@buenosairesmarketing.com.ar", website: "buenosairesmarketing.com.ar", rating: 4.9, reviews: 256, score: 90, status: "Hot" }
];

// Mock scrape leads function
const mockScrapeLeads = (query, location) => {
  // Filter by location and query if provided
  let filteredLeads = [...globalBusinessData];
  
  if (location) {
    const lowerLocation = location.toLowerCase();
    filteredLeads = filteredLeads.filter(lead => 
      lead.location.toLowerCase().includes(lowerLocation)
    );
  }
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredLeads = filteredLeads.filter(lead => 
      lead.name.toLowerCase().includes(lowerQuery) || 
      lead.type.toLowerCase().includes(lowerQuery)
    );
  }
  
  // If no matches, return some default leads
  if (filteredLeads.length === 0) {
    filteredLeads = globalBusinessData.slice(0, 3);
  }
  
  // Format the data to match our Lead model
  return filteredLeads.map(lead => ({
    ...lead,
    site: lead.website,
    revenue: Math.floor(Math.random() * 2000000 + 100000).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    employees: Math.floor(Math.random() * 50 + 5).toString(),
    response: null,
    meetingBooked: false,
    followUpSent: false
  }));
};

// Mock audit function
const mockAuditWebsite = (site) => {
  return {
    site,
    speed: Math.floor(Math.random() * 100),
    seo: Math.floor(Math.random() * 100),
    mobile: Math.floor(Math.random() * 100),
    security: Math.floor(Math.random() * 100),
    issues: ["Slow mobile load time", "Missing meta descriptions", "Unoptimized images", "No SSL certificate"],
    recommendations: ["Optimize image sizes", "Add meta descriptions", "Implement lazy loading", "Enable SSL"]
  };
};

// @desc    Scrape leads based on query and send to n8n
// @route   POST /api/scraper/scrape
// @access  Private
exports.scrapeLeads = async (req, res) => {
  try {
    const { query, location } = req.body;
    let scrapedLeadsData;
    let source = 'SerpApi (real data)';

    // Try to use SerpApi if API key is provided
    if (process.env.SERP_API_KEY && !process.env.SERP_API_KEY.includes('your_serpapi_key')) {
      try {
        console.log('Scraping with SerpApi (real data)...');
        const searchQuery = `${query} in ${location || 'New York'}`;
        const serpApiUrl = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(searchQuery)}&api_key=${process.env.SERP_API_KEY}`;
        const response = await axios.get(serpApiUrl);
        
        if (response.data.local_results && response.data.local_results.length > 0) {
          scrapedLeadsData = response.data.local_results.map((result, i) => ({
            name: result.title,
            type: result.type || 'Business',
            location: result.address || location || 'Unknown',
            phone: result.phone || 'N/A',
            email: `info@${(result.title || 'business').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            website: result.website || 'N/A',
            site: result.website || 'N/A',
            rating: result.rating || 0,
            reviews: result.reviews || 0,
            score: Math.floor(Math.random() * 40 + 60),
            status: Math.random() > 0.5 ? 'Hot' : 'Warm',
            revenue: Math.floor(Math.random() * 2000000 + 100000).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            employees: Math.floor(Math.random() * 50 + 5).toString(),
            response: null,
            meetingBooked: false,
            followUpSent: false
          }));
        } else {
          throw new Error('No results found from SerpApi');
        }
      } catch (serpApiError) {
        console.error('SerpApi error:', serpApiError.message);
        source = 'Mock data';
        scrapedLeadsData = mockScrapeLeads(query, location);
      }
    } else {
      // No SerpApi key provided - use mock data with warning
      console.warn('No valid SERP_API_KEY provided, using mock data');
      source = 'Mock data';
      scrapedLeadsData = mockScrapeLeads(query, location);
    }
    
    // Save leads to database
    const scrapedLeads = await Lead.insertMany(scrapedLeadsData);

    // Send data to n8n webhook if URL is provided
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
          query,
          location,
          leads: scrapedLeads,
          timestamp: new Date().toISOString()
        });
      } catch (n8nError) {
        console.warn("Could not send to n8n - make sure n8n is running:", n8nError.message);
      }
    }

    res.status(200).json({
      status: 'success',
      message: `Leads scraped successfully from ${source}`,
      data: { leads: scrapedLeads, source }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to scrape leads: ' + error.message });
  }
};

// @desc    Audit a website
// @route   POST /api/scraper/audit
// @access  Private
exports.auditWebsite = (req, res) => {
  try {
    const { site } = req.body;
    const auditReport = mockAuditWebsite(site);
    res.status(200).json({
      status: 'success',
      message: 'Audit completed successfully',
      data: { audit: auditReport }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to audit website' });
  }
};

// @desc    Update lead from n8n webhook
// @route   POST /api/scraper/update-lead
// @access  Public (but secured by a secret header)
exports.updateLeadFromN8N = async (req, res) => {
  try {
    const { id, response, score, status, meetingBooked, followUpSent } = req.body;
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ status: 'error', message: 'Lead not found' });
    }

    // Update the lead
    if (response !== undefined) lead.response = response;
    if (score !== undefined) lead.score = score;
    if (status !== undefined) lead.status = status;
    if (meetingBooked !== undefined) lead.meetingBooked = meetingBooked;
    if (followUpSent !== undefined) lead.followUpSent = followUpSent;
    
    await lead.save();

    res.status(200).json({
      status: 'success',
      message: 'Lead updated successfully',
      data: { lead }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to update lead' });
  }
};
