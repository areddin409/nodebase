"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, useState, type ReactNode } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";
import ConfirmDelete from "@/components/confirm-delete";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  // status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
  }: BaseTriggerNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
          {/* TODO: Wrap within NodeStatusIndicator */}
          <BaseNode
            onDoubleClick={onDoubleClick}
            className="rounded-l-2xl relative group"
          >
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} alt={`${name}`} width={16} height={16} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </WorkflowNode>

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

BaseTriggerNode.displayName = "BaseTriggerNode";
