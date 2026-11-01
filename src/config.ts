/* ------------------------------------------------------------------
 * Koshal Electronics — central business content.
 * Every fact that has NOT been confirmed by the business owner is
 * flagged with `confirmed: false` and rendered as a clearly labelled
 * development placeholder. Nothing here is invented for the public UI.
 * ------------------------------------------------------------------ */

export const BUSINESS = {
  name: "Koshal Electronics",
  shortName: "Koshal",
  focus: "Television & electronics repair",
} as const;

export const CONTACT = {
  phone: { value: "", confirmed: false, label: "Phone number to be confirmed" },
  whatsapp: { value: "", confirmed: false, label: "WhatsApp to be enabled once the number is confirmed" },
  email: { value: "", confirmed: false, label: "Email address to be confirmed" },
  address: { value: "", confirmed: false, label: "Workshop address to be confirmed" },
  hours: { value: "", confirmed: false, label: "Opening hours to be confirmed" },
  mapUrl: { value: "", confirmed: false, label: "Directions link appears once the address is verified" },
} as const;

export type DeviceId = "tv" | "speaker" | "monitor" | "desktop" | "other";

export interface Device {
  id: DeviceId;
  name: string;
  short: string;
  blurb: string;
  issues: string[];
}

export const DEVICES: Device[] = [
  {
    id: "tv",
    name: "Television",
    short: "TV",
    blurb:
      "LED, LCD and smart TVs — from no-power faults to backlight, panel and mainboard issues. We diagnose before recommending anything.",
    issues: [
      "Won't power on",
      "No picture, sound ok",
      "Sound problems",
      "Lines or flickering on screen",
      "Remote / smart features failing",
      "Not sure / other",
    ],
  },
  {
    id: "speaker",
    name: "Speaker / Home Theatre",
    short: "Audio",
    blurb:
      "Home theatres, soundbars, active speakers and amplifiers. Power, distortion, channel drop-outs and connectivity faults.",
    issues: [
      "No sound at all",
      "Distorted or crackling audio",
      "One channel missing",
      "Bluetooth / input not working",
      "Power or fuse issues",
      "Not sure / other",
    ],
  },
  {
    id: "monitor",
    name: "Monitor",
    short: "Monitor",
    blurb:
      "Desktop and gaming monitors — power, backlight, port and display faults checked and discussed before any repair.",
    issues: [
      "Stays black",
      "Flickering or dim backlight",
      "Colour or line defects",
      "Port / cable issues",
      "Not sure / other",
    ],
  },
  {
    id: "desktop",
    name: "Desktop / Computer",
    short: "PC",
    blurb:
      "Desktop towers and all-in-ones — power supplies, boards, storage and boot problems. Laptops are accepted case by case.",
    issues: [
      "Won't start",
      "Starts then shuts down",
      "No display output",
      "Beep codes / boot errors",
      "Slow or failing storage",
      "Not sure / other",
    ],
  },
  {
    id: "other",
    name: "Other Electronics",
    short: "Other",
    blurb:
      "Something else with a plug, a board or a screen? Describe it in the enquiry and we'll tell you honestly whether we can help.",
    issues: ["Describe the device and fault in the enquiry form"],
  },
];

export const PROCESS = [
  {
    title: "Describe the device & the fault",
    body: "Tell us what it is, roughly how old it is, and what it's doing — or not doing. The more detail, the better the first conversation.",
  },
  {
    title: "Talk it through with us",
    body: "We discuss the likely causes and the sensible next step. No obligation, and no pressure to proceed.",
  },
  {
    title: "We check it and explain the options",
    body: "Where a fault isn't obvious, the device is inspected. You get a clear explanation of what's wrong and what a repair would involve — before you decide anything.",
  },
  {
    title: "You decide how to proceed",
    body: "Approve, ask questions, or walk away. If a repair isn't worth it, we'll say so plainly.",
  },
] as const;

export const BRANDS = [
  "Samsung", "LG", "Sony", "Panasonic", "Philips", "Mi", "OnePlus", "TCL",
  "Dell", "HP", "Lenovo", "Acer", "JBL", "boAt", "F&D", "Zebronics",
] as const;

export const TERMS = [
  {
    title: "Diagnosis comes first",
    body: "A firm recommendation — and any price — follows a discussion of the fault or an inspection of the device. We don't guess at quotes.",
  },
  {
    title: "Parts & timing vary",
    body: "Part availability and repair time depend on the model and the fault. We confirm both before work begins and keep you posted if anything changes.",
  },
  {
    title: "Warranty, stated per repair",
    body: "Coverage depends on the repair and the parts used. Whatever applies to your job is confirmed to you before you approve it — in plain language.",
  },
  {
    title: "No pressure, ever",
    body: "If a device isn't worth fixing, we'll tell you. Honest advice is the whole point of a neighbourhood repair bench.",
  },
] as const;

export const FAQS = [
  {
    q: "What devices do you accept?",
    a: "Televisions, speakers and home theatres, monitors and desktop computers are our everyday work. Other electronics are considered case by case — describe the item in an enquiry and we'll tell you honestly whether it's something we can take on.",
  },
  {
    q: "What should I tell you about the fault?",
    a: "The device type, brand or model if you know it, and what it's doing — for example: no power, no picture, distorted sound, lines on the screen. When it started and whether anything unusual happened (a storm, a fall, a pop or smell) all help.",
  },
  {
    q: "How are estimates discussed?",
    a: "Over a conversation first, and after an inspection where the fault isn't obvious. You'll get a clear explanation of the cause and what a repair involves before deciding anything. We don't issue firm prices from a symptom alone.",
  },
  {
    q: "How long does a repair take?",
    a: "It depends on the fault and on part availability for your model. We give you a realistic indication once the device has been checked, and we'll tell you promptly if a part needs to be ordered.",
  },
  {
    q: "Is there a warranty on repairs?",
    a: "Coverage depends on the specific repair and parts used. Whatever applies to your job is stated clearly before you approve the work — we never assume it or hide it in fine print.",
  },
  {
    q: "Do you offer pickup or delivery?",
    a: "Arrangements like pickup, delivery or drop-off hours are confirmed when you contact us, depending on your location and the size of the device.",
  },
  {
    q: "How do I get in touch?",
    a: "Use the enquiry form on this page — it reaches us directly with your device and fault already filled in. Phone and WhatsApp options will be published here as soon as they're confirmed.",
  },
] as const;

export const GALLERY = [
  { label: "Workshop bench", kind: "bench" },
  { label: "TV mainboard inspection", kind: "board" },
  { label: "Backlight strip replacement", kind: "strip" },
  { label: "Home theatre servicing", kind: "wave" },
  { label: "Monitor diagnostics", kind: "screen" },
  { label: "Completed repair, ready for collection", kind: "tv" },
] as const;

/* Verified public reviews will live here once provided by the owner.
 * The section renders an honest empty state until then. */
export const REVIEWS: { name: string; text: string; source?: string }[] = [];
