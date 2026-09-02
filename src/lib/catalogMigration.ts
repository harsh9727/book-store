export function hasInitializedCatalog(
  stored: Partial<
    Record<"catalogInitialized" | "products" | "categories", unknown>
  >,
) {
  const storedProducts = Array.isArray(stored.products) ? stored.products : [];
  const storedCategories = Array.isArray(stored.categories) ? stored.categories : [];
  return (
    stored.catalogInitialized === true ||
    storedProducts.length > 0 ||
    storedCategories.length > 0
  );
}
