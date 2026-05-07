import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <div className="card group hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <Link to={`/shop/${product._id}`}>
        <div className="relative overflow-hidden h-64 bg-secondary">
          {product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/30">
              <ShoppingCart size={48} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isFeatured && (
              <span className="bg-primary text-secondary text-xs px-2 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Out of Stock
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="bg-orange-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                Low Stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <span className="text-xs text-primary/50 uppercase tracking-wider">
          {product.category}
        </span>

        <Link to={`/shop/${product._id}`}>
          <h3 className="font-serif text-primary font-semibold mt-1 hover:text-primary-light transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.ratings.count > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-primary/60">
              {product.ratings.average} ({product.ratings.count})
            </span>
          </div>
        )}

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-primary font-bold text-lg">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
