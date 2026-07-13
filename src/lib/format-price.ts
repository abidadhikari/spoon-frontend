function formatPrice(value: number | null): string | null {
  if (value === null || value === undefined) return null;
  return new Intl.NumberFormat("en-IN").format(value);
}

export { formatPrice };
