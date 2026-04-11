// ── Order statuses ────────────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING:   'pending',
  PAID:      'paid',
  ACTIVE:    'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/** Statuses that represent a successfully paid / active order */
export const PAID_STATUSES = [
  ORDER_STATUS.PAID,
  ORDER_STATUS.ACTIVE,
  ORDER_STATUS.COMPLETED,
];

/** All order status options shown in admin dropdowns */
export const ORDER_STATUS_OPTIONS = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PAID,
  ORDER_STATUS.ACTIVE,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
];

// ── Lead statuses ─────────────────────────────────────────────────────────────
export const LEAD_STATUS = {
  NEW:        'new',
  CONTACTED:  'contacted',
  QUALIFIED:  'qualified',
  CLOSED:     'closed',
};

export const LEAD_STATUS_OPTIONS = [
  LEAD_STATUS.NEW,
  LEAD_STATUS.CONTACTED,
  LEAD_STATUS.QUALIFIED,
  LEAD_STATUS.CLOSED,
];