interface CategoryObject {
  id: string;
  category: string;
}

function filterByCategory(
  objects: CategoryObject[],
  categories: string[]
): CategoryObject[] {
  const filteredObjects: CategoryObject[] = [];

  for (const obj of objects) {
    if (categories.includes(obj.category)) {
      filteredObjects.push(obj);
    }
  }

  return filteredObjects;
}

// Example usage:
const objects: CategoryObject[] = [
  { id: "1", category: "electronics" },
  { id: "2", category: "clothing" },
  { id: "3", category: "books" },
];

const categories: string[] = ["clothing", "books"];

const filtered = filterByCategory(objects, categories);

export default filterByCategory;
