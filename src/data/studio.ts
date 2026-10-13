export const services = [
  {
    id: "web-design",
    number: "01",
    title: "Websites",
    short: "Help customers find and contact your business.",
    description:
      "We design and build professional websites for small businesses, restaurants and service providers. Customers can learn what you offer, browse your pages and send an inquiry.",
    icon: "web",
    features: [
      "Business websites and landing pages",
      "Restaurant menus and service pages",
      "Mobile-friendly layouts and contact forms",
      "Website updates and basic search optimization",
    ],
    problem: "You need a new website or want to improve an existing one.",
  },
  {
    id: "business-software",
    number: "02",
    title: "Custom business software",
    short: "Manage your daily work in one place.",
    description:
      "We build applications for the tasks your team handles every day. The tools and screens are planned around your business needs.",
    icon: "software",
    features: [
      "Inventory and stock-management tools",
      "Business dashboards and reports",
      "Staff, reservation and operations tools",
      "Customer and internal team portals",
    ],
    problem: "Your business needs a tool that spreadsheets cannot handle well.",
  },
  {
    id: "automation",
    number: "03",
    title: "Business automation",
    short: "Reduce repetitive work.",
    description:
      "We plan and build workflows that connect your tools and carry out routine steps, such as updating records or sending a notification.",
    icon: "automation",
    features: [
      "Inquiry and appointment workflows",
      "Customer follow-ups and notifications",
      "Data updates between business tools",
      "Task automation, including AI-assisted steps where useful",
    ],
    problem: "Your team keeps repeating the same manual tasks.",
  },
  {
    id: "maintenance",
    number: "04",
    title: "Website maintenance",
    short: "Keep your website up to date.",
    description:
      "We offer agreed support plans for routine updates, content changes and technical assistance after your website is built.",
    icon: "support",
    features: [
      "Content changes and routine updates",
      "Performance and security-related checks",
      "Hosting and deployment support",
      "Ongoing technical assistance",
    ],
    problem: "You need help maintaining an existing website.",
  },
] as const;
export const processSteps = [
  {
    number: "1",
    title: "Tell us what you need",
    description:
      "Share your business, the problem you want to solve and any existing website or tools.",
  },
  {
    number: "2",
    title: "Review the plan and price",
    description:
      "We explain the recommended solution, agree on the scope and provide a quote.",
  },
  {
    number: "3",
    title: "We build and test it",
    description:
      "You review the work before launch. We also discuss handover and ongoing support.",
  },
];
export const industries = [
  {
    number: "01",
    title: "Restaurants, bars & cafés",
    line: "Websites and tools for restaurant teams.",
    description:
      "Help guests find your menu and explore tools to manage reservations, staff and stock.",
    examples: [
      "Restaurant websites and digital menus",
      "Reservation and staff-management tools",
      "Inventory and ingredient-cost tracking",
    ],
    project: "ember-and-olive",
  },
  {
    number: "02",
    title: "Cleaning & home services",
    line: "Make your services easy to find.",
    description:
      "Explain what you offer, where you work and how customers can request a quote.",
    examples: [
      "Service pages and coverage information",
      "Quote forms with useful project questions",
      "Appointment and inquiry follow-ups",
    ],
    project: "liberty-shine",
  },
  {
    number: "03",
    title: "Contractors & local providers",
    line: "Show your work and collect project inquiries.",
    description:
      "Present your services and completed projects, and make it easy for customers to contact you.",
    examples: [
      "Service websites and project galleries",
      "Estimate and project-request forms",
      "Customer and internal project tools",
    ],
    project: null,
  },
  {
    number: "04",
    title: "Retail & small businesses",
    line: "Websites and everyday business tools.",
    description:
      "Introduce your business online and explore software for products, suppliers and stock.",
    examples: [
      "Business websites and product information",
      "Inventory and supplier-management tools",
      "Business dashboards and reports",
    ],
    project: "stockpilot",
  },
  {
    number: "05",
    title: "Other growing businesses",
    line: "A solution for your specific needs.",
    description:
      "Tell us how your business works. We can help identify a useful website, application or automation project.",
    examples: [
      "Customer and staff portals",
      "Tools for your team’s daily tasks",
      "Connections between existing business tools",
    ],
    project: null,
  },
];
