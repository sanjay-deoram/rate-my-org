const STAR_POLYGON_POINTS =
  "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26";

function starFraction(rating: number, index: number): number {
  return Math.min(1, Math.max(0, rating - index));
}

// Rating is always displayed as a number elsewhere on the card, so the star
// row is decorative and hidden from assistive tech; caller owns the label.
export function StarRatingDisplay({
  rating,
  size = 14,
  className,
}: {
  rating: number | null;
  size?: number;
  className?: string;
}) {
  const clampedRating = rating === null ? 0 : Math.min(5, Math.max(0, rating));

  return (
    <div aria-hidden className={`flex gap-0.5 ${className ?? ""}`}>
      {[0, 1, 2, 3, 4].map((index) => {
        const fraction = rating === null ? 0 : starFraction(clampedRating, index);

        return (
          <div key={index} className="relative" style={{ width: size, height: size }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={size}
              height={size}
              style={{
                fill: "none",
                stroke: "color-mix(in srgb, var(--color-outline-variant) 50%, transparent)",
                strokeWidth: 1.5,
              }}
            >
              <polygon points={STAR_POLYGON_POINTS} />
            </svg>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fraction * 100}%` }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={size}
                height={size}
                className="shrink-0"
                style={{
                  fill: "var(--color-tertiary-fixed-dim)",
                  stroke: "var(--color-tertiary-fixed-dim)",
                  strokeWidth: 1.5,
                }}
              >
                <polygon points={STAR_POLYGON_POINTS} />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
