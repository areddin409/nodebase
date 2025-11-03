import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const loaderVariants = cva(
  "flex items-center justify-center w-full h-full min-h-[200px]",
  {
    variants: {
      variant: {
        default: "flex-col gap-3",
        inline: "flex-row gap-2 min-h-fit w-fit",
        overlay:
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex-col gap-3 min-h-screen",
        card: "bg-card border rounded-lg p-6 shadow-sm flex-col gap-3",
        minimal: "flex-row gap-2 min-h-fit w-fit",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
      },
      spinnerSize: {
        sm: "[&_svg]:size-4",
        default: "[&_svg]:size-6",
        lg: "[&_svg]:size-8",
        xl: "[&_svg]:size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      spinnerSize: "default",
    },
  }
);

const loaderTextVariants = cva(
  "font-medium text-muted-foreground animate-pulse",
  {
    variants: {
      variant: {
        default: "text-center",
        inline: "",
        overlay: "text-center",
        card: "text-center",
        minimal: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  text?: string;
  showText?: boolean;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      className,
      variant,
      size,
      spinnerSize,
      text = "Loading...",
      showText = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          loaderVariants({ variant, size, spinnerSize }),
          className
        )}
        {...props}
      >
        <Spinner className="text-primary" />
        {showText && (
          <span className={cn(loaderTextVariants({ variant }))}>{text}</span>
        )}
      </div>
    );
  }
);

Loader.displayName = "Loader";

export { Loader, loaderVariants };
