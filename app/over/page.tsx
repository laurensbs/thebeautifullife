import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import HeartDivider from "@/components/ui/HeartDivider";
import HeartDraw from "@/components/ui/HeartDraw";
import { getLocale } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({
    title:
      locale === "en"
        ? "About Marion — The Beautiful Life"
        : "Over Marion — The Beautiful Life",
    description:
      locale === "en"
        ? "Marion Lubach — creative life mentor. Personal coaching from chaos to calm to a life that fits, in your own way."
        : "Marion Lubach — creatief levensmentor. Persoonlijke coaching van chaos naar rust naar een leven dat klopt, op jouw manier.",
    path: "/over",
    locale,
  });
}

const COPY: Record<
  "nl" | "en",
  {
    eyebrow: string;
    title: string;
    role: string;
    intro: string[];
    sectionRecognition: { title: string; body: string[] };
    sectionWork: { title: string; body: string[] };
    sectionWorld: { title: string; body: string[] };
    sectionDesign: { title: string; body: string[] };
    sectionEnv: { title: string; body: string[] };
    sectionLife: { title: string; body: string[] };
    sectionHelp: { title: string; body: string[] };
    storyTitle: string;
    story: string[];
    cta: { title: string; body: string; primary: string; secondary: string };
  }
> = {
  nl: {
    eyebrow: "wie ik ben",
    title: "Marion Lubach",
    role: "jouw creatief levensmentor",
    intro: [
      "Misschien herken je dit. Je voelt dat er meer in je zit, maar krijgt het nog niet helder. Je bent iets kwijtgeraakt, of op een punt gekomen waar je niet meer weet welke kant je op moet.",
      "Misschien door verandering — in werk, gezondheid of een relatie. Of omdat de wereld verandert en wat eerst logisch was nu niet meer klopt.",
      "Misschien kom je net van school. Of ben je in verwachting en zoek je naar balans tussen leven en werk. Je hebt een hoofd vol ideeën — maar mist richting.",
    ],
    sectionRecognition: {
      title: "Wat ik doe",
      body: [
        "Ik help mensen om terug te gaan naar innerlijke rust, zodat ze van daaruit helder krijgen wat ze écht willen.",
        "Niet gebaseerd op wat ze altijd hebben gedaan, maar op wat daadwerkelijk bij hen past — in het nu. En hoe we dat richting kunnen geven.",
      ],
    },
    sectionWork: {
      title: "Het werk",
      body: [
        "Wij leven in een wereld die snel verandert, waarin oude zekerheden wegvallen en nieuwe mogelijkheden ontstaan. Daarom kijken we opnieuw.",
        "Wie ben je. Wat wil je. Hoe wil je leven.",
      ],
    },
    sectionWorld: {
      title: "Een nieuwe blik",
      body: [
        "Vanuit die helderheid bouwen we verder. We ontwerpen een leven dat past bij wie je bent.",
        "Soms is dat een leven in rust — met natuur en stilte. Soms juist een leven vol avontuur. Maar altijd op een manier die klopt voor jou.",
      ],
    },
    sectionDesign: {
      title: "Ontwerp",
      body: [
        "In een omgeving en met mensen die aansluiten op jouw waarden, jouw tempo, en jouw behoeften.",
        "Voor wie daar klaar voor is en bereid is zichzelf uit te dagen — vertalen we jouw wensen stap voor stap naar een levensvorm die past. En die ook kan bestaan in de wereld van nu.",
      ],
    },
    sectionEnv: {
      title: "Een leven dat klopt",
      body: [
        "Zodat je leven niet alleen klopt bij wie je bent en wat je doet — maar de dingen die jouw leven mooi maken je ook kunnen dragen.",
      ],
    },
    sectionLife: {
      title: "Samen ontwerpen",
      body: [
        "Ik help je graag van chaos naar rust en richting. En van daaruit ontwerpen we samen jouw leven.",
      ],
    },
    sectionHelp: {
      title: "Mijn weg",
      body: [],
    },
    storyTitle: "Mijn eigen verhaal",
    story: [
      "Ik studeerde lifecoaching en interieurstyling — twee werelden die me leerden dat hoe je leeft net zo belangrijk is als wát je leeft.",
      "Ik leefde een avontuurlijk leven in diverse landen en creëerde the picture-perfect life. Maar ik raakte mezelf kwijt in chaos en drukte.",
      "Ik vond uiteindelijk mijn weg terug — naar rust, balans en een leven dat weer helemaal van mij is.",
      "Vanuit de combinatie van opleiding en levenservaring ontvouwde zich het concept The Beautiful Life. Created to help you design yours.",
    ],
    cta: {
      title: "Klaar om opnieuw te beginnen?",
      body: "Drie paden om weer thuis te komen bij jezelf. Begin gratis met de reflectievragenlijst, of kies direct het pad dat past bij waar je nu staat.",
      primary: "Bekijk de pakketten",
      secondary: "Begin gratis",
    },
  },
  en: {
    eyebrow: "who I am",
    title: "Marion Lubach",
    role: "your creative life mentor",
    intro: [
      "Perhaps you recognise this. You sense there's more in you, but you can't quite see it clearly. You've lost something, or arrived at a point where you no longer know which way to go.",
      "Maybe through change — in work, health or a relationship. Or because the world is changing and what once made sense no longer fits.",
      "Maybe you've just left school. Or you're expecting and looking for balance between life and work. Your head is full of ideas — but you lack direction.",
    ],
    sectionRecognition: {
      title: "What I do",
      body: [
        "I help people return to inner calm, so that from there they gain clarity about what they truly want.",
        "Not based on what they've always done, but on what actually fits them — right now. And how we can give that direction.",
      ],
    },
    sectionWork: {
      title: "The work",
      body: [
        "We live in a world that changes quickly, where old certainties fall away and new possibilities arise. So we look anew.",
        "Who are you. What do you want. How do you want to live.",
      ],
    },
    sectionWorld: {
      title: "A new view",
      body: [
        "From that clarity we build further. We design a life that fits who you are.",
        "Sometimes that's a life in calm — with nature and silence. Sometimes a life full of adventure. But always in a way that's right for you.",
      ],
    },
    sectionDesign: {
      title: "Design",
      body: [
        "In an environment and with people that align with your values, your pace, and your needs.",
        "For those who are ready and willing to challenge themselves — we translate your wishes step by step into a life form that fits. And that can exist in the world of now.",
      ],
    },
    sectionEnv: {
      title: "A life that fits",
      body: [
        "So that your life not only fits who you are and what you do — but the things that make your life beautiful can also carry you.",
      ],
    },
    sectionLife: {
      title: "Designing together",
      body: [
        "I'd love to help you from chaos to calm and direction. And from there we design your life — together.",
      ],
    },
    sectionHelp: {
      title: "My path",
      body: [],
    },
    storyTitle: "My own story",
    story: [
      "I studied life coaching and interior styling — two worlds that taught me that how you live matters just as much as what you live.",
      "I lived an adventurous life in different countries and created the picture-perfect life. But I lost myself in chaos and busyness.",
      "I eventually found my way back — to calm, balance, and a life that's truly mine again.",
      "From the combination of training and lived experience, the concept The Beautiful Life unfolded. Created to help you design yours.",
    ],
    cta: {
      title: "Ready to begin again?",
      body: "Three paths to come home to yourself. Start free with the reflection questionnaire, or choose the path that fits where you are now.",
      primary: "View the packages",
      secondary: "Start free",
    },
  },
};

export default async function OverPage() {
  const locale = await getLocale();
  return <Page locale={locale} />;
}

function Page({ locale }: { locale: Locale }) {
  const t = COPY[locale === "en" ? "en" : "nl"];
  const isEN = locale === "en";

  return (
    <main className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-6 sm:pt-10 pb-14 sm:pb-20">
      {/* HERO — portret + intro side-by-side */}
      <section className="bg-page-soft rounded-[6px] shadow-[0_12px_40px_rgba(60,50,30,0.08)] overflow-hidden grid lg:grid-cols-[1fr_1.15fr]">
        <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] bg-page-dark">
          <Image
            src="https://u.cubeupload.com/laurensbos/06420caa3a384d2ea36b.jpeg"
            alt="Marion Lubach"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover object-[center_25%] lg:object-top"
          />
        </div>
        <div className="px-6 py-10 sm:px-12 sm:py-14 flex flex-col justify-center">
          <p className="font-script text-tan text-3xl">{t.eyebrow}</p>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl tracking-[0.06em] uppercase mt-1 text-ink">
            {t.title}
          </h1>
          <p className="font-script text-tan/85 text-xl sm:text-2xl mt-2">
            {t.role}
          </p>
          <HeartDivider className="my-6 lg:!justify-start" />
          <div className="space-y-4 text-ink-soft text-[15px] sm:text-[16px] leading-[1.85] max-w-prose">
            {t.intro.map((p, i) => (
              <p key={i} className="font-serif italic">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT I DO + THE WORK */}
      <section className="grid md:grid-cols-2 gap-5 sm:gap-7 mt-10 sm:mt-12">
        <Card title={t.sectionRecognition.title} body={t.sectionRecognition.body} />
        <Card title={t.sectionWork.title} body={t.sectionWork.body} />
      </section>

      {/* NEW VIEW + DESIGN */}
      <section className="grid md:grid-cols-2 gap-5 sm:gap-7 mt-5 sm:mt-7">
        <Card title={t.sectionWorld.title} body={t.sectionWorld.body} accent="sage" />
        <Card title={t.sectionDesign.title} body={t.sectionDesign.body} accent="sage" />
      </section>

      {/* LIFE + ENV */}
      <section className="grid md:grid-cols-2 gap-5 sm:gap-7 mt-5 sm:mt-7">
        <Card title={t.sectionEnv.title} body={t.sectionEnv.body} />
        <Card title={t.sectionLife.title} body={t.sectionLife.body} />
      </section>

      {/* MY OWN STORY — full width, italic, met decoratie */}
      <section className="mt-12 sm:mt-16 bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] shadow-[0_18px_48px_rgba(60,50,30,0.08)] px-6 py-12 sm:px-14 sm:py-16 relative overflow-hidden">
        <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-script text-tan text-3xl">
            {isEN ? "and a few words" : "en een paar woorden"}
          </p>
          <h2 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.04em] uppercase mt-1 text-ink leading-snug">
            {t.storyTitle}
          </h2>
          <HeartDivider className="my-6" />
        </div>
        <div className="max-w-2xl mx-auto space-y-5 text-ink-soft text-[15px] sm:text-[16px] leading-[1.9] font-serif italic">
          {t.story.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="font-script text-tan text-2xl sm:text-3xl text-center mt-8">
          — Marion
        </p>
      </section>

      {/* CTA */}
      <section className="mt-12 sm:mt-16 text-center max-w-2xl mx-auto">
        <Sparkles className="text-tan mx-auto mb-3" size={22} strokeWidth={1.4} />
        <h2 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.04em] uppercase text-ink leading-snug">
          {t.cta.title}
        </h2>
        <p className="text-ink-soft text-[14.5px] sm:text-[15px] leading-[1.85] mt-4 max-w-md mx-auto">
          {t.cta.body}
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/#packages"
            className="inline-flex items-center justify-center gap-2 bg-ink hover:brightness-110 text-white px-7 py-3.5 rounded-[3px] font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
          >
            {t.cta.primary} <ArrowRight size={13} />
          </Link>
          <Link
            href="/gratis"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[3px] border border-ink/30 text-ink hover:border-tan hover:text-tan font-sans text-xs tracking-[0.22em] uppercase transition"
          >
            <HeartDraw size={11} /> {t.cta.secondary}
          </Link>
        </div>
      </section>
    </main>
  );
}

function Card({
  title,
  body,
  accent = "tan",
}: {
  title: string;
  body: string[];
  accent?: "tan" | "sage";
}) {
  const stripColor = accent === "sage" ? "bg-sage" : "bg-tan";
  return (
    <div className="bg-page-soft/70 border border-line/60 rounded-[6px] px-6 py-7 sm:px-7 sm:py-8 relative overflow-hidden">
      <span className={`absolute top-0 left-0 bottom-0 w-0.5 ${stripColor}`} />
      <h3 className="font-serif font-medium text-lg sm:text-xl tracking-[0.04em] text-ink leading-snug">
        {title}
      </h3>
      <div className="mt-3 space-y-2.5 text-ink-soft text-[14.5px] leading-[1.85]">
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
