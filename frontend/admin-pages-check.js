const puppeteer = require('puppeteer');
const fs = require('fs');

async function checkAdminPages() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  const adminPages = [
    '/admin/login',
    '/admin/dashboard',
    '/admin/orders',
    '/admin/products',
    '/admin/sellers',
    '/admin/users',
    '/admin/blog',
    '/admin/services',
    '/admin/reports',
    '/admin/settings',
    '/admin/approvals',
    '/admin/account',
    '/admin/bookings',
    '/admin/messages',
    '/admin/notifications',
    '/admin/reviews',
    '/admin/images',
    '/admin/homepage-reviews'
  ];

  const results = [];
  
  console.log('🧪 Checking Admin Panel Pages...\n');
  
  for (const pagePath of adminPages) {
    console.log(`Testing: ${pagePath}`);
    
    try {
      // Navigate to page
      const response = await page.goto(`http://localhost:3002${pagePath}`, { 
        waitUntil: 'networkidle0',
        timeout: 10000 
      });
      
      // Check response status
      const status = response ? response.status() : 0;
      
      // Check for errors
      const pageContent = await page.content();
      const has404 = pageContent.includes('404') || pageContent.includes('Page Not Found');
      const hasAppError = pageContent.includes('Application error');
      const hasContent = pageContent.length > 1000; // Reasonable content length
      
      // Check page title
      const title = await page.title();
      
      const result = {
        path: pagePath,
        status: status,
        title: title,
        has404: has404,
        hasAppError: hasAppError,
        hasContent: hasContent,
        success: status === 200 && !has404 && !hasAppError && hasContent
      };
      
      results.push(result);
      
      console.log(`  Status: ${status} | Title: "${title}" | Content: ${hasContent ? '✅' : '❌'} | Errors: ${has404 || hasAppError ? '❌' : '✅'}`);
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      results.push({
        path: pagePath,
        status: 0,
        title: '',
        has404: false,
        hasAppError: true,
        hasContent: false,
        success: false,
        error: error.message
      });
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  await browser.close();
  
  // Generate report
  const summary = {
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    successRate: Math.round((results.filter(r => r.success).length / results.length) * 100)
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 ADMIN PANEL STATUS REPORT');
  console.log('='.repeat(60));
  console.log(`Total Pages: ${summary.total}`);
  console.log(`Successful: ${summary.successful}`);
  console.log(`Failed: ${summary.failed}`);
  console.log(`Success Rate: ${summary.successRate}%`);
  console.log('='.repeat(60));
  
  console.log('\n✅ Working Pages:');
  results.filter(r => r.success).forEach(r => {
    console.log(`  ${r.path} - ${r.title}`);
  });
  
  console.log('\n❌ Failed Pages:');
  results.filter(r => !r.success).forEach(r => {
    const issues = [];
    if (r.status !== 200) issues.push(`HTTP ${r.status}`);
    if (r.has404) issues.push('404 Error');
    if (r.hasAppError) issues.push('App Error');
    if (!r.hasContent) issues.push('No Content');
    if (r.error) issues.push(r.error);
    
    console.log(`  ${r.path} - Issues: ${issues.join(', ')}`);
  });
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary,
    results
  };
  
  const reportPath = './test-results/admin-workflows/admin-pages-status.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  return results;
}

checkAdminPages().catch(console.error);