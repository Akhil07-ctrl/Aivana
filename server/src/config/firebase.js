import admin from 'firebase-admin';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

try {
  // Load service account securely
  const serviceAccount = require('./firebase-service-account.json');

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('[FIREBASE] Admin SDK initialized successfully');
  }
} catch (error) {
  console.warn('[FIREBASE WARNING] Could not initialize Admin SDK. Phone Auth will not work.', error.message);
}

export default admin;
