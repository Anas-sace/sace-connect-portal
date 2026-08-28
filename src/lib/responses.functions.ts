import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

export const submissionSchema = z.object({
  program_type: z
    .string()
    .trim()
    .min(1, { message: "Please choose what you are looking for." })
    .max(80),
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name." })
    .max(100, { message: "Name must be under 100 characters." }),
  phone_whatsapp: z
    .string()
    .trim()
    .min(7, { message: "Please enter your WhatsApp number." })
    .max(20, { message: "Please enter a valid WhatsApp number." })
    .regex(/^\+?[0-9][0-9\s\-()]{6,19}$/, {
      message: "Please enter a valid WhatsApp number.",
    }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." })
    .max(255),
  college: z
    .string()
    .trim()
    .min(2, { message: "Please enter your college." })
    .max(150),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const submitResponse = createServerFn({ method: "POST" })
  .inputValidator((data: SubmissionInput) => submissionSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { error } = await supabase.from("responses").insert({
      program_type: data.program_type,
      name: data.name,
      phone_whatsapp: data.phone_whatsapp.replace(/\s+/g, " "),
      email: data.email.toLowerCase(),
      college: data.college,
    });

    if (error) {
      console.error("submitResponse failed", error);
      throw new Error("SUBMIT_FAILED");
    }

    return { ok: true } as const;
  });
