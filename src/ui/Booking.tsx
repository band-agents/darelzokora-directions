/**
 * Booking, world first. The first question is the site's whole structure:
 * is this for you, or for your son? Everything after follows from it: which
 * services are offered, whether we ask the child's age, and the colours.
 *
 * It is a request, not a confirmed slot: the current site shows no opening
 * hours, so the clinic confirms by phone. It is also a demo: nothing is sent.
 *
 * Carried-over rules: day keys from local date parts (never toISOString,
 * which shifts a Cairo evening to the day before); Egyptian mobiles accepted
 * with +20, 20, a leading 0, or bare; no step waits on an exit animation.
 */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Phone, Siren, Video, MapPin } from "lucide-react";
import { BRAND, BRANCHES, UI, WORLDS, serviceById, servicesOf, type L, type World } from "@/content";
import { useLang } from "@/lib/i18n";
import { WorldGlyph } from "./site";

const T = {
  steps: [
    { ar: "لمن؟", en: "Who for" }, { ar: "السبب", en: "Reason" }, { ar: "المكان", en: "Where" },
    { ar: "الموعد", en: "When" }, { ar: "بياناتك", en: "Details" },
  ] as L[],
  who: { ar: "لمن هذا الموعد؟", en: "Who is this visit for?" },
  what: { ar: "ما سبب الزيارة؟", en: "What is the visit about?" },
  notSure: { ar: "لست متأكداً: كشف عام", en: "Not sure: a general consultation" },
  where: { ar: "أين تفضل الكشف؟", en: "Where would you like to be seen?" },
  when: { ar: "اختر اليوم والوقت المناسب", en: "Pick a day and time" },
  whenNote: { ar: "هذا طلب موعد: يتصل بك فريقنا لتأكيده.", en: "This is a request: our team will call you to confirm it." },
  details: { ar: "بيانات التواصل", en: "How we reach you" },
  name: { ar: "الاسم", en: "Your name" },
  parent: { ar: "اسم ولي الأمر", en: "Parent's name" },
  phone: { ar: "رقم الموبايل", en: "Mobile number" },
  phoneHint: { ar: "مثال: 010 1234 5678 أو رقم دولي يبدأ بـ +", en: "e.g. 010 1234 5678, or an international number starting with +" },
  phoneErr: { ar: "اكتب رقم موبايل صحيح", en: "Enter a valid mobile number" },
  nameErr: { ar: "اكتب الاسم", en: "Enter a name" },
  age: { ar: "عمر ابنك", en: "Your son's age" },
  note: { ar: "ملاحظة (اختياري)", en: "Anything to add (optional)" },
  next: { ar: "التالي", en: "Next" },
  back: { ar: "السابق", en: "Back" },
  send: { ar: "أرسل طلب الموعد", en: "Send request" },
  doneT: { ar: "وصلنا طلبك", en: "Request received" },
  doneB: { ar: "سيتصل بك فريق دار الذكورة على {phone} لتأكيد الموعد.", en: "The Dar El Zokora team will call {phone} to confirm your appointment." },
  again: { ar: "حجز موعد آخر", en: "Book another" },
  torsion: { ar: "ألم مفاجئ وشديد؟ لا تحجز: اتصل الآن أو توجه للطوارئ.", en: "Sudden, severe pain? Don't book: call now or go to the emergency room." },
};

const AGES_SEL: L[] = [
  { ar: "أقل من سنة", en: "Under 1" }, { ar: "1 إلى 2", en: "1 to 2" }, { ar: "3 إلى 5", en: "3 to 5" },
  { ar: "6 إلى 9", en: "6 to 9" }, { ar: "10 إلى 14", en: "10 to 14" }, { ar: "15 إلى 18", en: "15 to 18" },
];

const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function openDays(n: number) {
  const out: Date[] = [];
  const d = new Date(); d.setHours(12, 0, 0, 0);
  while (out.length < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 5) out.push(new Date(d)); }
  return out;
}
const SLOTS = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

export function isPhone(v: string) {
  const s = v.replace(/[\s()-]/g, "");
  return /^(\+?20|0)?1[0125]\d{8}$/.test(s) || /^\+\d{8,15}$/.test(s);
}

export function Booking({ world: presetWorld, service: presetService }: { world?: World; service?: string }) {
  const { lang, t, dir } = useLang();
  const days = useMemo(() => openDays(12), []);
  const [world, setWorld] = useState<World | undefined>(presetWorld);
  const [step, setStep] = useState(presetWorld ? 1 : 0);
  const [svc, setSvc] = useState<string>(presetService ?? "");
  const [where, setWhere] = useState("");
  const [day, setDay] = useState(dayKey(days[0]));
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState(0);
  const [note, setNote] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);

  const kids = world === "kids";
  const detailsOk = name.trim().length > 1 && isPhone(phone);
  const ok = [!!world, !!svc, !!where, !!time, detailsOk][step];
  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;
  const Next = dir === "rtl" ? ArrowLeft : ArrowRight;
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(lang === "ar" ? "ar-EG-u-nu-latn" : "en-GB", o);

  const next = () => {
    if (step === 4) { if (detailsOk) setDone(true); else setTried(true); return; }
    if (ok) setStep(step + 1);
  };

  if (done) {
    return (
      <div className="z-book" data-w={world}>
        <motion.div className="z-book-done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <span className="z-book-done-i"><Check size={30} /></span>
          <h3>{t(T.doneT)}</h3>
          <p>{t(T.doneB).replace("{phone}", phone)}</p>
          <p className="z-demo">{t(UI.demo)}</p>
          <button type="button" className="z-btn z-btn-ghost" onClick={() => { setDone(false); setStep(0); setWorld(undefined); setSvc(""); setWhere(""); setTime(""); setTried(false); }}>{t(T.again)}</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="z-book" data-w={world}>
      <ol className="z-book-steps" aria-label={t(UI.book)}>
        {T.steps.map((s, i) => (
          <li key={i} className={i === step ? "is-on" : i < step ? "is-done" : ""}>
            <button type="button" disabled={i > step} onClick={() => setStep(i)} aria-current={i === step ? "step" : undefined}>
              <span className="u-tnum">{i < step ? <Check size={13} /> : i + 1}</span><em>{t(s)}</em>
            </button>
          </li>
        ))}
      </ol>

      <motion.div key={step} className="z-book-pane" initial={{ opacity: 0, x: dir === "rtl" ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        {step === 0 && (
          <fieldset>
            <legend className="z-book-q">{t(T.who)}</legend>
            <div className="z-book-worlds">
              {(["adults", "kids"] as World[]).map((w) => (
                <label key={w} data-w={w} className={`z-book-world${world === w ? " is-on" : ""}`}>
                  <input type="radio" name="bk-world" checked={world === w} onChange={() => { setWorld(w); setSvc(""); }} />
                  <WorldGlyph world={w} size={40} />
                  <b>{t(WORLDS[w].audience)}</b>
                  <span>{t(WORLDS[w].tagline)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && world && (
          <fieldset>
            <legend className="z-book-q">{t(T.what)}</legend>
            <div className="z-book-opts">
              {[...servicesOf(world).map((s) => ({ id: s.id, label: s.name })), { id: "general", label: T.notSure }].map((o) => (
                <label key={o.id} className={`z-book-opt${svc === o.id ? " is-on" : ""}${o.id === "torsion" ? " is-urgent" : ""}`}>
                  <input type="radio" name="bk-svc" checked={svc === o.id} onChange={() => setSvc(o.id)} />
                  {o.id === "torsion" && <Siren size={16} />}{t(o.label)}
                </label>
              ))}
            </div>
            {svc === "torsion" && (
              <p className="z-book-alert"><Siren size={18} />{t(T.torsion)} <a href={`tel:${BRAND.hotline}`}>{BRAND.hotline}</a></p>
            )}
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="z-book-q">{t(T.where)}</legend>
            <div className="z-book-opts is-two">
              {BRANCHES.map((b) => (
                <label key={b.id} className={`z-book-opt${where === b.id ? " is-on" : ""}`}>
                  <input type="radio" name="bk-where" checked={where === b.id} onChange={() => setWhere(b.id)} />
                  <MapPin size={16} /><span><b>{t(b.city)}</b><small>{t(b.address)}</small></span>
                </label>
              ))}
              <label className={`z-book-opt${where === "online" ? " is-on" : ""}`}>
                <input type="radio" name="bk-where" checked={where === "online"} onChange={() => setWhere("online")} />
                <Video size={16} /><span><b>{t(UI.online)}</b><small>{t(UI.abroad)}</small></span>
              </label>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="z-book-q">{t(T.when)}</legend>
            <div className="z-book-days" role="radiogroup">
              {days.map((d) => {
                const k = dayKey(d);
                return (
                  <button key={k} type="button" role="radio" aria-checked={day === k} className={day === k ? "is-on" : ""} onClick={() => setDay(k)}>
                    <span>{fmt(d, { weekday: "short" })}</span><b className="u-tnum">{d.getDate()}</b><span>{fmt(d, { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
            <div className="z-book-slots" role="radiogroup">
              {SLOTS.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={time === s} className={`u-tnum${time === s ? " is-on" : ""}`} onClick={() => setTime(s)}>{s}</button>
              ))}
            </div>
            <p className="z-book-note">{t(T.whenNote)}</p>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset className="z-book-form">
            <legend className="z-book-q">{t(T.details)}</legend>
            <label className={`z-field${tried && name.trim().length < 2 ? " is-bad" : ""}`}>
              <span>{t(kids ? T.parent : T.name)}</span>
              <input id="bk-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              {tried && name.trim().length < 2 && <em>{t(T.nameErr)}</em>}
            </label>
            <label className={`z-field${tried && !isPhone(phone) ? " is-bad" : ""}`}>
              <span>{t(T.phone)}</span>
              <input id="bk-phone" type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              {tried && !isPhone(phone) ? <em>{t(T.phoneErr)}</em> : <small>{t(T.phoneHint)}</small>}
            </label>
            {kids && (
              <div className="z-field">
                <span>{t(T.age)}</span>
                <div className="z-book-ages">
                  {AGES_SEL.map((a, i) => (
                    <button key={i} type="button" className={age === i ? "is-on" : ""} aria-pressed={age === i} onClick={() => setAge(i)}>{t(a)}</button>
                  ))}
                </div>
              </div>
            )}
            <label className="z-field">
              <span>{t(T.note)}</span>
              <textarea id="bk-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
            <div className="z-book-sum">
              <span><WorldGlyph world={world ?? "adults"} size={16} />{world ? t(WORLDS[world].audience) : ""}</span>
              <span>{svc === "general" ? t(T.notSure) : svc ? t(serviceById(svc)!.name) : ""}</span>
              <span>{where === "online" ? t(UI.online) : where ? t(BRANCHES.find((b) => b.id === where)!.city) : ""}</span>
              <span className="u-tnum">{fmt(days.find((d) => dayKey(d) === day)!, { weekday: "long", day: "numeric", month: "long" })} · {time}</span>
            </div>
          </fieldset>
        )}
      </motion.div>

      <div className="z-book-nav">
        {step > 0 ? <button type="button" className="z-btn z-btn-ghost" onClick={() => setStep(step - 1)}><Back size={16} />{t(T.back)}</button> : <a className="z-link" href={`tel:${BRAND.hotline}`}><Phone size={15} /> {BRAND.hotline}</a>}
        <button type="button" className="z-btn z-btn-primary" onClick={next} disabled={step !== 4 && !ok}>
          {step === 4 ? t(T.send) : t(T.next)} {step < 4 && <Next size={16} />}
        </button>
      </div>
    </div>
  );
}
