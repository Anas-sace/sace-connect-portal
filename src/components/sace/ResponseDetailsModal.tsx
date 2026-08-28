import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { downloadResponsePdf } from "@/lib/pdf";
import { formatDateTime } from "@/lib/sace";
import type { ResponseRecord } from "@/lib/sace";

interface ResponseDetailsModalProps {
  record: ResponseRecord | null;
  onOpenChange: (open: boolean) => void;
}

export function ResponseDetailsModal({ record, onOpenChange }: ResponseDetailsModalProps) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    if (!record || busy) return;
    setBusy(true);
    try {
      await downloadResponsePdf(record);
      toast.success("PDF generated");
    } catch {
      toast.error("Unable to generate the PDF right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={Boolean(record)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">Response Details</DialogTitle>
          <DialogDescription>Submitted through the SACE QR enquiry form.</DialogDescription>
        </DialogHeader>

        {record ? (
          <div className="space-y-4">
            <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              <Row label="Program" value={record.program_type} />
              <Row label="Name" value={record.name} />
              <Row label="Phone Number (WhatsApp)" value={record.phone_whatsapp} />
              <Row label="Email" value={record.email} />
              <Row label="College" value={record.college} />
              <Row label="Submitted On" value={formatDateTime(record.submitted_at)} />
            </dl>
            <Button onClick={handleDownload} disabled={busy} className="w-full">
              {busy ? (
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              ) : (
                <Download className="mr-2 size-4" aria-hidden />
              )}
              Download PDF
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-0.5 bg-card px-4 py-3 sm:grid-cols-3 sm:gap-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground sm:col-span-2">{value}</dd>
    </div>
  );
}
