import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, ClipboardCopy, Mail, Pencil, X } from 'lucide-react';
import { BUSINESS } from './config.js';
import { SERVICES, SIZES, TIME_WINDOWS } from './data.js';
import { EMPTY_FORM, FIELD_ORDER, buildMessage, mailUrl, todayISO, validateAll, validators, whatsappUrl } from './lib.js';
import { WhatsAppIcon } from './icons.jsx';

const DRAFT_KEY = 'go-deliver-draft';
const loadDraft = () => {
  try { return { ...EMPTY_FORM, ...JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}'), agree: false }; }
  catch { return { ...EMPTY_FORM }; }
};
const saveDraft = (f) => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...f, agree: false })); } catch { /* storage unavailable */ } };
const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } };

function Field({ id, label, error, hint, optional, children }) {
  return (
    <div className={'field' + (error ? ' has-error' : '')}>
      <label htmlFor={id}>{label}{optional && <span className="opt"> (optional)</span>}</label>
      {children}
      {hint && !error && <p className="hint" id={id + '-hint'}>{hint}</p>}
      {error && <p className="err" id={id + '-err'} role="alert"><AlertCircle size={15} aria-hidden="true" />{error}</p>}
    </div>
  );
}

export default function BookingModal({ initial, onClose }) {
  const [form, setForm] = useState(() => ({ ...loadDraft(), ...initial }));
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState('form');
  const [sent, setSent] = useState('');
  const [copied, setCopied] = useState(false);
  const panelRef = useRef(null);
  const errors = useMemo(() => validateAll(form), [form]);
  const shown = (k) => (touched[k] ? errors[k] : '');
  const errorCount = Object.keys(errors).length;
  const [submitted, setSubmitted] = useState(false);

  // lock scroll, focus, Esc to close, keep Tab inside the dialog
  useEffect(() => {
    const prev = document.activeElement;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const f = [...panelRef.current.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]')].filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [onClose]);

  useEffect(() => { if (!sent) saveDraft(form); }, [form, sent]);
  useEffect(() => { panelRef.current?.scrollTo({ top: 0 }); }, [step]);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const props = (k) => ({
    id: 'f-' + k, name: k, value: form[k], onChange: set(k), onBlur: blur(k),
    'aria-invalid': shown(k) ? 'true' : undefined,
    'aria-describedby': shown(k) ? `f-${k}-err` : undefined,
  });

  const review = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
    const first = FIELD_ORDER.find((k) => errors[k]);
    if (first) { document.getElementById('f-' + first)?.focus(); return; }
    setStep('review');
  };

  const message = useMemo(() => (errorCount ? '' : buildMessage(form)), [form, errorCount]);
  const serviceTitle = (SERVICES.find((s) => s.id === form.service) || {}).title || '';
  const subject = `${BUSINESS.name} booking – ${serviceTitle}`;
  const markSent = (how) => { setSent(how); clearDraft(); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };

  const row = (k, v) => v && <div className="sum-row" key={k}><dt>{k}</dt><dd>{v}</dd></div>;
  const lbl = (list, v) => (list.find((x) => x.value === v) || {}).label;

  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="bk-title" tabIndex={-1} ref={panelRef}>
        <header className="modal-head">
          <div>
            <p className="modal-step">{step === 'form' ? 'Step 1 of 2 · Your details' : 'Step 2 of 2 · Confirm & send'}</p>
            <h2 id="bk-title">{step === 'form' ? 'Book a delivery' : 'Check your details'}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close booking form"><X size={22} /></button>
        </header>

        {step === 'form' && (
          <form onSubmit={review} noValidate>
            {submitted && errorCount > 0 && (
              <div className="err-summary" role="alert">
                <AlertCircle size={18} aria-hidden="true" />
                <span>Please fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} below before continuing.</span>
              </div>
            )}

            <fieldset className="group">
              <legend>What do you need?</legend>
              <Field id="f-service" label="Service" error={shown('service')}>
                <select {...props('service')}>
                  <option value="">Choose a service…</option>
                  {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </Field>
              <div className="field">
                <span className="label-like" id="ct-label">Booking as</span>
                <div className="seg" role="radiogroup" aria-labelledby="ct-label">
                  {[['personal', 'Personal'], ['business', 'Business']].map(([v, t]) => (
                    <label key={v} className={form.customerType === v ? 'on' : ''}>
                      <input type="radio" name="customerType" value={v} checked={form.customerType === v} onChange={set('customerType')} />{t}
                    </label>
                  ))}
                </div>
              </div>
              {form.customerType === 'business' && (
                <Field id="f-company" label="Company name" error={shown('company')}>
                  <input type="text" autoComplete="organization" {...props('company')} />
                </Field>
              )}
              <div className="field">
                <span className="label-like" id="ur-label">Priority</span>
                <div className="seg" role="radiogroup" aria-labelledby="ur-label">
                  {[['standard', 'Standard'], ['express', 'Express']].map(([v, t]) => (
                    <label key={v} className={form.urgency === v ? 'on' : ''}>
                      <input type="radio" name="urgency" value={v} checked={form.urgency === v} onChange={set('urgency')} />{t}
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>

            <fieldset className="group">
              <legend>About you</legend>
              <div className="two">
                <Field id="f-name" label="Full name" error={shown('name')}>
                  <input type="text" autoComplete="name" {...props('name')} />
                </Field>
                <Field id="f-phone" label="Your phone number" error={shown('phone')} hint="e.g. 077 123 4567">
                  <input type="tel" inputMode="tel" autoComplete="tel" {...props('phone')} />
                </Field>
              </div>
              <Field id="f-email" label="Email" optional error={shown('email')}>
                <input type="email" autoComplete="email" {...props('email')} />
              </Field>
            </fieldset>

            <fieldset className="group">
              <legend>Pick-up & delivery</legend>
              <Field id="f-pickup" label="Pick-up address or place" error={shown('pickup')} hint="Street, suburb and town, or a shop/landmark">
                <input type="text" autoComplete="street-address" {...props('pickup')} />
              </Field>
              <Field id="f-dropoff" label="Deliver to" error={shown('dropoff')} hint="Street, suburb and town, or a lodge/office name">
                <input type="text" {...props('dropoff')} />
              </Field>
              <div className="two">
                <Field id="f-recipientName" label="Recipient name" error={shown('recipientName')}>
                  <input type="text" {...props('recipientName')} />
                </Field>
                <Field id="f-recipientPhone" label="Recipient phone" error={shown('recipientPhone')}>
                  <input type="tel" inputMode="tel" {...props('recipientPhone')} />
                </Field>
              </div>
            </fieldset>

            <fieldset className="group">
              <legend>The items</legend>
              <Field id="f-item" label="What is being delivered or done?" error={shown('item')} hint={`${form.item.length}/300`}>
                <textarea rows="3" maxLength="320" {...props('item')} />
              </Field>
              <Field id="f-size" label="Approximate size" error={shown('size')}>
                <select {...props('size')}>
                  <option value="">Choose a size…</option>
                  {SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </Field>
            </fieldset>

            <fieldset className="group">
              <legend>When</legend>
              <div className="two">
                <Field id="f-date" label="Delivery date" error={shown('date')}>
                  <input type="date" min={todayISO()} {...props('date')} />
                </Field>
                <Field id="f-window" label="Time window" error={shown('window')}>
                  <select {...props('window')}>
                    <option value="">Choose a time…</option>
                    {TIME_WINDOWS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
              </div>
              <Field id="f-notes" label="Anything else we should know?" optional error={shown('notes')}>
                <textarea rows="2" {...props('notes')} />
              </Field>
            </fieldset>

            <div className={'agree' + (shown('agree') ? ' has-error' : '')}>
              <label>
                <input type="checkbox" id="f-agree" checked={form.agree} onChange={set('agree')} onBlur={blur('agree')} aria-invalid={shown('agree') ? 'true' : undefined} aria-describedby={shown('agree') ? 'f-agree-err' : undefined} />
                <span>I understand there is no fixed price. {BUSINESS.name} will confirm the final price with me before the delivery goes ahead.</span>
              </label>
              {shown('agree') && <p className="err" id="f-agree-err" role="alert"><AlertCircle size={15} aria-hidden="true" />{shown('agree')}</p>}
            </div>

            <div className="modal-foot">
              <button type="button" className="btn btn-ghost-dark" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-red">Review details</button>
            </div>
          </form>
        )}

        {step === 'review' && (
          <div>
            <dl className="summary">
              {row('Service', serviceTitle)}
              {row('Booking as', form.customerType === 'business' ? `Business – ${form.company.trim()}` : 'Personal')}
              {row('Priority', form.urgency === 'express' ? 'Express' : 'Standard')}
              {row('Name', form.name.trim())}
              {row('Phone', form.phone.trim())}
              {row('Email', form.email.trim())}
              {row('Pick-up', form.pickup.trim())}
              {row('Deliver to', form.dropoff.trim())}
              {row('Recipient', `${form.recipientName.trim()} · ${form.recipientPhone.trim()}`)}
              {row('Items', form.item.trim())}
              {row('Size', lbl(SIZES, form.size))}
              {row('When', `${new Date(form.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${lbl(TIME_WINDOWS, form.window)}`)}
              {row('Notes', form.notes.trim())}
            </dl>

            <p className="price-note"><strong>Price:</strong> not fixed. It depends on distance, size, urgency and stops. We confirm the final price with you on WhatsApp, by phone or by email before we go.</p>

            {sent ? (
              <div className="sent" role="status">
                <Check size={20} aria-hidden="true" />
                <p>{sent === 'whatsapp' ? 'Your details are ready in WhatsApp. Press Send there to finish.' : 'Your details are ready in your email app. Press Send there to finish.'} We will reply to confirm the price and timing.</p>
              </div>
            ) : (
              <p className="send-label">Send your booking using:</p>
            )}

            <div className="send-actions">
              <a className="btn btn-wa" href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" onClick={() => markSent('whatsapp')}>
                <WhatsAppIcon size={20} /> Send on WhatsApp
              </a>
              <a className="btn btn-dark" href={mailUrl(subject, message)} onClick={() => markSent('email')}>
                <Mail size={20} aria-hidden="true" /> Send by email
              </a>
            </div>
            <div className="modal-foot split">
              <button type="button" className="btn btn-ghost-dark" onClick={() => { setSent(''); setStep('form'); }}>
                <ArrowLeft size={18} aria-hidden="true" /><Pencil size={16} aria-hidden="true" /> Edit details
              </button>
              <button type="button" className="btn btn-ghost-dark" onClick={copy}>
                {copied ? <Check size={18} aria-hidden="true" /> : <ClipboardCopy size={18} aria-hidden="true" />}
                {copied ? 'Copied' : 'Copy details'}
              </button>
            </div>
            {sent && <div className="modal-foot"><button type="button" className="btn btn-red" onClick={onClose}>Done</button></div>}
          </div>
        )}
      </div>
    </div>
  );
}
