// @vitest-environment node
import ExcelJS from "exceljs";
import { expect, it } from "vitest";
import type { AdminGuest } from "../admin-rsvps";
import { buildAttendanceWorkbook } from "../attendance-export";
const row: AdminGuest = {
  id: 1,
  guest_name: "Lâm Hồng Minh Quân",
  relationship: "Bạn bè",
  attending_status: "Attending",
  created_at: "2026-10-11T17:30:00Z",
};
async function read(rows: AdminGuest[]) {
  const bytes = await buildAttendanceWorkbook(rows);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(bytes);
  return workbook.getWorksheet("Danh sách tham dự")!;
}
it("exports Unicode, both attendance choices and Vietnam time in a real workbook", async () => {
  const sheet = await read([row, { ...row, id: 2, attending_status: "Not Attending" }]);
  expect(sheet.rowCount).toBe(3);
  expect(sheet.getCell("A2").value).toBe("Lâm Hồng Minh Quân");
  expect(sheet.getCell("C2").value).toBe("Có tham dự");
  expect(sheet.getCell("C3").value).toBe("Không tham dự");
  expect(sheet.getCell("D2").value).toContain("12/10/2026");
  expect(sheet.getCell("D2").value).toContain("00:30");
});
it("writes formula-like names and relationships as text, not formulas", async () => {
  const sheet = await read(
    ["=", "+", "-", "@"].map((prefix, index) => ({
      ...row,
      id: index + 1,
      guest_name: `${prefix}SUM(1,2)`,
      relationship: `${prefix}Bạn bè`,
    })),
  );
  for (let i = 2; i <= 5; i++) {
    expect(sheet.getCell(`A${i}`).type).toBe(ExcelJS.ValueType.String);
    expect(sheet.getCell(`B${i}`).type).toBe(ExcelJS.ValueType.String);
  }
  expect(sheet.getCell("A2").value).toBe("=SUM(1,2)");
});
it("exports headers only for an empty list without private extra columns", async () => {
  const sheet = await read([]);
  expect(sheet.rowCount).toBe(1);
  expect(sheet.getRow(1).values).toEqual([
    undefined,
    "Họ tên",
    "Mối quan hệ",
    "Tham dự",
    "Ngày gửi",
  ]);
  expect(sheet.columnCount).toBe(4);
});
it("exports every row beyond the usual 1000-row API cap", async () => {
  const sheet = await read(
    Array.from({ length: 1005 }, (_, i) => ({ ...row, id: i + 1, guest_name: `Khách ${i + 1}` })),
  );
  expect(sheet.rowCount).toBe(1006);
  expect(sheet.getCell("A1006").value).toBe("Khách 1005");
});
it.each(["Unknown", "toString", "__proto__"])(
  "rejects status %s rather than guessing no attendance",
  async (status) => {
    await expect(buildAttendanceWorkbook([{ ...row, attending_status: status }])).rejects.toThrow(
      "Trạng thái tham dự không hợp lệ.",
    );
  },
);
it("rejects an invalid date and accurately preserves a legacy Maybe", async () => {
  await expect(buildAttendanceWorkbook([{ ...row, created_at: "broken" }])).rejects.toThrow(
    "Ngày gửi không hợp lệ.",
  );
  expect((await read([{ ...row, attending_status: "Maybe" }])).getCell("C2").value).toBe("Có thể");
});
