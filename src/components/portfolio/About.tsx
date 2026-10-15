import { motion, useReducedMotion } from "framer-motion";
import portrait from "../../../images/optimized/story/portrait.webp";

export function About() {
  const reduceMotion = useReducedMotion();
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <motion.img
          src={portrait}
          alt="Lâm Hồng Minh Quân"
          width={800}
          height={800}
          loading="lazy"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto aspect-square w-full max-w-md rounded-full object-cover object-center"
        />
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-signature">Một chút về mình</p>
          <h2
            id="about-title"
            className="text-balance font-serif text-3xl font-bold leading-tight sm:text-5xl"
          >
            Lâm Hồng Minh Quân là thằng nào vậy???
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>Xin chào tất cả mọi người, mình là Minh Quân đây!</p>
            <p>
              Có lẽ trong mắt nhiều người, mình vẫn là một đứa hay tưng tửng, hơi 'khùng khùng' một
              chút, nhưng bên trong luôn ấp ủ những hoài bão lớn và lúc nào cũng mong được thấy mọi
              người mỉm cười.
            </p>
            <p>
              Mình không phải là người xuất sắc nhất, nhưng luôn tự hào vì bản thân chưa từng ngừng
              nỗ lực để tốt hơn mỗi ngày. Suốt những năm tháng đại học vừa qua, mình đã đi qua một
              hành trình thật rực rỡ và trọn vẹn với biết bao kỷ niệm khó quên.
            </p>
            <p>
              Giờ thì, mời mọi người cùng dừng lại một nhịp và nhìn ngắm lại chặng đường thanh xuân
              ấy cùng Quân nhé!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
