# Lời chúc dạng thư và admin xuất Excel — 12/10/2026

## Thay đổi

- Bỏ EmailJS và toàn bộ email thông báo tự động.
- Giữ lựa chọn Có/Không trong form; API và phong thư công khai không có email/trạng thái tham dự.
- Popup chung đúng nguyên văn đã duyệt, pháo giấy cho cả hai lựa chọn, hỗ trợ reduced-motion và trả focus khi đóng.
- Phong thư mở lời nhắn dưới dạng text, giữ xuống dòng và cuộn nội dung dài trên mobile.
- `/admin`: Supabase Auth, username `admin`, quyền theo UUID/private allowlist, session chỉ trong bộ nhớ. Reload cần đăng nhập lại.
- Excel thật: `Danh sách tham dự`, Họ tên / Mối quan hệ / Tham dự / Ngày gửi, giờ Việt Nam. Không có email/lời nhắn; không cắt ở 1.000 dòng.
- Giữ ảnh bìa/navbar trên ảnh, thông tin trên ảnh, chữ graduation pastel và handsign navy đã duyệt.

## Kiểm chứng trước phát hành

- 44 unit/integration tests đạt; type-check và production build đạt.
- SQL transactional tests đạt: RPC cũ lưu riêng tư, consent mới, validation, email trùng, anon/raw SELECT bị chặn, nonadmin/logout/expiry bị chặn, scalar export hơn 1.000 dòng; fixtures rollback.
- Chrome local: mật khẩu sai không có quyền, admin đúng tải được `.xlsx` đọc lại đủ hai bản ghi nền, reload yêu cầu login, meta noindex/nofollow có trong DOM.
- Hai submission thật trong luồng test: IDs 1018 và 1020, đúng trạng thái và publication flag; nguyên văn popup và canvas chung, không rain icon.
- Network: duplicate 409, save 204, public list 200; không có EmailJS request.
- Phong thư 4.000 ký tự tại 390×844: panel cuộn được, không tràn ngang, Escape trả focus về phong thư; HTML-like text không tạo img/script.
- 360×800, 768×1024, 1440×900: ảnh tải được, không tràn ngang; Hero cao tối thiểu viewport; desktop navbar trong suốt nằm trên ảnh. Scoped ESLint không lỗi/cảnh báo.

## Dữ liệu và tài khoản

Hai bản ghi cũ đã ghi nhận là 4 và 6; test local là 1018 và 1020. Chỉ xoá đúng những ID này sau review và backup đầy đủ vào `.local-backups/rsvp-before-cleanup.json` (ignored, ngoài public assets). Các phản hồi thật mới không nằm trong tập này phải được giữ lại.

Tài khoản thật được chủ trang tạo qua Dashboard với Auto confirm; đúng một tài khoản/UUID được allowlist. Mật khẩu không có trong Git, tài liệu hoặc VITE. Alias `admin@lhmq.invalid` không nhận email khôi phục; chủ trang quản lý mật khẩu qua Supabase Dashboard.

## Rollback

- Mốc source trước thay đổi: `rollback/pre-rsvp-letters-20261012` → `7fcab85296488a4e5a736761e30e26610cddf40e`.
- Deployment trước thay đổi: `dpl_3j4cssaVbbihTRNG4RUMKJoi6Jnv`, `https://lhmq-2gxoymc5t-noirdorks-projects.vercel.app`.
- Mốc release dự kiến: `release/rsvp-letters-admin-20261012`; chỉ gắn/push khi kiểm tra release đạt.

Không promote deployment cũ một cách mù quáng: nó chứa EmailJS và public DTO cũ. Muốn trở lại bố cục cũ, tạo nhánh rollback từ release hiện tại, khôi phục riêng Hero/Invitation/Navbar từ tag trước thay đổi và giữ luồng lưu/public privacy/admin mới; test rồi deploy build tương thích. Không revert migration để lộ lại trạng thái tham dự. Rollback code không khôi phục dữ liệu đã xoá; backup riêng dùng để phục hồi khi cần.

## Cảnh báo còn lại

- Dependency high/critical đã được sửa bằng các cập nhật lockfile trong range hiện tại. Audit production còn 2 low / 3 moderate: Babel/esbuild trong build/dev, fflate ZIP64 reader và uuid v3/v5 buffer handling không nằm trong luồng ứng dụng (không đọc ZIP do khách cung cấp, Excel export chỉ ghi workbook). ExcelJS bị đánh dấu theo uuid transitive. Không downgrade ExcelJS hoặc override major tự động. Rà lại trước 19/10/2026.
- Full audit còn các cảnh báo moderate của công cụ test/config dùng local; không expose dev server ra ngoài localhost. Lockfile/install scripts được kiểm soát trong lần thêm/cập nhật dependency.
- Supabase báo INFO RLS không policy: hai bảng cố ý không cho client đọc trực tiếp, truy cập qua RPC có projection/authorization. Không thêm policy mở bảng để làm mất cảnh báo.
- [Leaked password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) chưa bật; không thay gói hoặc thiết lập bảo mật tài khoản ngoài phạm vi.
- Cảnh báo chunk lớn hiện có; Excel lazy-loaded, không tải từ homepage ban đầu. Node local có cảnh báo module.register deprecation.
- Timeline có key trùng từ trước; không refactor timeline trong yêu cầu này. Chế độ reduced-motion được kiểm tra bằng unit tests; không thay thiết lập hệ điều hành của chủ máy.

## Trạng thái vận hành

Nguồn đã được kiểm thử local. Review độc lập, backup/xoá đúng ID và kiểm chứng production là các bước bắt buộc còn lại trước khi xác nhận release hoàn tất. Bằng chứng sau release được lưu riêng trong `.local-backups/release-verification.json`; không lưu mật khẩu/token hoặc lời nhắn trong tài liệu release.
