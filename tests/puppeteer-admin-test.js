/**
 * Puppeteer Tests for Admin Portal - Blog Posting and Content Management
 * Focused on testing admin functionality that might not be working
 */

const puppeteer = require('puppeteer');

async function runAdminTests() {
  let browser;
  let results = [];
  
  try {
    console.log('🚀 Starting Puppeteer Admin Portal Tests...');
    
    browser = await puppeteer.launch({ 
      headless: false,  // Set to true for headless mode
      slowMo: 100,     // Slow down operations for visibility
      defaultViewport: { width: 1280, height: 720 }
    });
    
    const page = await browser.newPage();
    
    // Enable request interception to handle errors
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      req.continue();
    });
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Console Error:', msg.text());
      }
    });
    
    // Test 1: Homepage Load
    console.log('📄 Testing homepage load...');
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      const title = await page.title();
      console.log('✅ Homepage loaded successfully:', title);
      results.push({ test: 'Homepage Load', status: 'PASS', details: title });
    } catch (error) {
      console.log('❌ Homepage failed to load:', error.message);
      results.push({ test: 'Homepage Load', status: 'FAIL', details: error.message });
    }
    
    // Test 2: Admin Login Page
    console.log('🔐 Testing admin login page...');
    try {
      await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2' });
      
      // Check if login form exists
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      const submitButton = await page.$('button[type="submit"]');
      
      if (emailInput && passwordInput && submitButton) {
        console.log('✅ Admin login form found');
        results.push({ test: 'Admin Login Form', status: 'PASS', details: 'Form elements present' });
        
        // Test form interaction
        await page.type('input[type="email"]', 'admin@beatlenuts.com');
        await page.type('input[type="password"]', 'admin123');
        
        // Click submit and wait for response
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }),
          page.click('button[type="submit"]')
        ]);
        
        const currentUrl = page.url();
        if (currentUrl.includes('/admin/dashboard')) {
          console.log('✅ Admin login successful - redirected to dashboard');
          results.push({ test: 'Admin Login', status: 'PASS', details: 'Successfully logged in' });
        } else if (currentUrl.includes('/admin/login')) {
          console.log('⚠️  Admin login failed - check credentials or backend');
          results.push({ test: 'Admin Login', status: 'FAIL', details: 'Login failed - invalid credentials or backend issue' });
        }
      } else {
        console.log('❌ Admin login form not found');
        results.push({ test: 'Admin Login Form', status: 'FAIL', details: 'Form elements missing' });
      }
    } catch (error) {
      console.log('❌ Admin login test failed:', error.message);
      results.push({ test: 'Admin Login', status: 'FAIL', details: error.message });
    }
    
    // Test 3: Admin Dashboard Navigation
    console.log('📊 Testing admin dashboard navigation...');
    try {
      await page.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle2' });
      
      // Check for common admin navigation elements
      const navElements = await page.$$eval('nav a, aside a, .sidebar a', links => 
        links.map(link => ({ text: link.textContent.trim(), href: link.href }))
      );
      
      if (navElements.length > 0) {
        console.log('✅ Admin navigation found:', navElements.length, 'links');
        results.push({ test: 'Admin Navigation', status: 'PASS', details: `Found ${navElements.length} navigation links` });
        
        // Test specific admin pages
        const adminPages = ['sellers', 'orders', 'approvals', 'messages'];
        for (const pageName of adminPages) {
          try {
            await page.goto(`http://localhost:3000/admin/${pageName}`, { waitUntil: 'networkidle2', timeout: 5000 });
            const pageTitle = await page.$eval('h1, h2', el => el.textContent.trim()).catch(() => 'No title found');
            console.log(`✅ Admin ${pageName} page loaded:`, pageTitle);
            results.push({ test: `Admin ${pageName} Page`, status: 'PASS', details: pageTitle });
          } catch (error) {
            console.log(`❌ Admin ${pageName} page failed:`, error.message);
            results.push({ test: `Admin ${pageName} Page`, status: 'FAIL', details: error.message });
          }
        }
      } else {
        console.log('❌ Admin navigation not found');
        results.push({ test: 'Admin Navigation', status: 'FAIL', details: 'No navigation elements found' });
      }
    } catch (error) {
      console.log('❌ Admin dashboard test failed:', error.message);
      results.push({ test: 'Admin Dashboard', status: 'FAIL', details: error.message });
    }
    
    // Test 4: Blog Management (if available)
    console.log('📝 Testing blog management functionality...');
    try {
      // Try different possible blog admin URLs
      const blogUrls = [
        'http://localhost:3000/admin/blog',
        'http://localhost:3000/admin/posts', 
        'http://localhost:3000/admin/content'
      ];
      
      let blogPageFound = false;
      for (const url of blogUrls) {
        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 5000 });
          const pageContent = await page.$eval('body', el => el.textContent).catch(() => '');
          
          if (pageContent.toLowerCase().includes('blog') || 
              pageContent.toLowerCase().includes('post') || 
              pageContent.toLowerCase().includes('article')) {
            console.log('✅ Blog management page found at:', url);
            results.push({ test: 'Blog Management Page', status: 'PASS', details: `Found at ${url}` });
            blogPageFound = true;
            break;
          }
        } catch (error) {
          // Continue to next URL
        }
      }
      
      if (!blogPageFound) {
        console.log('⚠️  Blog management page not found - may need to be created');
        results.push({ test: 'Blog Management Page', status: 'MISSING', details: 'Blog admin interface not found' });
      }
    } catch (error) {
      console.log('❌ Blog management test failed:', error.message);
      results.push({ test: 'Blog Management', status: 'FAIL', details: error.message });
    }
    
    // Test 5: ESM Portal
    console.log('🏪 Testing ESM Portal...');
    try {
      await page.goto('http://localhost:3000/esm-portal', { waitUntil: 'networkidle2' });
      
      const esmTitle = await page.$eval('h1, h2', el => el.textContent.trim()).catch(() => 'No title');
      console.log('✅ ESM Portal loaded:', esmTitle);
      results.push({ test: 'ESM Portal', status: 'PASS', details: esmTitle });
      
      // Test ESM login page
      await page.goto('http://localhost:3000/esm-portal/login', { waitUntil: 'networkidle2' });
      const loginForm = await page.$('form');
      if (loginForm) {
        console.log('✅ ESM login form found');
        results.push({ test: 'ESM Login Form', status: 'PASS', details: 'Form available' });
      } else {
        console.log('❌ ESM login form not found');
        results.push({ test: 'ESM Login Form', status: 'FAIL', details: 'Form not found' });
      }
    } catch (error) {
      console.log('❌ ESM Portal test failed:', error.message);
      results.push({ test: 'ESM Portal', status: 'FAIL', details: error.message });
    }
    
    // Test 6: API Connectivity
    console.log('🔌 Testing API connectivity...');
    try {
      const response = await page.goto('http://localhost:4000/', { waitUntil: 'networkidle2' });
      if (response.status() === 200) {
        console.log('✅ Backend API is accessible');
        results.push({ test: 'Backend API', status: 'PASS', details: 'API responding' });
      } else {
        console.log('❌ Backend API returned status:', response.status());
        results.push({ test: 'Backend API', status: 'FAIL', details: `Status: ${response.status()}` });
      }
    } catch (error) {
      console.log('❌ Backend API test failed:', error.message);
      results.push({ test: 'Backend API', status: 'FAIL', details: error.message });
    }
    
  } catch (error) {
    console.log('❌ Test suite failed:', error.message);
    results.push({ test: 'Test Suite', status: 'FAIL', details: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Print results summary
  console.log('\n📋 TEST RESULTS SUMMARY');
  console.log('========================');
  
  let passCount = 0;
  let failCount = 0;
  let missingCount = 0;
  
  results.forEach(result => {
    const status = result.status === 'PASS' ? '✅' : 
                  result.status === 'MISSING' ? '⚠️ ' : '❌';
    console.log(`${status} ${result.test}: ${result.details}`);
    
    if (result.status === 'PASS') passCount++;
    else if (result.status === 'MISSING') missingCount++;
    else failCount++;
  });
  
  console.log('\n📊 SUMMARY:');
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`⚠️  Missing: ${missingCount}`);
  console.log(`📋 Total: ${results.length}`);
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (failCount > 0 || missingCount > 0) {
    console.log('1. 🔧 Fix failed tests by checking backend connectivity');
    console.log('2. 📝 Create missing blog management interface in admin panel');
    console.log('3. 🔐 Verify admin authentication is working correctly');
    console.log('4. 🔗 Ensure all navigation links lead to functional pages');
  } else {
    console.log('✨ All tests passed! The application is functioning well.');
  }
  
  return results;
}

// Run the tests
if (require.main === module) {
  runAdminTests().catch(console.error);
}

module.exports = { runAdminTests };