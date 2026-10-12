# Lời chúc dạng thư và xuất danh sách tham dự

Ngày: 12/10/2026. Trạng thái: người dùng đã duyệt thiết kế; lập kế hoạch triển khai.

## Mục tiêu và phạm vi

Hoàn tất sáu yêu cầu về lời chúc, kiểm thử chức năng và bảo mật, dọn dữ liệu thử trên Supabase, sau đó push/deploy Vercel. Giữ các thay đổi giao diện local đã được duyệt: ảnh bìa trên cùng, navbar trên ảnh, thông tin trên ảnh, handsign navy và phần graduation cao tối thiểu một màn hình.

Không thêm đăng ký tài khoản cho khách, sửa/xoá lời chúc qua trang admin, gửi email, hoặc làm lại giao diện ngoài phạm vi này.

## Hiện trạng đã kiểm tra

- React/Vite, TanStack Router; Supabase project `jvbdzzidmnzxqhfyyvqv`.
- `ContactForm` lưu qua RPC `submit_rsvp`, rồi gửi thông báo qua EmailJS.
- `get_public_rsvps` hiện trả tên, trạng thái tham dự và ngày gửi, chưa trả lời nhắn.
- `public.rsvps` lưu lời nhắn cùng tên, email, mối quan hệ và trạng thái tham dự; đang bật RLS.
- Tại thời điểm khảo sát có hai bản ghi, cả hai có lời nhắn, chưa có tài khoản Supabase Auth và không có trigger gửi email trên bảng.
- Có 17 test đang đạt; type-check có năm lỗi thiếu trường `images` ở route kỷ niệm.

## 1. Form gửi lời chúc

Giữ tên, mối quan hệ, email, lựa chọn Có/Không tham dự và lời nhắn. Bỏ hoàn toàn việc gửi email tự động và dependency EmailJS nếu không còn nơi sử dụng.

Giữ validation, chặn gửi lặp trong lúc đang lưu và xử lý email trùng/lỗi mạng. Chỉ hiện thành công và reset form sau khi Supabase lưu thành công; khi thất bại giữ nội dung để khách thử lại. Vẫn phát sự kiện làm mới danh sách phản hồi sau khi lưu.

Thêm thông báo ngắn trước khi gửi: tên và lời chúc sẽ hiển thị công khai; email và lựa chọn tham dự không công khai.

## 2. Popup chung và pháo giấy

Mọi lựa chọn tham dự dùng cùng một dialog, không phân nhánh Có/Không và không còn hiệu ứng mưa icon. Nội dung phải đúng nguyên văn, gồm hai đoạn:

> Gửi lời chúc thành công
>
> Cảm ơn Thầy Cô anh chị em bạn dì cô chú đã cùng đồng hành, hỗ trợ và chở che con/em trong suốt hành trình thanh xuân vừa qua để hôm nay có một phiên bản trưởng thành, vững vàng và rực rỡ nhất <3.

Giữ chuỗi `<3.` dạng chữ, không thay thành emoji. Dùng canvas-confetti hiện có, canvas trong top layer của dialog. Pháo giấy chỉ bắn sau khi lưu thành công, dọn animation khi đóng. Tôn trọng reduced-motion; người bật chế độ này vẫn nhận đầy đủ thông báo nhưng không bị hiệu ứng chuyển động ép buộc.

Dialog hỗ trợ Escape, nút đóng, focus và nội dung dài trên mobile.

## 3. Phản hồi dạng phong thư

Giữ lưới responsive và các trạng thái tải/rỗng/lỗi/thử lại hiện có. Mỗi card là phong thư tông trắng/xanh pastel, có người gửi và người nhận Minh Quân. Không có badge, chữ, màu hay thuộc tính UI tiết lộ Có/Không tham dự.

Khách bấm nút mở thư để xem nguyên lời nhắn trong dialog. Hỗ trợ bàn phím, Escape, nút đóng và trả focus về phong thư vừa mở. Render nội dung như text bằng React, giữ xuống dòng và cho chuỗi dài xuống hàng; không dùng HTML từ lời nhắn. Hiệu ứng mở nhẹ, không ảnh hưởng reduced-motion.

## 4. Hợp đồng dữ liệu công khai và riêng tư

- Dữ liệu công khai chỉ gồm ID ổn định, tên, lời nhắn và ngày gửi. Không trả email hoặc trạng thái tham dự trong API công khai, không chỉ ẩn chúng bằng CSS.
- Thêm cờ cho phép công khai lời nhắn, mặc định false cho bản ghi cũ. Luồng mới đặt true sau thông báo công khai trong form; các lời nhắn cũ không tự động bị đưa ra công khai.
- Giữ RPC gửi của bản frontend cũ hoạt động trong quá trình chuyển phiên bản, nhưng không tự đánh dấu lời nhắn từ luồng cũ là công khai.
- Table gốc tiếp tục được bảo vệ bằng RLS và không được mở quyền SELECT trực tiếp cho khách.
- Các helper có quyền đọc bảng riêng đặt trong schema không expose qua Data API, `search_path` cố định, quyền EXECUTE được cấp rõ ràng. Public RPC làm facade với SECURITY INVOKER; helper admin kiểm tra `auth.uid()` trong database trước khi đọc.
- Admin export chỉ đọc ID, tên, mối quan hệ, trạng thái tham dự và ngày gửi. Không xuất email hoặc lời nhắn vì không cần cho yêu cầu này.

## 5. Trang admin và tài khoản

Route `/admin`, không có link trong navbar/footer/sitemap. Route có `noindex`; đường dẫn ẩn không được coi là biện pháp bảo mật.

Form đăng nhập dùng username `admin` và mật khẩu người dùng đã cung cấp. Supabase Auth thực hiện xác thực mật khẩu; tuyệt đối không so sánh mật khẩu trong JavaScript hoặc lưu nó trong repo, tài liệu, log hay biến VITE.

Vì Supabase đăng nhập bằng email/password, username `admin` ánh xạ tới danh tính nội bộ `admin@lhmq.invalid`. Tạo tài khoản qua Admin API trong môi trường công cụ tin cậy hoặc Supabase Dashboard, xác nhận tài khoản khi tạo và không gửi thư mời/email. Alias này không dùng cho nhận email hoặc khôi phục mật khẩu; chủ trang có thể đổi mật khẩu qua Supabase Dashboard.

Quyền admin gắn với UUID tài khoản đã được cấp trong danh sách cho phép thuộc schema private. Không tin username ở client hoặc user metadata để cấp quyền. Tài khoản khác dù đăng nhập thành công vẫn không được đọc hoặc xuất danh sách. Danh sách cho phép chỉ quản lý qua môi trường quản trị, không qua website.

Tái sử dụng Supabase client với session chỉ trong bộ nhớ, không localStorage; đăng xuất/hết phiên xoá quyền truy cập ở UI. Reload cần đăng nhập lại. Database kiểm tra quyền ở từng lần lấy dữ liệu, kể cả khi người dùng gọi RPC trực tiếp.

Giao diện admin tối thiểu: đăng nhập, tải Excel, trạng thái tải/lỗi và đăng xuất. Không thêm quản lý nhiều tài khoản, dashboard thống kê hoặc chức năng quên mật khẩu qua email.

## 6. File Excel

Xuất file `.xlsx` thật, một sheet `Danh sách tham dự`, các cột: Họ tên, Mối quan hệ, Tham dự, Ngày gửi. Hiển thị Có tham dự/Không tham dự bằng tiếng Việt. Không đoán giá trị trạng thái không hợp lệ thành Không tham dự.

Lấy đầy đủ danh sách đã được cấp quyền, không âm thầm dừng ở giới hạn số dòng của API. Khi chưa có bản ghi, vẫn xuất file có header và không tạo khách giả.

Dùng thư viện Excel chuyên dụng, tải động chỉ khi admin xuất file; không đưa phần tạo workbook vào bundle công khai ban đầu. Kiểm tra phiên bản và dependency trước khi cài. Tên/mối quan hệ được ghi như ô text, không được diễn giải thành công thức khi bắt đầu bằng `=`, `+`, `-` hoặc `@`. Ngày gửi hiển thị theo múi giờ Việt Nam.

## 7. Kiểm thử và tiêu chí hoàn thành

- Cả Có/Không tham dự đều lưu đúng, nhận popup đúng nguyên văn và cùng hiệu ứng pháo giấy; không có request gửi EmailJS.
- Input thiếu/trạng thái không hợp lệ/email trùng/lỗi mạng không hiện thành công và không mất lời nhắn.
- Phong thư mở/đóng được bằng chuột và bàn phím; nội dung dài, xuống dòng và chuỗi giống HTML không gây XSS.
- API công khai không có email/trạng thái tham dự; lời nhắn cũ chưa cho phép công khai không xuất hiện.
- Chưa đăng nhập, mật khẩu sai, tài khoản không phải admin và gọi RPC trực tiếp không được lấy dữ liệu riêng.
- Admin đúng tài khoản tải được workbook; đọc lại file xác nhận đủ dòng, đúng trạng thái, tiếng Việt, ngày giờ và dữ liệu giống công thức vẫn là text. Kiểm tra cả file rỗng và danh sách vượt một trang API.
- Logout/hết phiên mất quyền tải; menu/navbar, phần invitation và graduation vẫn hoạt động.
- Chạy toàn bộ test, build, lint các file thay đổi, type-check và audit dependency. Sửa tối thiểu contract `images` đang gây năm lỗi type-check, giữ nguyên cách hiển thị kỷ niệm; không refactor ngoài phạm vi.
- Kiểm tra browser desktop/mobile, reduced-motion, console/network và Supabase advisors. Không ghi mật khẩu/token vào output kiểm thử.

## 8. Dọn dữ liệu và phát hành

Chỉ dọn sau khi các kiểm tra chức năng, quyền và workbook đã đạt. Ghi nhận ID hai lời chúc cũ và ID các bản ghi do phiên kiểm thử tạo; sao lưu chúng vào bản local riêng tư, ngoài Git và ngoài public assets. Kiểm tra backup có đủ dữ liệu trước khi xoá.

Xoá đúng các ID đã ghi nhận, gồm cả trạng thái tham dự của những bản ghi đó. Không dùng TRUNCATE, không xoá tài khoản admin, bảng hoặc phản hồi thật mới được gửi trong lúc triển khai. Xác nhận các ID đã xoá không còn trên database, UI và export.

Giữ mốc source/deployment production hiện tại để rollback. Chỉ push các thay đổi đúng phạm vi; chờ Vercel READY và kiểm tra alias production đúng commit. Kiểm tra lần cuối luồng công khai, đăng nhập admin và xuất workbook trên production; dọn riêng dữ liệu test production nếu có. Không gửi lại email tự động khi rollback/migration.

Rollback code không tự khôi phục dữ liệu đã xoá; bản sao lưu riêng dùng khi cần phục hồi. Không tự revert migration làm lộ lại trạng thái tham dự hoặc quyền admin.

## Căn cứ kỹ thuật

- [Supabase password sign-in](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- [Supabase admin createUser](https://supabase.com/docs/reference/javascript/auth-admin-createuser)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [ExcelJS workbook documentation](https://github.com/exceljs/exceljs)
