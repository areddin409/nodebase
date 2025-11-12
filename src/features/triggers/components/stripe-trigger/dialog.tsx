"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";
import { useSaveWorkflow } from "@/features/editor/hooks/use-save-workflow";
import { STRIPE_EVENTS } from "@/config/constants";

interface Props {
  nodeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({ nodeId, open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params?.workflowId as string;
  const { getNode, setNodes } = useReactFlow();
  const node = getNode(nodeId);
  const { save } = useSaveWorkflow(workflowId);

  const [selectedEvent, setSelectedEvent] = useState<string>(
    (node?.data?.eventType as string) || "payment_intent.succeeded"
  );

  // Construct webhook URL with event type
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}&eventType=${selectedEvent}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy webhook URL");
    }
  };

  const handleSave = () => {
    // Update node data locally
    setNodes(nodes =>
      nodes.map(n =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, eventType: selectedEvent } }
          : n
      )
    );
    // Save workflow to backend
    save();

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Select which Stripe event should trigger this workflow. The webhook
            URL will automatically filter for your selected event.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="event-type">Event Type</Label>
            <div className="flex flex-col gap-2">
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger id="event-type" className="flex-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STRIPE_EVENTS.map(event => (
                    <SelectItem key={event.value} value={event.value}>
                      {event.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                onClick={copyToClipboard}
                size="icon"
                variant="outline"
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This URL includes your selected event type and will only trigger
              for {selectedEvent} events.
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup Instructions:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Save your event selection below</li>
              <li>Copy the webhook URL</li>
              <li>Open your Stripe Dashboard</li>
              <li>Go to Developers → Webhooks</li>
              <li>Click "Add endpoint"</li>
              <li>Paste the webhook URL</li>
              <li>Select "{selectedEvent}" as the event to listen for</li>
              <li>Save the webhook</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.eventType}}"}
                </code>
                - Event type (e.g., {selectedEvent})
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.eventId}}"}
                </code>
                - Unique event ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.raw.amount}}"}
                </code>
                - Payment amount (if applicable)
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.raw.customer}}"}
                </code>
                - Customer ID (if applicable)
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json stripe.raw}}"}
                </code>
                - Full event data as JSON
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
