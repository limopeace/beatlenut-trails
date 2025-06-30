const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function analyzeMobileScrollIssues() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Create analysis directory
  const analysisDir = path.join(__dirname, 'mobile-scroll-analysis');
  if (!fs.existsSync(analysisDir)) {
    fs.mkdirSync(analysisDir);
  }

  // Define pages to analyze
  const pages = [
    { name: 'homepage', url: 'http://localhost:3000' },
    { name: 'about', url: 'http://localhost:3000/about' },
    { name: 'services', url: 'http://localhost:3000/services' },
    { name: 'activities', url: 'http://localhost:3000/activities' },
    { name: 'destinations', url: 'http://localhost:3000/destinations' },
    { name: 'travel-listings', url: 'http://localhost:3000/travel-listings' },
    { name: 'contact', url: 'http://localhost:3000/contact' },
    { name: 'team', url: 'http://localhost:3000/team' },
    { name: 'bike-rentals', url: 'http://localhost:3000/bike-rentals' }
  ];

  const scrollIssues = [];

  try {
    // Mobile analysis (375x667 - iPhone SE)
    console.log('🔍 Analyzing mobile scroll behavior...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 667 });

    for (const pageInfo of pages) {
      try {
        console.log(`📱 Analyzing ${pageInfo.name}...`);
        await mobilePage.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check for horizontal scroll
        const horizontalScrollWidth = await mobilePage.evaluate(() => {
          return {
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
            bodyWidth: document.body.scrollWidth,
            hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth
          };
        });

        // Check for excessive vertical content
        const verticalScrollInfo = await mobilePage.evaluate(() => {
          return {
            documentHeight: document.documentElement.scrollHeight,
            viewportHeight: window.innerHeight,
            bodyHeight: document.body.scrollHeight,
            scrollRatio: document.documentElement.scrollHeight / window.innerHeight
          };
        });

        // Check for elements causing overflow
        const overflowElements = await mobilePage.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('*'));
          const problematic = [];
          
          elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const styles = window.getComputedStyle(el);
            
            // Check for horizontal overflow
            if (rect.right > window.innerWidth && styles.position !== 'fixed') {
              problematic.push({
                tag: el.tagName,
                className: el.className,
                id: el.id,
                right: rect.right,
                width: rect.width,
                issue: 'horizontal_overflow'
              });
            }
            
            // Check for elements with excessive width
            if (el.scrollWidth > window.innerWidth && styles.overflow !== 'hidden') {
              problematic.push({
                tag: el.tagName,
                className: el.className,
                id: el.id,
                scrollWidth: el.scrollWidth,
                issue: 'excessive_width'
              });
            }
          });
          
          return problematic.slice(0, 10); // Limit to first 10 issues
        });

        const pageAnalysis = {
          page: pageInfo.name,
          url: pageInfo.url,
          horizontalScroll: horizontalScrollWidth,
          verticalScroll: verticalScrollInfo,
          overflowElements: overflowElements,
          issues: []
        };

        // Identify specific issues
        if (horizontalScrollWidth.hasHorizontalScroll) {
          pageAnalysis.issues.push('HORIZONTAL_SCROLL_DETECTED');
        }

        if (verticalScrollInfo.scrollRatio > 6) {
          pageAnalysis.issues.push('EXCESSIVE_VERTICAL_CONTENT');
        }

        if (overflowElements.length > 0) {
          pageAnalysis.issues.push('ELEMENT_OVERFLOW_DETECTED');
        }

        scrollIssues.push(pageAnalysis);

        // Take screenshot for documentation
        await mobilePage.screenshot({
          path: path.join(analysisDir, `${pageInfo.name}-scroll-analysis.png`),
          fullPage: true
        });

        console.log(`✅ ${pageInfo.name} analyzed - Issues: ${pageAnalysis.issues.length}`);

      } catch (error) {
        console.log(`❌ Failed to analyze ${pageInfo.name}: ${error.message}`);
        scrollIssues.push({
          page: pageInfo.name,
          url: pageInfo.url,
          error: error.message,
          issues: ['PAGE_LOAD_ERROR']
        });
      }
    }

    // Generate analysis report
    const reportPath = path.join(analysisDir, 'scroll-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(scrollIssues, null, 2));

    console.log('\n📊 Mobile Scroll Analysis Summary:');
    console.log('=====================================');

    scrollIssues.forEach(analysis => {
      if (analysis.error) {
        console.log(`❌ ${analysis.page}: ${analysis.error}`);
        return;
      }

      console.log(`\n📱 ${analysis.page.toUpperCase()}:`);
      console.log(`   Horizontal Scroll: ${analysis.horizontalScroll.hasHorizontalScroll ? '❌ YES' : '✅ NO'}`);
      console.log(`   Document Width: ${analysis.horizontalScroll.documentWidth}px (Viewport: ${analysis.horizontalScroll.viewportWidth}px)`);
      console.log(`   Vertical Ratio: ${analysis.verticalScroll.scrollRatio.toFixed(1)}x viewport height`);
      console.log(`   Overflow Elements: ${analysis.overflowElements.length}`);
      console.log(`   Issues Found: ${analysis.issues.length > 0 ? analysis.issues.join(', ') : 'None'}`);
      
      if (analysis.overflowElements.length > 0) {
        console.log(`   Problematic Elements:`);
        analysis.overflowElements.slice(0, 3).forEach(el => {
          console.log(`     - ${el.tag}${el.className ? '.' + el.className : ''}${el.id ? '#' + el.id : ''} (${el.issue})`);
        });
      }
    });

    console.log(`\n📁 Full analysis saved to: ${reportPath}`);
    console.log(`📸 Screenshots saved to: ${analysisDir}`);

  } catch (error) {
    console.error('❌ Error during scroll analysis:', error);
  } finally {
    await browser.close();
  }
}

// Run the scroll analysis
analyzeMobileScrollIssues().catch(console.error);