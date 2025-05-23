const axios = require('axios');
const { performance } = require('perf_hooks');

// Configuration
const API_URL = 'http://localhost:4000/api';
const CONCURRENT_USERS = 100;
const TEST_DURATION = 60000; // 1 minute

const metrics = {
  requests: 0,
  errors: 0,
  totalResponseTime: 0,
  slowRequests: 0
};

// Simulated user actions
const userActions = [
  async () => {
    // Login
    const start = performance.now();
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      metrics.requests++;
      const responseTime = performance.now() - start;
      metrics.totalResponseTime += responseTime;
      if (responseTime > 1000) metrics.slowRequests++;
    } catch (error) {
      metrics.errors++;
    }
  },
  
  async () => {
    // Get products
    const start = performance.now();
    try {
      await axios.get(`${API_URL}/products`);
      metrics.requests++;
      const responseTime = performance.now() - start;
      metrics.totalResponseTime += responseTime;
      if (responseTime > 1000) metrics.slowRequests++;
    } catch (error) {
      metrics.errors++;
    }
  },
  
  async () => {
    // Search products
    const start = performance.now();
    try {
      await axios.get(`${API_URL}/products/search?q=test`);
      metrics.requests++;
      const responseTime = performance.now() - start;
      metrics.totalResponseTime += responseTime;
      if (responseTime > 1000) metrics.slowRequests++;
    } catch (error) {
      metrics.errors++;
    }
  },
  
  async () => {
    // Get messages
    const start = performance.now();
    try {
      await axios.get(`${API_URL}/messages`, {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      metrics.requests++;
      const responseTime = performance.now() - start;
      metrics.totalResponseTime += responseTime;
      if (responseTime > 1000) metrics.slowRequests++;
    } catch (error) {
      metrics.errors++;
    }
  }
];

// Simulate concurrent users
async function simulateUser() {
  const endTime = Date.now() + TEST_DURATION;
  
  while (Date.now() < endTime) {
    const action = userActions[Math.floor(Math.random() * userActions.length)];
    await action();
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000)); // Random delay
  }
}

// Run stress test
async function runStressTest() {
  console.log('🚀 Starting ESM Portal Stress Test...');
  console.log(`👥 Concurrent Users: ${CONCURRENT_USERS}`);
  console.log(`⏱️  Test Duration: ${TEST_DURATION / 1000} seconds\n`);
  
  const startTime = Date.now();
  const userPromises = [];
  
  // Launch concurrent users
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    userPromises.push(simulateUser());
  }
  
  // Monitor progress
  const progressInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const avgResponseTime = metrics.requests > 0 ? metrics.totalResponseTime / metrics.requests : 0;
    
    console.log(`⏱️  ${elapsed.toFixed(0)}s | 📊 Requests: ${metrics.requests} | ❌ Errors: ${metrics.errors} | ⚡ Avg Response: ${avgResponseTime.toFixed(0)}ms`);
  }, 5000);
  
  // Wait for all users to complete
  await Promise.all(userPromises);
  clearInterval(progressInterval);
  
  // Final report
  const testDuration = (Date.now() - startTime) / 1000;
  const avgResponseTime = metrics.totalResponseTime / metrics.requests;
  const requestsPerSecond = metrics.requests / testDuration;
  const errorRate = (metrics.errors / metrics.requests) * 100;
  
  console.log('\n📊 Stress Test Results:');
  console.log('─'.repeat(40));
  console.log(`Total Requests: ${metrics.requests}`);
  console.log(`Requests/Second: ${requestsPerSecond.toFixed(2)}`);
  console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`Slow Requests (>1s): ${metrics.slowRequests}`);
  console.log(`Error Rate: ${errorRate.toFixed(2)}%`);
  console.log(`Test Duration: ${testDuration.toFixed(2)}s`);
  console.log('─'.repeat(40));
  
  // Performance assessment
  if (avgResponseTime < 500 && errorRate < 1) {
    console.log('✅ Performance: EXCELLENT');
  } else if (avgResponseTime < 1000 && errorRate < 5) {
    console.log('⚠️  Performance: GOOD (with room for improvement)');
  } else {
    console.log('❌ Performance: NEEDS OPTIMIZATION');
  }
}

// Run test
if (require.main === module) {
  runStressTest().catch(console.error);
}

module.exports = { runStressTest };