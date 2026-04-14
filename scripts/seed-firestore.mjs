import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const loadEnvFile = (filename) => {
  const filePath = path.join(rootDir, filename);
  if (!fs.existsSync(filePath)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const [key, ...rest] = line.split('=');
        return [key.trim(), rest.join('=').trim()];
      })
  );
};

const env = {
  ...loadEnvFile('.env'),
  ...loadEnvFile('.env.local'),
  ...process.env,
};

const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'SEED_ADMIN_EMAIL',
  'SEED_ADMIN_PASSWORD',
];

const missing = required.filter((key) => !env[key]);
if (missing.length > 0) {
  console.error(`Missing environment values: ${missing.join(', ')}`);
  process.exit(1);
}

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const visitorCount = 1284;

const contacts = [
  {
    id: 'seed-contact-acacia-studio',
    name: 'Diane Umutoni',
    email: 'diane@acaciastudio.rw',
    subject: 'Portfolio redesign for a consulting brand',
    message:
      'I really like the sharp presentation of your work. I want a premium one-page portfolio site for our consulting studio, with strong motion, testimonials, and a better lead capture flow.',
  },
  {
    id: 'seed-contact-kigali-tech',
    name: 'Eric Ndayisaba',
    email: 'eric@kigalitechlab.com',
    subject: 'Frontend partnership inquiry',
    message:
      'We are looking for a frontend developer who can help us improve our product dashboard and polish the responsive experience. I would like to discuss availability and pricing.',
  },
  {
    id: 'seed-contact-school-platform',
    name: 'Sister Clarisse',
    email: 'clarisse@schoolplatform.org',
    subject: 'School website and admissions experience',
    message:
      'We need a modern school website with announcements, admissions information, and a simple content workflow for our internal team. Your education-related work looks close to what we need.',
  },
];

const socialEntries = [
  {
    id: 'seed-social-tresor',
    kind: 'testimonial',
    name: 'Tuyizere Tresor',
    role: 'Software Developer',
    company: 'Independent Client',
    rating: 5,
    visible: true,
    message:
      'Working with Gilbert felt easy from the first call. He translated ideas into a clean product direction, communicated clearly, and delivered a portfolio that looked polished on both desktop and mobile.',
  },
  {
    id: 'seed-social-janine',
    kind: 'feedback',
    name: 'Janine Mukamana',
    role: 'Project Coordinator',
    company: 'Bright Bridge',
    rating: 5,
    visible: true,
    message:
      'The collaboration was smooth and professional. What stood out most was the speed of iteration and the way he kept the interface elegant even while adding many practical business details.',
  },
  {
    id: 'seed-social-aimable',
    kind: 'testimonial',
    name: 'Aimable Bizimungu',
    role: 'Product Designer',
    company: 'Creative Portfolio Client',
    rating: 5,
    visible: true,
    message:
      'Gilbert has a strong eye for structure and visual rhythm. He did not just build a site for me, he shaped how my work is presented and made the experience feel more credible.',
  },
  {
    id: 'seed-social-nadine',
    kind: 'feedback',
    name: 'Nadine Uwase',
    role: 'Operations Lead',
    company: 'Education Initiative',
    rating: 4,
    visible: true,
    message:
      'I appreciated the clarity, responsiveness, and thoughtful suggestions throughout the project. Even when requirements shifted, he stayed calm and kept the work moving in the right direction.',
  },
  {
    id: 'seed-social-hidden',
    kind: 'feedback',
    name: 'Patrick Habimana',
    role: 'Startup Founder',
    company: 'Internal Archive Sample',
    rating: 4,
    visible: false,
    message:
      'This hidden sample is useful for testing the dashboard controls. It should stay in the database but not appear on the public website until visibility is switched on.',
  },
];

const ensureAdminRole = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Admin sign-in did not succeed.');
  }

  const roleRef = doc(db, 'roles', user.uid);
  const snapshot = await getDoc(roleRef);
  if (!snapshot.exists()) {
    throw new Error(`Missing roles/${user.uid}. Create that admin role document first.`);
  }

  if (snapshot.data()?.role !== 'admin') {
    throw new Error(`roles/${user.uid} exists, but role is not "admin".`);
  }
};

const upsertSeedDoc = async (collectionName, entry) => {
  const ref = doc(db, collectionName, entry.id);
  const snapshot = await getDoc(ref);
  const { id, ...fields } = entry;
  const base = snapshot.exists()
    ? { ...fields, updatedAt: serverTimestamp() }
    : { ...fields, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };

  await setDoc(ref, base, { merge: true });
};

const createContactIfMissing = async (entry) => {
  const ref = doc(db, 'contactSubmissions', entry.id);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    console.log(`Skipping existing contact: ${entry.id}`);
    return;
  }

  const { id, ...fields } = entry;
  await setDoc(ref, {
    ...fields,
    source: 'portfolio',
    createdAt: serverTimestamp(),
  });
  console.log(`Created contact: ${entry.id}`);
};

const main = async () => {
  await signInWithEmailAndPassword(auth, env.SEED_ADMIN_EMAIL, env.SEED_ADMIN_PASSWORD);
  await ensureAdminRole();

  await setDoc(
    doc(db, 'stats', 'visitorCount'),
    {
      count: visitorCount,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  console.log(`Visitor count set to ${visitorCount}`);

  for (const contact of contacts) {
    await createContactIfMissing(contact);
  }

  for (const entry of socialEntries) {
    await upsertSeedDoc('testimonials', entry);
    console.log(`Seeded social entry: ${entry.id}`);
  }

  console.log('Firestore seed completed successfully.');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
