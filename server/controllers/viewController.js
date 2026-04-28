import View from "../models/View.js";

// Track a page view (exclude admin)
export const trackView = async (req, res) => {
  try {
    const { page } = req.body;
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const referer = req.headers.referer || req.headers.referrer || 'direct';
    
    // Skip tracking for admin/owner
    // Method 1: Check if request has admin token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return res.status(200).json({ message: 'Admin view not tracked' });
    }
    
    // Method 2: Check localhost IP (for development)
    const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' || ip === '::ffff:127.0.0.1';
    
    // Method 3: Check for common bot user agents
    const botPatterns = /bot|crawler|spider|crawling|scraper|curl|wget|python|java|node|axios|http-client/i;
    const isBot = botPatterns.test(userAgent);
    
    // Method 4: Check for common development ports
    const isDevPort = req.headers.origin?.includes(':5173') || req.headers.origin?.includes(':5174');
    
    if (isLocalhost || isBot || isDevPort) {
      return res.status(200).json({ 
        message: 'View not tracked',
        reason: isLocalhost ? 'localhost' : isBot ? 'bot' : 'dev-port'
      });
    }
    
    // Check if this IP already viewed in last 30 minutes (session deduplication)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentView = await View.findOne({
      ip,
      page: page || 'home',
      timestamp: { $gte: thirtyMinutesAgo }
    });
    
    if (recentView) {
      return res.status(200).json({ message: 'Duplicate view within session - not tracked' });
    }
    
    // Create view record
    const view = new View({
      page: page || 'home',
      userAgent,
      ip,
      referer
    });
    
    await view.save();
    res.status(201).json({ message: 'View tracked' });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get view statistics (excluding admin views)
export const getStats = async (req, res) => {
  try {
    // Filter out localhost and bot views
    const filter = {
      ip: { 
        $nin: ['127.0.0.1', '::1', 'localhost', '::ffff:127.0.0.1'] 
      },
      userAgent: { 
        $not: /bot|crawler|spider|crawling|scraper|curl|wget|python|java|node|axios/i 
      }
    };
    
    // Total views (filtered)
    const totalViews = await View.countDocuments(filter);
    
    // Today's views
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayViews = await View.countDocuments({ 
      ...filter,
      timestamp: { $gte: today } 
    });
    
    // Yesterday's views
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);
    const yesterdayViews = await View.countDocuments({ 
      ...filter,
      timestamp: { $gte: yesterday, $lte: yesterdayEnd } 
    });
    
    // This week's views
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekViews = await View.countDocuments({ 
      ...filter,
      timestamp: { $gte: weekAgo } 
    });
    
    // This month's views
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthViews = await View.countDocuments({ 
      ...filter,
      timestamp: { $gte: monthAgo } 
    });
    
    // Daily views for the last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await View.countDocuments({
        ...filter,
        timestamp: { $gte: date, $lt: nextDate }
      });
      
      dailyStats.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: count
      });
    }
    
    // Recent views (last 10, filtered)
    const recentViews = await View.find(filter)
      .sort({ timestamp: -1 })
      .limit(10)
      .select('page timestamp ip userAgent referer');
    
    // Get unique visitors count (by IP)
    const uniqueVisitors = await View.distinct('ip', filter);
    
    // Get top pages
    const topPages = await View.aggregate([
      { $match: filter },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Get hourly stats for today
    const hourlyStats = [];
    for (let i = 0; i < 24; i++) {
      const hourStart = new Date(today);
      hourStart.setHours(i, 0, 0, 0);
      
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(i + 1, 0, 0, 0);
      
      const count = await View.countDocuments({
        ...filter,
        timestamp: { $gte: hourStart, $lt: hourEnd }
      });
      
      hourlyStats.push({
        hour: i,
        label: `${i}:00`,
        views: count
      });
    }
    
    res.json({
      totalViews,
      todayViews,
      yesterdayViews,
      weekViews,
      monthViews,
      uniqueVisitors: uniqueVisitors.length,
      dailyStats,
      hourlyStats,
      topPages,
      recentViews
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add test view (for development only)
export const addTestView = async (req, res) => {
  try {
    const testIPs = ['192.168.1.100', '10.0.0.55', '172.16.0.200', '203.0.113.42', '198.51.100.17'];
    const randomIP = testIPs[Math.floor(Math.random() * testIPs.length)];
    
    const view = new View({
      page: 'home',
      ip: randomIP,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      referer: 'https://google.com'
    });
    
    await view.save();
    res.json({ message: 'Test view added', ip: randomIP });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear all views (admin only)
export const clearViews = async (req, res) => {
  try {
    await View.deleteMany({});
    res.json({ message: 'All views cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get real-time stats (last 5 minutes)
export const getRealtimeStats = async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const filter = {
      ip: { $nin: ['127.0.0.1', '::1', 'localhost'] },
      timestamp: { $gte: fiveMinutesAgo }
    };
    
    const activeUsers = await View.distinct('ip', filter);
    const pageViews = await View.countDocuments(filter);
    
    res.json({
      activeUsers: activeUsers.length,
      pageViews,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};