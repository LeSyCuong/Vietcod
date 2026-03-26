import Image from "next/image";

export default function ProductImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden shadow-md">
      <Image src={src} alt={alt} fill className="object-cover" unoptimized />
    </div>
  );
}
