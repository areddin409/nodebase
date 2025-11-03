import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteProps {
  /**
   * Controls whether the dialog is open or closed
   */
  open: boolean;

  /**
   * Callback fired when the dialog state should change
   */
  onOpenChange: (open: boolean) => void;

  /**
   * The name/title of the item being deleted (e.g., node name, workflow name)
   */
  itemName: string;

  /**
   * The type of item being deleted (e.g., "node", "workflow", "connection")
   * @default "item"
   */
  itemType?: string;

  /**
   * Optional additional description or warning text
   */
  description?: string;

  /**
   * Callback fired when the user confirms the deletion
   */
  onConfirm: () => void;

  /**
   * Callback fired when the user cancels the deletion
   */
  onCancel?: () => void;

  /**
   * Custom text for the confirm button
   * @default "Delete"
   */
  confirmText?: string;

  /**
   * Custom text for the cancel button
   * @default "Cancel"
   */
  cancelText?: string;

  /**
   * Whether the deletion is destructive/dangerous
   * @default true
   */
  destructive?: boolean;
}

/**
 * Reusable confirmation dialog for delete operations
 *
 * This component provides a consistent delete confirmation experience
 * across the application with customizable messaging and callbacks.
 *
 * @example
 * ```tsx
 * <ConfirmDelete
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   itemName="HTTP Request Node"
 *   itemType="node"
 *   description="This action cannot be undone and will also remove all connections."
 *   onConfirm={() => handleDelete()}
 *   onCancel={() => setShowDialog(false)}
 * />
 * ```
 */
const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  open,
  onOpenChange,
  itemName,
  itemType = "item",
  description,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  destructive = true,
}) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{itemName}"?
            {description && <> {description}</>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : undefined
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDelete;
