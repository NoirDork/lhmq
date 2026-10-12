import type { AdminGuest } from "./admin-rsvps";

export async function buildAttendanceWorkbook(rows: AdminGuest[]): Promise<ArrayBuffer> {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Danh sách tham dự");
  sheet.columns = [
    { header: "Họ tên", width: 30 },
    { header: "Mối quan hệ", width: 24 },
    { header: "Tham dự", width: 22 },
    { header: "Ngày gửi", width: 24 },
  ];
  const dateFormat = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const attendance: Record<string, string> = {
    Attending: "Có tham dự",
    "Not Attending": "Không tham dự",
    Maybe: "Có thể",
  };
  for (const row of rows) {
    if (!Object.hasOwn(attendance, row.attending_status))
      throw new Error("Trạng thái tham dự không hợp lệ.");
    const date = new Date(row.created_at);
    if (Number.isNaN(date.getTime())) throw new Error("Ngày gửi không hợp lệ.");
    sheet.addRow([
      row.guest_name,
      row.relationship,
      attendance[row.attending_status],
      dateFormat.format(date),
    ]);
  }
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  const bytes = await workbook.xlsx.writeBuffer();
  return Uint8Array.from(new Uint8Array(bytes)).buffer;
}
