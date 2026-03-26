import { Injectable, Logger } from '@nestjs/common';
import { CompanyInfoService } from '../company-info.service';
import { SanphamGameService } from '../sanpham_game.service';

@Injectable()
export class RagService {
  private cache = new Map<
    string,
    { info: string; products: string; timestamp: number }
  >();
  private readonly cacheTTL = 1000 * 60 * 10;

  private categoryMap = {
    '2d': 'game 2D',
    h5: 'game H5',
    th: 'game tiên hiệp',
    kh: 'game kiếm hiệp',
    '3q': 'game Tam Quốc',
    '3d': 'game 3D',
  };
  private stopwords = [
    'tôi',
    'muốn',
    'xem',
    'giá',
    'mua',
    'với',
    'trên',
    'dưới',
    'của',
    'và',
    'là',
    'nhưng',
    'các',
    'cho',
    'cần',
  ];

  private cachedInfos: any[] = [];
  private cachedProducts: any[] = [];

  constructor(
    private readonly companyService: CompanyInfoService,
    private readonly productService: SanphamGameService,
  ) {}

  async initCache() {
    if (!this.cachedInfos.length)
      this.cachedInfos = await this.companyService.findAll();
    if (!this.cachedProducts.length)
      this.cachedProducts = await this.productService.findAll();
  }

  private cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTTL) this.cache.delete(key);
    }
  }

  private normalize(str: string) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/gi, ' ')
      .trim();
  }

  private extractKeywords(msg: string, topN = 10) {
    const words = this.normalize(msg)
      .split(/\s+/)
      .filter((w) => w && !this.stopwords.includes(w));
    const freq: Record<string, number> = {};
    for (const w of words) freq[w] = (freq[w] || 0) + 1;
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([w]) => w);
  }

  private extractCategoryCodes(keywords: string[]) {
    const codes: string[] = [];
    for (const kw of keywords) {
      const kwLower = kw.toLowerCase();
      for (const [code, name] of Object.entries(this.categoryMap)) {
        if (kwLower === code || kwLower === name.toLowerCase())
          if (!codes.includes(code)) codes.push(code);
      }
    }
    return codes;
  }

  private extractPriceLimit(msg: string) {
    const match = msg.match(
      /giá\s*(dưới|trên|khoảng)?\s*([\d.,]+)\s*(triệu|tr|vnđ|vnd|m|củ)?/i,
    );
    if (!match) return { min: null, max: null };
    const price = parseFloat(match[2].replace(',', '.'));
    if (isNaN(price)) return { min: null, max: null };
    const unitMultiplier = match[3]?.toLowerCase().includes('triệu')
      ? 1_000_000
      : 1;
    const priceLimit = price * unitMultiplier;
    if (match[1] === 'dưới') return { min: null, max: priceLimit };
    if (match[1] === 'trên') return { min: priceLimit, max: null };
    if (match[1] === 'khoảng')
      return { min: priceLimit * 0.9, max: priceLimit * 1.1 };
    return { min: priceLimit, max: priceLimit };
  }

  private scoreProduct(
    p: any,
    keywords: string[],
    categoryCodes: string[],
    minPrice: number | null,
    maxPrice: number | null,
  ): number {
    let score = 0;
    const nameNorm = this.normalize(p.name || ''),
      contentNorm = this.normalize(p.content || '');
    for (const kw of keywords) {
      if (nameNorm.includes(kw)) score += 5;
      if (contentNorm.includes(kw)) score += 2;
    }
    const pCategories = (p.category || '').split(',');
    if (
      !categoryCodes.length ||
      categoryCodes.some((c) => pCategories.includes(c))
    )
      score += 3;
    if (
      (!minPrice || p.price >= minPrice) &&
      (!maxPrice || p.price <= maxPrice)
    )
      score += 2;
    return score;
  }

  async getRelevantContext(
    question: string,
  ): Promise<{ info: string; products: string }> {
    this.cleanCache();
    await this.initCache();
    const lowerQ = this.normalize(question);
    if (this.cache.has(lowerQ)) return this.cache.get(lowerQ)!;

    const keywords = this.extractKeywords(question);
    const categoryCodes = this.extractCategoryCodes(keywords);
    const { min, max } = this.extractPriceLimit(question);

    let filteredProducts = this.cachedProducts.filter((p) => {
      const pCategories = (p.category || '').split(',');
      return (
        !categoryCodes.length ||
        categoryCodes.some((c) => pCategories.includes(c))
      );
    });

    const scoredProducts = filteredProducts
      .map((p) => ({
        ...p,
        score: this.scoreProduct(p, keywords, categoryCodes, min, max),
      }))
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const matchedInfos = this.cachedInfos
      .filter((info) =>
        keywords.some((kw) =>
          this.normalize(`${info.title} ${info.content}`).includes(kw),
        ),
      )
      .slice(0, 5);

    const infoContext = matchedInfos.length
      ? matchedInfos.map((i) => `# ${i.title}\n${i.content}`).join('\n\n')
      : 'Không có dữ liệu nội bộ phù hợp.';

    const productContext = scoredProducts.length
      ? scoredProducts
          .map(
            (sp, i) =>
              `## [${i + 1}] ${sp.name}\n- Danh mục: ${sp.category}\n- Giá: ${sp.price || 'Liên hệ'}\n- Mô tả: ${sp.content || 'Chưa có'}\n- Link: /pages/products/view/${sp.id}`,
          )
          .join('\n\n---\n\n')
      : 'Không tìm thấy sản phẩm phù hợp.';

    const result = { info: infoContext, products: productContext };
    this.cache.set(lowerQ, { ...result, timestamp: Date.now() });
    return result;
  }
}
