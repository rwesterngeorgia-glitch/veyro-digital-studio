export interface ProjectImage {
  key: string;
  title: string;
  caption: string;
  alt: string;
  mobile?: boolean;
}
export interface Project {
  slug: string;
  number: string;
  name: string;
  industry: string;
  category: string[];
  services: string[];
  headline: string;
  summary: string;
  coverAlt: string;
  theme: string;
  links: { label: string; href: string }[];
  objective: string;
  scenario: string;
  approach: string;
  features: { title: string; description: string }[];
  tech: string[];
  technical: string;
  disclosure: string;
  gallery: ProjectImage[];
}
export const projects: Project[] = [
  {
    slug: "ember-and-olive",
    number: "01",
    name: "Ember & Olive",
    industry: "Hospitality",
    category: ["websites", "software"],
    services: ["Web design", "Business software"],
    theme: "ember",
    headline: "Restaurant website and management tools",
    summary:
      "A restaurant website with a digital menu, demo reservations, menu editing and staff scheduling.",
    coverAlt:
      "Actual Ember & Olive homepage with editorial typography and a warm Mediterranean dining-room photograph.",
    links: [
      {
        label: "Open restaurant website",
        href: "https://ember-olive-demo.pages.dev/",
      },
      {
        label: "Try the dashboard",
        href: "https://ember-olive-demo.pages.dev/admin",
      },
    ],
    objective:
      "Show how a restaurant can combine a useful website for guests with management tools for its team.",
    scenario:
      "This fictional Philadelphia restaurant needs a website for guests and tools to manage dishes, reservations and staff.",
    approach:
      "Guests can find the menu and try a booking. Managers use separate screens for editing dishes, reviewing reservations and planning shifts. Both parts work on smaller screens.",
    features: [
      {
        title: "Digital menu",
        description: "Browse dishes by category and filter by dietary labels.",
      },
      {
        title: "Menu editing",
        description:
          "Edit dish prices, categories, availability, allergens and images in the working demo.",
      },
      {
        title: "Reservation management",
        description:
          "Try a sample booking, review guest details and update reservation statuses.",
      },
      {
        title: "Staff scheduling and daily tasks",
        description: "Plan sample staff shifts and manage daily checklists.",
      },
    ],
    tech: ["React", "TypeScript", "Vite", "React Router"],
    technical:
      "The static application uses versioned browser-local storage for isolated, editable demo data. Native dialogs, responsive management screens and reduced-motion support are part of the experience. The admin is a public demonstration; production use would need authentication, a backend and verified booking integrations.",
    disclosure:
      "Fictional portfolio concept, not an operating restaurant or paid client project. All reservations, team records and metrics are demonstration data. Changes stay in your browser; no real bookings or messages are sent.",
    gallery: [
      {
        key: "dashboard",
        title: "Management dashboard",
        caption: "The actual management overview, with fictional service data.",
        alt: "Ember & Olive restaurant management dashboard with demonstration reservations, staff summary and activity.",
      },
      {
        key: "menu",
        title: "Digital menu",
        caption: "Categories, dish descriptions and dietary filtering.",
        alt: "Actual categorized Ember & Olive digital menu with dish descriptions and dietary labels.",
      },
      {
        key: "editor",
        title: "Menu editor",
        caption: "Edit a dish’s price, category and availability in the demo.",
        alt: "Ember & Olive dish editor dialog showing editable menu fields.",
      },
      {
        key: "scheduling",
        title: "Staff scheduling",
        caption: "The staff calendar and sample shift planning.",
        alt: "Ember & Olive weekly calendar of fictional staff shifts.",
      },
      {
        key: "reservations",
        title: "Reservation management",
        caption: "Searchable reservations and demonstration status controls.",
        alt: "Ember & Olive reservation-management screen containing fictional guest records.",
      },
      {
        key: "mobile",
        title: "Mobile website",
        caption: "The restaurant website on a mobile screen.",
        alt: "Actual mobile Ember & Olive homepage with restaurant photography and large serif headline.",
        mobile: true,
      },
    ],
  },
  {
    slug: "stockpilot",
    number: "02",
    name: "StockPilot",
    industry: "Business operations",
    category: ["software"],
    services: ["Custom software", "Interface design"],
    theme: "stock",
    headline: "Inventory and operations management software",
    summary:
      "An application for tracking stock, supplier orders, ingredient costs and waste.",
    coverAlt:
      "Actual StockPilot application overview with stock values, inventory charts and demonstration alerts.",
    links: [
      {
        label: "Open product website",
        href: "https://stockpilot-demo.pages.dev/",
      },
      {
        label: "Try the application",
        href: "https://stockpilot-demo.pages.dev/app",
      },
    ],
    objective:
      "Bring stock records, purchasing, recipe costs and waste tracking into one working application.",
    scenario:
      "A fictional hospitality business needs to track stock across locations, receive deliveries, calculate ingredient costs and record waste.",
    approach:
      "Searchable product tables, clear forms and reports keep daily tasks easy to find. A guided tour helps visitors try the application, including its mobile layouts.",
    features: [
      {
        title: "Inventory tracking",
        description:
          "Search products, update quantities and view a history of stock changes.",
      },
      {
        title: "Purchase orders",
        description:
          "Create supplier orders, record partial deliveries and see what is still due.",
      },
      {
        title: "Recipe costing",
        description:
          "Calculate ingredient costs and theoretical recipe margins using sample prices.",
      },
      {
        title: "Waste tracking and reports",
        description:
          "Log waste, update stock and view reports, checklists and alerts.",
      },
    ],
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Recharts"],
    technical:
      "Typed commands apply stock changes atomically and preserve movement records. Transfers balance across locations, incompatible units and negative balances are rejected, and receipts have replay protection. Versioned browser-local persistence keeps each visitor’s demo isolated. This prototype does not implement production authentication, a server database, accounting valuation or live supplier connections.",
    disclosure:
      "Interactive portfolio concept, not production software or a paid client project. All business records are fictional. Changes stay in your browser. Recipe margins are theoretical; no measured savings or actual sales are represented.",
    gallery: [
      {
        key: "inventory",
        title: "Inventory list",
        caption:
          "The actual product catalog with quantities, costs and actions.",
        alt: "StockPilot inventory table with fictional products, units, stock balances and catalog controls.",
      },
      {
        key: "purchasing",
        title: "Purchase orders",
        caption:
          "Supplier orders and partial receiving in the working prototype.",
        alt: "StockPilot purchase-order workspace with sample supplier orders and receiving statuses.",
      },
      {
        key: "recipes",
        title: "Recipe costing",
        caption: "Ingredient-based costs and theoretical recipe margins.",
        alt: "StockPilot recipe-costing screen with sample recipe cards and theoretical margin calculations.",
      },
      {
        key: "waste",
        title: "Waste tracking",
        caption:
          "Recorded waste, linked stock changes and event-derived charts.",
        alt: "StockPilot waste-management workspace with sample loss entries and charts.",
      },
      {
        key: "mobile",
        title: "Mobile inventory tools",
        caption: "An actual mobile inventory workflow, captured at 390 pixels.",
        alt: "StockPilot mobile inventory interface with fictional product records.",
        mobile: true,
      },
    ],
  },
  {
    slug: "liberty-shine",
    number: "03",
    name: "Liberty Shine Cleaning",
    industry: "Home services",
    category: ["websites"],
    services: ["Web design", "Web development"],
    theme: "liberty",
    headline: "Website for a cleaning business",
    summary:
      "A business website with service pages, an FAQ and a demonstration quote form.",
    coverAlt:
      "Actual Liberty Shine Cleaning homepage with warm ivory design, forest-green typography and an illustrative kitchen photograph.",
    links: [
      { label: "Open live website", href: "https://liberty-shine.pages.dev/" },
    ],
    objective:
      "Build a complete cleaning-company website that clearly explains the services and how to request a quote.",
    scenario:
      "This fictional Philadelphia cleaning business needs to explain its services and help visitors prepare a quote inquiry.",
    approach:
      "Services, common questions and contact information are organized into separate pages. The menu and demonstration inquiry form work on mobile screens.",
    features: [
      {
        title: "Five-page website",
        description:
          "Home, Services, About, FAQ and Contact pages explain the business and its services.",
      },
      {
        title: "Service information",
        description:
          "Sample cleaning descriptions help visitors understand which service to request.",
      },
      {
        title: "Mobile-friendly navigation",
        description:
          "Working navigation and readable pages on phones, tablets and desktops.",
      },
      {
        title: "Quote inquiry form",
        description:
          "A demonstration quote form with clear validation. No messages are sent.",
      },
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Static export"],
    technical:
      "The Next.js App Router site exports to static files. Its quote form validates locally without sending or storing messages. Semantic page structure, visible keyboard focus and reduced-motion behavior support navigation. A real business would need verified content and a tested server-side inquiry delivery integration.",
    disclosure:
      "Fictional portfolio concept, not an active cleaning business or paid client project. Contact information in the demo is illustrative. No real inquiries are sent or stored. Photography within the captured website is illustrative stock imagery.",
    gallery: [
      {
        key: "services",
        title: "Service pages",
        caption: "Actual service-page design with useful sample scopes.",
        alt: "Liberty Shine service page showing sample cleaning scopes and editorial layout.",
      },
      {
        key: "contact",
        title: "Contact and quote form",
        caption:
          "The actual contact page and clearly labeled demonstration form.",
        alt: "Liberty Shine contact page with accessible quote form fields and demo disclosure.",
      },
      {
        key: "detail",
        title: "About page",
        caption: "The About page, captured from the actual demo.",
        alt: "Liberty Shine About page with forest-green headings and warm ivory styling.",
      },
      {
        key: "mobile",
        title: "Mobile website",
        caption: "The real homepage layout on a smaller screen.",
        alt: "Actual Liberty Shine mobile homepage with stacked editorial content.",
        mobile: true,
      },
    ],
  },
];
