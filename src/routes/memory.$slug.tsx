import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function imageUrl(slug: string, index: number): string {
  return `https://picsum.photos/seed/${slug}-${index}/800/600`;
}

const memories: Record<
  string,
  { title: string; caption: string; detail: string; hue: string; images: number }
> = {
  "university-memories": {
    title: "Kỷ Niệm Đại Học",
    caption: "Từ những buổi học đến đêm khuya — từng khoảnh khắc đã tạo nên tôi của ngày hôm nay.",
    detail:
      "Những năm đại học là chuỗi ngày trải nghiệm mới mẻ. Từ giảng đường đầu tiên đến kỳ thi cuối cùng, mỗi ngày đều mang đến điều mới — tình bạn, kiến thức, thử thách và chiến thắng. Những buổi học trong thư viện, đồ án nhóm, tiếng cười ở căng tin — tất cả đã xây nên con người tôi hôm nay.",
    hue: "from-amber-900/60 to-rose-900/60",
  },
  "friends-classmates": {
    title: "Bạn Bè & Đồng Môn",
    caption: "Những người đã làm hành trình này thật khó quên.",
    detail:
      "Mọi thứ sẽ chẳng thể trọn vẹn nếu thiếu những con người tuyệt vời tôi gặp trên đường đời. Bạn học thành bạn nhóm, rồi thành bạn thân, rồi thành gia đình. Những áp lực trước kỳ thi, những niềm vui sau hạn chót, và vô vàn kỷ niệm giữa những khoảnh khắc ấy — những sợi dây liên kết này sẽ tồn tại mãi.",
    hue: "from-emerald-900/60 to-teal-900/60",
  },
  "graduation-moments": {
    title: "Khoảnh Khắc Tốt Nghiệp",
    caption: "Những nụ cười, niềm tự hào và chiếc mũ cử nhân tung bay.",
    detail:
      "Bước lên sân khấu, tấm bằng trong tay, là kết tinh của bao năm cống hiến. Tiếng vỗ tay, tiếng reo hò của gia đình dưới khán đài, sức nặng của áo cử nhân — từng giây phút thật kỳ diệu. Đây là khoảnh khắc tất cả chúng ta đã hướng đến, và nó đẹp hơn cả những gì ta từng mơ.",
    hue: "from-slate-700 to-slate-900",
  },
  "behind-the-journey": {
    title: "Hậu Trường Hành Trình",
    caption: "Mồ hôi, nước mắt và sự kiên trì dẫn đến cột mốc này.",
    detail:
      "Những gì bạn thấy trong ngày tốt nghiệp chỉ là phần nổi của tảng băng. Đằng sau mỗi chiếc mũ và áo cử nhân là vô số đêm thức trắng, những phút giây nghi ngờ, hàng trang ghi chép, vô số tách cà phê và quyết tâm thầm lặng để tiếp tục bước đi. Hành trình này đã dạy tôi về sự kiên cường, nhẫn nại và giá trị của lao động chăm chỉ.",
    hue: "from-stone-700 to-stone-900",
  },
  "family-support": {
    title: "Hậu Phương Gia Đình",
    caption: "Gửi lời cảm ơn đến gia đình — những người luôn tin tưởng tôi từng bước trên đường đời.",
    detail:
      "Gia đình là điểm tựa của tôi trong suốt chặng đường. Từ những lời động viên lúc nửa đêm đến niềm tin không lay chuyển vào khả năng của tôi, họ không bao giờ để tôi bỏ cuộc. Họ cùng tôi ăn mừng từng chiến thắng nhỏ và nâng tôi dậy trong những giây phút yếu lòng. Tấm bằng này thuộc về họ cũng như thuộc về tôi.",
    hue: "from-indigo-900/60 to-violet-900/60",
  },
  "new-beginning": {
    title: "Khởi Đầu Mới",
    caption: "Một chương kết thúc — một cuộc phiêu lưu mới bắt đầu.",
    detail:
      "Tốt nghiệp không chỉ là điểm kết — mà là cánh cửa mở ra mọi điều phía trước. Với hành trang kiến thức, kỷ niệm và sự ủng hộ của những người tin tưởng tôi, tôi sẵn sàng bước ra thế giới và xây dựng tương lai. Những điều tốt đẹp nhất vẫn đang chờ đón.",
    hue: "from-sky-900/60 to-cyan-900/60",
    images: 3,
  },
};

export const Route = createFileRoute("/memory/$slug")({
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-foreground">Không tìm thấy</h1>
        <p className="mt-4 text-muted-foreground">Kỷ niệm này không tồn tại.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowLeft size={16} />
          Về trang chủ
        </Link>
      </div>
    </div>
  ),
  component: MemoryDetail,
});

function ImageWithSkeleton({ src, alt, hue }: { src: string; alt: string; hue: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${hue}`} />
      {!loaded && <div className="absolute inset-0 animate-pulse bg-accent/50" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover mix-blend-overlay transition-opacity duration-500 ${loaded ? "opacity-70" : "opacity-0"}`}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,transparent,rgba(0,0,0,0.35))]" />
      <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-2 text-sm backdrop-blur">
        <Heart size={14} className="text-signature" />
        <span>{alt.split("—")[1]?.trim() ?? ""}</span>
      </div>
    </div>
  );
}

function MemoryDetail() {
  const { slug } = Route.useParams();
  const memory = memories[slug];

  if (!memory) return null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Về trang chủ
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8"
        >
          <Carousel className="w-full">
            <CarouselContent>
              {Array.from({ length: memory.images }).map((_, i) => (
                <CarouselItem key={i}>
                  <ImageWithSkeleton
                    src={imageUrl(slug, i)}
                    alt={`${memory.title} — photo ${i + 1} / ${memory.images}`}
                    hue={memory.hue}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="mt-10 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            {memory.title}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 text-lg leading-relaxed text-muted-foreground"
        >
          {memory.detail}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <Link
            to="/"
            hash="memories"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Xem tất cả kỷ niệm
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
