"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface WorkflowNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

/**
 * Render a workflow node with optional top toolbar and an optional bottom label area.
 *
 * @param children - Content to render inside the node
 * @param showToolbar - Whether to display the top toolbar (defaults to `true`)
 * @param onDelete - Callback invoked when the delete button is pressed
 * @param onSettings - Callback invoked when the settings button is pressed
 * @param name - Optional name displayed in a bottom toolbar
 * @param description - Optional description displayed under the name
 * @returns A JSX element representing the workflow node UI
 */
export function WorkflowNode({
  children,
  showToolbar = true,
  onDelete,
  onSettings,
  name,
  description,
}: WorkflowNodeProps) {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            aria-label="Open settings"
            title="Open settings"
          >
            <SettingsIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            aria-label="Delete node"
            title="Delete node"
          >
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-[200px] text-center"
        >
          <p className="font-medium">{name}</p>
          {description && (
            <p className="text-sm truncate text-muted-foreground">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
}