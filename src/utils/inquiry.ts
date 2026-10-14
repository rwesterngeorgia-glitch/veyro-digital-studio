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
// Preview adapter: no network, logging, browser storage or delivery.
// Replace with an authorized server endpoint after delivery and error handling are tested.
export async function prepareInquiry(inquiry: Inquiry) {
  if (inquiry.website)
    throw new Error(
      "This inquiry cannot be reviewed. Please use the direct email link.",
    );
  const errors = validateInquiry(inquiry);
  if (Object.keys(errors).length)
    throw new Error("Please check the required fields.");
  return {
    kind: "preview" as const,
    inquiry: {
      ...inquiry,
      name: inquiry.name.trim(),
      email: inquiry.email.trim(),
      business: inquiry.business.trim(),
      details: inquiry.details.trim(),
    },
  };
}
export function inquiryText(inquiry: Inquiry) {
  return `Name: ${inquiry.name}\nEmail: ${inquiry.email}\nBusiness: ${inquiry.business || "Not provided"}\nProject: ${projectOptions.find((o) => o.value === inquiry.project)?.label}\nBudget: ${inquiry.budget || "Not provided"}\n\nProject details:\n${inquiry.details}`;
}
