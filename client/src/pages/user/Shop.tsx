import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../../components/shared/ProductCard";
import Spinner from "../../components/shared/Spinner";
import { getProducts } from "../../services/productService";
import type { Product, ProductCategory } from "../../types";

const categories: { label: string; value: ProductCategory | "" }[] = [
  { label: "All", value: "" },
  { label: "Suits", value: "suits" },
  { label: "Shirts", value: "shirts" },
  { label: "Trousers", value: "trousers" },
  { label: "Dresses", value: "dresses" },
  { label: "Jackets", value: "jackets" },
  { label: "Traditional", value: "traditional" },
  { label: "Accessories", value: "accessories" },
  { label: "Other", value: "other" },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchInput, setSearchInput] = useState(keyword);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({
          keyword: keyword || undefined,
          category: category || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          page,
          limit: 12,
        });
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, page, minPrice, maxPrice]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("keyword", searchInput);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput("");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasFilters = keyword || category || minPrice || maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Shop</h1>
          <p className="text-primary/60 mt-1">
            {loading ? "Loading..." : `${total} products found`}
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <button type="submit" className="btn-primary px-4">
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary px-4 flex items-center gap-2"
          >
            <SlidersHorizontal size={16} />
          </button>
        </form>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-secondary-dark p-6 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Min Price ($)
            </label>
            <input
              type="number"
              className="input-field"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Max Price ($)
            </label>
            <input
              type="number"
              className="input-field"
              placeholder="9999"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="btn-secondary flex items-center gap-2 w-full justify-center"
              >
                <X size={16} /> Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => updateParam("category", cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              category === cat.value
                ? "bg-primary text-secondary"
                : "bg-white text-primary border border-secondary-dark hover:bg-secondary"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateParam("page", String(p))}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-primary text-secondary"
                      : "bg-white text-primary border border-secondary-dark hover:bg-secondary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-primary/50 text-lg">No products found.</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-primary font-medium hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
