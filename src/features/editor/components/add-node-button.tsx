"use client";

import { PlusIcon } from "lucide-react";
import { memo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NodeSelector } from "@/components/node-selector";

export const AddNodeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button size="icon" variant={"outline"} className="bg-background">
        <PlusIcon />
      </Button>
    );
  }

  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button size="icon" variant={"outline"} className="bg-background">
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
