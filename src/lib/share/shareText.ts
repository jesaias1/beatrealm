import type { FightResult } from "@/lib/fight/types";
import type { PersistedRealm, Realm } from "@/types";

type ShareRealm = PersistedRealm | Realm;

function producerNameFor(realm: ShareRealm) {
  return "producerName" in realm ? realm.producerName : realm.producer.name;
}

export function getRealmPath(realm: ShareRealm) {
  return "producerName" in realm ? `/realm/${realm.slug}` : "/realm/demo";
}

export function getFightPath(realm: ShareRealm) {
  return "producerName" in realm ? `/realm/${realm.slug}/fight` : "/realm/demo/fight";
}

export function getProducerPath(realm: ShareRealm) {
  return "producerSlug" in realm
    ? `/producer/${realm.producerSlug}`
    : `/producer/${realm.producer.slug}`;
}

export function buildRealmShareText(realm: ShareRealm) {
  return `Enter my BeatRealm: ${producerNameFor(realm)} - ${realm.title}. Play the beat, fight the boss, and try to beat my score.`;
}

export function buildChallengeText(realm: ShareRealm) {
  return `Can you beat my Realm? Fight ${producerNameFor(realm)} - ${realm.title} on BeatRealm.`;
}

export function buildResultShareText(realm: PersistedRealm, result: FightResult) {
  return `I got ${result.rank} on ${realm.producerName} - ${realm.title} in BeatRealm with ${result.score.toLocaleString()} points, ${result.accuracy.toFixed(1)}% accuracy, and a max combo of ${result.maxCombo}. Can you beat my Realm?`;
}
