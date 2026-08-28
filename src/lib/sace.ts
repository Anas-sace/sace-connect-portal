export const SACE_NAME = "South Australian College of English";
export const SACE_TAGLINE = "South Australian College of English";
export const SACE_SUBLINE = "Global learning experiences for ambitious students";

/**
 * Program catalogue. Adding a future program only requires a new entry here —
 * the database stores the program as free text, so nothing else must change.
 */
export const PROGRAMS = [
  {
    value: "Internship Program",
    label: "Internship Program",
    description: "Hands-on industry placement with Australian organisations",
  },
  {
    value: "Immersion Program",
    label: "Immersion Program",
    description: "Cultural and academic immersion at partner campuses",
  },
] as const;

export type ProgramValue = (typeof PROGRAMS)[number]["value"];

export function isKnownProgram(value: string): boolean {
  return PROGRAMS.some((p) => p.value === value);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function sanitizeFilename(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 60) || "Response"
  );
}

export interface ResponseRecord {
  id: string;
  program_type: string;
  name: string;
  phone_whatsapp: string;
  email: string;
  college: string;
  is_demo: boolean;
  submitted_at: string;
  updated_at: string;
}
