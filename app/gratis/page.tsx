import { getLocale } from "@/lib/i18n/server";
import FreeForm from "./FreeForm";

export const metadata = {
  title: "Gratis reflectievragenlijst — The Beautiful Life",
  description:
    "Niet klaar voor een pakket — wel voor een eerste stap. Vul de gratis reflectievragenlijst in.",
};

export default async function GratisPage() {
  const locale = await getLocale();
  return <FreeForm locale={locale} />;
}
