const puppeteer = require('puppeteer');

async function testAdminPages() {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();
  
  console.log('🚀 Starting manual admin panel testing...\n');
  
  try {
    // Test 1: Login page
    console.log('1. Testing login page...');
    await page.goto('http://localhost:3002/admin/login', { waitUntil: 'networkidle0' });
    
    const loginTitle = await page.title();
    console.log(`   Page title: ${loginTitle}`);
    
    const hasLoginForm = await page.$('form') !== null;
    console.log(`   Has login form: ${hasLoginForm ? '✅' : '❌'}`);
    
    // Test login with demo credentials
    if (hasLoginForm) {
      console.log('   Testing demo login...');
      await page.type('input[type="email"]', 'admin@beatlenut.com');
      await page.type('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      
      // Wait for redirect
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
      
      const currentUrl = page.url();
      console.log(`   Redirected to: ${currentUrl}`);
      
      if (currentUrl.includes('/admin/dashboard')) {
        console.log('   ✅ Login successful');
        
        // Test 2: Dashboard
        console.log('\n2. Testing dashboard...');
        const dashboardTitle = await page.title();
        console.log(`   Page title: ${dashboardTitle}`);
        
        const hasStats = await page.$('.text-3xl, .text-2xl') !== null;
        console.log(`   Has statistics: ${hasStats ? '✅' : '❌'}`);
        
        const hasCharts = await page.$('canvas') !== null;
        console.log(`   Has charts: ${hasCharts ? '✅' : '❌'}`);
        
        // Test 3: Navigation to other pages
        console.log('\n3. Testing navigation...');
        const navLinks = await page.$$('nav a, .sidebar a, [href^="/admin/"]');
        console.log(`   Found ${navLinks.length} navigation links`);
        
        // Test each main admin page
        const pagesToTest = [
          '/admin/orders',
          '/admin/products', 
          '/admin/sellers',
          '/admin/users',
          '/admin/blog'
        ];
        
        for (const pagePath of pagesToTest) {
          console.log(`\n4. Testing ${pagePath}...`);
          try {
            await page.goto(`http://localhost:3002${pagePath}`, { waitUntil: 'networkidle0', timeout: 10000 });
            
            const pageTitle = await page.title();
            console.log(`   Page title: ${pageTitle}`);
            
            const hasTable = await page.$('table') !== null;
            const hasCards = await page.$('.card, .bg-white') !== null;
            const hasContent = await page.$('main, .content') !== null;
            
            console.log(`   Has table: ${hasTable ? '✅' : '❌'}`);
            console.log(`   Has cards: ${hasCards ? '✅' : '❌'}`);
            console.log(`   Has content: ${hasContent ? '✅' : '❌'}`);
            
            // Check for errors
            const hasError = await page.$('.error, .alert-error, [class*="error"]') !== null;
            const has404 = await page.evaluate(() => document.body.innerText.includes('404'));
            const hasAppError = await page.evaluate(() => document.body.innerText.includes('Application error'));
            
            if (hasError || has404 || hasAppError) {
              console.log(`   ❌ Page has errors: Error=${hasError}, 404=${has404}, AppError=${hasAppError}`);
            } else {
              console.log(`   ✅ Page loads without errors`);
            }
            
          } catch (error) {
            console.log(`   ❌ Error loading page: ${error.message}`);
          }
        }
        
      } else {
        console.log('   ❌ Login failed - not redirected to dashboard');
      }
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
  
  console.log('\n🎯 Manual testing complete. Check console for details.');
  console.log('👀 Browser will stay open for manual inspection...');
  
  // Keep browser open for manual inspection
  await new Promise(resolve => {
    console.log('Press Ctrl+C to close the browser and exit.');
  });
}

testAdminPages().catch(console.error);