const photos = import.meta.glob<string>("../../images/optimized/album-*/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

export interface Memory {
  slug: string;
  title: string;
  cover: string;
  images: string[];
}

const albums = [
  { id: 1, slug: "c5-trong-tim", title: "C5 TRONG TIM" },
  { id: 2, slug: "trai-tre-gai-xinh-bien-hoa", title: "TRAI TRẺ GÁI XINH BIÊN HOÀ" },
  { id: 3, slug: "doan-khoa-tai-chinh-ngan-hang", title: "ĐOÀN KHOA TÀI CHÍNH - NGÂN HÀNG" },
  { id: 4, slug: "ban-truyen-thong-ky-thuat", title: "BAN TRUYỀN THÔNG - KỸ THUẬT" },
  { id: 5, slug: "4-con-khi-za", title: "4 CON KHỈ ZÀ" },
  { id: 6, slug: "k22-iuuuuuu", title: "K22 IUUUUUU" },
  { id: 8, slug: "minh-kun-k22-5-k23", title: "MINH KUN K22,5 với K23" },
  { id: 9, slug: "trung-tam-bao-chi", title: "TRUNG TÂM BÁO CHÍ" },
  { id: 10, slug: "phututu", title: "PHUTUTU" },
];

export const memories: Memory[] = albums.map(({ id, slug, title }) => {
  const prefix = `../../images/optimized/album-${id}/`;
  return {
    slug,
    title,
    cover: photos[`${prefix}cover.webp`],
    images: Object.keys(photos)
      .filter((path) => path.startsWith(prefix) && !path.endsWith("/cover.webp"))
      .sort()
      .map((path) => photos[path]),
  };
});
