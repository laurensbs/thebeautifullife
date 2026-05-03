/* eslint-disable jsx-a11y/alt-text */
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import type { Workbook, Block } from "@/lib/workbooks/types";
import { tx } from "@/lib/workbooks/types";
import type { Locale } from "@/lib/i18n/types";

// Fonts — lokale TTF via /public/fonts/. Site-URL via env zodat ook de
// PDF-renderer in serverless (Vercel) ze kan ophalen. Fallback op
// productie-domein zodat het altijd werkt zonder extra config.
const FONT_BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://thebeautifullife.nl";

Font.register({
  family: "Cormorant Garamond",
  fonts: [
    { src: `${FONT_BASE}/fonts/cormorant-regular.ttf`, fontWeight: 400 },
    { src: `${FONT_BASE}/fonts/cormorant-medium.ttf`, fontWeight: 500 },
  ],
});

Font.register({
  family: "Pinyon Script",
  src: `${FONT_BASE}/fonts/pinyon-regular.ttf`,
});

// Brand kleuren — moeten matchen met site-tokens
const C = {
  page: "#F1EBE0",
  pageSoft: "#F6F1E7",
  pageDark: "#EAE2D2",
  ink: "#2A2A28",
  inkSoft: "#4A4A45",
  muted: "#8A8270",
  line: "#D9CFBE",
  sage: "#7C8867",
  tan: "#B6906A",
  white: "#FFFFFF",
};

const SERIF = "Cormorant Garamond";
const SCRIPT = "Pinyon Script";

const styles = StyleSheet.create({
  // ─── Page wrappers ──────────────────────────────────────────────
  page: {
    backgroundColor: C.pageSoft,
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 56,
    fontFamily: SERIF,
    color: C.ink,
  },
  cover: {
    backgroundColor: C.pageSoft,
    padding: 0,
    fontFamily: SERIF,
  },
  coverInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 64,
    paddingBottom: 64,
    paddingHorizontal: 64,
  },
  partPage: {
    backgroundColor: C.pageDark,
    padding: 64,
    fontFamily: SERIF,
    alignItems: "center",
    justifyContent: "center",
  },

  // ─── Cover ──────────────────────────────────────────────────────
  coverImage: {
    width: "100%",
    height: 240,
    marginBottom: 28,
  },
  coverEyebrow: {
    fontSize: 9,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: C.tan,
    marginBottom: 18,
  },
  coverTitleThe: {
    fontSize: 11,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: C.inkSoft,
    fontWeight: 500,
  },
  coverTitleBig: {
    fontSize: 38,
    letterSpacing: 5,
    textTransform: "uppercase",
    color: C.ink,
    fontWeight: 500,
    marginTop: 4,
  },
  coverTitleScript: {
    fontFamily: SCRIPT,
    fontSize: 56,
    color: C.tan,
    marginTop: -8,
  },
  coverSub: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: C.inkSoft,
    marginTop: 12,
  },
  coverScriptSub: {
    fontFamily: SCRIPT,
    fontSize: 18,
    color: C.tan,
    marginTop: 4,
  },
  coverPersonal: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: C.muted,
    marginTop: 24,
  },
  coverPersonalScript: {
    fontFamily: SCRIPT,
    fontSize: 22,
    color: C.ink,
    marginTop: 2,
  },
  coverAuthor: {
    fontSize: 11,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: C.ink,
    marginTop: 28,
  },
  coverAuthorRole: {
    fontFamily: SCRIPT,
    fontSize: 16,
    color: C.tan,
    marginTop: 4,
  },

  // ─── Block typography ───────────────────────────────────────────
  kicker: {
    fontFamily: SCRIPT,
    color: C.tan,
    fontSize: 22,
    marginBottom: 8,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: C.tan,
  },
  titleLg: {
    fontSize: 26,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: C.ink,
    fontWeight: 500,
    lineHeight: 1.2,
    marginBottom: 4,
  },
  titleMd: {
    fontSize: 20,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: C.ink,
    fontWeight: 500,
    lineHeight: 1.2,
    marginBottom: 4,
  },
  titleSm: {
    fontSize: 14,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: C.ink,
    fontWeight: 500,
    marginBottom: 4,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
    gap: 8,
  },
  ruleLine: {
    height: 0.8,
    width: 36,
    backgroundColor: C.tan,
    opacity: 0.55,
  },
  ruleHeart: {
    fontSize: 11,
    color: C.tan,
  },
  lead: {
    fontSize: 11,
    lineHeight: 1.7,
    color: C.inkSoft,
    marginBottom: 8,
  },
  scriptLine: {
    fontFamily: SCRIPT,
    color: C.tan,
    fontSize: 22,
    lineHeight: 1.4,
    marginVertical: 10,
    textAlign: "center",
  },
  breath: {
    fontFamily: SCRIPT,
    color: C.tan,
    fontSize: 28,
    lineHeight: 1.4,
    textAlign: "center",
    marginVertical: 16,
  },
  audioCue: {
    fontSize: 9,
    fontStyle: "italic",
    color: C.tan,
    marginVertical: 6,
  },
  letter: {
    fontSize: 11,
    lineHeight: 1.85,
    color: C.inkSoft,
    marginVertical: 6,
  },
  letterSign: {
    fontFamily: SCRIPT,
    color: C.tan,
    fontSize: 22,
    marginTop: 14,
  },

  questionsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 4,
    gap: 8,
  },
  questionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 0.8,
    borderColor: C.tan,
    marginTop: 6,
  },
  questionText: {
    fontSize: 11,
    color: C.ink,
    lineHeight: 1.55,
    flex: 1,
  },

  // Antwoord-blok (ipv lege lijntjes)
  answerCard: {
    backgroundColor: C.white,
    borderWidth: 0.8,
    borderColor: C.line,
    borderRadius: 3,
    padding: 14,
    marginTop: 10,
    marginBottom: 6,
  },
  answerLabel: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: C.muted,
    marginBottom: 6,
  },
  answerValue: {
    fontFamily: SCRIPT,
    color: C.ink,
    fontSize: 16,
    lineHeight: 1.55,
  },
  answerEmpty: {
    fontSize: 10,
    fontStyle: "italic",
    color: C.muted,
  },

  callout: {
    padding: 14,
    borderRadius: 3,
    marginVertical: 6,
  },
  calloutLabel: {
    fontSize: 8,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  calloutBody: {
    fontSize: 11,
    lineHeight: 1.6,
  },

  // ─── Footer ─────────────────────────────────────────────────────
  pageNumber: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    letterSpacing: 4,
    color: C.muted,
  },
  brandTop: {
    position: "absolute",
    top: 24,
    right: 32,
    fontFamily: SCRIPT,
    fontSize: 12,
    color: C.tan,
    opacity: 0.85,
  },
  chapterTop: {
    position: "absolute",
    top: 26,
    left: 32,
    fontSize: 8,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: C.muted,
  },

  partRoman: {
    fontSize: 11,
    letterSpacing: 6,
    textTransform: "uppercase",
    color: C.tan,
  },
  partTitle: {
    fontSize: 36,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: C.ink,
    marginTop: 14,
  },
  partScript: {
    fontFamily: SCRIPT,
    fontSize: 36,
    color: C.tan,
    marginTop: 4,
  },
  partLead: {
    fontSize: 11,
    lineHeight: 1.7,
    color: C.inkSoft,
    marginTop: 24,
    maxWidth: 360,
    textAlign: "center",
  },

  signature: {
    alignItems: "center",
    marginTop: 28,
  },
  signatureName: {
    fontFamily: SCRIPT,
    fontSize: 22,
    color: C.ink,
  },
  signatureRole: {
    fontSize: 8,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: C.tan,
    marginTop: 4,
  },

  // CTA
  cta: {
    marginTop: 18,
    padding: 18,
    borderRadius: 3,
    backgroundColor: C.pageDark,
    borderWidth: 0.8,
    borderColor: C.line,
    alignItems: "center",
  },
  ctaEyebrow: {
    fontFamily: SCRIPT,
    color: C.sage,
    fontSize: 18,
    marginBottom: 4,
  },
  ctaTitle: {
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: C.ink,
    fontWeight: 500,
  },
  ctaBody: {
    fontSize: 10,
    lineHeight: 1.6,
    color: C.inkSoft,
    marginTop: 6,
    textAlign: "center",
  },
});

// ─── Helpers ─────────────────────────────────────────────────────────

function HeartRule() {
  return (
    <View style={styles.ruleRow}>
      <View style={styles.ruleLine} />
      <Text style={styles.ruleHeart}>♥</Text>
      <View style={styles.ruleLine} />
    </View>
  );
}

function fmtToday(locale: Locale) {
  return new Date().toLocaleDateString(locale === "en" ? "en-GB" : "nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Block renderer ──────────────────────────────────────────────────

function renderBlock(
  b: Block,
  locale: Locale,
  answers: Record<string, string>,
  i: number
): React.ReactElement | null {
  switch (b.type) {
    case "kicker":
      return <Text key={i} style={styles.kicker}>{tx(b.text, locale)}</Text>;
    case "eyebrow":
      return <Text key={i} style={styles.eyebrow}>{tx(b.text, locale)}</Text>;
    case "title": {
      const lines = b.lines ? tx(b.lines, locale) : [tx(b.text, locale)];
      const style =
        b.size === "lg" || b.size === "xl"
          ? styles.titleLg
          : b.size === "sm"
            ? styles.titleSm
            : styles.titleMd;
      return (
        <View key={i}>
          {lines.map((l, li) => (
            <Text key={li} style={style}>{l}</Text>
          ))}
        </View>
      );
    }
    case "rule":
      return <HeartRule key={i} />;
    case "audioCue":
      return <Text key={i} style={styles.audioCue}>♪ {tx(b.text, locale)}</Text>;
    case "lead": {
      const ps = tx(b.paragraphs, locale);
      return (
        <View key={i}>
          {ps.map((p, pi) => (
            <Text key={pi} style={styles.lead}>{plainText(p)}</Text>
          ))}
        </View>
      );
    }
    case "scriptLine":
      return (
        <Text key={i} style={[styles.scriptLine, { fontSize: b.size ?? 22 }]}>
          {tx(b.text, locale)}
        </Text>
      );
    case "breath":
      return <Text key={i} style={styles.breath}>{tx(b.text, locale)}</Text>;
    case "letter": {
      const ps = tx(b.paragraphs, locale);
      return (
        <View key={i}>
          {ps.map((p, pi) => (
            <Text key={pi} style={styles.letter}>{plainText(p)}</Text>
          ))}
          {b.signoff && (
            <Text style={styles.letterSign}>{tx(b.signoff, locale)}</Text>
          )}
        </View>
      );
    }
    case "questions": {
      const items = tx(b.items, locale);
      return (
        <View key={i} style={{ marginTop: 8, marginBottom: 8 }}>
          {items.map((it, qi) => (
            <View key={qi} style={styles.questionsRow}>
              <View style={styles.questionBullet} />
              <Text style={styles.questionText}>{it}</Text>
            </View>
          ))}
        </View>
      );
    }
    case "field": {
      const v = (answers[b.key] ?? "").trim();
      return (
        <View key={i} style={styles.answerCard}>
          {b.placeholder && (
            <Text style={styles.answerLabel}>{tx(b.placeholder, locale)}</Text>
          )}
          {v ? (
            <Text style={styles.answerValue}>{v}</Text>
          ) : (
            <Text style={styles.answerEmpty}>— nog niet ingevuld —</Text>
          )}
        </View>
      );
    }
    case "twoCol": {
      return (
        <View key={i} style={{ marginVertical: 8 }}>
          <View style={styles.answerCard}>
            <Text style={styles.answerLabel}>{tx(b.left.head, locale)}</Text>
            <AnswerInline keyName={b.left.field.key} answers={answers} />
          </View>
          <View style={styles.answerCard}>
            <Text style={styles.answerLabel}>{tx(b.right.head, locale)}</Text>
            <AnswerInline keyName={b.right.field.key} answers={answers} />
          </View>
        </View>
      );
    }
    case "scaleGroup": {
      return (
        <View key={i} style={{ marginVertical: 10 }}>
          {b.items.map((it, si) => {
            const v = (answers[it.key] ?? "").trim();
            return (
              <View
                key={si}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 4,
                  borderBottomWidth: 0.5,
                  borderBottomColor: C.line,
                }}
              >
                <Text style={{ fontSize: 10, color: C.inkSoft }}>
                  {tx(it.label, locale)}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: v ? C.tan : C.muted,
                    fontWeight: 500,
                  }}
                >
                  {v ? `${v} / 10` : "—"}
                </Text>
              </View>
            );
          })}
        </View>
      );
    }
    case "checks": {
      const items = tx(b.items, locale);
      let checkedSet = new Set<number>();
      try {
        const parsed = JSON.parse(answers[b.key] ?? "[]");
        if (Array.isArray(parsed))
          checkedSet = new Set<number>(parsed.map(Number));
      } catch {}
      return (
        <View key={i} style={{ marginVertical: 8 }}>
          {items.map((it, ci) => {
            const checked = checkedSet.has(ci);
            return (
              <View
                key={ci}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  paddingVertical: 3,
                  gap: 8,
                }}
              >
                <View
                  style={{
                    width: 9,
                    height: 9,
                    borderWidth: 0.8,
                    borderColor: C.tan,
                    backgroundColor: checked ? C.tan : C.white,
                    marginTop: 4,
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: checked ? C.muted : C.ink,
                    textDecoration: checked ? "line-through" : "none",
                    flex: 1,
                  }}
                >
                  {it}
                </Text>
              </View>
            );
          })}
        </View>
      );
    }
    case "wheelOfLife": {
      const items = tx(b.items, locale);
      let scores: Record<string, number> = {};
      try {
        const parsed = JSON.parse(answers[b.key] ?? "{}");
        if (parsed && typeof parsed === "object") scores = parsed;
      } catch {}
      return (
        <View key={i} style={{ marginVertical: 10 }}>
          {items.map((it, ci) => (
            <View
              key={ci}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 4,
                borderBottomWidth: 0.5,
                borderBottomColor: C.line,
                borderBottomStyle: "dotted",
              }}
            >
              <Text style={{ fontSize: 10, color: C.ink }}>{it}</Text>
              <Text
                style={{
                  fontFamily: SERIF,
                  fontSize: 12,
                  color: C.tan,
                }}
              >
                {scores[it] != null ? `${scores[it]} / 10` : "—"}
              </Text>
            </View>
          ))}
        </View>
      );
    }
    case "tracker30": {
      let parsed: { habit?: string; days?: number[] } = {};
      try {
        const p = JSON.parse(answers[b.key] ?? "{}");
        if (p && typeof p === "object") parsed = p;
      } catch {}
      const habit = parsed.habit ?? "";
      const days = new Set<number>(parsed.days ?? []);
      return (
        <View key={i} style={{ marginVertical: 10 }}>
          {b.habitLabel && (
            <Text style={styles.eyebrow}>{tx(b.habitLabel, locale)}</Text>
          )}
          <Text
            style={{
              borderBottomWidth: 0.8,
              borderBottomColor: C.tan,
              paddingVertical: 6,
              fontFamily: SERIF,
              fontSize: 14,
              color: habit ? C.ink : C.muted,
              marginBottom: 10,
            }}
          >
            {habit || "—"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            {Array.from({ length: 30 }, (_, n) => n + 1).map((n) => {
              const done = days.has(n);
              return (
                <View
                  key={n}
                  style={{
                    width: 22,
                    height: 22,
                    borderWidth: 0.8,
                    borderColor: done ? C.sage : C.line,
                    backgroundColor: done ? C.sage : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 8,
                      color: done ? C.white : C.muted,
                    }}
                  >
                    {n}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      );
    }
    case "weekLog": {
      const rows = tx(b.rows, locale);
      const days = tx(b.days, locale);
      let grid: Record<string, string> = {};
      try {
        const p = JSON.parse(answers[b.key] ?? "{}");
        if (p && typeof p === "object") grid = p;
      } catch {}
      return (
        <View key={i} style={{ marginVertical: 10 }}>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <View style={{ width: 70 }} />
            {days.map((d, di) => (
              <View key={di} style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontFamily: SERIF, fontSize: 10, color: C.tan }}>
                  {d}
                </Text>
              </View>
            ))}
          </View>
          {rows.map((rowLabel, ri) => (
            <View
              key={ri}
              style={{ flexDirection: "row", gap: 4, marginTop: 4 }}
            >
              <Text
                style={{
                  width: 70,
                  fontSize: 8,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: C.inkSoft,
                  alignSelf: "center",
                }}
              >
                {rowLabel}
              </Text>
              {days.map((_, di) => (
                <View
                  key={di}
                  style={{
                    flex: 1,
                    height: 22,
                    borderWidth: 0.8,
                    borderColor: C.line,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 9, color: C.tan }}>
                    {grid[`${ri}-${di}`] ?? "·"}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    }
    case "valuesPicker": {
      let picked: string[] = [];
      try {
        const p = JSON.parse(answers[b.key] ?? "[]");
        if (Array.isArray(p)) picked = p as string[];
      } catch {}
      return (
        <View key={i} style={{ marginVertical: 10 }}>
          {b.pickedHead && (
            <Text style={styles.eyebrow}>{tx(b.pickedHead, locale)}</Text>
          )}
          {Array.from({ length: b.pickCount ?? 5 }, (_, n) => (
            <Text
              key={n}
              style={{
                fontFamily: SERIF,
                fontSize: 14,
                color: C.tan,
                paddingVertical: 4,
                borderBottomWidth: 0.8,
                borderBottomColor: C.line,
              }}
            >
              {picked[n] ?? " "}
            </Text>
          ))}
        </View>
      );
    }
    case "callout": {
      const tone = b.tone;
      const bg =
        tone === "sage" ? C.sage : tone === "tan" ? C.tan : C.pageDark;
      const fg = tone === "cream" ? C.ink : C.white;
      const labelFg = tone === "cream" ? C.tan : "rgba(255,255,255,0.85)";
      return (
        <View
          key={i}
          style={[
            styles.callout,
            tone === "cream"
              ? { borderWidth: 0.8, borderColor: C.line }
              : {},
            { backgroundColor: bg },
          ]}
        >
          <Text style={[styles.calloutLabel, { color: labelFg }]}>
            {tx(b.label, locale)}
          </Text>
          <Text style={[styles.calloutBody, { color: fg }]}>
            {plainText(tx(b.body, locale))}
          </Text>
        </View>
      );
    }
    case "calloutList": {
      return (
        <View key={i}>
          {b.items.map((it, ci) => {
            const tone = b.tone;
            const bg =
              tone === "sage" ? C.sage : tone === "tan" ? C.tan : C.pageDark;
            const fg = tone === "cream" ? C.ink : C.white;
            const labelFg =
              tone === "cream" ? C.tan : "rgba(255,255,255,0.85)";
            return (
              <View
                key={ci}
                style={[
                  styles.callout,
                  tone === "cream"
                    ? { borderWidth: 0.8, borderColor: C.line }
                    : {},
                  { backgroundColor: bg },
                ]}
              >
                <Text style={[styles.calloutLabel, { color: labelFg }]}>
                  {tx(it.label, locale)}
                </Text>
                <Text style={[styles.calloutBody, { color: fg }]}>
                  {plainText(tx(it.body, locale))}
                </Text>
              </View>
            );
          })}
        </View>
      );
    }
    case "spacer":
      return <View key={i} style={{ height: b.height ?? 12 }} />;
    case "ctaCard":
      return (
        <View key={i} style={styles.cta}>
          <Text style={styles.ctaEyebrow}>{tx(b.eyebrow, locale)}</Text>
          <Text style={styles.ctaTitle}>{tx(b.title, locale)}</Text>
          <Text style={styles.ctaBody}>{plainText(tx(b.body, locale))}</Text>
        </View>
      );
    case "signature":
      return (
        <View key={i} style={styles.signature}>
          <Text style={styles.signatureName}>{b.name}</Text>
          <Text style={styles.signatureRole}>{tx(b.role, locale)}</Text>
        </View>
      );
    default:
      return null;
  }
}

// react-pdf doet geen markdown — strip _italic_ en **bold** markers
function plainText(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/_([^_\n]+)_/g, "$1");
}

function AnswerInline({
  keyName,
  answers,
}: {
  keyName: string;
  answers: Record<string, string>;
}) {
  const v = (answers[keyName] ?? "").trim();
  return v ? (
    <Text style={styles.answerValue}>{v}</Text>
  ) : (
    <Text style={styles.answerEmpty}>— nog niet ingevuld —</Text>
  );
}

// ─── PDF Document ────────────────────────────────────────────────────

export function WorkbookPdfDoc({
  workbook,
  answers,
  firstName,
  locale,
}: {
  workbook: Workbook;
  answers: Record<string, string>;
  firstName: string;
  locale: Locale;
}) {
  const cover = workbook.cover;
  const titleLines = tx(cover.title, locale);
  const isEN = locale === "en";

  return (
    <Document
      title={`${tx(workbook.title, locale)} — ${firstName}`}
      author="Marion Lubach"
    >
      {/* Cover */}
      <Page size="A4" style={styles.cover}>
        <View style={styles.coverInner}>
          <View style={{ alignItems: "center" }}>
            {workbook.imageUrl && (
              <Image src={workbook.imageUrl} style={styles.coverImage} />
            )}
            <Text style={styles.coverEyebrow}>{tx(cover.eyebrow, locale)}</Text>
            <Text style={styles.coverTitleThe}>The</Text>
            {titleLines.map((t, ti) => {
              if (ti === 0) {
                return (
                  <Text key={ti} style={styles.coverTitleBig}>
                    {t}
                  </Text>
                );
              }
              return (
                <Text key={ti} style={styles.coverTitleScript}>
                  {t}
                </Text>
              );
            })}
            <HeartRule />
            <Text style={styles.coverSub}>{tx(cover.sub, locale)}</Text>
            <Text style={styles.coverScriptSub}>{tx(cover.scriptSub, locale)}</Text>

            <Text style={styles.coverPersonal}>
              {isEN ? "for" : "voor"}
            </Text>
            <Text style={styles.coverPersonalScript}>{firstName}</Text>
            <Text
              style={{
                fontSize: 9,
                color: C.muted,
                marginTop: 6,
                letterSpacing: 2,
              }}
            >
              {fmtToday(locale)}
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={styles.coverAuthor}>{cover.author}</Text>
            <Text style={styles.coverAuthorRole}>{tx(cover.role, locale)}</Text>
          </View>
        </View>
      </Page>

      {/* Content pages */}
      {workbook.pages.map((page) => {
        if (page.layout === "part") {
          return (
            <Page key={page.number} size="A4" style={styles.partPage}>
              {page.partRoman && (
                <Text style={styles.partRoman}>{tx(page.partRoman, locale)}</Text>
              )}
              {page.partTitle && (
                <Text style={styles.partTitle}>{tx(page.partTitle, locale)}</Text>
              )}
              {page.partScript && (
                <Text style={styles.partScript}>{tx(page.partScript, locale)}</Text>
              )}
              <HeartRule />
              {page.partLead && (
                <Text style={styles.partLead}>{tx(page.partLead, locale)}</Text>
              )}
              <Text style={styles.pageNumber}>
                {String(page.number).padStart(2, "0")}
              </Text>
            </Page>
          );
        }
        return (
          <Page key={page.number} size="A4" style={styles.page}>
            {page.brand && (
              <Text style={styles.brandTop}>{tx(page.brand, locale)}</Text>
            )}
            {!page.brand && (
              <Text style={styles.brandTop}>{tx(workbook.brand, locale)}</Text>
            )}
            {page.chapter && (
              <Text style={styles.chapterTop}>{tx(page.chapter, locale)}</Text>
            )}
            <View>
              {page.blocks.map((b, i) => renderBlock(b, locale, answers, i))}
            </View>
            <Text style={styles.pageNumber}>
              {String(page.number).padStart(2, "0")}
            </Text>
          </Page>
        );
      })}

      {/* Closing page */}
      <Page size="A4" style={styles.page}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          <Text style={styles.kicker}>
            {isEN ? "with care" : "met liefde"}
          </Text>
          <Text style={styles.titleMd}>
            {isEN
              ? `For you, ${firstName}`
              : `Voor jou, ${firstName}`}
          </Text>
          <HeartRule />
          <Text
            style={[
              styles.lead,
              {
                textAlign: "center",
                maxWidth: 380,
                marginTop: 14,
              },
            ]}
          >
            {isEN
              ? "What you wrote here is yours. Read it back. Pause. Notice what shifted. I see you in the next step."
              : "Wat je hier hebt opgeschreven is van jou. Lees het terug. Sta even stil. Merk op wat er bewogen is. Tot in de volgende stap."}
          </Text>
          <View style={styles.signature}>
            <Text style={styles.signatureName}>Marion Lubach</Text>
            <Text style={styles.signatureRole}>
              {isEN ? "your creative lifestyle mentor" : "jouw creatieve leef-mentor"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
