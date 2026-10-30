export const SERVICES = [
  {
    id: 'grocery', icon: 'ShoppingBasket', title: 'Grocery Delivery',
    blurb: 'Fresh groceries and household essentials brought to your door.',
    points: ['Personal shopping', 'Your list, your brands', 'Special requests noted'],
  },
  {
    id: 'airport', icon: 'Plane', title: 'Airport & Transfers',
    blurb: 'Pick-ups, drop-offs and luggage handling for visitors and locals.',
    points: ['Meet & greet', 'Luggage assistance', 'Hotel and home drop-offs'],
  },
  {
    id: 'errands', icon: 'Landmark', title: 'Bill & Errand Runs',
    blurb: 'We handle payments, bank errands and everyday tasks for you.',
    points: ['Utility payments', 'Bank deposits & withdrawals', 'Document submissions'],
  },
  {
    id: 'documents', icon: 'FileText', title: 'Document & Package Delivery',
    blurb: 'Secure, careful delivery of important documents and parcels.',
    points: ['Confidential handling', 'Express option', 'Corporate deliveries'],
  },
  {
    id: 'pharmacy', icon: 'Pill', title: 'Pharmacy & Medical Runs',
    blurb: 'Prompt pick-up of medicine and health essentials.',
    points: ['Prescription collection', 'Medical supplies', 'Urgent requests'],
  },
  {
    id: 'custom', icon: 'Sparkles', title: 'Custom Requests',
    blurb: 'Something different? Tell us what you need and we will make it work.',
    points: ['Multi-stop runs', 'Flexible scheduling', 'Tailored to you'],
  },
];

export const SIZES = [
  { value: 'small', label: 'Small – documents, envelope, small bag' },
  { value: 'medium', label: 'Medium – box, shopping bags' },
  { value: 'large', label: 'Large – bulky or several items' },
];

export const TIME_WINDOWS = [
  { value: 'asap', label: 'As soon as possible' },
  { value: 'morning', label: 'Morning (6am – 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm – 5pm)' },
  { value: 'evening', label: 'Evening (5pm – 9pm)' },
];

export const FAQS = [
  ['How much will my delivery cost?', 'Every job is different, so we do not list fixed prices. After you send your details we confirm the final price with you on WhatsApp, by phone or by email before we collect anything.'],
  ['What affects the price?', 'Mostly distance, the size and weight of the items, how urgent the delivery is, the number of stops, and any waiting time. A short, small, flexible job usually costs less than a long, bulky, same-hour one.'],
  ['What happens after I send the form?', 'Your details open in WhatsApp or your email app, ready to send. We reply to confirm the price, the time and anything we need to know.'],
  ['Can I book for my business?', 'Yes. Choose “Business” on the form and add your company name. For regular deliveries, mention that in the notes and we will arrange it with you.'],
  ['What can you deliver?', 'Groceries, parcels, documents, pharmacy items, and errands such as bill payments. If you are unsure, send a custom request and ask.'],
  ['How do I pay?', 'Payment arrangements are agreed with you when we confirm the price. Nothing is charged through this website.'],
];
