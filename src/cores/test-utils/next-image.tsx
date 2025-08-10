/**
 * Mock implementation for Next.js Image component
 * This avoids the NextJS no-img-element linting warning in tests
 */
const MockNextImage = ({
  src,
  alt,
  width,
  height,
  ...props
}: {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  quality?: number | string;
}) => {
  return (
    <div
      data-testid="mock-next-image"
      data-src={src}
      data-alt={alt}
      style={{
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
      }}
      {...props}
    >
      {alt}
    </div>
  );
};

/**
 * Setup function to mock the next/image module
 * Use this in your test files by calling vi.mock('next/image')
 */
export const mockNextImage = () => {
  return {
    default: MockNextImage,
    __esModule: true,
  };
};
