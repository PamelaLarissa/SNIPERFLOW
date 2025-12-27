import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline:
          "text-foreground border-border",
        verified:
          "border-transparent bg-accent/20 text-accent",
        pending:
          "border-transparent bg-pending/20 text-pending",
        failed:
          "border-transparent bg-destructive/20 text-destructive",
        score_high:
          "border-transparent bg-score-high/20 text-score-high font-semibold",
        score_medium:
          "border-transparent bg-score-medium/20 text-score-medium font-semibold",
        score_low:
          "border-transparent bg-score-low/20 text-score-low font-semibold",
        glow:
          "border-primary/30 bg-primary/10 text-primary shadow-sm shadow-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
