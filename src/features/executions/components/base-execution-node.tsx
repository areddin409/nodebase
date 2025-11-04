"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useState } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";
import ConfirmDelete from "@/components/confirm-delete";
import {
  NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    status = "initial",
    children,
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    /**
     * Handles the actual deletion of the node and its connections
     * after user confirmation in the alert dialog.
     */
    const handleConfirmedDelete = () => {
      setNodes(currentNodes => {
        const updatedNodes = currentNodes.filter(node => node.id !== id);
        return updatedNodes;
      });

      setEdges(currentEdges => {
        const updatedEdges = currentEdges.filter(
          edge => edge.source !== id && edge.target !== id
        );
        return updatedEdges;
      });

      setShowDeleteDialog(false);
    };

    /**
     * Initiates the delete process by showing the confirmation dialog
     */
    const handleDelete = () => {
      setShowDeleteDialog(true);
    };
    return (
      <>
        <WorkflowNode
          name={name}
          description={description}
          onDelete={handleDelete}
          onSettings={onSettings}
        >
          <NodeStatusIndicator status={status} variant="border">
            <BaseNode status={status} onDoubleClick={onDoubleClick}>
              <BaseNodeContent>
                {typeof Icon === "string" ? (
                  <Image src={Icon} alt={`${name}`} width={16} height={16} />
                ) : (
                  <Icon className="size-4 text-muted-foreground" />
                )}
                {children}
                <BaseHandle
                  id="target-1"
                  type="target"
                  position={Position.Left}
                />
                <BaseHandle
                  id="source-1"
                  type="source"
                  position={Position.Right}
                />
              </BaseNodeContent>
            </BaseNode>
          </NodeStatusIndicator>
        </WorkflowNode>

        {/* Delete Confirmation Dialog */}
        <ConfirmDelete
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          itemName={name}
          itemType="node"
          description="This action cannot be undone and will also remove all connections to this node."
          onConfirm={handleConfirmedDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </>
    );
  }
);

BaseExecutionNode.displayName = "BaseExecutionNode";
