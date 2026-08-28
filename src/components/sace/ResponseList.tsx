import { Download, Eye, Inbox, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadResponsePdf } from "@/lib/pdf";
import { formatDate, formatDateTime } from "@/lib/sace";
import type { ResponseRecord } from "@/lib/sace";

interface ResponseListProps {
  records: ResponseRecord[];
  onView: (record: ResponseRecord) => void;
}

export function ResponseList({ records, onView }: ResponseListProps) {
  const [pending, setPending] = useState<string | null>(null);

  async function handlePdf(record: ResponseRecord) {
    if (pending) return;
    setPending(record.id);
    try {
      await downloadResponsePdf(record);
      toast.success(`PDF ready for ${record.name}`);
    } catch {
      toast.error("Unable to generate the PDF right now. Please try again.");
    } finally {
      setPending(null);
    }
  }

  if (records.length === 0) {
    return (
      <div className="surface-card flex flex-col items-center px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary">
          <Inbox className="size-6 text-primary" aria-hidden />
        </span>
        <h3 className="mt-5 text-lg font-semibold text-foreground">No responses yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Student responses submitted through the SACE QR form will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="surface-card hidden overflow-hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/60">
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>College</TableHead>
              <TableHead>Program</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(record.submitted_at)}
                </TableCell>
                <TableCell className="font-medium">
                  {record.name}
                  {record.is_demo ? (
                    <Badge variant="outline" className="ml-2 text-[10px]">
                      Demo
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell className="whitespace-nowrap">{record.phone_whatsapp}</TableCell>
                <TableCell className="max-w-[200px] truncate">{record.email}</TableCell>
                <TableCell className="max-w-[180px] truncate">{record.college}</TableCell>
                <TableCell>
                  <Badge
                    variant={record.program_type === "Internship Program" ? "default" : "secondary"}
                  >
                    {record.program_type.replace(" Program", "")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => onView(record)}>
                      <Eye className="mr-1.5 size-3.5" aria-hidden />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={pending === record.id}
                      onClick={() => handlePdf(record)}
                    >
                      {pending === record.id ? (
                        <Loader2 className="mr-1.5 size-3.5 animate-spin" aria-hidden />
                      ) : (
                        <Download className="mr-1.5 size-3.5" aria-hidden />
                      )}
                      PDF
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile / tablet cards */}
      <ul className="space-y-3 lg:hidden">
        {records.map((record) => (
          <li key={record.id} className="surface-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{record.name}</p>
                <p className="truncate text-xs text-muted-foreground">{record.college}</p>
              </div>
              <Badge
                variant={record.program_type === "Internship Program" ? "default" : "secondary"}
                className="shrink-0"
              >
                {record.program_type.replace(" Program", "")}
              </Badge>
            </div>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="truncate">{record.phone_whatsapp}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="truncate">{record.email}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Submitted</dt>
                <dd>{formatDateTime(record.submitted_at)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => onView(record)}>
                <Eye className="mr-1.5 size-3.5" aria-hidden />
                View
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="flex-1"
                disabled={pending === record.id}
                onClick={() => handlePdf(record)}
              >
                {pending === record.id ? (
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" aria-hidden />
                ) : (
                  <Download className="mr-1.5 size-3.5" aria-hidden />
                )}
                PDF
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
