export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

  return slug || "realm";
}

export function withUniqueSuffix(baseSlug: string, existingSlugs: string[]) {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  let candidate = `${baseSlug}-${counter}`;
  while (existingSlugs.includes(candidate)) {
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}
