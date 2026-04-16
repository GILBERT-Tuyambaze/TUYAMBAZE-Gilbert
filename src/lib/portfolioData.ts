import {
  addDoc,
  collection,
  deleteField,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth, firestore, isFirebaseConfigured } from '@/lib/firebase';

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date | null;
  source: 'portfolio';
};

export type VisitSession = {
  id: string;
  sessionKey: string;
  entryPath: string;
  currentPath: string;
  exitPath: string;
  pageViews: number;
  durationSeconds: number;
  locale: string;
  timeZone: string;
  referrer: string;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  startedAt: Date | null;
  lastSeenAt: Date | null;
  endedAt: Date | null;
  isActive: boolean;
};

export type SocialProofKind = 'testimonial' | 'feedback';

export type Testimonial = {
  id: string;
  kind: SocialProofKind;
  name: string;
  role: string;
  company: string;
  message: string;
  rating: number;
  visible: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type DashboardData = {
  visitorCount: number;
  contactSubmissions: ContactSubmission[];
  testimonials: Testimonial[];
  visitSessions: VisitSession[];
  analyticsAvailable: boolean;
};

type FirestoreDoc = {
  id: string;
  createdAt?: Timestamp | Date | { seconds: number } | null;
  updatedAt?: Timestamp | Date | { seconds: number } | null;
  [key: string]: unknown;
};

type AdminRole = {
  uid: string;
  role: 'admin' | 'viewer';
  email: string;
};

const CONTACT_SUBMISSIONS = 'contactSubmissions';
const TESTIMONIALS = 'testimonials';
const VISIT_SESSIONS = 'visitSessions';
const STATS = 'stats';
const VISITOR_COUNT_DOC = 'visitorCount';
const ROLES = 'roles';

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 160;
const MAX_SUBJECT_LENGTH = 180;
const MAX_MESSAGE_LENGTH = 3000;
const MAX_CONTACT_MESSAGE_LENGTH = 5000;
const MAX_ROLE_LENGTH = 120;
const MAX_COMPANY_LENGTH = 120;
const MAX_PATH_LENGTH = 240;
const MAX_REFERRER_LENGTH = 500;
const MAX_TIMEZONE_LENGTH = 80;
const MAX_USER_AGENT_LENGTH = 500;

const toDate = (value: Timestamp | Date | { seconds: number } | null | undefined): Date | null => {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === 'object' && 'seconds' in value && typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000);
  }
  return null;
};

const mapContactSubmission = (data: FirestoreDoc): ContactSubmission => ({
  id: data.id,
  name: String(data.name ?? ''),
  email: String(data.email ?? ''),
  subject: String(data.subject ?? ''),
  message: String(data.message ?? ''),
  createdAt: toDate(data.createdAt),
  source: 'portfolio',
});

const mapVisitSession = (data: FirestoreDoc): VisitSession => ({
  id: data.id,
  sessionKey: String(data.sessionKey ?? data.id),
  entryPath: String(data.entryPath ?? '/'),
  currentPath: String(data.currentPath ?? '/'),
  exitPath: String(data.exitPath ?? '/'),
  pageViews: Number(data.pageViews ?? 1),
  durationSeconds: Number(data.durationSeconds ?? 0),
  locale: String(data.locale ?? ''),
  timeZone: String(data.timeZone ?? ''),
  referrer: String(data.referrer ?? ''),
  userAgent: String(data.userAgent ?? ''),
  screenWidth: Number(data.screenWidth ?? 0),
  screenHeight: Number(data.screenHeight ?? 0),
  startedAt: toDate(data.startedAt as Timestamp | Date | { seconds: number } | null | undefined),
  lastSeenAt: toDate(data.lastSeenAt as Timestamp | Date | { seconds: number } | null | undefined),
  endedAt: toDate(data.endedAt as Timestamp | Date | { seconds: number } | null | undefined),
  isActive: Boolean(data.isActive ?? false),
});

const mapSocialEntry = (data: FirestoreDoc): Testimonial => ({
  id: data.id,
  kind: String(data.kind ?? 'testimonial') as SocialProofKind,
  name: String(data.name ?? ''),
  role: String(data.role ?? ''),
  company: String(data.company ?? ''),
  message: String(data.message ?? ''),
  rating: Number(data.rating ?? 5),
  visible: Boolean(data.visible ?? true),
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt),
});

const requireFirestore = () => {
  if (!isFirebaseConfigured || !firestore) {
    throw new Error('Firebase is not configured.');
  }
  return firestore;
};

const requireAuth = () => {
  if (!auth) {
    throw new Error('Firebase auth is not configured.');
  }
  return auth;
};

const collapseWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

const trimToLength = (value: string, maxLength: number) => collapseWhitespace(value).slice(0, maxLength);

const normalizeMultiline = (value: string, maxLength: number) =>
  value
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);

const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const sanitizePath = (value: string) => {
  const normalized = value.trim() || '/';
  return normalized.slice(0, MAX_PATH_LENGTH);
};

export const submitStoredContactMessage = async (input: Omit<ContactSubmission, 'id' | 'createdAt' | 'source'>) => {
  const db = requireFirestore();
  const name = trimToLength(input.name, MAX_NAME_LENGTH);
  const email = trimToLength(input.email, MAX_EMAIL_LENGTH);
  const subject = trimToLength(input.subject, MAX_SUBJECT_LENGTH);
  const message = normalizeMultiline(input.message, MAX_CONTACT_MESSAGE_LENGTH);

  if (name.length < 2 || subject.length < 2 || message.length < 5 || !validateEmail(email)) {
    throw new Error('Invalid contact submission.');
  }

  await addDoc(collection(db, CONTACT_SUBMISSIONS), {
    name,
    email,
    subject,
    message,
    source: 'portfolio',
    createdAt: serverTimestamp(),
  });
};

export const createVisitSession = async (input: {
  sessionId: string;
  entryPath: string;
  currentPath: string;
  locale: string;
  timeZone: string;
  referrer: string;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
}) => {
  const db = requireFirestore();
  const sessionId = trimToLength(input.sessionId, 120);

  await setDoc(doc(db, VISIT_SESSIONS, sessionId), {
    sessionKey: sessionId,
    entryPath: sanitizePath(input.entryPath),
    currentPath: sanitizePath(input.currentPath),
    exitPath: sanitizePath(input.currentPath),
    pageViews: 1,
    durationSeconds: 0,
    locale: trimToLength(input.locale || 'unknown', 40),
    timeZone: trimToLength(input.timeZone || 'unknown', MAX_TIMEZONE_LENGTH),
    referrer: trimToLength(input.referrer || 'direct', MAX_REFERRER_LENGTH),
    userAgent: trimToLength(input.userAgent || 'unknown', MAX_USER_AGENT_LENGTH),
    screenWidth: Math.max(0, Math.round(input.screenWidth || 0)),
    screenHeight: Math.max(0, Math.round(input.screenHeight || 0)),
    startedAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
    endedAt: null,
    isActive: true,
  }, { merge: true });
};

export const updateVisitSession = async (input: {
  sessionId: string;
  currentPath: string;
  exitPath?: string;
  durationSeconds: number;
  isActive: boolean;
  incrementPageView?: boolean;
}) => {
  const db = requireFirestore();
  const payload: Record<string, unknown> = {
    currentPath: sanitizePath(input.currentPath),
    exitPath: sanitizePath(input.exitPath ?? input.currentPath),
    durationSeconds: Math.max(0, Math.round(input.durationSeconds)),
    isActive: input.isActive,
    lastSeenAt: serverTimestamp(),
    endedAt: input.isActive ? null : serverTimestamp(),
  };

  if (input.incrementPageView) {
    payload.pageViews = increment(1);
  }

  await setDoc(doc(db, VISIT_SESSIONS, trimToLength(input.sessionId, 120)), payload, { merge: true });
};

export const submitPortfolioSocialProof = async (
  input: Omit<Testimonial, 'id' | 'visible' | 'createdAt' | 'updatedAt'>
) => {
  const db = requireFirestore();
  const name = trimToLength(input.name, MAX_NAME_LENGTH);
  const role = trimToLength(input.role, MAX_ROLE_LENGTH);
  const company = trimToLength(input.company, MAX_COMPANY_LENGTH);
  const message = normalizeMultiline(input.message, MAX_MESSAGE_LENGTH);
  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));

  if (name.length < 2 || role.length < 2 || message.length < 10) {
    throw new Error('Invalid social proof submission.');
  }

  await addDoc(collection(db, TESTIMONIALS), {
    kind: input.kind,
    name,
    role,
    company,
    message,
    rating,
    visible: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const watchVisibleSocialProof = (onData: (items: Testimonial[]) => void) => {
  const db = requireFirestore();
  const socialQuery = query(
    collection(db, TESTIMONIALS),
    where('visible', '==', true),
    limit(48)
  );

  return onSnapshot(
    socialQuery,
    (snapshot) => {
      const items = snapshot.docs
        .map((entry) => mapSocialEntry({ id: entry.id, ...entry.data() }))
        .sort((a, b) => {
          const aTime = a.createdAt ? a.createdAt.getTime() : 0;
          const bTime = b.createdAt ? b.createdAt.getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, 24);

      onData(items);
    },
    () => {
      onData([]);
    }
  );
};

export const getVisitorCountValue = async () => {
  const db = requireFirestore();
  const snapshot = await getDoc(doc(db, STATS, VISITOR_COUNT_DOC));
  const count = snapshot.exists() ? Number(snapshot.data()?.count ?? 0) : 0;
  return Number.isFinite(count) ? count : 0;
};

export const incrementVisitorCountValue = async () => {
  const db = requireFirestore();
  const visitorRef = doc(db, STATS, VISITOR_COUNT_DOC);

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(visitorRef);
    const currentCount = snapshot.exists() ? Number(snapshot.data()?.count ?? 0) : 0;
    const safeCount = Number.isFinite(currentCount) ? currentCount : 0;
    const nextCount = safeCount + 1;

    transaction.set(
      visitorRef,
      {
        count: nextCount,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return nextCount;
  });
};

export const setVisitorCountValue = async (count: number) => {
  const db = requireFirestore();
  const safeCount = Math.max(0, Math.round(count));
  await setDoc(
    doc(db, STATS, VISITOR_COUNT_DOC),
    {
      count: safeCount,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const watchAdminUser = (callback: (user: User | null) => void) => {
  const firebaseAuth = requireAuth();
  return onAuthStateChanged(firebaseAuth, callback);
};

export const getCurrentAdminRole = async (): Promise<AdminRole | null> => {
  const firebaseAuth = requireAuth();
  const currentUser = firebaseAuth.currentUser;
  if (!currentUser) return null;

  const db = requireFirestore();
  const snapshot = await getDoc(doc(db, ROLES, currentUser.uid));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    uid: currentUser.uid,
    role: String(data.role ?? 'viewer') as AdminRole['role'],
    email: String(data.email ?? currentUser.email ?? ''),
  };
};

export const getDashboardData = async (): Promise<DashboardData> => {
  const db = requireFirestore();
  const [visitorSnapshot, contactsSnapshot, socialSnapshot] = await Promise.all([
    getDoc(doc(db, STATS, VISITOR_COUNT_DOC)),
    getDocs(query(collection(db, CONTACT_SUBMISSIONS), orderBy('createdAt', 'desc'), limit(100))),
    getDocs(query(collection(db, TESTIMONIALS), orderBy('createdAt', 'desc'), limit(100))),
  ]);
  const visitSessionsResult = await getDocs(
    query(collection(db, VISIT_SESSIONS), orderBy('startedAt', 'desc'), limit(200))
  )
    .then((snapshot) => ({ available: true, snapshot }))
    .catch((error) => {
      if (error instanceof Error && /permission|insufficient/i.test(error.message)) {
        return { available: false, snapshot: null };
      }
      throw error;
    });

  const visitorCount = visitorSnapshot.exists() ? Number(visitorSnapshot.data()?.count ?? 0) : 0;

  return {
    visitorCount: Number.isFinite(visitorCount) ? visitorCount : 0,
    contactSubmissions: contactsSnapshot.docs.map((entry) =>
      mapContactSubmission({ id: entry.id, ...entry.data() })
    ),
    testimonials: socialSnapshot.docs.map((entry) =>
      mapSocialEntry({ id: entry.id, ...entry.data() })
    ),
    visitSessions: visitSessionsResult.snapshot
      ? visitSessionsResult.snapshot.docs.map((entry) =>
          mapVisitSession({ id: entry.id, ...entry.data() })
        )
      : [],
    analyticsAvailable: visitSessionsResult.available,
  };
};

export const updateSocialEntry = async (
  input: Omit<Testimonial, 'createdAt' | 'updatedAt'>
) => {
  const db = requireFirestore();
  const name = trimToLength(input.name, MAX_NAME_LENGTH);
  const role = trimToLength(input.role, MAX_ROLE_LENGTH);
  const company = trimToLength(input.company, MAX_COMPANY_LENGTH);
  const message = normalizeMultiline(input.message, MAX_MESSAGE_LENGTH);
  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));

  await updateDoc(doc(db, TESTIMONIALS, input.id), {
    kind: input.kind,
    name,
    role,
    company,
    message,
    rating,
    visible: input.visible,
    updatedAt: serverTimestamp(),
  });
};

export const deleteSocialEntry = async (entryId: string) => {
  const db = requireFirestore();
  await deleteDoc(doc(db, TESTIMONIALS, entryId));
};

export const deleteContactSubmissions = async (entryIds: string[]) => {
  const db = requireFirestore();
  const batch = writeBatch(db);

  entryIds.forEach((entryId) => {
    batch.delete(doc(db, CONTACT_SUBMISSIONS, entryId));
  });

  await batch.commit();
};

export const loginAdmin = async (email: string, password: string) => {
  const firebaseAuth = requireAuth();
  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

export const logoutAdmin = async () => {
  const firebaseAuth = requireAuth();
  await signOut(firebaseAuth);
};
