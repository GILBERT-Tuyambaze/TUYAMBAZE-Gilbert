import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

initializeApp();

const db = getFirestore();
const region = 'us-central1';
const cors = true;

const VISITOR_DOC = db.collection('stats').doc('visitorCount');
const CONTACTS = db.collection('contactSubmissions');
const SOCIAL_PROOF = db.collection('testimonials');
const ROLES = db.collection('roles');

type SocialEntryKind = 'testimonial' | 'feedback';

const ensureString = (value: unknown, field: string, min: number, max: number) => {
  if (typeof value !== 'string') {
    throw new HttpsError('invalid-argument', `${field} must be a string.`);
  }

  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    throw new HttpsError('invalid-argument', `${field} must be between ${min} and ${max} characters.`);
  }

  return trimmed;
};

const ensureOptionalString = (value: unknown, field: string, max: number) => {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  if (typeof value !== 'string') {
    throw new HttpsError('invalid-argument', `${field} must be a string.`);
  }

  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw new HttpsError('invalid-argument', `${field} must be at most ${max} characters.`);
  }

  return trimmed;
};

const ensureKind = (value: unknown) => {
  if (value !== 'testimonial' && value !== 'feedback') {
    throw new HttpsError('invalid-argument', 'kind must be either testimonial or feedback.');
  }

  return value as SocialEntryKind;
};

const ensureRating = (value: unknown) => {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new HttpsError('invalid-argument', 'rating must be an integer between 1 and 5.');
  }

  return rating;
};

const ensureAdmin = async (uid?: string | null) => {
  if (!uid) {
    throw new HttpsError('unauthenticated', 'You must be signed in.');
  }

  const roleSnapshot = await ROLES.doc(uid).get();
  if (!roleSnapshot.exists || roleSnapshot.data()?.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Admin access is required.');
  }
};

export const incrementVisitorCount = onCall({ region, cors }, async () => {
  const nextCount = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(VISITOR_DOC);
    const currentCount = snapshot.exists ? Number(snapshot.data()?.count ?? 0) : 0;
    const safeCount = Number.isFinite(currentCount) ? currentCount : 0;
    const updatedCount = safeCount + 1;

    transaction.set(
      VISITOR_DOC,
      {
        count: updatedCount,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return updatedCount;
  });

  return { count: nextCount };
});

export const storeContactSubmission = onCall({ region, cors }, async (request) => {
  const name = ensureString(request.data?.name, 'name', 2, 120);
  const email = ensureString(request.data?.email, 'email', 5, 160);
  const subject = ensureString(request.data?.subject, 'subject', 2, 180);
  const message = ensureString(request.data?.message, 'message', 5, 5000);

  const docRef = await CONTACTS.add({
    name,
    email,
    subject,
    message,
    source: 'portfolio',
    createdAt: FieldValue.serverTimestamp(),
  });

  return { id: docRef.id, stored: true };
});

export const submitTestimonial = onCall({ region, cors }, async (request) => {
  const kind = ensureKind(request.data?.kind);
  const name = ensureString(request.data?.name, 'name', 2, 120);
  const role = ensureString(request.data?.role, 'role', 2, 120);
  const company = ensureOptionalString(request.data?.company, 'company', 120);
  const message = ensureString(request.data?.message, 'message', 10, 3000);
  const rating = ensureRating(request.data?.rating);

  const docRef = await SOCIAL_PROOF.add({
    kind,
    name,
    role,
    company,
    message,
    rating,
    visible: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { id: docRef.id, stored: true };
});

export const getDashboardData = onCall({ region, cors }, async (request) => {
  await ensureAdmin(request.auth?.uid);

  const [visitorSnapshot, contactsSnapshot, socialSnapshot] = await Promise.all([
    VISITOR_DOC.get(),
    CONTACTS.orderBy('createdAt', 'desc').limit(100).get(),
    SOCIAL_PROOF.orderBy('createdAt', 'desc').limit(100).get(),
  ]);

  const visitorCount = visitorSnapshot.exists ? Number(visitorSnapshot.data()?.count ?? 0) : 0;

  return {
    visitorCount: Number.isFinite(visitorCount) ? visitorCount : 0,
    contactSubmissions: contactsSnapshot.docs.map((entry) => ({
      id: entry.id,
      ...entry.data(),
    })),
    testimonials: socialSnapshot.docs.map((entry) => ({
      id: entry.id,
      ...entry.data(),
    })),
  };
});

export const setVisitorCount = onCall({ region, cors }, async (request) => {
  await ensureAdmin(request.auth?.uid);

  const count = Number(request.data?.count);
  if (!Number.isInteger(count) || count < 0) {
    throw new HttpsError('invalid-argument', 'count must be a non-negative integer.');
  }

  await VISITOR_DOC.set(
    {
      count,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { count };
});

export const updateSocialEntry = onCall({ region, cors }, async (request) => {
  await ensureAdmin(request.auth?.uid);

  const entryId = ensureString(request.data?.entryId, 'entryId', 5, 200);
  const kind = ensureKind(request.data?.kind);
  const name = ensureString(request.data?.name, 'name', 2, 120);
  const role = ensureString(request.data?.role, 'role', 2, 120);
  const company = ensureOptionalString(request.data?.company, 'company', 120);
  const message = ensureString(request.data?.message, 'message', 10, 3000);
  const rating = ensureRating(request.data?.rating);
  const visible = Boolean(request.data?.visible);

  await SOCIAL_PROOF.doc(entryId).update({
    kind,
    name,
    role,
    company,
    message,
    rating,
    visible,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { entryId, updated: true };
});

export const deleteSocialEntry = onCall({ region, cors }, async (request) => {
  await ensureAdmin(request.auth?.uid);

  const entryId = ensureString(request.data?.entryId, 'entryId', 5, 200);
  await SOCIAL_PROOF.doc(entryId).delete();

  return { entryId, deleted: true };
});
