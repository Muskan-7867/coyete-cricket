







export const getCategoryProducts = async (id: string) => {
  try {
    const response = await fetch(`/api/categories/${id}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch category products');
    }

    const data = await response.json();
    console.log("from fetcher products", data)
    return data;
  } catch (error) {
    console.error('Error fetching category products:', error);
    throw error;
  }
};