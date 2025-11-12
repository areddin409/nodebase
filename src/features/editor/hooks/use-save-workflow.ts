import { useAtomValue } from "jotai";
import { useUpdateWorkflow } from "@/features/workflows/hooks/use-workflows";
import { editorAtom } from "../store/atoms";

/**
 * Reusable hook to save workflow changes from React Flow editor.
 * Extracts nodes and edges from the editor instance and saves to the backend.
 *
 * @param workflowId - The ID of the workflow to save
 * @returns Object with save function and mutation state
 *
 * @example
 * ```tsx
 * const { save, isPending } = useSaveWorkflow(workflowId);
 *
 * const handleSave = () => {
 *   save();
 * };
 * ```
 */
export const useSaveWorkflow = (workflowId: string) => {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();

  const save = () => {
    if (!editor) {
      console.error("Editor instance not available");
      throw new Error("Editor instance not available");
    }

    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    saveWorkflow.mutate({ id: workflowId, nodes, edges });
  };

  return {
    save,
    isPending: saveWorkflow.isPending,
    isSuccess: saveWorkflow.isSuccess,
    isError: saveWorkflow.isError,
    error: saveWorkflow.error,
  };
};
