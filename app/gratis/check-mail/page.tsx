import { getLocale } from "@/lib/i18n/server";
import CheckMailView from "./CheckMailView";

export const metadata = {
  title: "Check je inbox — The Beautiful Life",
  robots: { index: false, follow: false },
};

export default async function CheckMailPage() {
  const locale = await getLocale();
  return <CheckMailView locale={locale} />;
}
