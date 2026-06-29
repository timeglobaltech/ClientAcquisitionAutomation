
const axios = require('axios');
require('dotenv').config();

console.log('Testing SERP API...');
console.log('SERP_API_KEY:', process.env.SERP_API_KEY ? 'Set' : 'NOT SET');
console.log('Key length:', process.env.SERP_API_KEY?.length);

const testScrape = async () => {
  try {
    const query = 'restaurants';
    const location = 'New York';
    const searchQuery = `${query} in ${location}`;
    const serpApiUrl = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(searchQuery)}&api_key=${process.env.SERP_API_KEY}`;
    
    console.log('Calling URL:', serpApiUrl.replace(process.env.SERP_API_KEY, '[REDACTED]'));
    const response = await axios.get(serpApiUrl, { timeout: 15000 });
    console.log('Response status:', response.status);
    console.log('Data keys:', Object.keys(response.data));
    console.log('Local results found:', response.data.local_results?.length || 0);
    if (response.data.local_results && response.data.local_results.length > 0) {
      console.log('First result:', JSON.stringify(response.data.local_results[0], null, 2));
    }
  } catch (error) {
    console.error('Error testing SERP API:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('Full error:', error);
  }
};

testScrape();
