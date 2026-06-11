import fs from "fs";
import path from "path";
import { initializeApp, type FirebaseOptions } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export const MINISTRY_NAME = "VIA Global";
export const DEFAULT_META_TITLE = "VIA Global | Raising Light, Faith, and Purpose";
export const DEFAULT_META_DESCRIPTION =
  "A community dedicated to spiritual growth, authentic connection, and impactful outreach. Join our modern ministry platform.";

export type ProgramShareMeta = {
  title: string;
  description: string;
  image: string;
  url?: string;
};

type FirebaseWebConfig = FirebaseOptions & {
  firestoreDatabaseId?: string;
};

let cachedFirestore: ReturnType<typeof getFirestore> | null = null;

const getFirebaseConfig = () => {
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
  return JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8")) as FirebaseWebConfig;
};

const getFirestoreInstance = () => {
  if (cachedFirestore) {
    return cachedFirestore;
  }

  const firebaseConfig = getFirebaseConfig();
  const firebaseApp = initializeApp(firebaseConfig);
  cachedFirestore = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
  return cachedFirestore;
};

export const getPublicSiteUrl = () => {
  const configuredUrl =
    process.env.PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return configuredUrl.replace(/\/+$/, "");
};

export const getPublicLogoUrl = () => {
  return (
    process.env.PUBLIC_LOGO_URL ||
    "https://ik.imagekit.io/4lndq5ke52/vialogo.png?updatedAt=1781025642014"
  );
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const getDefaultShareMeta = (): ProgramShareMeta => ({
  title: DEFAULT_META_TITLE,
  description: DEFAULT_META_DESCRIPTION,
  image: getPublicLogoUrl(),
  url: getPublicSiteUrl() || undefined,
});

const buildProgramDescription = (program: Record<string, unknown>) => {
  const summaryParts = [
    typeof program.subtitle === "string" ? program.subtitle : "",
    typeof program.date === "string" ? `Date: ${program.date}` : "",
    typeof program.time === "string" && program.time ? `Time: ${program.time}` : "",
    typeof program.venue === "string" && program.venue ? `Venue: ${program.venue}` : "",
  ].filter(Boolean);

  return summaryParts.join(" | ") || DEFAULT_META_DESCRIPTION;
};

export const getProgramShareMeta = async (programId: string): Promise<ProgramShareMeta | null> => {
  try {
    const firestore = getFirestoreInstance();
    const snapshot = await getDoc(doc(firestore, "programs", programId));
    if (!snapshot.exists()) {
      return null;
    }

    const program = snapshot.data() as Record<string, unknown>;
    const siteUrl = getPublicSiteUrl();

    return {
      title:
        typeof program.title === "string" && program.title
          ? `${program.title} | ${MINISTRY_NAME}`
          : DEFAULT_META_TITLE,
      description: buildProgramDescription(program),
      image:
        typeof program.image === "string" && program.image
          ? program.image
          : getPublicLogoUrl(),
      url: siteUrl ? `${siteUrl}/programs/${programId}` : undefined,
    };
  } catch (error) {
    console.error("Failed to build program share metadata", error);
    return null;
  }
};

export const applyShareMeta = (html: string, meta: ProgramShareMeta) => {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const image = escapeHtml(meta.image);
  const url = escapeHtml(meta.url || "");

  let output = html.replace(/<title>.*?<\/title>/is, `<title>${title}</title>`);
  output = output.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="${description}" />`
  );
  output = output.replace(
    /<meta property="og:title" content=".*?" \/>/i,
    `<meta property="og:title" content="${title}" />`
  );
  output = output.replace(
    /<meta property="og:description" content=".*?" \/>/i,
    `<meta property="og:description" content="${description}" />`
  );
  output = output.replace(
    /<meta property="og:image" content=".*?" \/>/i,
    `<meta property="og:image" content="${image}" />`
  );
  output = output.replace(
    /<meta property="twitter:title" content=".*?" \/>/i,
    `<meta property="twitter:title" content="${title}" />`
  );
  output = output.replace(
    /<meta property="twitter:description" content=".*?" \/>/i,
    `<meta property="twitter:description" content="${description}" />`
  );
  output = output.replace(
    /<meta property="twitter:image" content=".*?" \/>/i,
    `<meta property="twitter:image" content="${image}" />`
  );

  if (url) {
    if (/<meta property="og:url" content=".*?" \/>/i.test(output)) {
      output = output.replace(
        /<meta property="og:url" content=".*?" \/>/i,
        `<meta property="og:url" content="${url}" />`
      );
    } else {
      output = output.replace("</head>", `    <meta property="og:url" content="${url}" />\n  </head>`);
    }
  }

  return output;
};
