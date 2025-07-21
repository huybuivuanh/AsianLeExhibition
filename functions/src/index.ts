import { setGlobalOptions } from 'firebase-functions';
setGlobalOptions({ maxInstances: 10 });
import { initializeApp } from 'firebase-admin/app';

// Initialize the Firebase Admin SDK
initializeApp();
