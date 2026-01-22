import * as React from "react"

const OptimizedImage = React.forwardRef(
  ({ src, alt, className, width, height, loading = "lazy", ...props }, ref) => {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [error, setError] = React.useState(false)

    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
        {!isLoaded && !error && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
            Failed to load
          </div>
        ) : (
          <img
            ref={ref}
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            {...props}
          />
        )}
      </div>
    )
  }
)
OptimizedImage.displayName = "OptimizedImage"

export { OptimizedImage }
