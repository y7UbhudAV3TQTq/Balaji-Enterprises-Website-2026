export interface Product {
  id: string;
  name: string;
  category: 'extinguishers' | 'signage';
  image: string;
  description: string;
  specs: string[];
  badge?: string;
  defaultSize?: string;
}

export const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'extinguishers', label: 'Fire Extinguisher' },
  { id: 'signage', label: 'All Types of Signage Board' },
];

export const ALL_PRODUCTS: Product[] = [
  // --- FIRE EXTINGUISHERS ---
  { 
    id: 'ext-1', 
    name: 'Clean Agent Stored Pressure 6 Kg', 
    category: 'extinguishers', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/clean%20agent%20stored%20pressure%20fire%20extinguisher%206%20kg.png',
    description: 'Premier clean agent solution for high-end electronic environments.',
    specs: ['6kg Capacity', 'Class B, C', 'Eco-Friendly'],
    badge: 'Premium'
  },
  { 
    id: 'ext-2', 
    name: 'Clean Agent Stored Pressure 4 Kg', 
    category: 'extinguishers', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/water.jpg',
    description: 'Perfect for server rooms and data centers.',
    specs: ['4kg Capacity', 'Class B, C', 'Non-Conductive']
  },
  { 
    id: 'ext-4', 
    name: 'ABC Clean Agent Moldren 15 Kg', 
    category: 'extinguishers', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/ABC%20clean%20agent%20moldren%20type%20fire%20extinguisher%2015%20kg.jpg',
    description: 'Heavy duty modular clean agent for industrial protection.',
    specs: ['15kg Capacity', 'Automatic Opt.', 'Steel Body']
  },
  { 
    id: 'ext-11', 
    name: '9 Ltr Mechanical Foam Cartridge', 
    category: 'extinguishers', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/mechanical%20foam%20catridge%20type%20fire%20extinguisher%209%20liter.png',
    description: 'Effective for flammable liquid fires like petrol/diesel.',
    specs: ['9 Liter', 'Class A, B', 'AFFF Foam']
  },
  { 
    id: 'ext-23', 
    name: '45 Kg High Capacity ABC/BC', 
    category: 'extinguishers', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/high%20capacity%20fire%20extinguisher%2045%20kg.jpeg',
    description: 'Massive capacity for refineries and large factories.',
    specs: ['45kg Total', 'ISI Marked', 'Trolley Case'],
    badge: 'Industrial'
  },
  { 
    id: 'ext-35', 
    name: '22.5 Kg Trolley Mounted CO2', 
    category: 'extinguishers', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/trolley%20mounted%20co2%20type%20fire%20extinguisher%2022.5kg.jpg',
    description: 'Professional CO2 flood protection on wheels.',
    specs: ['22.5kg Capacity', 'Class B, C', 'High Pressure']
  },
  { 
    id: 'ext-refill', 
    name: 'Refilling Fire Extinguisher Service', 
    category: 'extinguishers', 
    image: 'https://images.unsplash.com/photo-1599700403969-fde2fbc94741?auto=format&fit=crop&w=800&q=80',
    description: 'Professional recharging and refilling for all types of extinguishers.',
    specs: ['All Agent Types', 'Pressure Testing', 'Safety Certification'],
    badge: 'Service'
  },

  // --- PROHIBITION SIGNS ---
  { 
    id: 'sign-no-smk', 
    name: 'Strictly No Smoking', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/NO%20SMOKING_page-0001.jpg',
    description: 'Standard prohibition signage for fire safety.',
    specs: ['Red/White', 'Weatherproof', '12x12/12x18'],
    defaultSize: '12x12'
  },
  { 
    id: 'sign-no-ent', 
    name: 'No Entry Authorized Only', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/NO%20entry_page-0001.jpg',
    description: 'Restrict access to hazardous or private areas.',
    specs: ['High Gloss', 'Tough Mount', 'High Vis'],
    defaultSize: '12x12'
  },
  { 
    id: 'sign-no-phn', 
    name: 'No Mobile Phones Zone', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/NO%20MOBILE%20PHONE_page-0001.jpg',
    description: 'For sensitive electronics or explosive hazard areas.',
    specs: ['PVC Vinyl', 'Non-Reflective', 'Digital Print'],
    defaultSize: '12x12'
  },
  { 
    id: 'sign-no-prk', 
    name: 'No Parking - Safe Zone', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/No%20parking%20sign%20board%20printable%20_%20Premium%20Vector.jpeg',
    description: 'Keep emergency access paths clear.',
    specs: ['Metal/Plate', 'UV Printed', 'Anti-Fade'],
    defaultSize: '12x18'
  },
  { 
    id: 'sign-photo-a4', 
    name: 'Safety Photo Frame A4', 
    category: 'signage', 
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
    description: 'Premium A4 size frame for safety certificates or notices.',
    specs: ['A4 Size', 'High Durability', 'Sleek Border'],
    defaultSize: 'A4'
  },
  { 
    id: 'sign-photo-a3', 
    name: 'Safety Photo Frame A3', 
    category: 'signage', 
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80',
    description: 'Large A3 size frame for emergency maps or large notices.',
    specs: ['A3 Size', 'Impact Resistant', 'Professional Finish'],
    defaultSize: 'A3'
  },

  // --- MANDATORY SIGNS ---
  { 
    id: 'sign-helmet', 
    name: 'Wear Safety Helmet Area', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/Wear%20Helmet.jpeg',
    description: 'Personal protective equipment mandatory sign.',
    specs: ['Safety Blue', 'Symbol Icon', 'Standard Compliant'],
    defaultSize: '12x18'
  },
  { 
    id: 'sign-gloves', 
    name: 'Safety Gloves Required', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/Wear%20Protective%20Gloves%20Sign%20-%207%20%C3%97%2010%E2%80%B3%20-%20_055%E2%80%B3%20Polyethylene%20Plastic.jpeg',
    description: 'Mandatory glove usage sign for hazardous handling.',
    specs: ['Graphic Icons', 'OSHA Standard', 'Rigid Plastic'],
    defaultSize: '12x18'
  },

  // --- WARNING SIGNS ---
  { 
    id: 'sign-high-v', 
    name: 'Danger High Voltage', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/Home%20Automation%20With%20ESP8266%20WiFi%20Without%20Using%20Blynk!.jpeg',
    description: 'Electrical hazard warning signage for panels.',
    specs: ['Yellow/Black', 'Reflective', 'Shock Warning'],
    defaultSize: '12x18'
  },
  { 
    id: 'sign-toxic', 
    name: 'Caution Toxic Materials', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/Warning-Caution-Toxic-Materials.png',
    description: 'Warning for chemical/biological storage areas.',
    specs: ['Hazard Symbol', 'International Std', 'Chemical Resist'],
    defaultSize: '18x12'
  },

  // --- EMERGENCY & LIFE SAFETY ---
  { 
    id: 'sign-glow-exit', 
    name: 'Photoluminescent Fire Exit', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/Photoluminescent%20Fire%20Exit%20Sign%20LARGE%20-%20Man%20on%20Left%20-%20600%20x%20150Hmm%20-%20Self%20Adhesive%20Rigid%20Plastic%20-%20%5BAS-PH14-SARP%5D.jpeg',
    description: 'Visible in total blackout situations.',
    specs: ['Superior Glow', '8+ Hour Life', 'Self-Adhesive'],
    defaultSize: '12x4',
    badge: 'Bestseller'
  },
  { 
    id: 'sign-asm-pt', 
    name: 'Fire Assembly Point', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/Red%20Fire%20Assembly%20Point%20Sign%20-%2010%20%C3%97%2014%E2%80%B3%20-%20_040%E2%80%B3%20Engineering%20Grade%20Reflective%20Aluminum.jpeg',
    description: 'Designated safe meeting area marker.',
    specs: ['Large Format', 'Outdoor Grade', 'Reflective'],
    defaultSize: '24x12'
  },
  { 
    id: 'sign-firstaid', 
    name: 'First Aid Station Station', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/Download%20First%20Aid%20Label%20Sign%20on%20white%20background%20for%20free.jpeg',
    description: 'Identification for first aid and medical kits.',
    specs: ['Safety Green', 'Cross Icon', 'Clear Text'],
    defaultSize: '12x18'
  },

  // --- FIRE EQUIPMENT SIGNAGE ---
  { 
    id: 'sign-ext-id', 
    name: 'Fire Extinguisher ID Sign', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/Fire%20Extinguisher%20Labels%20-%20Fire%20Extinguisher%20Label%20-%207%20x%2010_%20-%203_5%20Mil%20InfiniStick%E2%84%A2%20Vinyl%20Label.jpeg',
    description: 'Mark location of fire extinguishers clearly.',
    specs: ['Red Warning', 'Location Marker', 'Laminated'],
    defaultSize: '12x18'
  },
  { 
    id: 'sign-hose', 
    name: 'Fire Hose Reel Marker', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/Fire%20Hose%20Reel%20Sign%20-%20150x200mm%20_%20Self%20Adhesive%20Vinyl.jpeg',
    description: 'Identify fire hose reel stations for manual operation.',
    specs: ['Vinyl Wrap', 'High Contrasting', 'Clear Edge'],
    defaultSize: '12x18'
  },

  // --- GENERAL SIGNAGE ---
  { 
    id: 'sign-recep', 
    name: 'Reception Area Identification', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/reception.jpg',
    description: 'Clean, professional office navigation.',
    specs: ['Gold/Silver Opt', 'Acrylic Base', 'Modern Font'],
    defaultSize: '12x4'
  },
  { 
    id: 'sign-wash', 
    name: 'Modern Washroom Signage', 
    category: 'signage', 
    image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/Copy%20of%20Gents%20and%20Ladies%20Toilet%20Sign.jpeg',
    description: 'Gents/Ladies restroom icons for public buildings.',
    specs: ['Pictograms', 'Sleek Design', 'Easy Clean'],
    defaultSize: '12x4'
  },
  { 
    id: 'gen-1', 
    name: 'Custom Fire Safety Instructions Board', 
    category: 'signage', 
    image: '',
    description: 'A detailed fire safety instruction board with icons and emergency procedures.',
    specs: ['Custom Text', 'Wall Mounted', 'High Durability'],
    defaultSize: '24x36'
  }
];
