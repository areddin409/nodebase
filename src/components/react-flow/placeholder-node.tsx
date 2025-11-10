"use client";

import React, { forwardRef, type ReactNode } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

import { BaseNode } from "./base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onClick?: () => void;
};

export const PlaceholderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(
  ({ children, onClick }, ref) => {
    return (
      <BaseNode
        ref={ref}
        className="w-auto h-auto border-dashed border-muted-foreground bg-background p-4 text-center text-muted-foreground shadow-none cursor-pointer hover:border-muted-foreground hover:bg-muted dark:border-muted-foreground dark:bg-background dark:hover:border-muted-foreground dark:hover:bg-muted transition-colors duration-200 ease-in-out"
        onClick={onClick}
      >
        {children}
        <Handle
          type="target"
          style={{ visibility: "hidden" }}
          position={Position.Top}
          isConnectable={false}
        />
        <Handle
          type="source"
          style={{ visibility: "hidden" }}
          position={Position.Bottom}
          isConnectable={false}
        />
      </BaseNode>
    );
  }
);

PlaceholderNode.displayName = "PlaceholderNode";
