import { NextResponse } from "next/server";
import {
  deletePersistedRealm,
  getPersistedRealmBySlug,
} from "@/lib/realms/realmRepository";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const realm = await getPersistedRealmBySlug(slug);
  if (!realm) {
    return NextResponse.json({ error: "Realm not found." }, { status: 404 });
  }

  return NextResponse.json({ realm });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const deleted = await deletePersistedRealm(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Realm not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
