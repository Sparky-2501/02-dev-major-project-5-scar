import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadToCloudinary, isCloudinaryConfigured } from '../src/config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncAllAssets() {
  console.log('=== SCAR Cloudinary Catalog Sync Script ===');
  
  if (!isCloudinaryConfigured()) {
    console.error('ERROR: Cloudinary credentials not detected in .env.');
    console.error('Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in .env.');
    process.exit(1);
  }

  const tempFolder = path.resolve(__dirname, '../../frontend/public/images/temp-uploads');
  if (!fs.existsSync(tempFolder)) {
    console.error('Temporary images folder not found at:', tempFolder);
    process.exit(1);
  }

  const files = fs.readdirSync(tempFolder).filter(f => f.endsWith('.svg') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));
  console.log(`Found ${files.length} product images in temp-uploads ready for Cloudinary synchronization.`);

  const uploadedManifest = {};
  let successCount = 0;

  for (const file of files) {
    try {
      const filePath = path.join(tempFolder, file);
      const fileBuffer = fs.readFileSync(filePath);
      process.stdout.write(`Uploading ${file} ... `);
      
      const res = await uploadToCloudinary(fileBuffer, 'scar_products/catalog');
      uploadedManifest[file] = res.secureUrl;
      successCount++;
      console.log(`OK: ${res.secureUrl}`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }

  // Save manifest to json
  const manifestPath = path.resolve(__dirname, '../src/data/cloudinaryManifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(uploadedManifest, null, 2), 'utf8');
  console.log(`\nSuccessfully uploaded ${successCount} assets to Cloudinary!`);
  console.log(`Saved manifest to: ${manifestPath}`);
}

syncAllAssets().catch(console.error);
