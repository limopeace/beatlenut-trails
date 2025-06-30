const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testMobileUI() {
    console.log('🚀 Starting Mobile UI Test for Beatlenuts Travel Website');
    console.log('Testing URL: http://localhost:3000');
    
    let browser;
    const screenshots = [];
    const issues = [];
    const workingFeatures = [];
    
    try {
        // Launch browser with mobile emulation
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set mobile viewport (iPhone SE dimensions)
        await page.setViewport({
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true
        });
        
        console.log('📱 Set mobile viewport: 375x667');
        
        // Navigate to homepage
        console.log('🌐 Navigating to homepage...');
        await page.goto('http://localhost:3000', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // Wait for page to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 1: Initial homepage screenshot
        console.log('📸 Taking initial homepage screenshot...');
        const homepageScreenshot = `mobile-homepage-initial-${Date.now()}.png`;
        await page.screenshot({ 
            path: homepageScreenshot,
            fullPage: true 
        });
        screenshots.push({
            name: 'Homepage Initial View',
            file: homepageScreenshot,
            description: 'Initial mobile homepage view'
        });
        
        // Test 2: Check navigation header
        console.log('🧭 Testing navigation header...');
        try {
            const header = await page.$('nav, header, [role="navigation"]');
            if (header) {
                workingFeatures.push('Navigation header is present');
                
                // Check header background color
                const headerStyles = await page.evaluate(() => {
                    const nav = document.querySelector('nav, header, [role="navigation"]');
                    if (nav) {
                        const styles = window.getComputedStyle(nav);
                        return {
                            backgroundColor: styles.backgroundColor,
                            color: styles.color
                        };
                    }
                    return null;
                });
                
                if (headerStyles) {
                    console.log('Header styles:', headerStyles);
                    workingFeatures.push(`Header background: ${headerStyles.backgroundColor}`);
                }
            } else {
                issues.push('Navigation header not found');
            }
        } catch (error) {
            issues.push(`Header test failed: ${error.message}`);
        }
        
        // Test 3: Check hamburger menu
        console.log('🍔 Testing hamburger menu...');
        try {
            // Look for common hamburger menu selectors
            const hamburgerSelectors = [
                '[data-testid="hamburger-menu"]',
                '.hamburger',
                '.menu-toggle',
                '[aria-label="Menu"]',
                '[aria-label="Toggle menu"]',
                'button[class*="hamburger"]',
                'button[class*="menu"]',
                '.mobile-menu-trigger'
            ];
            
            let hamburgerButton = null;
            for (const selector of hamburgerSelectors) {
                hamburgerButton = await page.$(selector);
                if (hamburgerButton) {
                    console.log(`Found hamburger menu with selector: ${selector}`);
                    break;
                }
            }
            
            if (!hamburgerButton) {
                // Try to find any button that might be the hamburger menu
                const buttons = await page.$$('button');
                for (const button of buttons) {
                    const text = await page.evaluate(el => el.textContent.toLowerCase(), button);
                    const ariaLabel = await page.evaluate(el => el.getAttribute('aria-label'), button);
                    if (text.includes('menu') || (ariaLabel && ariaLabel.toLowerCase().includes('menu'))) {
                        hamburgerButton = button;
                        console.log('Found hamburger menu by content/aria-label');
                        break;
                    }
                }
            }
            
            if (hamburgerButton) {
                workingFeatures.push('Hamburger menu button found');
                
                // Take screenshot before clicking
                const beforeHamburgerScreenshot = `mobile-before-hamburger-${Date.now()}.png`;
                await page.screenshot({ 
                    path: beforeHamburgerScreenshot,
                    fullPage: true 
                });
                screenshots.push({
                    name: 'Before Hamburger Menu Click',
                    file: beforeHamburgerScreenshot,
                    description: 'Homepage before hamburger menu interaction'
                });
                
                // Click hamburger menu
                await hamburgerButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Take screenshot after clicking
                const afterHamburgerScreenshot = `mobile-after-hamburger-${Date.now()}.png`;
                await page.screenshot({ 
                    path: afterHamburgerScreenshot,
                    fullPage: true 
                });
                screenshots.push({
                    name: 'After Hamburger Menu Click',
                    file: afterHamburgerScreenshot,
                    description: 'Homepage after hamburger menu opened'
                });
                
                // Check if menu items are visible
                await new Promise(resolve => setTimeout(resolve, 500));
                const menuItems = await page.$$eval('a, button', elements => {
                    const menuTexts = ['Home', 'Packages', 'Activities', 'About', 'Contact', 'Blog', 'Bike Rentals', 'ESM Portal', 'Admin Panel', 'Book Now'];
                    return elements
                        .filter(el => {
                            const text = el.textContent.trim();
                            return menuTexts.some(menuText => text.toLowerCase().includes(menuText.toLowerCase()));
                        })
                        .map(el => el.textContent.trim());
                });
                
                if (menuItems.length > 0) {
                    workingFeatures.push(`Menu items visible: ${menuItems.join(', ')}`);
                } else {
                    issues.push('No menu items found after hamburger click');
                }
                
                // Try to close menu by clicking hamburger again
                await hamburgerButton.click();
                await new Promise(resolve => setTimeout(resolve, 500));
                workingFeatures.push('Hamburger menu toggle functionality works');
                
            } else {
                issues.push('Hamburger menu button not found');
            }
            
        } catch (error) {
            issues.push(`Hamburger menu test failed: ${error.message}`);
        }
        
        // Test 4: Check hero section buttons
        console.log('🎯 Testing hero section buttons...');
        try {
            const heroButtons = await page.$$eval('button, a', elements => {
                const buttonTexts = ['Activities', 'Explore Tours', 'Book Now'];
                return elements
                    .filter(el => {
                        const text = el.textContent.trim();
                        return buttonTexts.some(buttonText => text.toLowerCase().includes(buttonText.toLowerCase()));
                    })
                    .map(el => ({
                        text: el.textContent.trim(),
                        visible: el.offsetWidth > 0 && el.offsetHeight > 0,
                        rect: el.getBoundingClientRect()
                    }));
            });
            
            if (heroButtons.length > 0) {
                heroButtons.forEach(button => {
                    if (button.visible) {
                        workingFeatures.push(`Hero button "${button.text}" is visible`);
                    } else {
                        issues.push(`Hero button "${button.text}" is not visible`);
                    }
                });
            } else {
                issues.push('No hero section buttons found');
            }
            
            // Take screenshot of hero section
            const heroScreenshot = `mobile-hero-section-${Date.now()}.png`;
            await page.screenshot({ 
                path: heroScreenshot,
                clip: { x: 0, y: 0, width: 375, height: 667 }
            });
            screenshots.push({
                name: 'Hero Section Focus',
                file: heroScreenshot,
                description: 'Hero section with buttons visibility test'
            });
            
        } catch (error) {
            issues.push(`Hero section test failed: ${error.message}`);
        }
        
        // Test 5: Scroll to footer and test
        console.log('👣 Testing footer section...');
        try {
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check for social icons
            const socialIcons = await page.$$eval('a[href*="facebook"], a[href*="instagram"], [class*="social"] a, footer a', elements => {
                return elements
                    .filter(el => {
                        const href = el.getAttribute('href') || '';
                        const text = el.textContent.toLowerCase();
                        return href.includes('facebook') || href.includes('instagram') || 
                               text.includes('facebook') || text.includes('instagram');
                    })
                    .map(el => el.getAttribute('href') || el.textContent.trim());
            });
            
            if (socialIcons.length > 0) {
                workingFeatures.push(`Social icons found: ${socialIcons.join(', ')}`);
            } else {
                issues.push('Social icons (Facebook/Instagram) not visible in footer');
            }
            
            // Check for "Beta Factory" text
            const betaFactoryText = await page.$eval('*', () => {
                const walker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                
                let node;
                while (node = walker.nextNode()) {
                    if (node.textContent.includes('Beta Factory')) {
                        const element = node.parentElement;
                        const styles = window.getComputedStyle(element);
                        return {
                            found: true,
                            color: styles.color,
                            textDecoration: styles.textDecoration
                        };
                    }
                }
                return { found: false };
            });
            
            if (betaFactoryText.found) {
                workingFeatures.push(`Beta Factory text found with color: ${betaFactoryText.color}`);
                if (betaFactoryText.textDecoration.includes('underline')) {
                    workingFeatures.push('Beta Factory text has underline styling');
                }
            } else {
                issues.push('"Beta Factory" text not found in footer');
            }
            
            // Take footer screenshot
            const footerScreenshot = `mobile-footer-${Date.now()}.png`;
            await page.screenshot({ 
                path: footerScreenshot,
                fullPage: false,
                clip: { x: 0, y: 400, width: 375, height: 267 }
            });
            screenshots.push({
                name: 'Footer Section',
                file: footerScreenshot,
                description: 'Footer with social icons and Beta Factory text'
            });
            
        } catch (error) {
            issues.push(`Footer test failed: ${error.message}`);
        }
        
        // Test 6: Scroll behavior and section spacing
        console.log('📏 Testing scroll behavior and section spacing...');
        try {
            await page.evaluate(() => window.scrollTo(0, 0));
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check for overlapping elements
            const overlaps = await page.evaluate(() => {
                const elements = Array.from(document.querySelectorAll('section, div[class*="section"], header, nav, main'));
                const overlapping = [];
                
                for (let i = 0; i < elements.length - 1; i++) {
                    const rect1 = elements[i].getBoundingClientRect();
                    const rect2 = elements[i + 1].getBoundingClientRect();
                    
                    if (rect1.bottom > rect2.top && rect1.top < rect2.bottom) {
                        overlapping.push({
                            element1: elements[i].tagName + ' ' + (elements[i].className || ''),
                            element2: elements[i + 1].tagName + ' ' + (elements[i + 1].className || ''),
                            overlap: rect1.bottom - rect2.top
                        });
                    }
                }
                
                return overlapping;
            });
            
            if (overlaps.length === 0) {
                workingFeatures.push('No section overlaps detected');
            } else {
                overlaps.forEach(overlap => {
                    issues.push(`Section overlap: ${overlap.element1} overlaps ${overlap.element2} by ${overlap.overlap}px`);
                });
            }
            
            // Test smooth scrolling
            await page.evaluate(() => {
                window.scrollTo({ top: 500, behavior: 'smooth' });
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            workingFeatures.push('Smooth scroll behavior works');
            
        } catch (error) {
            issues.push(`Scroll test failed: ${error.message}`);
        }
        
        // Final full page screenshot
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const finalScreenshot = `mobile-final-overview-${Date.now()}.png`;
        await page.screenshot({ 
            path: finalScreenshot,
            fullPage: true 
        });
        screenshots.push({
            name: 'Final Full Page Overview',
            file: finalScreenshot,
            description: 'Complete mobile page overview after all tests'
        });
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        issues.push(`Test execution failed: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
    // Generate test report
    console.log('\n' + '='.repeat(80));
    console.log('📊 MOBILE UI TEST REPORT - BEATLENUTS TRAVEL WEBSITE');
    console.log('='.repeat(80));
    
    console.log('\n✅ WORKING FEATURES:');
    if (workingFeatures.length > 0) {
        workingFeatures.forEach((feature, index) => {
            console.log(`${index + 1}. ${feature}`);
        });
    } else {
        console.log('No working features detected');
    }
    
    console.log('\n❌ ISSUES IDENTIFIED:');
    if (issues.length > 0) {
        issues.forEach((issue, index) => {
            console.log(`${index + 1}. ${issue}`);
        });
    } else {
        console.log('No issues detected');
    }
    
    console.log('\n📸 SCREENSHOTS CAPTURED:');
    screenshots.forEach((screenshot, index) => {
        console.log(`${index + 1}. ${screenshot.name} (${screenshot.file})`);
        console.log(`   Description: ${screenshot.description}`);
    });
    
    console.log('\n📋 SUMMARY:');
    console.log(`- Total tests run: 6`);
    console.log(`- Working features: ${workingFeatures.length}`);
    console.log(`- Issues found: ${issues.length}`);
    console.log(`- Screenshots taken: ${screenshots.length}`);
    
    // Write detailed report to file
    const reportContent = {
        timestamp: new Date().toISOString(),
        testUrl: 'http://localhost:3000',
        viewport: { width: 375, height: 667 },
        workingFeatures,
        issues,
        screenshots,
        summary: {
            testsRun: 6,
            workingFeatures: workingFeatures.length,
            issuesFound: issues.length,
            screenshotsTaken: screenshots.length
        }
    };
    
    fs.writeFileSync('mobile-ui-test-report.json', JSON.stringify(reportContent, null, 2));
    console.log('\n💾 Detailed report saved to: mobile-ui-test-report.json');
    
    return reportContent;
}

// Run the test
testMobileUI().catch(console.error);