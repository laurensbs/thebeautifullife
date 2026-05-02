import crypto from "crypto";
import { sql } from "./db";
import { PACKAGE_WORKBOOKS, getWorkbook } from "./workbooks";
import { sendWorkbookInvite } from "./email";
import type { PackageSlug } from "./packages";

export type GrantedWorkbook = {
  slug: string;
  title: string;
  url: string;
  isNew: boolean;
};

export async function grantWorkbooksForPackage(
  submissionId: number,
  pkg: PackageSlug,
  email: string,
  firstName: string,
  siteUrl: string
): Promise<GrantedWorkbook[]> {
  const slugs = PACKAGE_WORKBOOKS[pkg] ?? [];
  const granted: GrantedWorkbook[] = [];

  for (const slug of slugs) {
    const workbook = getWorkbook(slug);
    if (!workbook) continue;

    const existing = await sql`
      SELECT access_token FROM workbook_access
      WHERE submission_id = ${submissionId} AND workbook_slug = ${slug}
      LIMIT 1
    `;

    let token: string;
    let isNew = false;
    if (existing.length > 0) {
      token = String(existing[0].access_token);
    } else {
      token = crypto.randomBytes(32).toString("hex");
      await sql`
        INSERT INTO workbook_access (submission_id, workbook_slug, access_token)
        VALUES (${submissionId}, ${slug}, ${token})
      `;
      isNew = true;
    }

    const url = `${siteUrl}/werkboek/${slug}?token=${token}`;
    granted.push({ slug, title: workbook.title, url, isNew });

    if (isNew) {
      try {
        await sendWorkbookInvite(email, firstName, workbook.title, url);
      } catch (err) {
        console.error("sendWorkbookInvite failed:", err);
      }
    }
  }

  return granted;
}
