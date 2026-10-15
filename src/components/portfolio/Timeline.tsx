import { motion, useReducedMotion } from "framer-motion";
import yearOne from "../../../images/optimized/story/journey-1.webp";
import yearTwo from "../../../images/optimized/story/journey-2.webp";
import yearThree from "../../../images/optimized/story/journey-3.webp";
import yearFour from "../../../images/optimized/story/journey-4.webp";
import graduation from "../../../images/optimized/story/journey-5.webp";

const chapters = [
  {
    year: "Năm nhất",
    title: "Gieo mơ",
    image: yearOne,
    width: 1600,
    height: 1600,
    text: "Ai cũng phải bắt đầu từ một ước mơ nào đó và năm nhất chính là lúc mình gieo xuống Đại học những hoài bão đầu tiên. Bước qua cánh cổng mới với bao bỡ ngỡ của tuổi trẻ, mình thật may mắn khi được gặp gỡ những người bạn mới, những người anh chị đi trước đã ân cần dẫn dắt và giúp đỡ mình bước qua những ngày tháng chập chững ban đầu.",
  },
  {
    year: "Năm hai",
    title: "Thức giấc",
    image: yearTwo,
    width: 900,
    height: 1600,
    text: 'Khi những ước mơ bắt đầu cựa mình thức giấc, cũng là lúc bản thân dần bắt nhịp được với guồng quay của thời sinh viên. Năm hai mang đến cho mình vô vàn trải nghiệm đáng nhớ và những mối quan hệ ngày càng gắn bó, khăng khít. Đặc biệt hơn cả, đây là năm đầu tiên mình chính thức trở thành "anh lớn", sẵn sàng sẻ chia và đồng hành cùng những thế hệ tiếp theo.',
  },
  {
    year: "Năm ba",
    title: "Đón nắng",
    image: yearThree,
    width: 886,
    height: 886,
    text: "Không còn là người vấp váp như thuở ban đầu, năm ba là lúc mình vươn mình mạnh mẽ để đón lấy ánh nắng rực rỡ nhưng cũng đầy gay gắt. Bản thân đã có những định hướng thật sự rõ ràng cho con đường học tập, các hoạt động ngoại khóa và cả những vòng tròn kết nối. Đây là khoảng thời gian mình đương đầu với nhiều thử thách nhất, nhưng cũng chính nhờ những áp lực ấy mà mình trở nên bản lĩnh, trưởng thành và cứng cáp hơn bao giờ hết.",
  },
  {
    year: "Năm tư",
    title: "Đan mây",
    image: yearFour,
    width: 1534,
    height: 1534,
    text: "Năm tư tựa như khoảnh khắc ta gom góp những chắt chiu của thanh xuân để đan dệt nên một bầu trời cho riêng mình. Chặng đường sinh viên dần khép lại, gói ghém theo biết bao bài học quý giá và những kỷ niệm không thể nào quên. Đây là lúc mình chập chững bước những bước đầu tiên vào thị trường lao động, tập làm quen với áp lực của cuộc sống trưởng thành. Nhưng dẫu có bộn bề, sâu thẳm bên trong vẫn là niềm tự hào về những nền tảng đã đắp xây và tâm thế sẵn sàng cho mọi chân trời phía trước.",
  },
  {
    year: "Tốt nghiệp",
    title: "Rực rỡ",
    image: graduation,
    width: 1388,
    height: 1600,
    text: "Và rồi, mọi nỗ lực đều được đền đáp bằng một mốc son rực rỡ nhất — ngày 23.10.2026, ngày mình chính thức khoác lên chiếc áo cử nhân. Đây là khoảnh khắc mình trọn vẹn và tự hào nhất khi nhìn lại cả một hành trình miệt mài không ngừng nghỉ để chinh phục mục tiêu. Tốt nghiệp không chỉ là dấu chấm hết cho một chương thanh xuân tươi đẹp, mà còn là lời chào sân đầy kiêu hãnh mở ra muôn vàn cơ hội, những thử thách và những chuyến phiêu lưu mới đang vẫy gọi.",
  },
];

export function Timeline() {
  const reduceMotion = useReducedMotion();
  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="scroll-mt-24 overflow-hidden px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-signature">
            Từng chút một, mình lớn lên
          </p>
          <h2 id="journey-title" className="mt-4 font-serif text-4xl font-bold sm:text-6xl">
            Hành trình rực rỡ
          </h2>
        </div>
        <ol className="relative space-y-16 before:absolute before:bottom-0 before:left-3 before:top-0 before:w-px before:bg-border md:space-y-24 md:before:left-1/2">
          {chapters.map(({ year, title, image, text, width, height }, index) => (
            <motion.li
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 36 }}
              animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.65 }}
              className="relative grid items-center gap-8 pl-10 md:grid-cols-2 md:gap-20 md:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute left-1.5 top-10 h-3 w-3 rounded-full bg-signature ring-4 ring-background md:left-1/2 md:top-1/2 md:-translate-x-1/2"
              />
              <div className={index % 2 ? "md:col-start-2 md:row-start-1" : ""}>
                <p className="text-xs uppercase tracking-[0.2em] text-signature">{year}</p>
                <h3 className="mt-3 font-serif text-3xl font-bold sm:text-5xl">{title}</h3>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">{text}</p>
              </div>
              <div
                className={`overflow-hidden rounded-2xl bg-card ${index % 2 ? "md:col-start-1 md:row-start-1" : ""}`}
              >
                <img
                  src={image}
                  width={width}
                  height={height}
                  alt={`${year}: ${title}`}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
