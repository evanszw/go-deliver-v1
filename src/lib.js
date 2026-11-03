import { BUSINESS } from './config.js';
import { SERVICES, SIZES, TIME_WINDOWS } from './data.js';

export const EMPTY_FORM = {
  service: '', customerType: 'personal', company: '',
  name: '', phone: '', email: '',
  pickup: '', dropoff: '',
  item: '', size: '',
  date: '', window: '', urgency: 'standard',
  recipientName: '', recipientPhone: '',
  notes: '', agree: false,
};

export const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const cleanPhone = (v) => v.replace(/[\s\-().]/g, '');
// Zimbabwe numbers: 07x xxx xxxx, 08x…, 09x…, +263 7x xxx xxxx, 263…  (9 digits after the prefix)
export const isZwPhone = (v) => /^(\+263|263|0)\d{9}$/.test(cleanPhone(v));
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

// Returns an error string, or '' when the field is valid.
export const validators = {
  service: (v) => (v ? '' : 'Choose the service you need.'),
  company: (v, f) => (f.customerType === 'business' && v.trim().length < 2 ? 'Enter your company name.' : ''),
  name: (v) => {
    const t = v.trim();
    if (!t) return 'Enter your full name.';
    if (t.length < 2) return 'Name is too short.';
    if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(t)) return 'Use letters only in your name.';
    return '';
  },
  phone: (v) => {
    if (!v.trim()) return 'Enter a phone number we can reach you on.';
    return isZwPhone(v) ? '' : 'Enter a valid number, e.g. 077 123 4567 or +263 77 123 4567.';
  },
  email: (v) => (!v.trim() || isEmail(v.trim()) ? '' : 'Enter a valid email address, or leave it blank.'),
  pickup: (v) => (v.trim().length >= 5 ? '' : 'Enter the pick-up address or place (at least 5 characters).'),
  dropoff: (v) => (v.trim().length >= 5 ? '' : 'Enter the delivery address or place (at least 5 characters).'),
  item: (v) => {
    const t = v.trim();
    if (t.length < 3) return 'Tell us what is being delivered.';
    if (t.length > 300) return 'Please keep this under 300 characters.';
    return '';
  },
  size: (v) => (v ? '' : 'Choose the approximate size.'),
  date: (v) => {
    if (!v) return 'Choose a delivery date.';
    if (v < todayISO()) return 'The date cannot be in the past.';
    return '';
  },
  window: (v) => (v ? '' : 'Choose a time window.'),
  recipientName: (v) => {
    const t = v.trim();
    if (!t) return 'Enter the recipient’s name.';
    if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(t)) return 'Use letters only in the name.';
    return '';
  },
  recipientPhone: (v) => {
    if (!v.trim()) return 'Enter the recipient’s phone number.';
    return isZwPhone(v) ? '' : 'Enter a valid number, e.g. 077 123 4567.';
  },
  notes: (v) => (v.length > 300 ? 'Please keep notes under 300 characters.' : ''),
  agree: (v) => (v ? '' : 'Please confirm you understand the price is agreed with us first.'),
};

export const FIELD_ORDER = ['service', 'company', 'name', 'phone', 'email', 'pickup', 'dropoff', 'item', 'size', 'date', 'window', 'recipientName', 'recipientPhone', 'notes', 'agree'];

export function validateAll(form) {
  const errors = {};
  for (const k of FIELD_ORDER) {
    const e = validators[k](form[k], form);
    if (e) errors[k] = e;
  }
  return errors;
}

const label = (list, v) => (list.find((x) => x.value === v) || {}).label || v;

export function buildMessage(f) {
  const service = (SERVICES.find((s) => s.id === f.service) || {}).title || f.service;
  const when = new Date(f.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const lines = [
    `Hi ${BUSINESS.name}! I would like to book a delivery.`,
    '',
    `Service: ${service}`,
    `Booking as: ${f.customerType === 'business' ? 'Business – ' + f.company.trim() : 'Personal'}`,
    `Priority: ${f.urgency === 'express' ? 'Express' : 'Standard'}`,
    '',
    `Name: ${f.name.trim()}`,
    `Phone: ${f.phone.trim()}`,
  ];
  if (f.email.trim()) lines.push(`Email: ${f.email.trim()}`);
  lines.push(
    '',
    `Pick-up: ${f.pickup.trim()}`,
    `Deliver to: ${f.dropoff.trim()}`,
    `Recipient: ${f.recipientName.trim()} (${f.recipientPhone.trim()})`,
    '',
    `Items: ${f.item.trim()}`,
    `Size: ${label(SIZES, f.size)}`,
    `Date: ${when}`,
    `Time: ${label(TIME_WINDOWS, f.window)}`,
  );
  if (f.notes.trim()) lines.push(`Notes: ${f.notes.trim()}`);
  lines.push('', 'Please confirm the final price and timing. Thank you!');
  return lines.join('\n');
}

export const whatsappUrl = (text) => `https://wa.me/${BUSINESS.whatsappNumber}${text ? '?text=' + encodeURIComponent(text) : ''}`;
export const mailUrl = (subject, body) => `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
