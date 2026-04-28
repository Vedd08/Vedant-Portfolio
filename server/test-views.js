import axios from 'axios';

const addTestViews = async () => {
  const ips = [
    '192.168.1.100',
    '10.0.0.55',
    '172.16.0.200',
    '203.0.113.42',
    '198.51.100.17'
  ];
  
  for (const ip of ips) {
    try {
      await axios.post('http://localhost:5000/api/views/track', {
        page: 'home'
      }, {
        headers: {
          'X-Forwarded-For': ip
        }
      });
      console.log(`Added test view from ${ip}`);
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
  
  console.log('Done adding test views!');
};

addTestViews();