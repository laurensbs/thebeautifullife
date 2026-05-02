import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import ChromeRouter from "./ChromeRouter";
import { getLocale } from "@/lib/i18n/server";

export default async function ChromeGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <ChromeRouter
      header={<SiteHeader locale={locale} />}
      footer={<SiteFooter locale={locale} />}
    >
      {children}
    </ChromeRouter>
  );
}
