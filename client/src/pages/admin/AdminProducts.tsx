import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import {
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
} from "../../services/adminService";
import { getProducts } from "../../services/productService";
import Spinner from "../../components/shared/Spinner";
import { Plus, Pencil, Trash2, X, Package, Upload } from "lucide-react";
import type { Product, ProductCategory } from "../../types";
import api from "../../services/api";

const categories: ProductCategory[] = [
  "suits",
  "shirts",
  "trousers",
  "dresses",
  "jackets",
  "traditional",
  "accessories",
  "other",
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "suits" as ProductCategory,
  stock: "",
  isFeatured: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Image upload state
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      const data = await getProducts({ limit: 100 });
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageUrls([]);
    setError("");
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      isFeatured: product.isFeatured,
    });
    setImageUrls(product.images || []);
    setError("");
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      const { data } = await api.post(
        "/upload/multiple?folder=products",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const newUrls = data.urls.map((u: { url: string }) => u.url);
      setImageUrls((prev) => [...prev, ...newUrls]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        images: imageUrls,
        isFeatured: form.isFeatured,
      };

      if (editingProduct) {
        await updateProductAdmin(editingProduct._id, payload);
      } else {
        await createProductAdmin(payload);
      }

      setShowForm(false);
      fetchProducts();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save product.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProductAdmin(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">
            Products
          </h1>
          <p className="text-primary/60 mt-1">
            {products.length} products total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-secondary-dark">
              <h2 className="font-serif text-xl font-bold text-primary">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-primary/50 hover:text-primary"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Description
                </label>
                <textarea
                  className="input-field resize-none h-24"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Category
                </label>
                <select
                  className="input-field"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as ProductCategory,
                    })
                  }
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Product Images
                </label>

                {/* Image previews */}
                {imageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {imageUrls.map((url) => (
                      <div
                        key={url}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border border-secondary-dark group"
                      >
                        <img
                          src={url}
                          alt="product"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? <Spinner size="sm" /> : <Upload size={16} />}
                  {uploading ? "Uploading..." : "Upload Images"}
                </button>
                <p className="text-xs text-primary/40 mt-1">
                  JPEG, PNG or WebP — max 5MB each. Multiple files supported.
                </p>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm font-medium text-primary"
                >
                  Featured Product
                </label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex items-center gap-2 flex-1 justify-center"
                >
                  {submitting ? <Spinner size="sm" /> : null}
                  {submitting
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-primary/20 mb-3" />
          <p className="text-primary/50">No products yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary border-b border-secondary-dark">
                <tr>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Price
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Stock
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Featured
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-secondary-dark/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/20">
                              <Package size={16} />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-primary line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-primary/70">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          product.stock === 0
                            ? "text-red-500"
                            : product.stock <= 5
                              ? "text-orange-500"
                              : "text-green-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isFeatured ? (
                        <span className="text-primary text-xs font-medium bg-primary/10 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      ) : (
                        <span className="text-primary/30 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 text-primary/50 hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(product._id, product.name)
                          }
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
