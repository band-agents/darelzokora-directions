/**
 * The board the client opens first, in the language they chose.
 *
 * Order: what this is → why the current site needs restructuring (only what
 * can be checked on darelzokora.com) → the new structure and every place the
 * two sections show → the three directions, live → the same page in A, B and
 * C → what we need from the centre.
 */

import { ArrowUpRight, Check, Phone } from "lucide-react";
import type { ComponentType } from "react";
import { BRAND, type L, type World } from "@/content";
import { useLang } from "@/lib/i18n";
import { LivePlayer, Reveal, RevealGroup, RevealItem } from "@/lib/motion";
import type { DirId } from "@/lib/routes";
import { BubbleHero, HERO, HERO_FRAMES, STICKER_FRAMES, SplitHero, StickerHero, type HeroProps } from "@/remotion/heroes";
import { SKIN as BUBBLE } from "@/directions/Bubble";
import { SKIN as SPLIT } from "@/directions/Split";
import { SKIN as STICKER } from "@/directions/Sticker";
import { LangToggle } from "@/ui/chrome";
import { heroPropsFor } from "@/ui/heroProps";
import { WorldGlyph, type Skin } from "@/ui/site";
import logo from "@/brand/logo.svg";
import "./overview.css";

interface Direction {
  id: DirId; letter: string; name: L; idea: L; summary: L; motion: L; chooseIf: L;
  skin: Skin; film: ComponentType<HeroProps>; frames: number;
  fonts: [string, string]; swatches: Record<World, [string, string]>;
  stage: string;
}

const DIRS: Direction[] = [
  {
    id: "bubble", letter: "A", name: { ar: "فقاعة", en: "Bubble" },
    idea: { ar: "ناعم، مستدير، خفيف كالهواء.", en: "Soft, round, weightless." },
    summary: {
      ar: "ألوان باستيل تسبح في الخلفية وكل شيء مستدير. النعناعي والأزرق المائي للكبار، والخوخي والزبدي للأطفال، والتركوازي من الشعار يجمع القسمين.",
      en: "Pastel washes drift behind everything and every edge is round. Mint and aqua for adults, peach and butter for kids; the logo's teal holds both together.",
    },
    motion: {
      ar: "الفيلم يعيش داخل فقاعة عائمة وينتقل من قسم إلى قسم بانتقال «القزحية» الدائري من Remotion. فقاعات تصعد، وعناوين تطلع كلمة كلمة.",
      en: "The film lives in a floating bubble and moves from section to section through Remotion's circular iris. Bubbles rise; headlines lift word by word.",
    },
    chooseIf: { ar: "تريدون الأكثر دفئاً وطمأنة، وخصوصاً للأمهات.", en: "you want the warmest, most reassuring of the three, especially for mothers." },
    skin: BUBBLE, film: BubbleHero, frames: HERO_FRAMES,
    fonts: ["Baloo Bhaijaan 2", "Readex Pro"],
    swatches: { adults: ["#077A74", "#DDF5F1"], kids: ["#D65A3F", "#FFE9DC"] },
    stage: "radial-gradient(70% 70% at 30% 30%, #DDF5F1, transparent 70%), radial-gradient(70% 70% at 75% 75%, #FFE9DC, transparent 70%), #F6FBFB",
  },
  {
    id: "split", letter: "B", name: { ar: "نصفان", en: "Split" },
    idea: { ar: "صفحة واحدة، نصفان واضحان.", en: "One page, two clear halves." },
    summary: {
      ar: "الرئيسية مقسومة حرفياً: الكبار في جهة والأطفال في الجهة الأخرى، والنصف الذي تقترب منه يكبر. تحريري ودقيق، خطوط بدل الظلال. أخضر مريمي للكبار، وبنفسجي فاتح وزبدي للأطفال.",
      en: "The home page is literally split: adults on one side, kids on the other, and the half you lean into grows. Editorial and exact, rules instead of shadows. Sage and teal for adults, periwinkle and butter for kids.",
    },
    motion: {
      ar: "الفيلم ميدالية على خط المنتصف، يمسح من نصف إلى نصف ثم يدور كعقرب الساعة (انتقالات wipe و clockWipe). داخل كل قسم فهرس جانبي ثابت يأخذك لأي جزء.",
      en: "The film is a medallion on the seam that wipes from half to half, then sweeps like a clock hand (wipe and clockWipe). Inside each section a sticky index takes you anywhere on the page.",
    },
    chooseIf: { ar: "تريدون الأوضح والأكثر «طبية»، والأسهل لمن يعرف ما يريد.", en: "you want the clearest and most clinical, and the fastest for people who know what they want." },
    skin: SPLIT, film: SplitHero, frames: HERO_FRAMES,
    fonts: ["Alexandria", "IBM Plex Sans Arabic"],
    swatches: { adults: ["#0E7C72", "#E3F3EF"], kids: ["#4757D6", "#E7EBFF"] },
    stage: "linear-gradient(90deg, #E3F3EF 50%, #E7EBFF 50%)",
  },
  {
    id: "sticker", letter: "C", name: { ar: "ملصق", en: "Sticker" },
    idea: { ar: "مرح، جريء، كأنه تطبيق.", en: "Playful, bold, app-like." },
    summary: {
      ar: "كل شيء ملصق: ألوان باستيل، حد حبر سميك، ظل صلب، وميل خفيف يستقيم عندما تلمسه. نعناعي وسماوي للكبار، وردي علكة وليموني للأطفال.",
      en: "Everything is a sticker: pastel fills, a thick ink outline, a hard shadow and a slight tilt that straightens when you touch it. Mint and sky for adults, bubblegum and lemon for kids.",
    },
    motion: {
      ar: "الفيلم يتقلب كملصق يُقلب على ظهره (انتقال flip من Remotion)، شريط يمر بكل الخدمات بأسمائها، وشنب الشعار يتحرك.",
      en: "The film turns over like a sticker being flipped (Remotion flip), a ticker runs every service by name, and the logo's moustache wiggles.",
    },
    chooseIf: { ar: "تريدون الأجرأ والأكثر مرحاً، والأقرب لجيل الشباب والآباء الجدد.", en: "you want the boldest and most fun, closest to young men and new parents." },
    skin: STICKER, film: StickerHero, frames: STICKER_FRAMES,
    fonts: ["Marhey", "Rubik"],
    swatches: { adults: ["#7FE0C8", "#CFF5EA"], kids: ["#FFB3C7", "#FFE0EA"] },
    stage: "radial-gradient(#1B153014 1.2px, transparent 1.4px) 0 0 / 16px 16px, #F8F5FF",
  },
];

/** Things the current site does that the new structure answers. Each can be checked on darelzokora.com. */
const TODAY: { now: L; fix: L }[] = [
  {
    now: { ar: "القائمة قائمة واحدة طويلة؛ ستة روابط منها عن الدعامات، وموضوعا الأطفال الوحيدان (التبول اللاإرادي وتأخر البلوغ) مدفونان تحت «الرجل».", en: "The menu is one long list; six links are about implants, and the only two children's topics (bedwetting, delayed puberty) sit under “The man”." },
    fix: { ar: "قسمان لكل منهما صفحته وخدماته ولونه، ومفتاح «الكبار / الأطفال» في أعلى كل صفحة.", en: "Two sections, each with its own page, services and colour, and an Adults / Kids switch at the top of every page." },
  },
  {
    now: { ar: "في الرئيسية يظهر الأطفال في بطاقة واحدة من تسع، وبطاقة التبول اللاإرادي تحمل نص الدعامة نفسه.", en: "On the home page children get one card of nine, and the bedwetting card carries the implant card's text." },
    fix: { ar: "الرئيسية مفترق طرق: أول قرار هو «لي» أو «لابني»، ولكل قسم ثماني خدمات مكتوبة له.", en: "The home page is a fork: the first decision is “for me” or “for my son”, and each section has eight services written for it." },
  },
  {
    now: { ar: "الخبرة مذكورة بثلاث صيغ في الصفحة نفسها: 20 سنة، وأكثر من 18 عاماً، ومنذ 2003.", en: "Experience is stated three ways on the same page: 20 years, 18+ years, and since 2003." },
    fix: { ar: "رقم واحد في كل مكان: منذ 2003.", en: "One figure everywhere: since 2003." },
  },
];

/** Every place the two sections show, with a page that shows it. */
const STRESS: { t: L; d: L; href: string }[] = [
  { t: { ar: "الرئيسية مفترق طرق", en: "Home is a fork" }, d: { ar: "بابان كبيران قبل أي شيء آخر.", en: "Two big doors before anything else." }, href: "" },
  { t: { ar: "مفتاح في كل صفحة", en: "A switch on every page" }, d: { ar: "الكبار / الأطفال في الهيدر، دائماً.", en: "Adults / Kids in the header, always." }, href: "/adults" },
  { t: { ar: "لون لكل قسم", en: "A colour per section" }, d: { ar: "الموقع كله يغيّر لونه حسب القسم.", en: "The whole site changes colour with the section." }, href: "/kids" },
  { t: { ar: "انتقال بين العالمين", en: "A wipe between worlds" }, d: { ar: "دائرة بلون القسم تفتح عند العبور.", en: "A circle in the section's colour opens as you cross." }, href: "/kids" },
  { t: { ar: "الحجز يبدأ بـ«لمن؟»", en: "Booking starts with “who for?”" }, d: { ar: "لي أو لابني، ثم أسئلة تناسب كل حالة.", en: "Me or my son, then questions that fit each." }, href: "/book" },
  { t: { ar: "حسب عمر ابنك", en: "By your son's age" }, d: { ar: "رضيع، طفل، مراهق، مع ما يجب مراقبته.", en: "Baby, child, teen, with what to watch for." }, href: "/kids" },
  { t: { ar: "حالة طارئة واضحة", en: "An emergency you can't miss" }, d: { ar: "التواء الخصية: اتصل الآن، لا تحجز.", en: "Testicular torsion: call now, don't book." }, href: "/s/torsion" },
  { t: { ar: "شريط الهاتف", en: "The phone tab bar" }, d: { ar: "الكبار والأطفال بجوار زر الحجز.", en: "Adults and Kids either side of Book." }, href: "/kids" },
];

const PAGES: { label: L; path: string; w?: World }[] = [
  { label: { ar: "الرئيسية", en: "Home" }, path: "" },
  { label: { ar: "قسم الكبار", en: "Adults section" }, path: "/adults", w: "adults" },
  { label: { ar: "قسم الأطفال", en: "Kids section" }, path: "/kids", w: "kids" },
  { label: { ar: "خدمة: دعامة العضو الذكري", en: "Service: penile implants" }, path: "/s/implants", w: "adults" },
  { label: { ar: "خدمة: الخصية المعلقة", en: "Service: undescended testis" }, path: "/s/undescended", w: "kids" },
  { label: { ar: "طارئ: التواء الخصية", en: "Emergency: testicular torsion" }, path: "/s/torsion", w: "kids" },
  { label: { ar: "احجز", en: "Book" }, path: "/book" },
  { label: { ar: "احجز لابنك", en: "Book for your son" }, path: "/book/kids", w: "kids" },
  { label: { ar: "د. أسامة", en: "Dr. Osama" }, path: "/doctor" },
  { label: { ar: "الفروع", en: "Branches" }, path: "/branches" },
  { label: { ar: "مقالات", en: "Articles" }, path: "/articles" },
];

const ASKS: L[] = [
  { ar: "أي اتجاه، أو ما تحبونه من كل واحد.", en: "Which direction, or what you like from each." },
  { ar: "مراجعة د. أسامة للنصوص الطبية، وخصوصاً صفحات الأطفال التي كتبناها من جديد.", en: "Dr. Osama's review of the medical copy, especially the kids' pages we wrote from scratch." },
  { ar: "مواعيد كل فرع الحقيقية. المواعيد في نموذج الحجز أمثلة، والطلب يؤكَّد بالهاتف.", en: "Each branch's real hours. The booking times are examples; a request is confirmed by phone." },
  { ar: "أين تصل طلبات الحجز: الخط الساخن، أو واتساب، أو نظام حجز لديكم.", en: "Where booking requests should go: the hotline, WhatsApp, or a booking system you use." },
  { ar: "رقم واتساب: الموقع الحالي فيه رقم، فهل نضيفه؟", en: "WhatsApp: the current site links a number. Should we add it?" },
  { ar: "موافقتكم على اقتباس تقييمات Google (مختصرة، بالحروف الأولى فقط).", en: "Your OK to quote Google reviews (shortened, initials only)." },
  { ar: "صور حقيقية للفروع ولمنطقة الأطفال إن وُجدت؛ نستخدم الآن رسوماً.", en: "Real photos of the branches and any children's area; we use illustrations for now." },
];

function Film({ d }: { d: Direction }) {
  const { t, dir } = useLang();
  return (
    <div className="ov-film" style={{ background: d.stage }}>
      <div className={`ov-film-in ov-film-${d.id}`}>
        <LivePlayer component={d.film} inputProps={heroPropsFor(d.skin, t, dir === "rtl")} width={HERO.width} height={HERO.height} frames={d.frames} still={40}
          label={t({ ar: `فيلم الواجهة للاتجاه ${d.letter}`, en: `Direction ${d.letter}'s hero film` })} />
      </div>
    </div>
  );
}

export function Overview() {
  const { t, lang, dir } = useLang();
  return (
    <div className="ov" dir={dir} lang={lang}>
      <header className="ov-top">
        <div className="ov-wrap ov-top-in">
          <img src={logo} alt={t(BRAND.name)} className="ov-logo" />
          <span className="ov-top-t">{t({ ar: "اتجاهات الموقع · الجولة الأولى", en: "Website directions · round one" })}</span>
          <LangToggle className="ov-lang" />
        </div>
      </header>

      <section className="ov-hero">
        <div className="ov-wrap">
          <Reveal y={10}><p className="ov-kicker">{t(BRAND.name)} · {t(BRAND.doctor)}</p></Reveal>
          <Reveal delay={0.08} y={16}>
            <h1 className="ov-h1">
              {t({ ar: "مركز واحد، قسمان، ", en: "One centre, two sections, " })}
              <em>{t({ ar: "وثلاث طرق لعرضهما", en: "three ways to show it" })}</em>
            </h1>
          </Reveal>
          <Reveal delay={0.16} y={12}>
            <p className="ov-lead">
              {t({
                ar: "ثلاثة مواقع كاملة، كل منها بالعربية أولاً والإنجليزية بضغطة. كلها مبنية على البنية الجديدة نفسها: قسم للكبار وقسم للأطفال، ظاهران في كل صفحة. الاختلاف في الشكل والحركة والإحساس.",
                en: "Three complete sites, each in Arabic first with English one tap away. All three share the same new structure: an adults section and a kids section, visible on every page. They differ in look, motion and feel.",
              })}
            </p>
          </Reveal>
          <Reveal delay={0.24} y={12} className="ov-jump">
            {DIRS.map((d) => (
              <a key={d.id} href={`#${d.id}`} className="ov-jump-a">
                <b>{d.letter}</b>{t(d.name)}<ArrowUpRight size={16} className="u-flip" />
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="ov-sec">
        <div className="ov-wrap">
          <h2 className="ov-h2">{t({ ar: "لماذا نعيد البناء، لا التلوين فقط", en: "Why restructure, not just restyle" })}</h2>
          <RevealGroup className="ov-today" each={0.08}>
            {TODAY.map((x, i) => (
              <RevealItem key={i} className="ov-today-row">
                <div className="ov-now"><span className="ov-tag">{t({ ar: "اليوم", en: "Today" })}</span><p>{t(x.now)}</p></div>
                <div className="ov-new"><span className="ov-tag ov-tag-new">{t({ ar: "الجديد", en: "New" })}</span><p>{t(x.fix)}</p></div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="ov-sec ov-sec-tint">
        <div className="ov-wrap">
          <h2 className="ov-h2">{t({ ar: "البنية الجديدة", en: "The new structure" })}</h2>
          <p className="ov-sub">{t({ ar: "كل صفحة تعرف إلى أي قسم تنتمي. الصفحات المشتركة تخدم القسمين.", en: "Every page knows which section it belongs to. Shared pages serve both." })}</p>
          <div className="ov-map">
            <div className="ov-map-home">{t({ ar: "الرئيسية: لي أم لابني؟", en: "Home: for me, or for my son?" })}</div>
            <div className="ov-map-worlds">
              {(["adults", "kids"] as World[]).map((w) => (
                <div key={w} className="ov-map-world" data-ow={w}>
                  <b><WorldGlyph world={w} size={20} />{t(w === "adults" ? { ar: "قسم الكبار", en: "Adults section" } : { ar: "قسم الأطفال", en: "Kids section" })}</b>
                  <span>{t(w === "adults"
                    ? { ar: "ما الذي يقلقك · 8 خدمات · رحلتك · أسئلة · تقييمات · مقالات", en: "What's on your mind · 8 services · your visit · FAQ · reviews · articles" }
                    : { ar: "ما الذي يقلقك · 8 خدمات · حسب العمر · طارئ · رحلتك · أسئلة · مقالات", en: "What's on your mind · 8 services · by age · emergency · your visit · FAQ · articles" })}</span>
                  <i>{t({ ar: "صفحة لكل خدمة ← حجز مجهّز مسبقاً", en: "A page per service → booking, pre-filled" })}</i>
                </div>
              ))}
            </div>
            <div className="ov-map-shared">{t({ ar: "مشترك: د. أسامة · الفروع الأربعة · المقالات · الحجز", en: "Shared: Dr. Osama · the four branches · articles · booking" })}</div>
          </div>

          <h3 className="ov-h3">{t({ ar: "أين يظهر القسمان", en: "Where the two sections show" })}</h3>
          <RevealGroup className="ov-stress" each={0.05}>
            {STRESS.map((s, i) => (
              <RevealItem key={i}>
                <a className="ov-stress-a" href={`#bubble${s.href}`}>
                  <span className="ov-stress-n u-tnum">{String(i + 1).padStart(2, "0")}</span>
                  <b>{t(s.t)}</b>
                  <span>{t(s.d)}</span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {DIRS.map((d, i) => (
        <section key={d.id} id={d.id} className={`ov-sec ov-dir ${i % 2 ? "ov-dir-rev" : ""}`}>
          <div className="ov-wrap ov-dir-grid">
            <Film d={d} />
            <div className="ov-dir-copy">
              <p className="ov-dir-letter"><b>{d.letter}</b>{t(d.name)}</p>
              <h2 className="ov-h2">{t(d.idea)}</h2>
              <p>{t(d.summary)}</p>
              <dl className="ov-facts">
                <div><dt>{t({ ar: "الحركة", en: "Motion" })}</dt><dd>{t(d.motion)}</dd></div>
                <div>
                  <dt>{t({ ar: "الألوان", en: "Colour" })}</dt>
                  <dd className="ov-sw">
                    {(["adults", "kids"] as World[]).map((w) => (
                      <span key={w}>
                        {d.swatches[w].map((c) => <i key={c} style={{ background: c }} title={c} />)}
                        {t(w === "adults" ? { ar: "الكبار", en: "Adults" } : { ar: "الأطفال", en: "Kids" })}
                      </span>
                    ))}
                  </dd>
                </div>
                <div><dt>{t({ ar: "الخطوط", en: "Type" })}</dt><dd><span style={{ fontFamily: `'${d.fonts[0]}'` }}>{d.fonts[0]}</span> + {d.fonts[1]}</dd></div>
                <div><dt>{t({ ar: "اختاروه إذا", en: "Choose it if" })}</dt><dd>{t(d.chooseIf)}</dd></div>
              </dl>
              <div className="ov-dir-go">
                <a className="ov-btn" href={`#${d.id}`}>{t({ ar: `افتح ${d.letter}`, en: `Open ${d.letter}` })}<ArrowUpRight size={17} className="u-flip" /></a>
                <a className="ov-btn ov-btn-ghost" href={`#${d.id}/adults`}><WorldGlyph world="adults" size={17} />{t({ ar: "الكبار", en: "Adults" })}</a>
                <a className="ov-btn ov-btn-ghost" href={`#${d.id}/kids`}><WorldGlyph world="kids" size={17} />{t({ ar: "الأطفال", en: "Kids" })}</a>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="ov-sec ov-sec-tint">
        <div className="ov-wrap">
          <h2 className="ov-h2">{t({ ar: "الصفحة نفسها في الثلاثة", en: "The same page in all three" })}</h2>
          <p className="ov-sub">{t({ ar: "كل موقع فيه هذه الصفحات. والمفتاح أسفل الشاشة ينقلك بين A و B و C على الصفحة نفسها.", en: "Every site has these pages, and the switcher at the bottom of the screen moves between A, B and C on the same page." })}</p>
          <div className="ov-table" role="table">
            <div className="ov-tr ov-th" role="row">
              <span role="columnheader">{t({ ar: "الصفحة", en: "Page" })}</span>
              {DIRS.map((d) => <span key={d.id} role="columnheader"><b>{d.letter}</b> {t(d.name)}</span>)}
            </div>
            {PAGES.map((p) => (
              <div key={p.path} className="ov-tr" role="row">
                <span role="cell" className="ov-td-page">{p.w && <WorldGlyph world={p.w} size={16} />}{t(p.label)}</span>
                {DIRS.map((d) => (
                  <a key={d.id} role="cell" href={`#${d.id}${p.path}`} aria-label={`${t(p.label)} · ${d.letter}`}>
                    {d.letter}<ArrowUpRight size={15} className="u-flip" />
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ov-sec">
        <div className="ov-wrap ov-narrow">
          <h2 className="ov-h2">{t({ ar: "ما نحتاجه من المركز", en: "What we need from the centre" })}</h2>
          <ul className="ov-asks">
            {ASKS.map((a, i) => <li key={i}><Check size={18} />{t(a)}</li>)}
          </ul>
        </div>
      </section>

      <footer className="ov-foot">
        <div className="ov-wrap ov-foot-in">
          <span>{t(BRAND.name)} · {t({ ar: "اتجاهات الموقع", en: "Website directions" })} · {new Date().getFullYear()}</span>
          <a href={`tel:${BRAND.hotline}`}><Phone size={15} /> <span className="u-tnum">{BRAND.hotline}</span></a>
        </div>
      </footer>
    </div>
  );
}
