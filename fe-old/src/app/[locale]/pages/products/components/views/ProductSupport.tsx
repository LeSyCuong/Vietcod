import Image from "next/image";
import Link from "next/link";

export default function ProductSupport({
  img,
  title,
  content,
  button,
}: {
  img: string;
  title: string;
  content: string;
  button: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">
              {title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
          </div>
        </div>

        <div className="aspect-[16/9] rounded-lg overflow-hidden mb-6 bg-gray-100">
          <Image
            src={img}
            alt={title}
            width={320}
            height={180}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        <a
          href="https://zalo.me/0865811722"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-black hover:bg-gray-900 text-white font-medium py-3.5 rounded-lg transition-colors"
        >
          {button}
        </a>
      </div>
    </div>
  );
}
