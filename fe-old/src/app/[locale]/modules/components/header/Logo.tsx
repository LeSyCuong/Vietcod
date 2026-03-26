// components/Logo.tsx
import Link from "next/link";
import Image from "next/image";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 font-semibold text-white">
    <Image
      src="/uploads/images/name.png"
      alt="Logo"
      width={128}
      height={32}
      className="h-10 w-auto"
    />
  </Link>
);

export default Logo;
