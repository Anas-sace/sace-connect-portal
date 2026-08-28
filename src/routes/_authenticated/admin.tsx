import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ChevronLeft, ChevronRight, Loader2, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DashboardStats } from "@/components/sace/DashboardStats";
import { ResponseDetailsModal } from "@/components/sace/ResponseDetailsModal";
import { ResponseFilters, type FiltersState } from "@/components/sace/ResponseFilters";
import { ResponseList } from "@/components/sace/ResponseList";
import { SaceLogo } from "@/components/sace/SaceLogo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { downloadAllResponsesPdf } from "@/lib/pdf";
import type { ResponseRecord } from "@/lib/sace";

const PAGE_SIZE = 25;

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "SACE Response Management Dashboard" },
      { name: "description", content: "Internal SACE dashboard for managing student responses." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "SACE Response Management Dashboard" },
      { property: "og:description", content: "Internal SACE response management system." },
    ],
  }),
  component: AdminDashboard,
});

async function fetchResponses(): Promise<ResponseRecord[]> {
  const { data, error } = await supabase
    .from("responses")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ResponseRecord[];
}

function AdminDashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["responses"],
    queryFn: fetchResponses,
  });

  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    program: "all",
    college: "all",
    from: "",
    to: "",
    sort: "newest",
  });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ResponseRecord | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel("responses-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "responses" }, () => {
        queryClient.invalidateQueries({ queryKey: ["responses"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const records = useMemo(() => data ?? [], [data]);

  const colleges = useMemo(
    () => Array.from(new Set(records.map((r) => r.college))).sort((a, b) => a.localeCompare(b)),
    [records],
  );

  const filtered = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const fromTime = filters.from ? new Date(`${filters.from}T00:00:00`).getTime() : null;
    const toTime = filters.to ? new Date(`${filters.to}T23:59:59.999`).getTime() : null;

    const result = records.filter((r) => {
      if (filters.program !== "all" && r.program_type !== filters.program) return false;
      if (filters.college !== "all" && r.college !== filters.college) return false;
      const time = new Date(r.submitted_at).getTime();
      if (fromTime !== null && time < fromTime) return false;
      if (toTime !== null && time > toTime) return false;
      if (term) {
        const haystack = `${r.name} ${r.phone_whatsapp} ${r.email} ${r.college}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      const diff = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
      return filters.sort === "newest" ? -diff : diff;
    });
    return result;
  }, [records, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRecords = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = useMemo(
    () => ({
      total: records.length,
      internship: records.filter((r) => r.program_type === "Internship Program").length,
      immersion: records.filter((r) => r.program_type === "Immersion Program").length,
      colleges: colleges.length,
    }),
    [records, colleges],
  );

  function updateFilters(patch: Partial<FiltersState>) {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }

  async function handleRefresh() {
    await refetch();
    toast.success("Responses updated");
  }

  async function handleExport() {
    if (exporting) return;
    if (filtered.length === 0) {
      toast.error("No responses available for export.");
      return;
    }
    setExporting(true);
    try {
      await downloadAllResponsesPdf(filtered);
      toast.success(`Exported ${filtered.length} response${filtered.length === 1 ? "" : "s"}`);
    } catch {
      toast.error("Unable to generate the PDF right now. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  async function handleLogout() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    await navigate({ to: "/", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="brand-gradient sticky top-0 z-20 border-b border-primary-dark/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-primary-foreground px-2.5 py-1.5">
              <SaceLogo className="h-6 sm:h-7" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold text-primary-foreground sm:text-base">
                Response Management Dashboard
              </h1>
              <p className="truncate text-xs text-accent">{user?.email}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleLogout} className="self-start">
            <LogOut className="mr-2 size-4" aria-hidden />
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        {isError ? (
          <div className="surface-card flex flex-col items-center gap-4 px-6 py-14 text-center">
            <AlertTriangle className="size-8 text-destructive" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Something went wrong while loading responses. Please try again.
            </p>
            <Button onClick={() => refetch()}>Try again</Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        ) : (
          <>
            <DashboardStats {...stats} />

            <ResponseFilters
              filters={filters}
              colleges={colleges}
              refreshing={isFetching}
              exporting={exporting}
              onChange={updateFilters}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />

            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Showing {pageRecords.length} of {filtered.length} response
                {filtered.length === 1 ? "" : "s"}
              </p>
              {isFetching ? (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                  Syncing
                </span>
              ) : null}
            </div>

            <ResponseList records={pageRecords} onView={setSelected} />

            {totalPages > 1 ? (
              <nav
                aria-label="Pagination"
                className="flex items-center justify-center gap-3 pt-2"
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="mr-1 size-4" aria-hidden />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <ChevronRight className="ml-1 size-4" aria-hidden />
                </Button>
              </nav>
            ) : null}
          </>
        )}
      </main>

      <ResponseDetailsModal record={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
