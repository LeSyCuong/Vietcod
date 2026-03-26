/* Language Tabs */
type LangTabsProps = {
  activeLang: string;
  setActiveLang: (lang: string) => void;
  languages: string[];
};

export default function LangTabs({
  activeLang,
  setActiveLang,
  languages,
}: LangTabsProps) {
  return (
    <div className="flex gap-2 mb-4">
      {languages.map((langKey) => (
        <button
          key={langKey}
          onClick={() => setActiveLang(langKey)}
          className={`cursor-pointer px-4 py-1.5 text-sm font-medium rounded-lg border transition-all duration-150
            ${
              activeLang === langKey
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
        >
          {langKey.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
