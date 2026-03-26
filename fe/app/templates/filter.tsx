import { SearchInput } from "@/components/template/input";
import { Checkbox } from "@/components/template/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { FrameworkIcon } from "@/components/svg/template-page";
import { Banknote } from "lucide-react";

const CATEGORY_MAP: Record<string, string> = {
  kh: "Kiếm Hiệp",
  th: "Tiên Hiệp",
  "2d": "Game 2D",
  tb: "Game Thẻ Bài",
  "3q": "Game Tam Quốc",
  h5: "Game H5",
  "3d": "Game 3D",
};

export const PRICE_RANGES = [
  { id: "all", label: "Tất cả mức giá", min: 0, max: Infinity },
  { id: "0_1500", label: "0 - 1.500.000đ", min: 0, max: 1500000 },
  {
    id: "1500_2000",
    label: "1.500.000đ - 2.000.000đ",
    min: 1500000,
    max: 2000000,
  },
  {
    id: "2000_3000",
    label: "2.000.000đ - 3.000.000đ",
    min: 2000000,
    max: 3000000,
  },
  {
    id: "3000_5000",
    label: "3.000.000đ - 5.000.000đ",
    min: 3000000,
    max: 5000000,
  },
  {
    id: "5000_10000",
    label: "5.000.000đ - 10.000.000đ",
    min: 5000000,
    max: 10000000,
  },
  {
    id: "above_10000",
    label: "Trên 10.000.000đ",
    min: 10000000,
    max: Infinity,
  },
];

type FilterSidebarProps = {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  availableCategories: string[];
  selectedCategories: string[];
  onToggleCategory: (cat: string) => void;
  priceFilter: string;
  onPriceChange: (id: string) => void;
};

export function FilterSidebar({
  searchQuery,
  onSearchChange,
  availableCategories,
  selectedCategories,
  onToggleCategory,
  priceFilter,
  onPriceChange,
}: FilterSidebarProps) {
  return (
    <div className="w-full lg:w-[260px] shrink-0">
      <h2 className="w-full mb-4 font-semibold text-left blog-heading-gradient">
        Bộ lọc Tìm kiếm
      </h2>
      <div className="mb-6">
        <SearchInput
          placeholder="Tìm tên game..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-lg border-[.75px] border-white/20 w-full"
        />
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price"]}>
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="flex items-center w-full text-left pb-4">
            <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
              <FrameworkIcon />
            </span>
            <span className="w-full pl-4 text-sm text-left">Thể loại</span>
          </AccordionTrigger>
          <AccordionContent>
            <Separator className="my-4 mt-0" orientation="horizontal" />
            <div className="flex flex-col gap-1">
              {availableCategories.map((cat) => (
                <label
                  key={cat}
                  className="flex flex-row items-center px-2 py-1 space-x-3 h-10 duration-150 rounded-md bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.15)] cursor-pointer"
                >
                  <Checkbox
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => onToggleCategory(cat)}
                    className="ml-2"
                  />
                  <span className="text-sm font-normal uppercase italic text-white/50 mr-2">
                    [{cat}]
                  </span>
                  <span className="text-sm font-normal">
                    {CATEGORY_MAP[cat.toLowerCase()] || cat}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-none mt-4">
          <AccordionTrigger className="flex items-center w-full text-left pb-4">
            <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
              <Banknote className="w-3.5 h-3.5" />
            </span>
            <span className="w-full pl-4 text-sm text-left">Mức giá</span>
          </AccordionTrigger>
          <AccordionContent>
            <Separator className="my-4 mt-0" orientation="horizontal" />
            <div className="flex flex-col gap-1">
              {PRICE_RANGES.map((range) => (
                <label
                  key={range.id}
                  className="flex flex-row items-center px-2 py-1 space-x-3 h-10 duration-150 rounded-md bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.15)] cursor-pointer"
                >
                  <Checkbox
                    checked={priceFilter === range.id}
                    onCheckedChange={() => onPriceChange(range.id)}
                    className="ml-2 rounded-full"
                  />
                  <span className="text-sm font-normal">{range.label}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
