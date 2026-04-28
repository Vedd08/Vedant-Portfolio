import axios from 'axios';

const addMultipleTestViews = async () => {
  const testIPs = [
    '192.168.1.100',
    '10.0.0.55', 
    '172.16.0.200',
    '203.0.113.42',
    '198.51.100.17',
    '192.0.2.100',
    '198.51.100.200',
    '203.0.113.150'
  ];
  
  const pages = ['home', 'projects', 'about', 'contact'];
  
  console.log('Adding test views...\n');
  
  for (let i = 0; i < 20; i++) {
    const randomIP = testIPs[Math.floor(Math.random() * testIPs.length)];
    const randomPage = pages[Math.floor(Math.random() * pages.length)];
    
    try {
      await axios.post('http://localhost:5000/api/views/track', {
        page: randomPage
      }, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Test Browser)',
          'X-Forwarded-For': randomIP
        }
      });
      console.log(`✅ Added view: ${randomIP} -> ${randomPage}`);
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
    }
  }
  
  console.log('\n✅ Done adding test views!');
};

addMultipleTestViews();