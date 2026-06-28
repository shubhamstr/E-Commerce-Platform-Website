// ==============================|| BRANDING CONFIG ||============================== //
// Single source of truth for all branding across the Website.
// Update values here to rebrand the entire application.

const branding = {
  // App name
  name: 'Guestora',
  // Tagline
  tagline: 'Your One-Stop Online Store',
  // Full title for metadata
  get fullTitle() {
    return `${this.name} — ${this.tagline}`;
  },
  // Meta description
  description:
    'Discover amazing deals on electronics, fashion, home essentials and more at Guestora. Fast delivery, secure checkout, and the best prices.',

  // Developer / author
  author: {
    name: 'Shubham',
    portfolioUrl: 'https://codeguest.in',
  },

  // Brand colors
  colors: {
    primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accentColor: '#667eea',
  },

  // Contact info
  contact: {
    email: 'support@guestora.com',
    phone: '+1 (800) 123-4567',
    address: 'San Francisco, CA, USA',
  },

  // Business hours
  hours: {
    weekday: 'Monday – Friday: 9:00 AM – 6:00 PM (PST)',
    saturday: 'Saturday: 10:00 AM – 4:00 PM (PST)',
    sunday: 'Sunday: Closed',
  },
};

export default branding;
