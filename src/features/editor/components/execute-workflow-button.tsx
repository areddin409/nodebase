import { Button } from "@/components/ui/button";
import {
  useExecuteWorkflow,
  useUpdateWorkflow,
} from "@/features/workflows/hooks/use-workflows";
import { useAtomValue } from "jotai";
import { FlaskConicalIcon } from "lucide-react";
import { editorAtom } from "../store/atoms";

export const ExecutionWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();

  const handleExecute = () => {
    if (!editor) return;

    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    saveWorkflow.mutate(
      { id: workflowId, nodes, edges },
      {
        onSuccess: () => {
          executeWorkflow.mutate({ id: workflowId });
        },
      }
    );
  };

  return (
    <Button
      size={"lg"}
      onClick={handleExecute}
      disabled={executeWorkflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};
