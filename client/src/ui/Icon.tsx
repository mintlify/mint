export default function Icon({
  icon,
  iconType,
  className,
}: {
  icon: string;
  iconType?: 'brands' | 'duotone' | 'light' | 'regular' | 'sharp-solid' | 'solid' | 'thin';
  className?: string;
}) {
  const type = iconType || 'regular';

  return (
    <svg
      className={className}
      style={{
        WebkitMaskImage: `url(https://deo472wkghxhm.cloudfront.net/${type}/${icon}.svg)`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
    ></svg>
  );
}
