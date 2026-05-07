import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Star, ArrowLeft, Package } from "lucide-react";
import { getProduct } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import Spinner from "../../components/shared/Spinner";
import type { Product } from "../../types";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id!);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-primary/50 text-lg">Product not found.</p>
        <Link
          to="/shop"
          className="text-primary font-medium hover:underline mt-2 inline-block"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-primary/60 hover:text-primary transition-colors mb-8 text-sm"
      >
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="bg-secondary rounded-2xl overflow-hidden h-96 mb-4">
            {product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary/20">
                <Package size={80} />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === selectedImage
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-xs text-primary/50 uppercase tracking-widest">
            {product.category}
          </span>

          <h1 className="font-serif text-4xl font-bold text-primary mt-2 mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          {product.ratings.count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(product.ratings.average)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-primary/20"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-primary/60">
                {product.ratings.average} ({product.ratings.count} reviews)
              </span>
            </div>
          )}

          <p className="text-3xl font-bold text-primary mb-6">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-primary/70 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Stock */}
          <p
            className={`text-sm font-medium mb-6 ${
              product.stock === 0
                ? "text-red-500"
                : product.stock <= 5
                  ? "text-orange-500"
                  : "text-green-600"
            }`}
          >
            {product.stock === 0
              ? "Out of Stock"
              : product.stock <= 5
                ? `Only ${product.stock} left in stock`
                : `${product.stock} in stock`}
          </p>

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-secondary-dark rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-primary hover:bg-secondary transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 text-primary font-medium border-x border-secondary-dark">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-4 py-2 text-primary hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`btn-primary flex items-center gap-2 flex-1 justify-center ${
                  added ? "bg-green-600" : ""
                }`}
              >
                <ShoppingCart size={18} />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          )}

          {/* Custom Order CTA */}
          <div className="bg-secondary rounded-xl p-4 border border-secondary-dark">
            <p className="text-sm text-primary/70">
              Want this tailored to your exact measurements?
            </p>
            <Link
              to="/custom-order"
              className="text-primary font-medium text-sm hover:underline"
            >
              Place a Custom Order →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
