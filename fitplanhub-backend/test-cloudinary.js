require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('\n🔍 Testing Cloudinary Configuration...\n');

// Show what we're using
console.log('Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || '❌ MISSING');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || '❌ MISSING');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ MISSING');
console.log('');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Test the connection
async function testCloudinary() {
  try {
    console.log('Testing Cloudinary API connection...\n');
    
    // Try to ping Cloudinary
    const result = await cloudinary.api.ping();
    
    console.log('✅ SUCCESS! Cloudinary is configured correctly');
    console.log('Response:', result);
    
    // Try a test upload
    console.log('\nTesting upload...');
    const testImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    
    const uploadResult = await cloudinary.uploader.upload(testImage, {
      folder: 'test',
      resource_type: 'image'
    });
    
    console.log('✅ Upload successful!');
    console.log('URL:', uploadResult.secure_url);
    
    // Clean up
    await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log('✅ Test image cleaned up');
    
  } catch (error) {
    console.error('❌ FAILED! Cloudinary configuration error:');
    console.error('Error:', error.message);
    console.error('HTTP Code:', error.http_code);
    
    if (error.http_code === 401) {
      console.error('\n⚠️  Authentication Failed!');
      console.error('This usually means:');
      console.error('1. Cloud name is incorrect or disabled');
      console.error('2. API key is incorrect');
      console.error('3. API secret is incorrect');
      console.error('4. Your Cloudinary account may be suspended');
      console.error('\nPlease verify your credentials at:');
      console.error('https://cloudinary.com/console\n');
    }
  }
}

testCloudinary();
