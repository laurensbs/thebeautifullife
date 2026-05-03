import { NextResponse } from "next/server";
import { getWorkbookSession } from "@/lib/workbook-auth";
import {
  createClientSession,
  setClientCookie,
  getClientSession,
} from "@/lib/client-auth";

/**
 * GET /api/workbook/to-portal
 *
 * Bridge: zet klant met werkboek-sessie meteen door naar het portaal
 * met een client_token cookie. Voorkomt dat klant opnieuw moet inloggen
 * als hij vanuit het werkboek terug naar 'Mijn pad' wil.
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  // Al ingelogd in portal? Direct doorsturen.
  const existingClient = await getClientSession();
  if (existingClient) {
    return NextResponse.redirect(`${origin}/mijn-pad`);
  }

  // Werkboek-sessie? Maak client-sessie van zelfde email.
  const wb = await getWorkbookSession();
  if (wb?.email) {
    const sessionToken = await createClientSession(wb.email);
    await setClientCookie(sessionToken);
    return NextResponse.redirect(`${origin}/mijn-pad`);
  }

  // Geen sessie → naar login
  return NextResponse.redirect(`${origin}/mijn-pad/login`);
}
