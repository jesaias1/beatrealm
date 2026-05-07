import { NextResponse } from "next/server";
import {
  importPersistedRealms,
  listPersistedRealms,
} from "@/lib/realms/realmRepository";
import type { PersistedRealm } from "@/types";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const realms = await listPersistedRealms();
  return NextResponse.json({
    version: 1,
    exportedAt: new Date().toISOString(),
    realms,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { realms?: PersistedRealm[] };
    if (!Array.isArray(body.realms)) {
      return jsonError("Import requires a realms array.", 400);
    }

    const imported = await importPersistedRealms(body.realms);
    return NextResponse.json({ importedCount: imported.length, imported });
  } catch {
    return jsonError("Unable to import local metadata.", 400);
  }
}
