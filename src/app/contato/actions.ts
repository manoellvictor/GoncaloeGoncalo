"use server";

import { z } from "zod";
import { getSupabaseClient } from "@/lib/supabase/server";

/**
 * Envio do formulário "Fale Conosco" (prd.md §6.10).
 *
 * A validação roda no servidor: os atributos `required` do HTML são
 * conveniência de UX e podem ser burlados. O consentimento LGPD é exigido aqui
 * e de novo pelo RLS (`with check (lgpd_consent = true)`).
 */

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo.")
    .max(120, "Nome muito longo."),
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido, como nome@empresa.com.")
    .max(160, "E-mail muito longo."),
  phone: z
    .string()
    .trim()
    .min(1, "Informe seu telefone.")
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 13;
      },
      "Informe um telefone válido com DDD, como (98) 99999-9999.",
    ),
  company: z.string().trim().max(120, "Nome da empresa muito longo.").optional(),
  message: z
    .string()
    .trim()
    .min(20, "Descreva sua necessidade em pelo menos 20 caracteres.")
    .max(4000, "Mensagem muito longa. Resuma em até 4000 caracteres."),
  // Checkbox não marcado não é enviado no FormData, então o valor chega
  // `undefined` — daí o optional antes do refine.
  lgpdConsent: z
    .string()
    .optional()
    .refine(
      (value) => value === "on",
      "É preciso autorizar o tratamento dos seus dados para enviar.",
    ),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Erros por campo, para exibir junto ao input correspondente. */
  errors?: Partial<Record<keyof z.infer<typeof schema>, string>>;
  /** Devolve o que o usuário digitou para não perder o preenchimento no erro. */
  values?: Record<string, string>;
};

export const initialContactState: ContactFormState = { status: "idle" };

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    company: String(formData.get("company") ?? ""),
    message: String(formData.get("message") ?? ""),
    lgpdConsent: formData.get("lgpdConsent")
      ? String(formData.get("lgpdConsent"))
      : undefined,
  };

  // Preserva o preenchimento (menos o consentimento, que é re-afirmado)
  const values = {
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    company: raw.company,
    message: raw.message,
  };

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: ContactFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof z.infer<typeof schema>;
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return {
      status: "error",
      message: "Revise os campos destacados abaixo.",
      errors,
      values,
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error("[contato] Supabase não configurado — envio não persistido.");
    return {
      status: "error",
      message:
        "Não foi possível enviar sua mensagem agora. Tente novamente ou fale conosco pelo WhatsApp.",
      values,
    };
  }

  const { error } = await supabase.from("contact_submissions").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    company: parsed.data.company || null,
    message: parsed.data.message,
    lgpd_consent: true,
  });

  if (error) {
    console.error(`[contato] falha ao gravar lead: ${error.message}`);
    return {
      status: "error",
      message:
        "Não foi possível enviar sua mensagem agora. Tente novamente ou fale conosco pelo WhatsApp.",
      values,
    };
  }

  // PENDENTE: disparar e-mail transacional para o escritório assim que o
  // serviço de envio for definido (prd.md §6.10). O lead já fica persistido.
  return {
    status: "success",
    message:
      "Mensagem enviada. Nossa equipe entrará em contato em até um dia útil.",
  };
}
