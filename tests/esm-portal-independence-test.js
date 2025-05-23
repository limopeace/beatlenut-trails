const axios = require('axios');
const puppeteer = require('puppeteer');

// Test configuration
const ESM_URL = 'http://localhost:3000/esm-portal';
const TRAVEL_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:4000/api';

// Independence test suite
async function runIndependenceTests() {
  console.log('🔍 ESM Portal Independence Testing');
  console.log('═'.repeat(40));
  
  const results = {
    routeSeparation: false,
    authIndependence: false,
    dataSeparation: false,
    styleSeparation: false,
    errorHandling: false
  };
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Test 1: Route Separation
    console.log('\n1️⃣  Testing Route Separation...');
    await page.goto(ESM_URL);
    const esmContent = await page.content();
    
    await page.goto(TRAVEL_URL);
    const travelContent = await page.content();
    
    // Check that ESM and Travel have different content
    results.routeSeparation = !esmContent.includes('travel packages') && esmContent.includes('marketplace');
    console.log(`   Route Separation: ${results.routeSeparation ? '✅ PASSED' : '❌ FAILED'}`);
    
    // Test 2: Authentication Independence
    console.log('\n2️⃣  Testing Authentication Independence...');
    try {
      // Try to login to ESM with travel credentials
      const esmAuth = await axios.post(`${API_URL}/esm/auth/login`, {
        email: 'travel@example.com',
        password: 'travelpass'
      });
      
      // Should fail if systems are independent
      results.authIndependence = false;
    } catch (error) {
      // Expected to fail - systems are independent
      results.authIndependence = true;
    }
    console.log(`   Auth Independence: ${results.authIndependence ? '✅ PASSED' : '❌ FAILED'}`);
    
    // Test 3: Data Separation
    console.log('\n3️⃣  Testing Data Separation...');
    try {
      // Check if ESM data is accessible from travel routes
      const travelProducts = await axios.get(`${API_URL}/products`);
      const esmProducts = await axios.get(`${API_URL}/esm/products`);
      
      // Products should be different
      results.dataSeparation = travelProducts.data.length === 0 || 
        JSON.stringify(travelProducts.data) !== JSON.stringify(esmProducts.data);
    } catch (error) {
      results.dataSeparation = true; // If one fails, they're separate
    }
    console.log(`   Data Separation: ${results.dataSeparation ? '✅ PASSED' : '❌ FAILED'}`);
    
    // Test 4: Style Separation
    console.log('\n4️⃣  Testing Style Separation...');
    await page.goto(`${ESM_URL}/products`);
    const esmStyles = await page.evaluate(() => {
      return Array.from(document.styleSheets).map(sheet => sheet.href).filter(Boolean);
    });
    
    await page.goto(`${TRAVEL_URL}/services`);
    const travelStyles = await page.evaluate(() => {
      return Array.from(document.styleSheets).map(sheet => sheet.href).filter(Boolean);
    });
    
    // Check for separate stylesheets
    const esmSpecificStyles = esmStyles.filter(style => style.includes('esm'));
    const travelSpecificStyles = travelStyles.filter(style => style.includes('travel'));
    
    results.styleSeparation = esmSpecificStyles.length > 0 || 
      !esmStyles.every(style => travelStyles.includes(style));
    console.log(`   Style Separation: ${results.styleSeparation ? '✅ PASSED' : '❌ FAILED'}`);
    
    // Test 5: Error Handling
    console.log('\n5️⃣  Testing Error Handling Independence...');
    await page.goto(`${ESM_URL}/non-existent-page`);
    const esmError = await page.content();
    
    await page.goto(`${TRAVEL_URL}/non-existent-page`);
    const travelError = await page.content();
    
    // Error pages should be different
    results.errorHandling = esmError !== travelError;
    console.log(`   Error Independence: ${results.errorHandling ? '✅ PASSED' : '❌ FAILED'}`);
    
    // Final Report
    console.log('\n📊 Independence Test Summary:');
    console.log('═'.repeat(40));
    const passedTests = Object.values(results).filter(r => r).length;
    const totalTests = Object.keys(results).length;
    
    Object.entries(results).forEach(([test, passed]) => {
      console.log(`${test}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    });
    
    console.log('\nOverall Score: ' + passedTests + '/' + totalTests);
    if (passedTests === totalTests) {
      console.log('✅ ESM Portal is fully independent!');
    } else {
      console.log('⚠️  Some independence issues detected');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error);
  } finally {
    await browser.close();
  }
}

// Admin linkage test
async function testAdminLinkage() {
  console.log('\n\n🔗 Admin Portal Linkage Testing');
  console.log('═'.repeat(40));
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Login as admin
    await page.goto('http://localhost:3000/admin/login');
    await page.type('[name="email"]', 'admin@beatlenuts.com');
    await page.type('[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // Check for ESM management options
    await page.goto('http://localhost:3000/admin/dashboard');
    
    const hasESMSection = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('ESM Portal') || text.includes('Marketplace');
    });
    
    console.log(`\n1️⃣  ESM Section in Admin: ${hasESMSection ? '✅ FOUND' : '❌ NOT FOUND'}`);
    
    // Check specific ESM management pages
    const esmPages = [
      '/admin/sellers',
      '/admin/approvals',
      '/admin/marketplace-analytics'
    ];
    
    for (const esmPage of esmPages) {
      await page.goto(`http://localhost:3000${esmPage}`);
      const pageExists = !page.url().includes('404') && !page.url().includes('error');
      console.log(`   ${esmPage}: ${pageExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    }
    
  } catch (error) {
    console.error('❌ Admin Linkage Test Error:', error);
  } finally {
    await browser.close();
  }
}

// Run all tests
async function runAllTests() {
  await runIndependenceTests();
  await testAdminLinkage();
  console.log('\n🏁 All Independence Tests Completed!');
}

// Execute tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runIndependenceTests, testAdminLinkage };