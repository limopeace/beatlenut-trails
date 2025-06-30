// Quick test to debug ESM registration form data submission
const testFormData = () => {
  console.log('🔍 Testing form data submission...');
  
  // Simulate the form data being sent
  const testData = new FormData();
  
  // Test the exact field mappings from the form
  testData.append('name', 'John Doe');
  testData.append('firstName', 'John');
  testData.append('lastName', 'Doe');
  testData.append('email', 'john.doe@test.com');
  testData.append('password', 'Test123@');
  testData.append('phoneNumber', '9876543210');
  testData.append('businessName', 'Test Business');
  testData.append('businessDescription', 'This is a test business description that is long enough to meet the minimum requirements for the form validation.');
  testData.append('serviceBackground', 'This is a test service background that describes the military service and experience in detail.');
  testData.append('categories', JSON.stringify(['Security Services']));
  testData.append('termsAccepted', 'true');
  testData.append('role', 'seller');
  
  // Log what we're sending
  console.log('📤 Form data entries:');
  for (const [key, value] of testData.entries()) {
    console.log(`📝 ${key}: ${value}`);
  }
  
  // Test the API call
  fetch('http://localhost:4000/api/esm/sellers/register', {
    method: 'POST',
    body: testData,
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ Response:', data);
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
};

testFormData();