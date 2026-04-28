import axios from 'axios';

const testTracking = async () => {
  console.log('Testing view tracking...\n');
  
  // Test 1: Localhost (should be filtered)
  console.log('1. Testing localhost view (should be filtered):');
  try {
    const res1 = await axios.post('http://localhost:5000/api/views/track', {
      page: 'home'
    });
    console.log('   Response:', res1.data);
  } catch (err) {
    console.log('   Error:', err.response?.data || err.message);
  }
  
  // Test 2: Simulate real visitor
  console.log('\n2. Testing real visitor view:');
  try {
    const res2 = await axios.post('http://localhost:5000/api/views/track', {
      page: 'home'
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'X-Forwarded-For': '203.0.113.42'
      }
    });
    console.log('   Response:', res2.data);
  } catch (err) {
    console.log('   Error:', err.response?.data || err.message);
  }
  
  // Test 3: Bot user agent (should be filtered)
  console.log('\n3. Testing bot view (should be filtered):');
  try {
    const res3 = await axios.post('http://localhost:5000/api/views/track', {
      page: 'home'
    }, {
      headers: {
        'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
        'X-Forwarded-For': '66.249.66.1'
      }
    });
    console.log('   Response:', res3.data);
  } catch (err) {
    console.log('   Error:', err.response?.data || err.message);
  }
  
  console.log('\n✅ Test complete!');
};

testTracking();