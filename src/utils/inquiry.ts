import site from "../config/site.json";

export interface Inquiry {
  name: string;
  email: string;
  business: string;
  project: string;
  budget: string;
  details: string;
  preferred: string;
  website: string;
}
export const projectOptions = [
  { value: "website", label: "Website design & development" },
  { value: "software", label: "Custom business software" },
  { value: "automation", label: "Automation & integration" },
  { value: "support", label: "Maintenance & support" },
  { value: "unsure", label: "Let’s work it out together" },
];
export const preferredOptions = ["Email", "Instagram", "Facebook"];
export const budgetOptions = [
  ...(site.launchOffer.active
    ? [`${site.launchOffer.price} launch offer`]
    : []),
  "Not sure yet",
  "$500–$999",
  "$1,000–$2,499",
  "$2,500–$4,999",
  "$5,000+",
];
export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;
export function validateInquiry(inquiry: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (inquiry.name.trim().length < 2 || inquiry.name.trim().length > 100)
    errors.name = "Enter your name (2–100 characters).";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email.trim()) ||
    inquiry.email.length > 254
  )
    errors.email = "Enter a valid email address.";
  if (inquiry.business.trim().length > 120)
    errors.business = "Keep the business name under 120 characters.";
  if (!projectOptions.some((o) => o.value === inquiry.project))
    errors.project = "Choose a project type.";
  if (inquiry.budget && !budgetOptions.includes(inquiry.budget))
    errors.budget = "Choose one of the listed budget ranges.";
  if (
    inquiry.details.trim().length < 20 ||
    inquiry.details.trim().length > 5000
  )
    errors.details = "Add a little more detail (20–5,000 characters).";
  if (!preferredOptions.includes(inquiry.preferred))
    errors.preferred = "Choose your preferred contact method.";
  return errors;
}
export async function sendInquiry(inquiry: Inquiry, turnstileToken: string) {
  if (inquiry.website) throw new Error("Please use the direct email link.");
  const errors = validateInquiry(inquiry);
  if (Object.keys(errors).length)
    throw new Error("Please check the required fields.");
  let response: Response;
  try {
    response = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...inquiry, turnstileToken }),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error(
      "We couldn’t confirm your inquiry was sent. Please try again or email hello@veyro350.com.",
    );
  }
  let result: { ok?: boolean; message?: string };
  try {
    result = await response.json();
  } catch {
    throw new Error(
      "We couldn’t confirm your inquiry was sent. Please try again or email hello@veyro350.com.",
    );
  }
  if (!response.ok || result?.ok !== true)
    throw new Error(
      (typeof result?.message === "string" && result.message) ||
        "Your inquiry could not be sent. Please try again or email us.",
    );
}
export function inquiryText(inquiry: Inquiry) {
  return `Name: ${inquiry.name}\nEmail: ${inquiry.email}\nBusiness: ${inquiry.business || "Not provided"}\nProject: ${projectOptions.find((o) => o.value === inquiry.project)?.label}\nBudget: ${inquiry.budget || "Not provided"}\n\nProject details:\n${inquiry.details}`;
}
