/**
 * Route Configuration
 * Define all routes in one place for easy management
 */

export const ROUTES = {
  // Public routes
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
    SERVICES: '/services',
    PRODUCTS: '/products',
    PORTFOLIO: '/portfolio',
    TEAM: '/team',
    BLOG: '/blog',
    BLOG_POST: (id) => `/blog/${id}`,
    CONTACT: '/contact',
    QUOTE: '/quote',
    NOT_FOUND: '*',
  },

  // Auth routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },

  // Protected routes
  PROTECTED: {
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDER_SUCCESS: '/order-success',
  },

  // User dashboard
  DASHBOARD: {
    HOME: '/dashboard',
    ORDERS: '/dashboard/orders',
    PROFILE: '/dashboard/profile',
    REFERRAL: '/referral',
  },

  // Admin routes
  ADMIN: {
    HOME: '/admin',
    LEADS: '/admin/leads',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
  },
};

// Navigation links for Header/Navbar
export const NAV_LINKS = [
  { label: 'Services', href: ROUTES.PUBLIC.SERVICES },
  { label: 'Products', href: ROUTES.PUBLIC.PRODUCTS },
  { label: 'Portfolio', href: ROUTES.PUBLIC.PORTFOLIO },
  { label: 'Team', href: ROUTES.PUBLIC.TEAM },
  { label: 'Blog', href: ROUTES.PUBLIC.BLOG },
  { label: 'Contact', href: ROUTES.PUBLIC.CONTACT },
];

// CTA button
export const CTA_LINK = {
  label: '💰 Get Quote',
  href: ROUTES.PUBLIC.QUOTE,
};

export default ROUTES;
