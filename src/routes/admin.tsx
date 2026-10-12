import { createFileRoute, HeadContent } from "@tanstack/react-router";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Quản trị tham dự | Minh Quân" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <>
      <HeadContent />
      <AdminPanel />
    </>
  );
}
