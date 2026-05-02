import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Login — Mijn pad",
};

export default async function ClientLoginPage() {
  const locale = await getLocale();
  return (
    <Suspense fallback={null}>
      <LoginForm locale={locale} />
    </Suspense>
  );
}
