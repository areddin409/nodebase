import { type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type NodeStatus = "loading" | "success" | "error" | "initial";

export type NodeStatusVariant = "overlay" | "border";

export type NodeStatusIndicatorProps = {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  children: ReactNode;
  className?: string;
};

export const SpinnerLoadingIndicator = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="relative">
      <StatusBorder className="border-blue-500/40 dark:border-blue-400/50">
        {children}
      </StatusBorder>

      <div className="absolute inset-0 z-50 rounded-[7px] bg-background/50 backdrop-blur-sm" />
      <div className="absolute inset-0 z-50">
        <span className="absolute left-[calc(50%-1.25rem)] top-[calc(50%-1.25rem)] inline-block h-10 w-10 animate-ping rounded-full bg-blue-500/20 dark:bg-blue-400/30" />

        <LoaderCircle className="absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)] size-6 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    </div>
  );
};

export const BorderLoadingIndicator = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className="absolute -left-[2px] -top-[2px] h-[calc(100%+4px)] w-[calc(100%+4px)]">
        <style>
          {`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .spinner {
          animation: spin 2s linear infinite;
          position: absolute;
          left: 50%;
          top: 50%;
          width: 140%;
          aspect-ratio: 1;
          transform-origin: center;
        }
      `}
        </style>
        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-sm",
            className
          )}
        >
          <div className="spinner rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(59,130,246,0.6)_0deg,rgba(59,130,246,0)_360deg)] dark:bg-[conic-gradient(from_0deg_at_50%_50%,rgba(96,165,250,0.7)_0deg,rgba(96,165,250,0)_360deg)]" />
        </div>
      </div>
      {children}
    </>
  );
};

const StatusBorder = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div
        className={cn(
          "absolute -left-[2px] -top-[2px] h-[calc(100%+4px)] w-[calc(100%+4px)] rounded-md border-3",
          className
        )}
      />
      {children}
    </>
  );
};

export const NodeStatusIndicator = ({
  status,
  variant = "border",
  children,
  className,
}: NodeStatusIndicatorProps) => {
  switch (status) {
    case "loading":
      switch (variant) {
        case "overlay":
          return <SpinnerLoadingIndicator>{children}</SpinnerLoadingIndicator>;
        case "border":
          return (
            <BorderLoadingIndicator className={className}>
              {children}
            </BorderLoadingIndicator>
          );
        default:
          return <>{children}</>;
      }
    case "success":
      return (
        <StatusBorder
          className={cn(
            "border-green-600/60 dark:border-green-400/70",
            className
          )}
        >
          {children}
        </StatusBorder>
      );
    case "error":
      return (
        <StatusBorder
          className={cn("border-red-600/60 dark:border-red-400/70", className)}
        >
          {children}
        </StatusBorder>
      );
    default:
      return <>{children}</>;
  }
};
