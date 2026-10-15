import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { memories, type Memory } from "@/lib/memories";
import { AlbumCarousel } from "@/components/portfolio/AlbumCarousel";

export const Route = createFileRoute("/memory/$slug")({
  loader: ({ params }): Memory => {
    const memory = memories.find((album) => album.slug === params.slug);
    if (!memory) throw notFound();
    return memory;
  },
  notFoundComponent: () => (
    <main className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold">Không tìm thấy album</h1>
        <Link
          to="/"
          hash="memories"
          className="mt-6 inline-flex min-h-11 items-center text-signature"
        >
          Về những dấu chân đáng nhớ
        </Link>
      </div>
    </main>
  ),
  component: MemoryDetail,
});

function MemoryDetail() {
  const memory: Memory = Route.useLoaderData();
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <Link
          to="/"
          hash="memories"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Những dấu chân đáng nhớ
        </Link>
        <h1 className="mt-6 text-balance font-serif text-3xl font-bold leading-tight sm:text-5xl">
          {memory.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {memory.images.length} ảnh kỷ niệm · Vuốt hoặc dùng phím mũi tên để xem ảnh
        </p>
        <AlbumCarousel key={memory.slug} memory={memory} />
      </div>
    </main>
  );
}
