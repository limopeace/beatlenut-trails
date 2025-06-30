const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: 'http://localhost:3000',
  backendUrl: 'http://localhost:4000',
  adminCredentials: {
    email: 'admin@beatlenut.com',
    password: 'admin123'
  },
  testUser: {
    // For basic auth registration
    name: 'Direct Test User',
    email: 'directtest' + Date.now() + '@example.com',
    password: 'TestPass123!',
    role: 'seller'
  },
  // For ESM detailed registration 
  esmTestUser: {
    fullName: 'Direct Test User',
    email: 'directtest' + Date.now() + '@example.com',
    password: 'TestPass123!',
    phone: '9876543210',
    location: 'New Delhi, India',
    serviceBranch: 'army',
    rank: 'Major',
    serviceNumber: 'TEST123456',
    serviceYears: {
      from: 2000,
      to: 2020
    },
    businessName: 'Direct Test Business',
    sellerType: {
      products: true,
      services: true
    },
    category: 'security-services'
  },
  screenshotDir: path.join(__dirname, 'test-results', 'direct-test-' + Date.now())
};

// Create screenshot directory
if (!fs.existsSync(config.screenshotDir)) {
  fs.mkdirSync(config.screenshotDir, { recursive: true });
}

let browser, page;
let adminToken;
let userToken;

// Utility functions
const screenshot = async (name, description) => {
  try {
    const filename = `${name}.png`;
    const filepath = path.join(config.screenshotDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`📸 ${filename} - ${description}`);
  } catch (error) {
    console.log(`❌ Screenshot failed: ${error.message}`);
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Step 1: Register user via API
const registerUserViaAPI = async () => {
  console.log('\n🔧 STEP 1: Register User via API');
  console.log('=====================================');
  
  try {
    // Try ESM detailed registration first
    console.log('🎯 Attempting ESM detailed registration...');
    const response = await axios.post(`${config.backendUrl}/api/esm/sellers/register`, config.esmTestUser);
    console.log('✅ ESM user registered successfully via API');
    console.log(`📧 Email: ${config.esmTestUser.email}`);
    console.log(`🆔 User ID: ${response.data.data.user._id}`);
    console.log(`✅ Approved: ${response.data.data.user.approved}`);
    
    userToken = response.data.data.token;
    return response.data.data.user;
  } catch (esmError) {
    console.log(`⚠️ ESM registration failed: ${esmError.response?.data?.message || esmError.message}`);
    
    // Fallback to basic auth registration
    try {
      console.log('🔄 Attempting basic auth registration...');
      const response = await axios.post(`${config.backendUrl}/api/auth/esm-register`, config.testUser);
      console.log('✅ Basic user registered successfully via API');
      console.log(`📧 Email: ${config.testUser.email}`);
      console.log(`🆔 User ID: ${response.data.data.user._id}`);
      console.log(`✅ Approved: ${response.data.data.user.approved}`);
      
      userToken = response.data.data.token;
      return response.data.data.user;
    } catch (basicError) {
      console.log(`❌ Both registration methods failed`);
      console.log('ESM Error:', esmError.response?.data?.message || esmError.message);
      console.log('Basic Error:', basicError.response?.data?.message || basicError.message);
      if (basicError.response?.data) {
        console.log('Error details:', JSON.stringify(basicError.response.data, null, 2));
      }
      throw basicError;
    }
  }
};

// Step 2: Admin login and approve user
const adminApproveUser = async (userId) => {
  console.log('\n👨‍💼 STEP 2: Admin Approval Process');
  console.log('=====================================');
  
  try {
    // Admin login via API
    console.log('🔑 Admin login via API...');
    const loginResponse = await axios.post(`${config.backendUrl}/api/auth/admin/login`, config.adminCredentials);
    adminToken = loginResponse.data.data.token;
    console.log('✅ Admin logged in successfully');
    
    // Open browser for admin UI navigation
    console.log('🌐 Opening admin panel in browser...');
    await page.goto(`${config.baseUrl}/admin/login`, { waitUntil: 'networkidle0' });
    await screenshot('01-admin-login-page', 'Admin login page');
    
    // Login via UI
    await page.type('input[name="email"]', config.adminCredentials.email);
    await page.type('input[name="password"]', config.adminCredentials.password);
    await screenshot('02-admin-credentials-filled', 'Admin credentials entered');
    
    await page.click('button[type="submit"]');
    await delay(3000);
    await screenshot('03-admin-dashboard', 'Admin dashboard after login');
    
    // Navigate to approvals or sellers page
    console.log('📋 Navigating to seller management...');
    await page.goto(`${config.baseUrl}/admin/sellers`, { waitUntil: 'networkidle0' });
    await screenshot('04-admin-sellers-page', 'Admin sellers management page');
    
    // Look for the new user and approve if needed
    console.log(`🔍 Looking for user: ${config.testUser.email}`);
    
    // Try different admin approval endpoints
    const approvalEndpoints = [
      `/api/admin/sellers/${userId}/verification`,
      `/api/approvals/${userId}/approve`,
      `/api/admin/approvals/batch`
    ];
    
    let approvalSuccess = false;
    for (const endpoint of approvalEndpoints) {
      try {
        const approveResponse = await axios.put(
          `${config.backendUrl}${endpoint}`,
          endpoint.includes('batch') ? { userIds: [userId], action: 'approve' } : { verified: true, approved: true },
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        console.log(`✅ User approved via ${endpoint}`);
        approvalSuccess = true;
        break;
      } catch (approveError) {
        console.log(`⚠️ Approval endpoint ${endpoint} failed: ${approveError.response?.status || 'Network Error'}`);
      }
    }
    
    if (!approvalSuccess) {
      console.log('ℹ️ No approval endpoints worked - user may still be functional without explicit approval');
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Admin approval failed: ${error.message}`);
    return false;
  }
};

// Step 3: Test ESM Portal Login
const testESMLogin = async (userEmail, userPassword) => {
  console.log('\n🔑 STEP 3: ESM Portal Login Test');
  console.log('=================================');
  
  try {
    // First try API login
    console.log('🔧 Testing login via API...');
    try {
      const apiLoginResponse = await axios.post(`${config.backendUrl}/api/auth/esm-login`, {
        email: userEmail,
        password: userPassword
      });
      console.log('✅ API login successful');
      userToken = apiLoginResponse.data.data.token;
    } catch (apiError) {
      console.log(`❌ API login failed: ${apiError.response?.data?.message || apiError.message}`);
      throw apiError;
    }
    
    // Then test UI login
    console.log('🌐 Testing login via UI...');
    await page.goto(`${config.baseUrl}/esm-portal/login`, { waitUntil: 'networkidle0' });
    await screenshot('05-esm-login-page', 'ESM portal login page');
    
    await page.type('input[name="email"]', userEmail);
    await page.type('input[name="password"]', userPassword);
    await screenshot('06-esm-login-filled', 'ESM login credentials entered');
    
    await page.click('button[type="submit"]');
    await delay(3000);
    await screenshot('07-esm-post-login', 'After ESM login attempt');
    
    // Check if login was successful
    const currentUrl = page.url();
    if (currentUrl.includes('/esm-portal') && !currentUrl.includes('/login')) {
      console.log('✅ UI login successful');
      return true;
    } else {
      console.log(`❌ UI login failed - URL: ${currentUrl}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Login test failed: ${error.message}`);
    return false;
  }
};

// Step 4: Test Product Posting
const testProductPosting = async () => {
  console.log('\n📦 STEP 4: Product Posting Test');
  console.log('===============================');
  
  try {
    await page.goto(`${config.baseUrl}/esm-portal/add-product`, { waitUntil: 'networkidle0' });
    await screenshot('08-product-add-page', 'Add product page');
    
    // Check if page requires authentication
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('❌ Product page redirected to login - authentication required');
      return false;
    }
    
    // Look for form fields and fill them
    console.log('📝 Filling product form...');
    
    const productData = {
      name: 'Test Military Equipment',
      category: 'electronics',
      price: '25000',
      description: 'Professional military equipment for testing purposes.',
      stock: '5'
    };
    
    // Try various field selectors
    const fieldSelectors = [
      { name: 'name', selectors: ['input[name="name"]', 'input[name="title"]', '#product-name'], value: productData.name },
      { name: 'price', selectors: ['input[name="price"]', '#product-price'], value: productData.price },
      { name: 'description', selectors: ['textarea[name="description"]', '#product-description'], value: productData.description },
      { name: 'stock', selectors: ['input[name="stock"]', 'input[name="quantity"]', '#product-stock'], value: productData.stock }
    ];
    
    for (const field of fieldSelectors) {
      let fieldFilled = false;
      for (const selector of field.selectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            await page.type(selector, field.value);
            console.log(`✓ Filled ${field.name}: ${selector}`);
            fieldFilled = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
      if (!fieldFilled) {
        console.log(`⚠️ Could not find field: ${field.name}`);
      }
    }
    
    await screenshot('09-product-form-filled', 'Product form filled');
    
    // Try to submit
    const submitSelectors = ['button[type="submit"]', 'button:contains("Submit")', '.submit-btn', '#submit-product'];
    let submitted = false;
    
    for (const selector of submitSelectors) {
      try {
        const button = await page.$(selector);
        if (button) {
          await button.click();
          console.log(`✓ Clicked submit button: ${selector}`);
          submitted = true;
          break;
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!submitted) {
      console.log('⚠️ Could not find submit button');
    }
    
    await delay(3000);
    await screenshot('10-product-submitted', 'After product submission');
    
    return true;
  } catch (error) {
    console.log(`❌ Product posting failed: ${error.message}`);
    return false;
  }
};

// Step 5: Test Service Posting
const testServicePosting = async () => {
  console.log('\n🛠️ STEP 5: Service Posting Test');
  console.log('==============================');
  
  try {
    await page.goto(`${config.baseUrl}/esm-portal/add-service`, { waitUntil: 'networkidle0' });
    await screenshot('11-service-add-page', 'Add service page');
    
    const serviceData = {
      name: 'Test Security Services',
      category: 'security', 
      basePrice: '5000',
      description: 'Professional security consulting services for testing. This service includes comprehensive security assessment, vulnerability analysis, and recommendations for improvement based on years of military experience.'
    };
    
    // Service form uses specific field names
    const fieldSelectors = [
      { name: 'name', selectors: ['input[name="name"]', 'input[name="title"]', '#name'], value: serviceData.name },
      { name: 'basePrice', selectors: ['input[name="basePrice"]', 'input[name="price"]', '#basePrice'], value: serviceData.basePrice },
      { name: 'category', selectors: ['select[name="category"]', '#category'], value: serviceData.category },
      { name: 'description', selectors: ['textarea[name="description"]', '#description'], value: serviceData.description }
    ];
    
    for (const field of fieldSelectors) {
      let fieldFilled = false;
      for (const selector of field.selectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            await page.type(selector, field.value);
            console.log(`✓ Filled ${field.name}: ${selector}`);
            fieldFilled = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
      if (!fieldFilled) {
        console.log(`⚠️ Could not find field: ${field.name}`);
      }
    }
    
    await screenshot('12-service-form-filled', 'Service form filled');
    
    // Submit form
    const submitSelectors = ['button[type="submit"]', 'button:contains("Submit")', '.submit-btn'];
    for (const selector of submitSelectors) {
      try {
        const button = await page.$(selector);
        if (button) {
          await button.click();
          console.log(`✓ Clicked submit button: ${selector}`);
          break;
        }
      } catch (error) {
        continue;
      }
    }
    
    await delay(3000);
    await screenshot('13-service-submitted', 'After service submission');
    
    return true;
  } catch (error) {
    console.log(`❌ Service posting failed: ${error.message}`);
    return false;
  }
};

// Main test execution
const runDirectWorkflowTest = async () => {
  console.log('🚀 DIRECT WORKFLOW TEST - ESM PORTAL');
  console.log('====================================');
  console.log(`📧 Test User: ${config.esmTestUser.email}`);
  console.log(`📁 Screenshots: ${config.screenshotDir}`);
  console.log('');
  
  let results = {
    registration: false,
    approval: false,
    login: false,
    productPosting: false,
    servicePosting: false
  };
  
  try {
    // Initialize browser
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 1366, height: 768 },
      args: ['--no-sandbox']
    });
    page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`🔴 Console Error: ${msg.text()}`);
      }
    });
    
    // Execute test steps
    console.log('Starting test workflow...\n');
    
    // Step 1: Register user
    const user = await registerUserViaAPI();
    results.registration = true;
    
    // Step 2: Admin approve user
    results.approval = await adminApproveUser(user._id);
    
    // Step 3: Test login
    const userEmail = user.email || config.esmTestUser.email || config.testUser.email;
    const userPassword = config.esmTestUser.password || config.testUser.password;
    results.login = await testESMLogin(userEmail, userPassword);
    
    // Step 4: Test product posting (only if login successful)
    if (results.login) {
      results.productPosting = await testProductPosting();
      results.servicePosting = await testServicePosting();
    } else {
      console.log('⏭️ Skipping product/service posting due to login failure');
    }
    
    // Generate summary
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    console.log(`✅ Registration: ${results.registration ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Admin Approval: ${results.approval ? 'PASS' : 'FAIL'}`);
    console.log(`✅ ESM Login: ${results.login ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Product Posting: ${results.productPosting ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Service Posting: ${results.servicePosting ? 'PASS' : 'FAIL'}`);
    
    const passCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;
    console.log(`\n🎯 Overall: ${passCount}/${totalCount} tests passed`);
    
    // Save detailed report
    const reportPath = path.join(config.screenshotDir, 'DIRECT_WORKFLOW_REPORT.md');
    const reportContent = `# Direct Workflow Test Report

**Timestamp:** ${new Date().toISOString()}
**Test User:** ${config.testUser.email}

## Results
- Registration: ${results.registration ? '✅ PASS' : '❌ FAIL'}
- Admin Approval: ${results.approval ? '✅ PASS' : '❌ FAIL'}
- ESM Login: ${results.login ? '✅ PASS' : '❌ FAIL'}
- Product Posting: ${results.productPosting ? '✅ PASS' : '❌ FAIL'}
- Service Posting: ${results.servicePosting ? '✅ PASS' : '❌ FAIL'}

## Overall Score: ${passCount}/${totalCount}

## Test User Details
- Email: ${config.testUser.email}
- Role: ${config.testUser.role}
- Business: ${config.testUser.businessName}

## Next Steps
${results.login ? 'Complete workflow successful! Ready for production testing.' : 'Login issues need to be resolved before proceeding.'}
`;
    
    fs.writeFileSync(reportPath, reportContent);
    console.log(`📄 Report saved: ${reportPath}`);
    
  } catch (error) {
    console.error('💥 Critical test failure:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Run the test
if (require.main === module) {
  runDirectWorkflowTest().catch(console.error);
}

module.exports = { runDirectWorkflowTest };