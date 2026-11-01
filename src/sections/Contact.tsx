import { useEffect, useMemo, useRef, useState } from "react";
import { Phone, Mail, MapPin, Clock, Copy, Check, AlertCircle, Send } from "lucide-react";
import { CONTACT, DEVICES, type DeviceId } from "../config";
import { useDiagnostic } from "../state";
import { Reveal, SectionHead } from "../components/ui";
import { cn } from "../utils/cn";

type Method = "phone" | "whatsapp" | "email";
interface FormState {
  name: string;
  method: Method;
  detail: string;
  device: DeviceId | "";
  brand: string;
  symptom: string;
  description: string;
  time: string;
  acknowledge: boolean;
}
type Errors = Partial<Record<keyof FormState, string>>;

const METHODS: { id: Method; label: string }[] = [
  { id: "phone", label: "Phone call" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
];

export function Contact() {
  const { device: ctxDevice, symptom: ctxSymptom } = useDiagnostic();
  const [form, setForm] = useState<FormState>({
    name: "", method: "phone", detail: "", device: "", brand: "",
    symptom: "", description: "", time: "No preference", acknowledge: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "draft" | "copied">("idle");
  const liveRef = useRef<HTMLParagraphElement>(null);

  /* carry diagnostic selections into the form */
  useEffect(() => {
    if (ctxDevice) {
      setForm((f) => ({ ...f, device: ctxDevice, symptom: f.device === ctxDevice ? f.symptom : "" }));
      setStatus("idle");
    }
  }, [ctxDevice]);
  useEffect(() => {
    if (ctxSymptom) setForm((f) => ({ ...f, symptom: ctxSymptom }));
  }, [ctxSymptom]);

  const activeDevice = DEVICES.find((d) => d.id === form.device) ?? null;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (status !== "idle") setStatus("idle");
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Please tell us your name.";
    if (!form.detail.trim()) {
      e.detail = form.method === "email" ? "We need an email address to reply." : "We need a number to reach you on.";
    } else if (form.method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.detail)) {
      e.detail = "That email address doesn't look right.";
    } else if (form.method !== "email" && !/^[+\d][\d\s-]{6,17}$/.test(form.detail)) {
      e.detail = "Please enter a valid phone number.";
    }
    if (!form.device) e.device = "Choose the device type.";
    if (!form.symptom) e.symptom = "Pick the closest symptom — “Not sure” is fine.";
    if (!form.acknowledge) e.acknowledge = "Please confirm you understand how estimates work.";
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      liveRef.current?.focus();
      return;
    }
    setStatus("draft");
  };

  const draft = useMemo(() => {
    const d = DEVICES.find((x) => x.id === form.device);
    return [
      `Repair enquiry — Koshal Electronics`,
      `Name: ${form.name}`,
      `Device: ${d?.name ?? "—"}${form.brand ? ` (${form.brand})` : ""}`,
      `Issue: ${form.symptom}`,
      form.description ? `Details: ${form.description}` : "",
      `Preferred contact: ${METHODS.find((m) => m.id === form.method)?.label} — ${form.detail}`,
      `Best time: ${form.time}`,
    ].filter(Boolean).join("\n");
  }, [form]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus("copied");
      window.setTimeout(() => setStatus("draft"), 2200);
    } catch {
      setStatus("draft");
    }
  };

  const inputCls = (err?: string) =>
    cn(
      "w-full bg-transparent border-b py-3 font-body text-ink placeholder:text-moss/50 transition-colors duration-300 focus:outline-none",
      err ? "border-[#a63d2a] animate-shake" : "border-line focus:border-forest"
    );

  const errText = (id: string, msg?: string) =>
    msg ? (
      <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-[#a63d2a] animate-shake">
        <AlertCircle size={12} aria-hidden="true" /> {msg}
      </p>
    ) : null;

  return (
    <section id="contact" className="py-24 md:py-36 bg-cream-2/60 border-t border-line">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="09"
          kicker="Request a repair"
          title={
            <>
              Tell us what&rsquo;s wrong. <span className="text-leaf">We&rsquo;ll take it from there.</span>
            </>
          }
        />

        <div className="grid lg:grid-cols-12 gap-10">
          {/* info panel */}
          <Reveal variant="left" className="lg:col-span-4">
            <div className="bg-forest text-cream rounded-lg p-7 md:p-8 h-full flex flex-col">
              <h3 className="font-display font-semibold text-xl mb-6">Reach the bench</h3>
              <ul className="space-y-5 text-sm">
                <li className="flex gap-4">
                  <Phone size={17} className="text-mint shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Phone &amp; WhatsApp</p>
                    {CONTACT.phone.confirmed ? (
                      <a href={`tel:${CONTACT.phone.value}`} className="link-draw text-sage">{CONTACT.phone.value}</a>
                    ) : (
                      <p className="text-sage">{CONTACT.phone.label} <span className="dev-tag ml-1 !border-sage/50 !text-sage">dev</span></p>
                    )}
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail size={17} className="text-mint shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Email</p>
                    {CONTACT.email.confirmed ? (
                      <a href={`mailto:${CONTACT.email.value}`} className="link-draw text-sage">{CONTACT.email.value}</a>
                    ) : (
                      <p className="text-sage">{CONTACT.email.label} <span className="dev-tag ml-1 !border-sage/50 !text-sage">dev</span></p>
                    )}
                  </div>
                </li>
                <li className="flex gap-4">
                  <MapPin size={17} className="text-mint shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Workshop</p>
                    {CONTACT.address.confirmed ? (
                      <p className="text-sage">{CONTACT.address.value}</p>
                    ) : (
                      <p className="text-sage">{CONTACT.address.label} <span className="dev-tag ml-1 !border-sage/50 !text-sage">dev</span></p>
                    )}
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock size={17} className="text-mint shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-sage">
                      {CONTACT.hours.confirmed ? CONTACT.hours.value : CONTACT.hours.label}
                      {!CONTACT.hours.confirmed && <span className="dev-tag ml-1 !border-sage/50 !text-sage">dev</span>}
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-auto pt-8 border-t border-sage/25">
                <p className="text-xs text-sage leading-relaxed">
                  The form is the fastest way to reach us right now. Once phone and
                  WhatsApp are confirmed, one-tap calling and a prefilled WhatsApp
                  message will appear here.
                </p>
              </div>
            </div>
          </Reveal>

          {/* form */}
          <Reveal variant="right" delay={120} className="lg:col-span-8">
            <form onSubmit={onSubmit} noValidate className="bg-cream border border-line rounded-lg p-7 md:p-10">
              <p
                ref={liveRef}
                tabIndex={-1}
                aria-live="assertive"
                className="sr-only focus:not-sr-only focus:absolute focus:bg-cream focus:p-3 focus:border focus:border-[#a63d2a] focus:rounded"
              >
                {Object.keys(errors).length > 0 ? `The form has ${Object.keys(errors).length} fields to fix.` : ""}
              </p>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label htmlFor="f-name" className="kicker text-moss">Your name *</label>
                  <input id="f-name" className={inputCls(errors.name)} value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    aria-invalid={!!errors.name} aria-describedby="e-name" placeholder="e.g. Priya Sharma" />
                  {errText("e-name", errors.name)}
                </div>

                <div>
                  <label htmlFor="f-brand" className="kicker text-moss">Brand / model <span className="normal-case tracking-normal">(if known)</span></label>
                  <input id="f-brand" className={inputCls()} value={form.brand}
                    onChange={(e) => set("brand", e.target.value)} placeholder="e.g. Samsung 43″ LED" />
                </div>

                <div>
                  <span className="kicker text-moss block mb-3">Preferred contact *</span>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Preferred contact method">
                    {METHODS.map((m) => (
                      <button key={m.id} type="button" role="radio" aria-checked={form.method === m.id}
                        onClick={() => set("method", m.id)}
                        className={cn("chip !py-2", form.method === m.id && "!bg-forest !text-cream !border-forest")}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="f-detail" className="kicker text-moss">
                    {form.method === "email" ? "Email address" : "Phone number"} *
                  </label>
                  <input id="f-detail" className={inputCls(errors.detail)} value={form.detail}
                    onChange={(e) => set("detail", e.target.value)}
                    inputMode={form.method === "email" ? "email" : "tel"}
                    aria-invalid={!!errors.detail} aria-describedby="e-detail"
                    placeholder={form.method === "email" ? "you@example.com" : "+91 …"} />
                  {errText("e-detail", errors.detail)}
                </div>

                <div>
                  <label htmlFor="f-device" className="kicker text-moss">Device type *</label>
                  <select id="f-device" className={cn(inputCls(errors.device), "appearance-none cursor-pointer")}
                    value={form.device} aria-invalid={!!errors.device} aria-describedby="e-device"
                    onChange={(e) => { set("device", e.target.value as DeviceId); set("symptom", ""); }}>
                    <option value="">Select a device…</option>
                    {DEVICES.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  {errText("e-device", errors.device)}
                </div>

                <div>
                  <label htmlFor="f-symptom" className="kicker text-moss">Symptom *</label>
                  <select id="f-symptom" className={cn(inputCls(errors.symptom), "appearance-none cursor-pointer", !activeDevice && "opacity-50")}
                    value={form.symptom} disabled={!activeDevice}
                    aria-invalid={!!errors.symptom} aria-describedby="e-symptom"
                    onChange={(e) => set("symptom", e.target.value)}>
                    <option value="">{activeDevice ? "Select the closest symptom…" : "Choose a device first"}</option>
                    {activeDevice?.issues.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errText("e-symptom", errors.symptom)}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="f-desc" className="kicker text-moss">Describe what happened <span className="normal-case tracking-normal">(optional)</span></label>
                  <textarea id="f-desc" rows={3} className={cn(inputCls(), "resize-none")} value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="When did it start? Any storm, fall, unusual sound or smell?" />
                </div>

                <div>
                  <label htmlFor="f-time" className="kicker text-moss">Best time to reply <span className="normal-case tracking-normal">(optional)</span></label>
                  <select id="f-time" className={cn(inputCls(), "appearance-none cursor-pointer")} value={form.time}
                    onChange={(e) => set("time", e.target.value)}>
                    {["No preference", "Morning", "Afternoon", "Evening"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={form.acknowledge}
                      onChange={(e) => set("acknowledge", e.target.checked)}
                      className="mt-1 w-4 h-4 accent-forest cursor-pointer"
                      aria-invalid={!!errors.acknowledge} aria-describedby="e-ack" />
                    <span className="text-sm text-moss leading-snug">
                      I understand any estimate follows a discussion or inspection of the device. *
                    </span>
                  </label>
                </div>
                {errText("e-ack", errors.acknowledge)}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn btn-primary shine">
                  <span>Prepare my enquiry</span>
                  <Send size={16} aria-hidden="true" />
                </button>
                <p className="text-xs text-moss max-w-xs">
                  No backend is connected yet, so we&rsquo;ll assemble your message for
                  one-tap copying — nothing is sent or stored without a real integration.
                </p>
              </div>

              {/* honest fallback output */}
              {status !== "idle" && (
                <div className="mt-8 border border-forest/30 rounded-md bg-cream-2/70 p-6 animate-[rise-in_0.5s_cubic-bezier(0.22,1,0.36,1)]" role="status">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="font-display font-semibold text-forest flex items-center gap-2">
                      <Check size={16} className="text-leaf animate-check-pop" aria-hidden="true" />
                      Your enquiry is ready to send
                    </p>
                    <button type="button" onClick={copy} className="btn btn-ghost !py-2 !px-4 text-sm active:scale-95 transition-transform">
                      {status === "copied" ? (
                        <>
                          <Check size={14} className="text-forest animate-check-pop" aria-hidden="true" />
                          <span className="font-semibold text-forest">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} aria-hidden="true" />
                          <span>Copy message</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-[0.78rem] leading-relaxed text-ink/80 border-l-2 border-leaf pl-4">{draft}</pre>
                  <p className="mt-3 text-xs text-moss">
                    Paste it into your email or messaging app. Direct sending and
                    one-tap WhatsApp will switch on automatically once contact details are confirmed.
                  </p>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
