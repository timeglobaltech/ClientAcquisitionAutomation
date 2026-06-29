
const axios = require('axios');
const Lead = require('../models/Lead');
const Audit = require('../models/Audit');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini for real audits
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// @desc    Scrape leads based on query and send to n8n (REAL DATA ONLY)
// @route   POST /api/scraper/scrape
// @access  Private
exports.scrapeLeads = async (req, res) => {
  try {
    console.log('=== /api/scraper/scrape called ===');
    const { query, location, webhookUrl } = req.body;
    console.log('Request body:', { query, location, webhookUrl });

    // Check if SERP API key is valid
    if (!process.env.SERP_API_KEY || process.env.SERP_API_KEY.includes('your_serpapi_key')) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Valid SERP_API_KEY required for real scraping' 
      });
    }

    console.log('Scraping with SerpApi (real data)...');
    const searchQuery = `${query} in ${location || 'New York'}`;
    const serpApiUrl = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(searchQuery)}&api_key=${process.env.SERP_API_KEY}`;
    const response = await axios.get(serpApiUrl);
    
    if (!response.data.local_results || response.data.local_results.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'No results found for this query' 
      });
    }

    const scrapedLeadsData = response.data.local_results.map((result) => {
      // Calculate a simple score based on rating and reviews
      const rating = result.rating || 0;
      const reviews = result.reviews || 0;
      const score = Math.min(Math.floor((rating * 10) + (Math.log10(reviews + 1) * 10)), 100);
      
      return {
        name: result.title,
        type: result.type || 'Business',
        location: result.address || location || 'Unknown',
        phone: result.phone || 'N/A',
        email: result.email || `info@${(result.title || 'business').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        website: result.website || 'N/A',
        site: result.website || 'N/A',
        rating,
        reviews,
        score,
        status: score >= 80 ? 'Hot' : score >= 60 ? 'Warm' : 'Cold',
        revenue: 'N/A',
        employees: 'N/A',
        response: null,
        meetingBooked: false,
        followUpSent: false
      };
    });
    
    // Save leads to database with user - upsert to avoid duplicates, isInLeads: false by default
    console.log('Saving leads to database...');
    const scrapedLeads = [];
    for (const leadData of scrapedLeadsData) {
      // Upsert lead: if exists, skip; if not, create new one with isInLeads: false
      const lead = await Lead.findOneAndUpdate(
        { 
          user: req.user._id, 
          $or: [{ name: leadData.name }, { site: leadData.site }] 
        },
        {
          $setOnInsert: {
            ...leadData,
            user: req.user._id,
            isInLeads: false
          }
        },
        { new: true, upsert: true }
      );
      scrapedLeads.push(lead);
    }
    console.log('Saved leads:', scrapedLeads.length);
    console.log('First lead:', scrapedLeads[0]);

    // Send data to n8n webhook if URL is provided (from request or env)
    const n8nUrl = webhookUrl || process.env.N8N_WEBHOOK_URL;
    if (n8nUrl) {
      try {
        await axios.post(n8nUrl, {
          query,
          location,
          leads: scrapedLeads,
          timestamp: new Date().toISOString()
        });
      } catch (n8nError) {
        console.warn("Could not send to n8n - make sure n8n is running:", n8nError.message);
      }
    }

    // Prepare response with id for frontend
    const responseLeads = scrapedLeads.map(lead => ({
      ...lead.toObject(),
      id: lead._id // Add id for frontend compatibility
    }));
    
    res.status(200).json({
      status: 'success',
      message: `Leads scraped successfully from SerpApi (real data)`,
      data: { leads: responseLeads, source: 'SerpApi (real data)' }
    });
  } catch (error) {
    console.error('Scrape error:', error.response?.data || error.message);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to scrape leads: ' + (error.response?.data?.error || error.message) 
    });
  }
};

// @desc    Audit a website (REAL DATA using Gemini)
// @route   POST /api/scraper/audit
// @access  Private
exports.auditWebsite = async (req, res) => {
  try {
    const { site, leadId } = req.body;

    // Check if audit already exists
    const existingAudit = await Audit.findOne({ user: req.user._id, site, lead: leadId });
    if (existingAudit) {
      return res.status(200).json({
        status: 'success',
        message: 'Audit already exists',
        data: { audit: existingAudit, isExisting: true }
      });
    }

    const prompt = `Audit this website: ${site}

Please provide a comprehensive audit with:
- speed score (0-100)
- seo score (0-100)
- mobile score (0-100)
- security score (0-100)
- list of specific issues found
- actionable recommendations

Return the response ONLY as a valid JSON object with this exact structure:
{
  "site": "${site}",
  "speed": 0-100 number,
  "seo": 0-100 number,
  "mobile": 0-100 number,
  "security": 0-100 number,
  "issues": ["issue1", "issue2"],
  "recommendations": ["rec1", "rec2"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let auditText = response.text();
    
    // Clean up the response to get valid JSON
    auditText = auditText.replace(/```json|```/g, '').trim();
    const auditReport = JSON.parse(auditText);

    // Create new audit in database
    const newAudit = await Audit.create({
      ...auditReport,
      user: req.user._id,
      lead: leadId
    });

    res.status(200).json({
      status: 'success',
      message: 'Audit completed successfully (real data)',
      data: { audit: newAudit, isExisting: false }
    });
  } catch (error) {
    console.error('Audit error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to audit website: ' + error.message 
    });
  }
};

// @desc    Get all audits for user
// @route   GET /api/scraper/audits
// @access  Private
exports.getUserAudits = async (req, res) => {
  try {
    const audits = await Audit.find({ user: req.user._id })
      .populate('lead', 'name type location site')
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: { audits }
    });
  } catch (error) {
    console.error('Get audits error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get audits' });
  }
};

// @desc    Get single audit by ID
// @route   GET /api/scraper/audits/:id
// @access  Private
exports.getAuditById = async (req, res) => {
  try {
    const audit = await Audit.findOne({ _id: req.params.id, user: req.user._id })
      .populate('lead');
    if (!audit) {
      return res.status(404).json({ status: 'error', message: 'Audit not found' });
    }
    res.status(200).json({
      status: 'success',
      data: { audit }
    });
  } catch (error) {
    console.error('Get audit error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get audit' });
  }
};

// @desc    Get audits grouped by lead type (for folders)
// @route   GET /api/scraper/audits/grouped
// @access  Private
exports.getGroupedAudits = async (req, res) => {
  try {
    // Get all leads for user first
    const leads = await Lead.find({ user: req.user._id });
    // Group leads by type
    const grouped = leads.reduce((acc, lead) => {
      const type = lead.type || 'Other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(lead);
      return acc;
    }, {});

    res.status(200).json({
      status: 'success',
      data: { groupedLeads: grouped }
    });
  } catch (error) {
    console.error('Grouped audits error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get grouped leads' });
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
