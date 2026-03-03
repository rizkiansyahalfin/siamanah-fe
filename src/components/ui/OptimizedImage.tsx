import * as React from "react";

import { cn } from "@/lib/utils";

export interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  src: string;
  alt: string;
  /**
   * Responsive sizes hint, e.g.
   * "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
   */
  sizes?: string;
  /**
   * If true, do not force loading=\"lazy\".
   * Useful for above-the-fold images like hero banners.
   */
  priority?: boolean;
  /**
   * Extra classes for the outer wrapper (skeleton / aspect handling).
   */
  wrapperClassName?: string;
  /**
   * Extra classes for the blur placeholder overlay.
   */
  placeholderClassName?: string;
}

function computeWebpSrc(src: string): string {
  if (!src || typeof src !== "string") return "";
  // Simple heuristic: replace common raster extensions with .webp.
  // For remote URLs without an extension, fall back to the original src.
  return src.replace(/\.(jpe?g|png)$/i, ".webp");
}

export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      className,
      sizes,
      priority,
      wrapperClassName,
      placeholderClassName,
      onLoad,
      ...imgProps
    },
    ref,
  ) => {
    const [isLoaded, setIsLoaded] = React.useState(false);

    const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
      setIsLoaded(true);
      if (onLoad) {
        onLoad(event);
      }
    };

    const webpSrc = React.useMemo(() => computeWebpSrc(src), [src]);

    return (
      <div
        className={cn(
          "relative overflow-hidden bg-slate-100",
          wrapperClassName,
        )}
      >
        <picture>
          <source type="image/webp" srcSet={webpSrc} sizes={sizes} />
          <img
            ref={ref}
            src={src}
            alt={alt}
            loading={priority ? imgProps.loading : "lazy"}
            sizes={sizes}
            onLoad={handleLoad}
            className={cn(
              "block w-full h-full object-cover transition-opacity duration-500",
              isLoaded ? "opacity-100" : "opacity-0",
              className,
            )}
            {...imgProps}
          />
        </picture>

        {/* Blur / skeleton placeholder */}
        <div
          className={cn(
            "absolute inset-0 bg-slate-100 blur-sm transition-opacity duration-500",
            isLoaded && "opacity-0 pointer-events-none",
            placeholderClassName,
          )}
        />
      </div>
    );
  },
);

OptimizedImage.displayName = "OptimizedImage";

