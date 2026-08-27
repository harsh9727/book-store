import { Star, StarHalf } from "lucide-react";

interface ProductRatingProps {
  rating: number;
  reviewsCount?: number;
  showCount?: boolean;
  size?: number;
  className?: string;
}

export default function ProductRating({
  rating,
  reviewsCount,
  showCount = true,
  size = 16,
  className = "",
}: ProductRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-amber-500">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            size={size}
            className="fill-amber-400 text-amber-400"
          />
        ))}
        {hasHalfStar && (
          <StarHalf
            size={size}
            className="fill-amber-400 text-amber-400"
          />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            className="text-gray-300"
          />
        ))}
      </div>

      <span className="text-xs font-semibold text-gray-800">
        {rating.toFixed(1)}
      </span>

      {showCount && reviewsCount !== undefined && (
        <span className="text-xs text-gray-500">
          ({reviewsCount.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
}
