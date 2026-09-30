/**
 * Every word the three directions print, in Arabic and English.
 *
 * Arabic is the landing language; English is one tap away. Both live side by
 * side in L objects so a missing translation is a type error, not a blank.
 *
 * Sources:
 *   - darelzokora.com as it stands (2026-09-30): the service list, the kids
 *     topics its own articles cover, the doctor's record, branches, hotline,
 *     the Q&A answers, and public Google reviews it already shows.
 *   - Everything marked "ours" is new wording written for the redesign. The
 *     medical copy is deliberately general and must be reviewed by Dr. Osama
 *     before launch.
 *
 * The site is built on two worlds, adults and kids. Every service belongs to
 * exactly one, and every page knows which world it is in.
 */

export type L = { ar: string; en: string };
export type World = "adults" | "kids";

/* ── Identity ─────────────────────────────────────────────── */

export const BRAND = {
  name: { ar: "دار الذكورة", en: "Dar El Zokora" } as L,
  doctor: { ar: "د. أسامة غطاس", en: "Dr. Osama Ghattas" } as L,
  doctorTitle: { ar: "استشاري جراحات الذكورة والمسالك البولية", en: "Consultant in andrology & urological surgery" } as L,
  hotline: "16740",
  email: "info@darelzokora.com",
  line: { ar: "مركز صحة الرجل والطفل الذكر، من الولادة حتى الشيخوخة", en: "Men's and boys' health, from birth onwards" } as L, // ours
  social: [
    { id: "facebook", href: "https://www.facebook.com/daralzokora/" },
    { id: "instagram", href: "https://www.instagram.com/drosamaghatas/" },
    { id: "youtube", href: "https://www.youtube.com/channel/UCbHS7mzy9C3Pc1u4ZtDeZ1A" },
    { id: "x", href: "https://twitter.com/ElZokora" },
  ],
  site: "https://www.darelzokora.com/",
};

/** The site's own figures. */
export const STATS = [
  { value: 2003, plain: true, label: { ar: "بداية الممارسة", en: "In practice since" } },
  { value: 100000, suffix: "+", label: { ar: "حالة تم فحصها", en: "Patients examined" } },
  { value: 20000, suffix: "+", label: { ar: "عملية جراحية", en: "Surgeries performed" } },
  { value: 10000, suffix: "+", label: { ar: "عملية زراعة دعامة", en: "Penile implants" } },
] as const;

/* ── The two worlds ───────────────────────────────────────── */

export const WORLDS: Record<World, {
  label: L; tagline: L; title: L; intro: L; cta: L; door: L; audience: L;
}> = {
  adults: {
    label: { ar: "الكبار", en: "Adults" },
    audience: { ar: "لك أنت", en: "For you" },
    tagline: { ar: "صحة الرجل الجنسية والإنجابية", en: "Men's sexual & reproductive health" },
    title: { ar: "صحتك الجنسية، بسرية تامة", en: "Your sexual health, in complete privacy" },
    intro: {
      ar: "من ضعف الانتصاب وتأخر الإنجاب إلى دعامات العضو الذكري: تشخيص دقيق، وخطة واضحة، وطبيب واحد يتابعك من أول زيارة لآخرها.",
      en: "From erectile problems and delayed conception to penile implants: a precise diagnosis, a clear plan, and one doctor who follows you from the first visit to the last.",
    },
    cta: { ar: "احجز كشفك", en: "Book your visit" },
    door: { ar: "أنا أبحث عن علاج لي", en: "I'm looking for care for myself" },
  },
  kids: {
    label: { ar: "الأطفال", en: "Kids" },
    audience: { ar: "لابنك", en: "For your son" },
    tagline: { ar: "من الولادة حتى البلوغ", en: "From birth to puberty" },
    title: { ar: "اطمئن على ابنك من الصغر", en: "Peace of mind for your son, from day one" },
    intro: {
      ar: "الخصية المعلقة، والختان، والتبول اللاإرادي، والبلوغ: فحص لطيف بحضورك، وشرح واضح لك، ومتابعة لنموه خطوة بخطوة.",
      en: "Undescended testis, circumcision, bedwetting, puberty: a gentle check with you in the room, a clear explanation for you, and follow-up as he grows.",
    },
    cta: { ar: "احجز لابنك", en: "Book for your son" },
    door: { ar: "أنا أبحث عن علاج لابني", en: "I'm looking for care for my son" },
  },
};

/* ── Services ─────────────────────────────────────────────── */

export type Age = "baby" | "child" | "teen";

export interface Service {
  id: string;
  world: World;
  icon: string;
  name: L;
  short: L;
  about: L;
  signs: L[];
  care: L[];
  note?: L;
  emergency?: boolean;
  ages?: Age[];
  faq?: { q: L; a: L }[];
}

export const SERVICES: Service[] = [
  /* Adults */
  {
    id: "implants", world: "adults", icon: "Sparkles",
    name: { ar: "دعامة العضو الذكري", en: "Penile implants" },
    short: { ar: "حل دائم لضعف الانتصاب الشديد، بنوعيها الهيدروليكية والمرنة.", en: "A permanent answer to severe erectile dysfunction, hydraulic or malleable." },
    about: {
      ar: "حين لا تعود الأدوية مفيدة، تعيد الدعامة القدرة على الانتصاب بشكل دائم. أُجري في دار الذكورة أكثر من 10,000 عملية زراعة دعامة، ويُختار النوع المناسب لكل حالة بعد تشخيص دقيق.",
      en: "When medication stops working, an implant restores erections for good. More than 10,000 implants have been placed at Dar El Zokora, and the right type is chosen for each man after a precise diagnosis.",
    },
    signs: [
      { ar: "الأدوية لم تعد تعطي نتيجة", en: "Tablets no longer work" },
      { ar: "ضعف انتصاب مع السكر أو الضغط", en: "Erectile problems with diabetes or blood pressure" },
      { ar: "بعد جراحة البروستاتا", en: "After prostate surgery" },
    ],
    care: [
      { ar: "الدعامة الهيدروليكية: انتصاب طبيعي عند الحاجة", en: "Hydraulic implant: a natural erection on demand" },
      { ar: "الدعامة المرنة: أبسط وأقل تكلفة", en: "Malleable implant: simpler and more affordable" },
      { ar: "تقنية Ghattas Modification لتثبيت الخزان بأمان ووقت أقصر", en: "The Ghattas Modification: a safer, shorter way to fix the reservoir" },
    ],
    note: { ar: "لا تظهر من خارج الملابس، وآمنة لمرضى السكر والضغط.", en: "Invisible under clothes, and safe with diabetes or high blood pressure." },
    faq: [
      { q: { ar: "كم تعيش الدعامة؟", en: "How long does an implant last?" }, a: { ar: "فعاليتها نظرياً 15 سنة، وعملياً تستمر أكثر من ذلك.", en: "In theory 15 years; in practice, often longer." } },
      { q: { ar: "هل تؤثر على السكر أو الضغط؟", en: "Does it affect diabetes or blood pressure?" }, a: { ar: "لا، الدعامة لا تؤثر على السكر ولا الضغط.", en: "No. The implant has no effect on either." } },
    ],
  },
  {
    id: "ed", world: "adults", icon: "HeartPulse",
    name: { ar: "علاج ضعف الانتصاب", en: "Erectile dysfunction" },
    short: { ar: "تشخيص دقيق للسبب، عضوي أو نفسي، ثم خطة علاج تناسبك.", en: "Find the real cause, physical or psychological, then a plan that fits you." },
    about: {
      ar: "أغلب حالات ضعف الانتصاب لها سبب يمكن اكتشافه: الأوعية الدموية، أو الهرمونات، أو التسرب الوريدي، أو الأدوية. نبدأ بالتشخيص قبل أي علاج.",
      en: "Most erectile problems have a cause that can be found: blood flow, hormones, venous leak or medication. We diagnose before we treat.",
    },
    signs: [
      { ar: "انتصاب ضعيف أو قصير", en: "Weak or short-lived erections" },
      { ar: "غياب الانتصاب الصباحي", en: "No morning erections" },
      { ar: "قلق مستمر قبل العلاقة", en: "Constant anxiety before sex" },
    ],
    care: [
      { ar: "دوبلر على العضو وتحاليل هرمونات", en: "Penile Doppler and hormone tests" },
      { ar: "علاج دوائي وتعديل نمط الحياة", en: "Medication and lifestyle changes" },
      { ar: "علاج التسرب الوريدي عند وجوده", en: "Treatment of venous leak when present" },
    ],
  },
  {
    id: "pe", world: "adults", icon: "Timer",
    name: { ar: "سرعة القذف", en: "Premature ejaculation" },
    short: { ar: "خطط علاج حديثة تعتمد على السبب الأساسي للحالة.", en: "Modern treatment plans built on the underlying cause." },
    about: {
      ar: "سرعة القذف من أكثر المشكلات شيوعاً وأكثرها قابلية للعلاج. نحدد النوع والسبب، ثم نختار بين التمارين والعلاج الدوائي أو كليهما.",
      en: "Premature ejaculation is one of the most common problems, and one of the most treatable. We identify the type and cause, then choose between exercises, medication or both.",
    },
    signs: [
      { ar: "القذف قبل الرغبة بوقت قصير", en: "Ejaculating sooner than you want" },
      { ar: "صعوبة التحكم في التوقيت", en: "Difficulty controlling the timing" },
      { ar: "توتر في العلاقة الزوجية", en: "Strain in the relationship" },
    ],
    care: [
      { ar: "تمارين وتقنيات سلوكية", en: "Exercises and behavioural techniques" },
      { ar: "علاج دوائي عند الحاجة", en: "Medication where needed" },
      { ar: "علاج السبب العضوي إن وُجد", en: "Treating a physical cause if there is one" },
    ],
  },
  {
    id: "infertility", world: "adults", icon: "Microscope",
    name: { ar: "تأخر الإنجاب والعقم", en: "Male infertility" },
    short: { ar: "تشخيص أسباب تأخر الإنجاب وخطة علاج متكاملة.", en: "Find why conception is delayed, then an integrated plan." },
    about: {
      ar: "في كثير من الحالات يكون سبب تأخر الإنجاب عند الرجل، ويمكن علاجه. من تحليل السائل المنوي إلى إصلاح انسداد القنوات المنوية ميكروسكوبياً وعلاج انعدام الحيوانات المنوية.",
      en: "In many couples the cause lies with the man, and it can be treated. From semen analysis to microsurgical repair of blocked ducts and treatment of azoospermia.",
    },
    signs: [
      { ar: "مرور سنة دون حمل", en: "A year without a pregnancy" },
      { ar: "تحليل سائل منوي غير طبيعي", en: "An abnormal semen analysis" },
      { ar: "انعدام الحيوانات المنوية", en: "No sperm in the sample (azoospermia)" },
    ],
    care: [
      { ar: "تحليل السائل المنوي والهرمونات", en: "Semen analysis and hormones" },
      { ar: "إصلاح انسداد القنوات المنوية ميكروسكوبياً", en: "Microsurgical repair of blocked ducts" },
      { ar: "علاج انعدام الحيوانات المنوية", en: "Azoospermia treatment" },
    ],
  },
  {
    id: "varicocele", world: "adults", icon: "Activity",
    name: { ar: "دوالي الخصية", en: "Varicocele" },
    short: { ar: "جراحة ميكروسكوبية دقيقة لتحسين الخصوبة وتخفيف الألم.", en: "Precise microsurgery to improve fertility and ease pain." },
    about: {
      ar: "الدوالي تمدد في أوردة الخصية قد يسبب ألماً ويؤثر على الخصوبة. نعالجها بالميكروسكوب الجراحي مع الحفاظ على الأوعية الليمفاوية والشرايين.",
      en: "A varicocele is a swelling of the veins around the testicle that can cause pain and affect fertility. We repair it under the surgical microscope, sparing the lymphatics and arteries.",
    },
    signs: [
      { ar: "ثقل أو ألم في الخصية", en: "Heaviness or ache in the testicle" },
      { ar: "عروق بارزة في كيس الصفن", en: "Visible veins in the scrotum" },
      { ar: "تأخر الإنجاب", en: "Delayed conception" },
    ],
    care: [
      { ar: "فحص ودوبلر ملون", en: "Examination and colour Doppler" },
      { ar: "ربط الدوالي ميكروسكوبياً", en: "Microsurgical varicocele repair" },
      { ar: "متابعة تحليل السائل المنوي", en: "Follow-up semen analysis" },
    ],
  },
  {
    id: "curvature", world: "adults", icon: "Spline",
    name: { ar: "انحناء القضيب", en: "Penile curvature" },
    short: { ar: "إصلاح الانحناء الخلقي والمكتسب بتقنيات دقيقة وآمنة.", en: "Correction of congenital and acquired curvature, precisely and safely." },
    about: {
      ar: "الانحناء قد يكون خلقياً أو مكتسباً (مرض بيروني). نقيّم درجته وتأثيره، ونصححه بتقنيات تحافظ على الطول والوظيفة قدر الإمكان.",
      en: "Curvature can be present from birth or develop later (Peyronie's disease). We measure it, assess its effect, and correct it with techniques that preserve length and function as far as possible.",
    },
    signs: [
      { ar: "انحناء واضح أثناء الانتصاب", en: "A clear bend during erection" },
      { ar: "ألم أو صعوبة في العلاقة", en: "Pain or difficulty during sex" },
      { ar: "تكتل ملموس في العضو", en: "A lump you can feel" },
    ],
    care: [
      { ar: "تقييم الانحناء بالصور والقياس", en: "Assessment with photos and measurement" },
      { ar: "علاج غير جراحي في المراحل المبكرة", en: "Non-surgical care in early stages" },
      { ar: "تصحيح جراحي عند الحاجة", en: "Surgical correction when needed" },
    ],
  },
  {
    id: "prostate", world: "adults", icon: "Droplets",
    name: { ar: "البروستاتا والمسالك البولية", en: "Prostate & urinary" },
    short: { ar: "تضخم البروستاتا والحصوات بمناظير حديثة وتعافٍ أسرع.", en: "Enlarged prostate and stones, with modern endoscopy and faster recovery." },
    about: {
      ar: "تضخم البروستاتا الحميد شائع مع التقدم في العمر ويعيق التبول. نعالجه ونعالج حصوات وانسدادات المسالك بأقل تدخل جراحي ممكن.",
      en: "Benign prostate enlargement is common with age and makes passing urine harder. We treat it, and urinary stones and blockages, with the least invasive surgery possible.",
    },
    signs: [
      { ar: "تبول متكرر خاصة ليلاً", en: "Frequent urination, especially at night" },
      { ar: "ضعف تدفق البول", en: "A weak stream" },
      { ar: "ألم أو دم في البول", en: "Pain or blood in the urine" },
    ],
    care: [
      { ar: "أشعة وتحاليل على مستوى البروستاتا", en: "Prostate imaging and tests" },
      { ar: "علاج دوائي", en: "Medication" },
      { ar: "عمليات المنظار المتقدمة", en: "Advanced endoscopic surgery" },
    ],
  },
  {
    id: "hormones", world: "adults", icon: "FlaskConical",
    name: { ar: "الهرمونات وفحص ما قبل الزواج", en: "Hormones & premarital checks" },
    short: { ar: "نقص هرمون الذكورة، وفحص يطمئنك قبل الزواج.", en: "Low testosterone, and a check-up that reassures you before marriage." },
    about: {
      ar: "الإرهاق وقلة الرغبة قد يكون سببهما نقص التستوستيرون. نقيسه بدقة ونعالج عند الحاجة، ونقدم فحصاً شاملاً للرجال قبل الزواج.",
      en: "Fatigue and low desire can come from low testosterone. We measure it properly and treat when needed, and offer a full men's check-up before marriage.",
    },
    signs: [
      { ar: "إرهاق وقلة رغبة", en: "Fatigue and low desire" },
      { ar: "تغيرات في المزاج أو الوزن", en: "Changes in mood or weight" },
      { ar: "الاستعداد للزواج", en: "Getting ready for marriage" },
    ],
    care: [
      { ar: "تحاليل هرمونات صباحية", en: "Morning hormone tests" },
      { ar: "خطة علاج ومتابعة", en: "A treatment and monitoring plan" },
      { ar: "فحص ما قبل الزواج للرجال", en: "Premarital check for men" },
    ],
  },

  /* Kids */
  {
    id: "undescended", world: "kids", icon: "Baby", ages: ["baby", "child"],
    name: { ar: "الخصية المعلقة والنطاطة", en: "Undescended testis" },
    short: { ar: "خصية لم تنزل إلى مكانها، وأفضل وقت لعلاجها مبكراً.", en: "A testicle that hasn't come down. Earlier treatment is better." },
    about: {
      ar: "الخصية المعلقة هي خصية لم تتحرك إلى مكانها الطبيعي في كيس الصفن. قد يكون العلاج دوائياً أو بتدخل جراحي بسيط، ويُفضل قبل أن يكمل الطفل عامه الثاني.",
      en: "An undescended testis hasn't moved down into the scrotum. Treatment may be medical or a small operation, ideally before your son's second birthday.",
    },
    signs: [
      { ar: "كيس الصفن فارغ من جهة أو الجهتين", en: "An empty scrotum on one or both sides" },
      { ar: "الخصية محسوسة في منطقة الفخذ", en: "A testicle felt in the groin" },
      { ar: "خصية تظهر وتختفي (نطاطة)", en: "A testicle that comes and goes (retractile)" },
    ],
    care: [
      { ar: "فحص وسونار", en: "Examination and ultrasound" },
      { ar: "علاج دوائي في حالات مختارة", en: "Medication in selected cases" },
      { ar: "جراحة تثبيت الخصية في يوم واحد", en: "A same-day operation to bring it down" },
    ],
    note: { ar: "لا تنتظر البلوغ: التأخير قد يؤثر على الخصوبة لاحقاً.", en: "Don't wait for puberty: delay can affect fertility later." },
  },
  {
    id: "hypospadias", world: "kids", icon: "Shapes", ages: ["baby"],
    name: { ar: "الإحليل السفلي", en: "Hypospadias" },
    short: { ar: "فتحة البول في غير مكانها، وتُصحح جراحياً في سن مبكرة.", en: "The urine opening is out of place. It is corrected early with surgery." },
    about: {
      ar: "في الإحليل السفلي تكون فتحة البول على الجهة السفلية من العضو بدلاً من طرفه. يُصحح بجراحة دقيقة في السنة الأولى أو الثانية غالباً.",
      en: "In hypospadias the urine opening sits on the underside of the penis instead of at the tip. It is usually corrected with careful surgery in the first or second year.",
    },
    signs: [
      { ar: "فتحة البول أسفل العضو", en: "The opening on the underside" },
      { ar: "جلد زائد من أعلى فقط", en: "Foreskin gathered on top only" },
      { ar: "انحناء العضو", en: "A bend in the penis" },
    ],
    care: [
      { ar: "لا ختان قبل التقييم: قد نحتاج الجلد في الإصلاح", en: "No circumcision before assessment: the foreskin may be needed for the repair" },
      { ar: "تحديد التوقيت المناسب للجراحة", en: "Choosing the right timing" },
      { ar: "جراحة تصحيح ومتابعة", en: "Corrective surgery and follow-up" },
    ],
    note: { ar: "لاحظت شكلاً غير معتاد؟ استشر قبل الختان.", en: "Noticed anything unusual? See us before any circumcision." },
  },
  {
    id: "buried", world: "kids", icon: "Circle", ages: ["baby", "child"],
    name: { ar: "العضو المدفون", en: "Buried penis" },
    short: { ar: "عضو طبيعي الحجم مختفٍ تحت الجلد أو الدهون.", en: "A normally sized penis hidden under skin or fat." },
    about: {
      ar: "قد يبدو العضو صغيراً وهو في الحقيقة طبيعي الحجم لكنه مختفٍ. التشخيص الصحيح يطمئن الأهل، والعلاج الجراحي متاح عند الحاجة.",
      en: "The penis can look small when it is in fact normal in size but hidden. The right diagnosis reassures parents, and surgery is available when needed.",
    },
    signs: [
      { ar: "العضو يبدو صغيراً أو مختفياً", en: "The penis looks small or hidden" },
      { ar: "انتفاخ الجلد أثناء التبول", en: "Skin balloons when he passes urine" },
      { ar: "صعوبة في النظافة", en: "Difficulty keeping clean" },
    ],
    care: [
      { ar: "تقييم متخصص قبل أي ختان", en: "Specialist assessment before any circumcision" },
      { ar: "متابعة النمو", en: "Growth follow-up" },
      { ar: "تصحيح جراحي عند الحاجة", en: "Surgical correction when needed" },
    ],
  },
  {
    id: "circumcision", world: "kids", icon: "ShieldCheck", ages: ["baby", "child"],
    name: { ar: "الختان (الطهور)", en: "Circumcision" },
    short: { ar: "ختان آمن على يد متخصص، بعد فحص يستبعد ما يمنعه.", en: "A safe circumcision by a specialist, after a check that rules out reasons to wait." },
    about: {
      ar: "الختان إجراء بسيط لكنه يحتاج يداً متخصصة. نفحص الطفل أولاً لاستبعاد الإحليل السفلي والعضو المدفون، ثم نجريه بتخدير مناسب ونشرح لك الرعاية بعده.",
      en: "Circumcision is simple but needs a specialist's hands. We first check for hypospadias or a buried penis, then perform it with proper anaesthesia and explain the aftercare.",
    },
    signs: [
      { ar: "رغبة الأهل في الختان", en: "Parents' wish for circumcision" },
      { ar: "التهابات متكررة", en: "Repeated infections" },
      { ar: "ضيق في الجلد (فيموزيس)", en: "A tight foreskin (phimosis)" },
    ],
    care: [
      { ar: "فحص قبل الختان", en: "A check before the procedure" },
      { ar: "تخدير آمن ومناسب للعمر", en: "Safe, age-appropriate anaesthesia" },
      { ar: "تعليمات واضحة للعناية بعده", en: "Clear aftercare instructions" },
    ],
  },
  {
    id: "bedwetting", world: "kids", icon: "Moon", ages: ["child", "teen"],
    name: { ar: "التبول اللاإرادي والمثانة العصبية", en: "Bedwetting & bladder control" },
    short: { ar: "مشكلة شائعة وقابلة للعلاج، بخطة تناسب عمر الطفل.", en: "Common and treatable, with a plan that fits his age." },
    about: {
      ar: "التبول اللاإرادي ليس ذنب الطفل. قد يكون سببه عادات، أو إمساكاً، أو التهاباً، أو خللاً في أعصاب المثانة. نبحث عن السبب ونعالجه بلطف.",
      en: "Bedwetting is never the child's fault. It can come from habits, constipation, infection or a problem with the bladder's nerves. We find the cause and treat it gently.",
    },
    signs: [
      { ar: "بلل الفراش بعد سن الخامسة", en: "Wet nights after age five" },
      { ar: "حوادث بلل أثناء النهار", en: "Daytime accidents" },
      { ar: "إلحاح أو التهابات متكررة", en: "Urgency or repeated infections" },
    ],
    care: [
      { ar: "تدريب المثانة وعادات يومية", en: "Bladder training and daily habits" },
      { ar: "علاج دوائي عند الحاجة", en: "Medication where needed" },
      { ar: "دراسة ديناميكية وتحفيز عصبي للمثانة العصبية", en: "Bladder studies and nerve stimulation for neurogenic bladder" },
    ],
  },
  {
    id: "torsion", world: "kids", icon: "Siren", ages: ["child", "teen"], emergency: true,
    name: { ar: "التواء الخصية وآلامها", en: "Testicular torsion & pain" },
    short: { ar: "ألم مفاجئ وشديد في الخصية حالة طارئة: توجه للطوارئ فوراً.", en: "Sudden, severe testicle pain is an emergency: go now." },
    about: {
      ar: "في التواء الخصية ينقطع الدم عنها، وكل ساعة تفرق. أي ألم مفاجئ وشديد في الخصية يحتاج كشفاً عاجلاً وسوناراً فورياً.",
      en: "In torsion the testicle's blood supply is cut off, and every hour counts. Any sudden, severe pain needs an urgent examination and scan.",
    },
    signs: [
      { ar: "ألم مفاجئ وشديد", en: "Sudden, severe pain" },
      { ar: "تورم أو احمرار", en: "Swelling or redness" },
      { ar: "غثيان أو قيء مع الألم", en: "Nausea or vomiting with the pain" },
    ],
    care: [
      { ar: "سونار عاجل", en: "An urgent ultrasound" },
      { ar: "جراحة طارئة لإنقاذ الخصية", en: "Emergency surgery to save the testicle" },
      { ar: "متابعة بعد العلاج", en: "Follow-up afterwards" },
    ],
    note: { ar: "الوقت يحسم: الساعات الأولى هي الأهم. اتصل 16740 أو توجه لأقرب طوارئ.", en: "Time decides: the first hours matter most. Call 16740 or go to the nearest emergency room." },
  },
  {
    id: "teenvaricocele", world: "kids", icon: "Activity", ages: ["teen"],
    name: { ar: "دوالي الخصية عند المراهقين", en: "Varicocele in teens" },
    short: { ar: "شائعة في سن المراهقة، وتحتاج متابعة لنمو الخصية.", en: "Common in teenagers, and worth watching as the testicle grows." },
    about: {
      ar: "تظهر الدوالي غالباً في الجهة اليسرى خلال المراهقة. نتابع حجم الخصية ونموها، ونتدخل ميكروسكوبياً عندما يلزم للحفاظ على الخصوبة.",
      en: "Varicocele usually appears on the left during adolescence. We follow the testicle's size and growth, and repair it microsurgically when needed to protect fertility.",
    },
    signs: [
      { ar: "إحساس بعروق في كيس الصفن", en: "Veins you can feel in the scrotum" },
      { ar: "ألم خفيف بعد الوقوف أو الرياضة", en: "A dull ache after standing or sport" },
      { ar: "خصية أصغر من الأخرى", en: "One testicle smaller than the other" },
    ],
    care: [
      { ar: "فحص ودوبلر", en: "Examination and Doppler" },
      { ar: "متابعة حجم الخصية", en: "Monitoring testicle size" },
      { ar: "إصلاح ميكروسكوبي عند الحاجة", en: "Microsurgical repair when needed" },
    ],
  },
  {
    id: "puberty", world: "kids", icon: "Sprout", ages: ["child", "teen"],
    name: { ar: "البلوغ وتأخره", en: "Puberty & delayed puberty" },
    short: { ar: "هل نمو ابنك طبيعي؟ متابعة البلوغ وتقييم التأخر.", en: "Is he developing normally? Puberty follow-up and assessment of delay." },
    about: {
      ar: "يبدأ البلوغ عادة بين 9 و14 سنة. إن تأخرت علاماته، أو قلقت من حجم العضو أو النمو، يطمئنك الفحص ويحدد إن كان هناك سبب يحتاج علاجاً.",
      en: "Puberty usually starts between 9 and 14. If the signs are late, or you're worried about size or growth, an examination reassures you and finds any cause that needs treatment.",
    },
    signs: [
      { ar: "لا علامات بلوغ بعد سن 14", en: "No signs of puberty by 14" },
      { ar: "بطء في زيادة الطول", en: "Slow growth in height" },
      { ar: "قلق من حجم العضو", en: "Worry about penis size" },
    ],
    care: [
      { ar: "فحص ومنحنى نمو", en: "Examination and growth chart" },
      { ar: "تحاليل هرمونات وعمر العظام", en: "Hormone tests and bone age" },
      { ar: "علاج السبب أو علاج هرموني عند الحاجة", en: "Treating the cause, or hormones when needed" },
    ],
  },
];

export const serviceById = (id: string) => SERVICES.find((s) => s.id === id);
export const servicesOf = (w: World) => SERVICES.filter((s) => s.world === w);

/** "What brings you in?": plain-language concerns that route to a service. Ours. */
export const CONCERNS: Record<World, { label: L; service: string }[]> = {
  adults: [
    { label: { ar: "الانتصاب ضعيف", en: "Weak erections" }, service: "ed" },
    { label: { ar: "الأدوية لم تعد تنفع", en: "Tablets stopped working" }, service: "implants" },
    { label: { ar: "سرعة القذف", en: "Coming too fast" }, service: "pe" },
    { label: { ar: "تأخر الإنجاب", en: "Trying for a baby" }, service: "infertility" },
    { label: { ar: "ألم أو عروق في الخصية", en: "Testicle ache or veins" }, service: "varicocele" },
    { label: { ar: "انحناء في العضو", en: "A bend in the penis" }, service: "curvature" },
    { label: { ar: "مشاكل في التبول", en: "Trouble passing urine" }, service: "prostate" },
    { label: { ar: "إرهاق وقلة رغبة", en: "Tired, low desire" }, service: "hormones" },
  ],
  kids: [
    { label: { ar: "الخصية ليست في مكانها", en: "A testicle isn't in place" }, service: "undescended" },
    { label: { ar: "فتحة البول في مكان غير معتاد", en: "The urine opening looks unusual" }, service: "hypospadias" },
    { label: { ar: "العضو يبدو صغيراً أو مختفياً", en: "It looks small or hidden" }, service: "buried" },
    { label: { ar: "أريد ختان ابني", en: "I want him circumcised" }, service: "circumcision" },
    { label: { ar: "يبلّل فراشه ليلاً", en: "He wets the bed" }, service: "bedwetting" },
    { label: { ar: "ألم مفاجئ في الخصية", en: "Sudden testicle pain" }, service: "torsion" },
    { label: { ar: "انتفاخ أو عروق في الخصية", en: "Swelling or veins" }, service: "teenvaricocele" },
    { label: { ar: "البلوغ تأخر", en: "Puberty seems late" }, service: "puberty" },
  ],
};

/** Kids by age: the growth ruler. Ours. */
export const AGES: { id: Age; label: L; range: L; tip: L }[] = [
  {
    id: "baby", label: { ar: "رضيع", en: "Baby" }, range: { ar: "من الولادة حتى سنتين", en: "Birth to 2" },
    tip: { ar: "أول فحص بعد الولادة يكشف الخصية المعلقة والإحليل السفلي مبكراً، وقبل أي ختان.", en: "A first check after birth catches an undescended testis or hypospadias early, and before any circumcision." },
  },
  {
    id: "child", label: { ar: "طفل", en: "Child" }, range: { ar: "من 3 إلى 9 سنوات", en: "3 to 9" },
    tip: { ar: "التبول اللاإرادي بعد الخامسة، أو خصية تظهر وتختفي، أسباب تستحق زيارة هادئة.", en: "Bedwetting after five, or a testicle that comes and goes, are worth a calm visit." },
  },
  {
    id: "teen", label: { ar: "مراهق", en: "Teen" }, range: { ar: "من 10 إلى 18 سنة", en: "10 to 18" },
    tip: { ar: "متابعة البلوغ والدوالي، وأي ألم مفاجئ في الخصية حالة طارئة.", en: "Follow puberty and varicocele, and treat any sudden testicle pain as an emergency." },
  },
];

/* ── Journeys ─────────────────────────────────────────────── */

export const JOURNEY: Record<World, { title: L; body: L }[]> = {
  adults: [
    { title: { ar: "احجز بخصوصية", en: "Book privately" }, body: { ar: "أونلاين أو على 16740، دون أن تشرح حالتك لأحد.", en: "Online or on 16740, without explaining yourself to anyone." } },
    { title: { ar: "تشخيص دقيق", en: "A precise diagnosis" }, body: { ar: "كشف وفحوصات ودوبلر في نفس المكان.", en: "Consultation, tests and Doppler under one roof." } },
    { title: { ar: "خطة واضحة", en: "A clear plan" }, body: { ar: "نشرح لك الخيارات والنتائج المتوقعة قبل أي خطوة.", en: "Your options and likely results, explained before any step." } },
    { title: { ar: "العلاج والمتابعة", en: "Treatment and follow-up" }, body: { ar: "متابعة دقيقة بعد العلاج لضمان أفضل النتائج.", en: "Close follow-up after treatment for the best result." } },
  ],
  kids: [
    { title: { ar: "احجز لابنك", en: "Book for your son" }, body: { ar: "اختر الفرع والموعد المناسب لكم.", en: "Choose the branch and time that suit you." } },
    { title: { ar: "فحص لطيف بحضورك", en: "A gentle check, with you there" }, body: { ar: "بهدوء ودون استعجال، وأنت بجانب ابنك.", en: "Calm and unhurried, and you stay beside him." } },
    { title: { ar: "شرح واضح للأهل", en: "A clear explanation" }, body: { ar: "ماذا وجدنا، وماذا نقترح، ولماذا.", en: "What we found, what we suggest, and why." } },
    { title: { ar: "علاج ومتابعة للنمو", en: "Care that follows his growth" }, body: { ar: "نتابع ابنك حتى البلوغ عند الحاجة.", en: "We follow him through to puberty when needed." } },
  ],
};

/** Why here. The site's own reasons. */
export const PROMISES: { title: L; body: L; icon: string }[] = [
  { icon: "Lock", title: { ar: "سرية تامة", en: "Complete privacy" }, body: { ar: "في جميع مراحل التشخيص والعلاج.", en: "At every stage of diagnosis and treatment." } },
  { icon: "Award", title: { ar: "تخصص دقيق", en: "Specialised care" }, body: { ar: "ذكورة الكبار والأطفال فقط، منذ 2003.", en: "Male health for men and boys only, since 2003." } },
  { icon: "Cpu", title: { ar: "أحدث التقنيات", en: "Up-to-date technology" }, body: { ar: "دوبلر وميكروسكوب جراحي ومناظير حديثة.", en: "Doppler, surgical microscope and modern endoscopes." } },
  { icon: "RefreshCw", title: { ar: "متابعة بعد العلاج", en: "Follow-up after care" }, body: { ar: "حتى تطمئن على النتيجة.", en: "Until you're sure of the result." } },
];

export const FAQ: Record<World, { q: L; a: L }[]> = {
  adults: [
    { q: { ar: "هل زيارتي سرية؟", en: "Is my visit confidential?" }, a: { ar: "نعم، السرية تامة في كل مراحل التشخيص والعلاج.", en: "Yes. Privacy is complete at every stage of diagnosis and treatment." } },
    { q: { ar: "هل تظهر الدعامة من خارج الملابس؟", en: "Will an implant show under clothes?" }, a: { ar: "لا، لا تظهر ولا تغيّر المظهر ولا تسبب أي إحراج.", en: "No. It doesn't show, doesn't change your appearance, and won't embarrass you." } },
    { q: { ar: "أنا مريض سكر وضغط، هل الدعامة آمنة؟", en: "I have diabetes and high blood pressure. Is an implant safe?" }, a: { ar: "نعم، لا تؤثر الدعامة على السكر أو الضغط.", en: "Yes. An implant doesn't affect either condition." } },
    { q: { ar: "هل يمكن الكشف أونلاين؟", en: "Can I consult online?" }, a: { ar: "نعم، يمكنك حجز كشف أونلاين واختيار الموعد المناسب.", en: "Yes. You can book an online consultation at a time that suits you." } },
  ],
  kids: [
    { q: { ar: "متى أفحص ابني؟", en: "When should my son be checked?" }, a: { ar: "بعد الولادة، وقبل الختان، وعند ملاحظة أي شيء غير معتاد، وعند بداية البلوغ.", en: "After birth, before circumcision, whenever something looks unusual, and as puberty begins." } },
    { q: { ar: "هل الختان آمن لكل طفل؟", en: "Is circumcision safe for every boy?" }, a: { ar: "بعد الفحص فقط، لاستبعاد الإحليل السفلي والعضو المدفون، لأن الجلد قد نحتاجه في الإصلاح.", en: "Only after a check for hypospadias or a buried penis, because the foreskin may be needed for a repair." } },
    { q: { ar: "ابني يشعر بألم مفاجئ في الخصية، ماذا أفعل؟", en: "My son has sudden testicle pain. What should I do?" }, a: { ar: "حالة طارئة: اتصل 16740 أو توجه لأقرب طوارئ فوراً.", en: "It's an emergency: call 16740 or go to the nearest emergency room now." } },
    { q: { ar: "هل سأكون مع ابني أثناء الكشف؟", en: "Will I be with my son during the visit?" }, a: { ar: "نعم، تبقى بجانبه طوال الفحص.", en: "Yes, you stay beside him throughout." } },
  ],
};

/** Public Google reviews the current site already shows. Shortened; names as initials. */
export const REVIEWS: { world: World; who: L; body: L }[] = [
  { world: "kids", who: { ar: "أحمد ع.", en: "Ahmed A." }, body: { ar: "من أحسن مراكز كشف ذكورة الأطفال. اكتشفنا فعلاً أن في مشكلة، وتابعنا، والحمد لله في تحسن كبير.", en: "One of the best centres for boys' andrology. They found a real problem, followed it through, and he's much better." } },
  { world: "kids", who: { ar: "مروة أ.", en: "Marwa A." }, body: { ar: "نصيحة: اطمن على ابنك من الصغر، هيفرق معاه جداً في حياته. عن تجربة.", en: "My advice: get your son checked early. It makes a real difference to his life. I speak from experience." } },
  { world: "kids", who: { ar: "أم رحمة", en: "Om Rahma" }, body: { ar: "أفضل مركز متخصص في ذكورة الأطفال وسن المراهقة، أرشحه بشدة.", en: "The best centre for boys and teenagers. I recommend it strongly." } },
  { world: "adults", who: { ar: "محمود ر.", en: "Mahmoud R." }, body: { ar: "مكان فوق الممتاز بالنسبة للعلاج والمتابعة والخدمة والنظافة والنظام.", en: "Excellent for treatment, follow-up, service, cleanliness and organisation." } },
  { world: "adults", who: { ar: "حميد ب. من ليبيا", en: "Hamid B., Libya" }, body: { ar: "دكتور أسامة حبيبنا وحبيب ليبيا كلها، من أحسن المراكز في مصر.", en: "Dr. Osama is loved by us and by all of Libya. One of the best centres in Egypt." } },
  { world: "adults", who: { ar: "نور", en: "Nour" }, body: { ar: "من أفضل الأماكن التي تهتم بصحة الرجل، قمة الاحترام والاهتمام بالمرضى.", en: "One of the best places for men's health: respect and care for every patient." } },
];

/* ── The doctor ───────────────────────────────────────────── */

export const DOCTOR = {
  intro: {
    ar: "مؤسس والمدير الإكلينيكي لمراكز دار الذكورة، أحد أكبر المراكز المتخصصة في صحة الرجل في الشرق الأوسط.",
    en: "Founder and clinical director of the Dar El Zokora centres, among the largest specialist centres for men's health in the Middle East.",
  } as L,
  record: [
    { ar: "بكالوريوس الطب والجراحة، جامعة الإسكندرية", en: "MBBCh, Alexandria University" },
    { ar: "ماجستير جراحة المسالك البولية، جامعة عين شمس", en: "MSc in Urology, Ain Shams University" },
    { ar: "مبتكر تقنية Ghattas Modification، المنشورة في IJIR عام 2024", en: "Originator of the Ghattas Modification, published in IJIR, 2024" },
    { ar: "براءة اختراع مسجلة برقم EG/P/2024/1413", en: "Registered patent EG/P/2024/1413" },
    { ar: "مؤسس ورئيس الجمعية الدولية للمسالك البولية والذكورة (2024)", en: "Founder and president, International Society of Urology & Andrology (2024)" },
    { ar: "مدرب دولي معتمد مع شركة بوسطن ساينتفيك", en: "Accredited international trainer with Boston Scientific" },
  ] as L[],
  conference: {
    ar: "مؤتمر دار الذكورة العلمي السنوي (DZAC) يجمع خبراء من مصر والعالم، واستضافت المراكز الخبير الأمريكي د. ستيفن ويلسون.",
    en: "Dar El Zokora's annual scientific conference (DZAC) brings together experts from Egypt and abroad, and the centres have hosted the American surgeon Dr. Steven Wilson.",
  } as L,
};

/* ── Branches ─────────────────────────────────────────────── */

export const BRANCHES: { id: string; city: L; address: L; q: string }[] = [
  { id: "alex", city: { ar: "الإسكندرية", en: "Alexandria" }, address: { ar: "برج الكناري، دوران جيهان، شارع جمال عبدالناصر، ميامي", en: "Al-Kanary Tower, Gihan roundabout, Gamal Abdel Nasser St, Miami" }, q: "Dar El Zokora Alexandria Miami" },
  { id: "tagamoa", city: { ar: "التجمع الخامس", en: "New Cairo, Fifth Settlement" }, address: { ar: "شارع التسعين، مول CMC", en: "90th Street, CMC Mall" }, q: "Dar El Zokora Fifth Settlement CMC Mall" },
  { id: "zayed", city: { ar: "الشيخ زايد", en: "Sheikh Zayed" }, address: { ar: "بيفرلي هيلز، عيادات الندى، عيادة 212، الدور الثاني", en: "Beverly Hills, Al-Nada Clinics, clinic 212, 2nd floor" }, q: "Dar El Zokora Sheikh Zayed Beverly Hills" },
  { id: "mansoura", city: { ar: "المنصورة", en: "Mansoura" }, address: { ar: "تقاطع شارع بنك مصر مع السكة الجديدة، أسفل الموجي للأشعة", en: "Bank Misr St at El-Sekka El-Gedida, below El-Mogy Radiology" }, q: "Dar El Zokora Mansoura" },
];
export const mapHref = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/* ── Articles (real posts on the current site) ────────────── */

const P = "https://www.darelzokora.com/";
export const ARTICLES: { world: World; title: L; href: string }[] = [
  { world: "adults", title: { ar: "10 أسئلة لازم تسألها لطبيبك قبل عملية الدعامة", en: "10 questions to ask before a penile implant" }, href: P + "10-%d8%a3%d8%b3%d8%a6%d9%84%d8%a9-%d9%82%d8%a8%d9%84-%d8%b9%d9%85%d9%84%d9%8a%d8%a9-%d8%af%d8%b9%d8%a7%d9%85%d8%a9-%d8%a7%d9%84%d8%b9%d8%b6%d9%88-%d8%a7%d9%84%d8%b0%d9%83%d8%b1%d9%8a/" },
  { world: "adults", title: { ar: "دعامة الانتصاب لمرضى السكر: هل هي آمنة؟", en: "Implants and diabetes: are they safe?" }, href: P + "%d8%af%d8%b9%d8%a7%d9%85%d8%a9-%d8%a7%d9%84%d8%a7%d9%86%d8%aa%d8%b5%d8%a7%d8%a8-%d9%84%d9%85%d8%b1%d8%b6%d9%89-%d8%a7%d9%84%d8%b3%d9%83%d8%b1/" },
  { world: "adults", title: { ar: "علامات العقم عند الرجال: إمتى تقلق وإمتى تطمّن؟", en: "Signs of male infertility: when to worry, when to relax" }, href: P + "%d8%b9%d9%84%d8%a7%d9%85%d8%a7%d8%aa-%d8%a7%d9%84%d8%b9%d9%82%d9%85-%d8%b9%d9%86%d8%af-%d8%a7%d9%84%d8%b1%d8%ac%d8%a7%d9%84-%d8%a5%d9%85%d8%aa%d9%89-%d8%aa%d9%82%d9%84%d9%82-%d9%88%d8%a5%d9%85%d8%aa/" },
  { world: "adults", title: { ar: "الحياة بعد تركيب الدعامة: ماذا يتغير؟", en: "Life after a penile implant: what changes?" }, href: P + "life-after-penile-implant/" },
  { world: "kids", title: { ar: "سن البلوغ عند الذكور: دليل شامل للأهل", en: "Puberty in boys: a complete guide for parents" }, href: P + "%d8%b3%d9%86-%d8%a7%d9%84%d8%a8%d9%84%d9%88%d8%ba-%d8%b9%d9%86%d8%af-%d8%a7%d9%84%d8%b0%d9%83%d9%88%d8%b1-%d8%af%d9%84%d9%8a%d9%84-%d8%b4%d8%a7%d9%85%d9%84-%d9%84%d9%84%d8%a3%d9%87%d9%84-%d9%88%d8%a7/" },
  { world: "kids", title: { ar: "الخصية المعلقة عند الأطفال", en: "Undescended testis in children" }, href: P + "%d8%a7%d9%84%d8%ae%d8%b5%d9%8a%d8%a9-%d8%a7%d9%84%d9%85%d8%b9%d9%84%d9%82%d8%a9-%d8%b9%d9%86%d8%af-%d8%a7%d9%84%d8%a3%d8%b7%d9%81%d8%a7%d9%84/" },
  { world: "kids", title: { ar: "التبول الليلي عند الأطفال: أسبابه وعلاجه", en: "Bedwetting in children: causes and treatment" }, href: P + "%d8%a7%d9%84%d8%aa%d8%a8%d9%88%d9%84-%d8%a7%d9%84%d9%84%d9%8a%d9%84%d9%8a-%d8%b9%d9%86%d8%af-%d8%a7%d9%84%d8%a3%d8%b7%d9%81%d8%a7%d9%84/" },
  { world: "kids", title: { ar: "العضو الذكري المدفون عند الأطفال", en: "Buried penis in children" }, href: P + "%d8%a7%d9%84%d8%b9%d8%b6%d9%88-%d8%a7%d9%84%d8%b0%d9%83%d8%b1%d9%8a-%d8%a7%d9%84%d9%85%d8%af%d9%81%d9%88%d9%86-%d8%b9%d9%86%d8%af-%d8%a7%d9%84%d8%a3%d8%b7%d9%81%d8%a7%d9%84/" },
];

/* ── Interface words ──────────────────────────────────────── */

export const UI = {
  home: { ar: "الرئيسية", en: "Home" },
  book: { ar: "احجز موعد", en: "Book a visit" },
  bookShort: { ar: "احجز", en: "Book" },
  call: { ar: "اتصل", en: "Call" },
  doctor: { ar: "د. أسامة", en: "Dr. Osama" },
  about: { ar: "عن الدار", en: "About us" },
  branches: { ar: "الفروع", en: "Branches" },
  articles: { ar: "مقالات", en: "Articles" },
  menu: { ar: "القائمة", en: "Menu" },
  close: { ar: "إغلاق", en: "Close" },
  langSwitch: { ar: "English", en: "العربية" },
  langLabel: { ar: "Switch to English", en: "التحويل إلى العربية" },
  chooseWorld: { ar: "لمن تبحث عن رعاية؟", en: "Who is the care for?" },
  concern: { ar: "ما الذي يقلقك؟", en: "What's on your mind?" },
  concernHint: { ar: "اختر ما يشبه حالتك، ونأخذك للصفحة المناسبة.", en: "Pick what sounds closest, and we'll take you to the right page." },
  services: { ar: "خدماتنا", en: "Our services" },
  allServices: { ar: "كل الخدمات", en: "All services" },
  seeAll: { ar: "عرض الكل", en: "See all" },
  learnMore: { ar: "اعرف أكثر", en: "Learn more" },
  signs: { ar: "متى تزورنا؟", en: "When to see us" },
  care: { ar: "كيف نعالج", en: "How we treat it" },
  journey: { ar: "رحلتك معنا", en: "Your visit, step by step" },
  why: { ar: "لماذا دار الذكورة؟", en: "Why Dar El Zokora?" },
  faq: { ar: "أسئلة شائعة", en: "Common questions" },
  reviews: { ar: "قالوا عنّا", en: "What families and patients say" },
  byAge: { ar: "حسب عمر ابنك", en: "By your son's age" },
  emergency: { ar: "حالة طارئة", en: "Emergency" },
  emergencyLine: { ar: "ألم مفاجئ وشديد في خصية ابنك؟ لا تنتظر.", en: "Sudden, severe pain in your son's testicle? Don't wait." },
  emergencyCta: { ar: "اتصل الآن 16740", en: "Call 16740 now" },
  stats: { ar: "بالأرقام", en: "In numbers" },
  meetDoctor: { ar: "تعرّف على د. أسامة", en: "Meet Dr. Osama" },
  directions: { ar: "الاتجاهات", en: "Directions" },
  readOnSite: { ar: "اقرأ المقال", en: "Read the article" },
  relatedWorld: { ar: "خدمات أخرى في نفس القسم", en: "More in this section" },
  placeholder: { ar: "المواعيد والأسعار تُؤكد عند الحجز.", en: "Times and prices are confirmed when you book." },
  demo: { ar: "نموذج تجريبي: لم يتم إرسال أي حجز.", en: "Demo: no booking has been sent." },
  online: { ar: "كشف أونلاين", en: "Online consultation" },
  abroad: { ar: "قادم من خارج مصر؟", en: "Travelling from abroad?" },
  abroadBody: { ar: "يأتينا مرضى من ليبيا والخليج وخارجهما. نرتب لك الموعد، ونساعدك في الإقامة، ونتابعك بعد عودتك.", en: "Patients travel to us from Libya, the Gulf and beyond. We arrange your appointment, help with your stay, and follow up after you're home." }, // ours
  hotline: { ar: "الخط الساخن", en: "Hotline" },
  footerNote: { ar: "المحتوى الطبي للتوعية فقط ولا يغني عن الكشف.", en: "Medical content is for information and doesn't replace an examination." },
};

/* ── Home ─────────────────────────────────────────────────── */

/** Ours: the line that frames the whole site around its two worlds. */
export const HOME = {
  kicker: { ar: "دار الذكورة · د. أسامة غطاس", en: "Dar El Zokora · Dr. Osama Ghattas" } as L,
  title: { ar: "صحة الذكور، من الطفولة إلى الرجولة", en: "Male health, from boyhood to manhood" } as L,
  accent: { ar: ["الطفولة", "الرجولة"], en: ["boyhood", "manhood"] },
  /** Boyhood takes the kids colour, manhood the adults colour. */
  accentWorlds: ["kids", "adults"],
  lead: {
    ar: "مركز متخصص منذ 2003 بقسمين: قسم للكبار لصحة الرجل الجنسية والإنجابية، وقسم للأطفال من الولادة حتى البلوغ. أربعة فروع، وخط ساخن واحد.",
    en: "A specialist centre since 2003, in two sections: one for adults, for men's sexual and reproductive health, and one for kids, from birth to puberty. Four branches, one hotline.",
  } as L,
  worldsTitle: { ar: "اختر القسم المناسب", en: "Choose your section" } as L,
  worldsLead: { ar: "لكل قسم خدماته ورحلته، حتى تصل لما تحتاجه بأقل خطوات.", en: "Each section has its own services and journey, so you reach what you need in the fewest steps." } as L,
};
