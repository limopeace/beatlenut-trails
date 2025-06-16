const fs = require('fs');
const path = require('path');
const AdminLoginWorkflow = require('./admin-login-workflow');
const AdminDashboardWorkflow = require('./admin-dashboard-workflow');
const EsmRegistrationWorkflow = require('./esm-registration-workflow');

class TestRunner {
  constructor() {
    this.results = [];
    this.startTime = new Date();
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Workflow Testing Suite');
    console.log('=' .repeat(60));

    const workflows = [
      { name: 'Admin Login', class: AdminLoginWorkflow },
      { name: 'Admin Dashboard', class: AdminDashboardWorkflow },
      { name: 'ESM Registration', class: EsmRegistrationWorkflow }
    ];

    for (const workflow of workflows) {
      console.log(`\n📋 Running ${workflow.name} Workflow...`);
      console.log('-'.repeat(40));
      
      try {
        const instance = new workflow.class();
        await instance.runWorkflow();
        
        // Read the report to get results
        const reportPath = path.join(__dirname, '../test-results', 
          workflow.name.toLowerCase().replace(' ', '-') + '-workflows',
          workflow.name.toLowerCase().replace(' ', '-'),
          'report.json'
        );
        
        if (fs.existsSync(reportPath)) {
          const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
          this.results.push({
            workflow: workflow.name,
            ...report
          });
        }
        
        console.log(`✅ ${workflow.name} workflow completed`);
        
      } catch (error) {
        console.error(`❌ ${workflow.name} workflow failed:`, error.message);
        this.results.push({
          workflow: workflow.name,
          error: error.message,
          totalSteps: 0,
          passedSteps: 0,
          failedSteps: 1
        });
      }
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await this.generateSummaryReport();
  }

  async generateSummaryReport() {
    const endTime = new Date();
    const duration = Math.round((endTime - this.startTime) / 1000);
    
    const summary = {
      testSuiteRun: {
        startTime: this.startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: `${duration}s`,
        totalWorkflows: this.results.length,
        passedWorkflows: this.results.filter(r => !r.error && r.passedSteps === r.totalSteps).length,
        failedWorkflows: this.results.filter(r => r.error || r.passedSteps !== r.totalSteps).length
      },
      results: this.results,
      overallStats: {
        totalSteps: this.results.reduce((sum, r) => sum + (r.totalSteps || 0), 0),
        passedSteps: this.results.reduce((sum, r) => sum + (r.passedSteps || 0), 0),
        failedSteps: this.results.reduce((sum, r) => sum + (r.failedSteps || 0), 0)
      }
    };

    // Create summary directory
    const summaryDir = path.join(__dirname, '../test-results/summary');
    if (!fs.existsSync(summaryDir)) {
      fs.mkdirSync(summaryDir, { recursive: true });
    }

    // Save JSON report
    const jsonPath = path.join(summaryDir, 'test-summary.json');
    fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));

    // Generate markdown report
    const markdownReport = this.generateMarkdownSummary(summary);
    const mdPath = path.join(summaryDir, 'test-summary.md');
    fs.writeFileSync(mdPath, markdownReport);

    // Console summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUITE SUMMARY');
    console.log('='.repeat(60));
    console.log(`🕐 Duration: ${summary.testSuiteRun.duration}`);
    console.log(`📋 Workflows: ${summary.testSuiteRun.passedWorkflows}/${summary.testSuiteRun.totalWorkflows} passed`);
    console.log(`✅ Steps: ${summary.overallStats.passedSteps}/${summary.overallStats.totalSteps} passed`);
    console.log(`📁 Reports saved to: ${summaryDir}`);
    
    // Individual workflow results
    console.log('\n📋 Individual Results:');
    this.results.forEach(result => {
      const status = result.error ? '❌ ERROR' : 
                    result.passedSteps === result.totalSteps ? '✅ PASSED' : '⚠️ PARTIAL';
      console.log(`  ${status} ${result.workflow}: ${result.passedSteps || 0}/${result.totalSteps || 0} steps`);
    });
    
    console.log('\n🔗 View detailed reports in the test-results directories');
  }

  generateMarkdownSummary(summary) {
    const overallSuccess = summary.testSuiteRun.passedWorkflows === summary.testSuiteRun.totalWorkflows;
    
    return `# Beatlenuts-GR Workflow Test Suite Summary

**Test Date:** ${new Date(summary.testSuiteRun.endTime).toLocaleString()}
**Duration:** ${summary.testSuiteRun.duration}
**Overall Status:** ${overallSuccess ? '✅ ALL PASSED' : '❌ SOME FAILED'}

## Summary Statistics

- **Workflows:** ${summary.testSuiteRun.passedWorkflows}/${summary.testSuiteRun.totalWorkflows} passed
- **Total Steps:** ${summary.overallStats.passedSteps}/${summary.overallStats.totalSteps} passed
- **Success Rate:** ${Math.round((summary.overallStats.passedSteps / summary.overallStats.totalSteps) * 100)}%

## Individual Workflow Results

${summary.results.map(result => {
  const status = result.error ? '❌ ERROR' : 
                result.passedSteps === result.totalSteps ? '✅ PASSED' : '⚠️ PARTIAL';
  const details = result.error ? result.error : `${result.passedSteps}/${result.totalSteps} steps passed`;
  
  return `### ${result.workflow}
- **Status:** ${status}
- **Details:** ${details}
- **Report:** [View Details](../${result.workflow.toLowerCase().replace(' ', '-')}-workflows/${result.workflow.toLowerCase().replace(' ', '-')}/report.md)`;
}).join('\n\n')}

## System Information

- **Frontend Server:** http://localhost:3000
- **Backend Server:** http://localhost:4000
- **Test Environment:** Development
- **Browser:** Chromium (Puppeteer)

## Recommendations

${overallSuccess ? 
  `✅ All workflows passed successfully! The system is ready for production testing.` :
  `⚠️ Some workflows failed. Please review the individual reports and fix the identified issues before proceeding.`
}

---
*Generated by Beatlenuts-GR Automated Testing Suite*
`;
  }
}

// Run all tests
const runner = new TestRunner();
runner.runAllTests().catch(console.error);