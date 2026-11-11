export interface NailDesign {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  aestheticId?: string;
  optionalPrice?: string; // Configurable: keep empty if not set
}

export interface NailService {
  id: string;
  name: string;
  description: string;
  image: string;
  optionalPrice?: string;
  optionalDuration?: string;
  popular?: boolean;
}

export interface NailAesthetic {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accentColor: string;
  sampleDesignIds: string[];
}

export const BRAND_CONFIG = {
  brandName: "Nails by Sanu",
  artistName: "Sanu",
  tagline: "Every Detail. Every Shade. Your Signature Style.",
  heroHeadline: "A Little Art. A Lot of Elegance.",
  heroSubtitle:
    "Discover your signature nail style with beautiful designs, delicate details, and a touch of pink luxury.",
  location: "Satara, Maharashtra",
  city: "Satara",
  
  // WhatsApp Configuration
  whatsappNumber: "9359387837",
  whatsappCountryCode: "+91",
  whatsappFull: "+919359387837",
  whatsappBaseUrl: "https://wa.me/919359387837",
  
  // Instagram Configuration
  instagramUsername: "nailsbysanu_18",
  instagramProfileUrl: "https://www.instagram.com/nailsbysanu_18/",
  
  // Luxury Palette Tokens
  colors: {
    blushPink: "#F8C8DC",
    softRose: "#EFA6C8",
    roseGold: "#B76E79",
    pearlWhite: "#FFF9FC",
    champagne: "#F5E6D3",
    deepBurgundy: "#57243B",
    softLavender: "#E9DDF8",
  },
};

// Gallery Categories
export const GALLERY_CATEGORIES = [
  "All",
  "Pink Luxury Nails",
  "French Nail Art",
  "Bridal Nails",
  "Glitter & Glam",
  "Chrome Nails",
  "Minimalist Nails",
  "Cute & Girly Nails",
  "Floral Nail Art",
  "Korean Nail Art",
  "3D Nail Art",
  "Nail Extensions",
  "Trending Designs",
] as const;

// Curated Gallery Items (Centrally managed for easy replacement by Sanu)
export const GALLERY_DESIGNS: NailDesign[] = [
  {
    id: "design-1",
    name: "Glazed Blush Chrome Nails",
    category: "Pink Luxury Nails",
    aestheticId: "luxury-diva",
    image: "/images/hero-nail-art.jpg",
    description: "Almond-shaped glazed blush pink chrome with delicate micro pearl cuffs and subtle gold foil accents.",
  },
  {
    id: "design-2",
    name: "Rose Gold French Tip Couture",
    category: "French Nail Art",
    aestheticId: "minimal-chic",
    image: "/images/french-chrome.jpg",
    description: "Contemporary French manicure featuring sheer blush gel base and high-shine rose gold mirror tips.",
  },
  {
    id: "design-3",
    name: "Bridal Lace & Pearl Elegance",
    category: "Bridal Nails",
    aestheticId: "bridal-elegance",
    image: "/images/bridal-pearl.jpg",
    description: "Exquisite bridal nail design with handcrafted white lace patterns, delicate pearl borders, and crystal accents.",
  },
  {
    id: "design-4",
    name: "Rose Sparkle Ombré Stiletto",
    category: "Glitter & Glam",
    aestheticId: "glam-queen",
    image: "/images/glitter-glam.jpg",
    description: "Dazzling champagne and rose gold glitter ombré over blush gel, catching the light from every angle.",
  },
  {
    id: "design-5",
    name: "Dewy Syrup Korean Aura Nails",
    category: "Korean Nail Art",
    aestheticId: "soft-girl",
    image: "/images/korean-aura.jpg",
    description: "Trending Korean jelly blush aura nails with soft diffuse center gradient and glassy wet shine.",
  },
  {
    id: "design-6",
    name: "Sculpted 3D Peony & Dewdrop Crystals",
    category: "3D Nail Art",
    aestheticId: "pink-princess",
    image: "/images/floral-3d.jpg",
    description: "Handcrafted 3D sculpted floral petals crowned with gold caviar beads and Swarovski crystal dewdrops.",
  },
  {
    id: "design-7",
    name: "Fine-Line Rose Gold Minimalist",
    category: "Minimalist Nails",
    aestheticId: "minimal-chic",
    image: "/images/minimalist-chic.jpg",
    description: "Ultra-clean milky blush nails with geometric razor-thin metallic rose gold lines and micro dots.",
  },
  {
    id: "design-8",
    name: "Ribbon Bows & Jelly Heart Charms",
    category: "Cute & Girly Nails",
    aestheticId: "cute-playful",
    image: "/images/cute-girly.jpg",
    description: "Charming pastel pink set with 3D sculpted ribbon bows, iridescent pearl hearts, and syrup gloss.",
  },
  {
    id: "design-9",
    name: "Prismatic Velvet Magnetic Cat-Eye",
    category: "Trending Designs",
    aestheticId: "chrome-obsession",
    image: "/images/cat-eye-velvet.jpg",
    description: "Mesmerizing mauve-pink magnetic velvet cat-eye finish with shifting multidimensional holographic sheen.",
  },
  {
    id: "design-10",
    name: "Rose Quartz Marble Extensions",
    category: "Nail Extensions",
    aestheticId: "luxury-diva",
    image: "/images/extensions-marble.jpg",
    description: "Sculpted stiletto extensions with realistic rose quartz veining, metallic gold foil, and glass topcoat.",
  },
  {
    id: "design-11",
    name: "Floral Watercolor & Pearl Accents",
    category: "Floral Nail Art",
    aestheticId: "pink-princess",
    image: "/images/floral-watercolor.jpg",
    description: "Soft blooming peony watercolor effects paired with subtle pearl clusters and champagne shimmer.",
  },
  {
    id: "design-12",
    name: "High-Shine Liquid Chrome Diva",
    category: "Chrome Nails",
    aestheticId: "chrome-obsession",
    image: "/images/french-chrome.jpg",
    description: "Mirror-finish rose gold and metallic blush chrome with flawless cuticle contouring.",
  },
];

// Nail Aesthetics for "What Is Your Nail Aesthetic?" Interactive Finder
export const NAIL_AESTHETICS: NailAesthetic[] = [
  {
    id: "soft-girl",
    name: "Soft Girl",
    tagline: "Dewy, dreamy & ethereal",
    description: "Delicate syrup gels and translucent blush aura gradients.",
    image: "/images/korean-aura.jpg",
    accentColor: "#F8C8DC",
    sampleDesignIds: ["design-5"],
  },
  {
    id: "pink-princess",
    name: "Pink Princess",
    tagline: "Romantic & floral",
    description: "Blush tones with 3D floral petals and fairytale sparkle.",
    image: "/images/floral-3d.jpg",
    accentColor: "#EFA6C8",
    sampleDesignIds: ["design-6"],
  },
  {
    id: "minimal-chic",
    name: "Minimal Chic",
    tagline: "Clean & understated",
    description: "Milky sheer bases with razor-thin rose gold lines.",
    image: "/images/minimalist-chic.jpg",
    accentColor: "#F5E6D3",
    sampleDesignIds: ["design-7", "design-2"],
  },
  {
    id: "bridal-elegance",
    name: "Bridal Elegance",
    tagline: "Timeless wedding couture",
    description: "Intricate white lace, soft champagne ombré, and micro pearls.",
    image: "/images/bridal-pearl.jpg",
    accentColor: "#FFF9FC",
    sampleDesignIds: ["design-3"],
  },
  {
    id: "glam-queen",
    name: "Glam Queen",
    tagline: "Sparkling & bold",
    description: "High-voltage glitter ombré and prismatic crystals.",
    image: "/images/glitter-glam.jpg",
    accentColor: "#B76E79",
    sampleDesignIds: ["design-4"],
  },
  {
    id: "chrome-obsession",
    name: "Chrome Obsession",
    tagline: "Reflective & sleek",
    description: "Mirror glazed shine and magnetic velvet cat-eye depth.",
    image: "/images/cat-eye-velvet.jpg",
    accentColor: "#E9DDF8",
    sampleDesignIds: ["design-9"],
  },
  {
    id: "cute-playful",
    name: "Cute & Playful",
    tagline: "Sweet & whimsical",
    description: "3D sculpted ribbons, jelly hearts, and pastel pink charms.",
    image: "/images/cute-girly.jpg",
    accentColor: "#F8C8DC",
    sampleDesignIds: ["design-8"],
  },
  {
    id: "luxury-diva",
    name: "Luxury Diva",
    tagline: "Opulent & sculpted",
    description: "Sculpted marble extensions with 24k gold leaf foil.",
    image: "/images/extensions-marble.jpg",
    accentColor: "#57243B",
    sampleDesignIds: ["design-1", "design-10"],
  },
];

// Simplified Services (5 Core, highly relevant nail services)
export const NAIL_SERVICES: NailService[] = [
  {
    id: "service-gel",
    name: "Gel Polish & Overlay",
    description: "Long-lasting, chip-resistant gel polish cured under LED light with mirror gloss.",
    image: "/images/hero-nail-art.jpg",
    popular: true,
  },
  {
    id: "service-extensions",
    name: "Nail Extensions & Sculpting",
    description: "Custom sculpted extensions in your preferred shape (almond, coffin, stiletto, or square).",
    image: "/images/extensions-marble.jpg",
    popular: true,
  },
  {
    id: "service-french",
    name: "Modern French & Chrome Art",
    description: "Classic French tips reimagined with metallic chrome, micro-lines, and glazed finishes.",
    image: "/images/french-chrome.jpg",
    popular: false,
  },
  {
    id: "service-bridal",
    name: "Bridal Couture Nails",
    description: "Wedding day artistry featuring delicate lace, pearl embellishments, and crystal accents.",
    image: "/images/bridal-pearl.jpg",
    popular: true,
  },
  {
    id: "service-custom",
    name: "Custom & 3D Nail Art",
    description: "Bespoke hand-painted nail designs, sculpted 3D petals, charms, and cat-eye magnetic effects.",
    image: "/images/floral-3d.jpg",
    popular: false,
  },
];

// Helper to construct official WhatsApp URL with encoded message
export function buildWhatsAppLink(message: string): string {
  return `${BRAND_CONFIG.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}

// Generate inquiry message for design
export function getDesignWhatsAppMessage(designName: string): string {
  return `Hello Sanu! I found your nail art website and I am interested in booking this design: ${designName}.
Please share the availability and pricing. Thank you!`;
}

// Generate inquiry message for service
export function getServiceWhatsAppMessage(serviceName: string): string {
  return `Hello Sanu! I am interested in inquiring about your "${serviceName}" service.
Could you please share your upcoming availability and pricing details? Thank you!`;
}

// Generate inquiry message for aesthetic
export function getAestheticWhatsAppMessage(aestheticName: string, designName?: string): string {
  if (designName) {
    return `Hello Sanu! I explored the "What Is Your Nail Aesthetic?" finder on your website and loved the "${aestheticName}" vibe (specifically the ${designName}).
Could you please share your availability and pricing for this look? Thank you!`;
  }
  return `Hello Sanu! I explored your website and fell in love with the "${aestheticName}" nail aesthetic.
Could you please share your availability and consultation details? Thank you!`;
}

// Generate full booking modal message
export interface BookingInquiryData {
  customerName: string;
  selectedDesign?: string;
  selectedService?: string;
  preferredDate?: string;
  preferredTime?: string;
  additionalMessage?: string;
}

export function getFullBookingMessage(data: BookingInquiryData): string {
  return `Hello Sanu!
I would like to enquire about an appointment.
Name: ${data.customerName || "Guest"}
Design: ${data.selectedDesign || "To be discussed"}
Service: ${data.selectedService || "Custom Nail Art"}
Preferred Date: ${data.preferredDate || "Flexible"}
Preferred Time: ${data.preferredTime || "Flexible"}
Additional Message: ${data.additionalMessage || "None"}

Please let me know your availability and pricing.
Thank you!`;
}

// Generate Instagram DM prewritten copy
export function getInstagramDmText(designOrService?: string): string {
  const item = designOrService ? `I am interested in ${designOrService}.` : "I would love to explore your nail art designs.";
  return `Hi Sanu! I found your nail art website and would love to enquire about an appointment. ${item} Could you please share your availability and pricing? Thank you!`;
}
