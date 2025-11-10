"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
} from "@xyflow/react";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

import "@xyflow/react/dist/style.css";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { useTheme } from "next-themes";
import { NodeType } from "@/generated/prisma";
import { ExecutionWorkflowButton } from "./execute-workflow-button";

/**
 * React Flow Visual Workflow Editor
 *
 * This component provides a comprehensive visual workflow editor built on top of React Flow.
 * It enables users to create, edit, and manage workflow automation through a drag-and-drop
 * interface with custom node types and real-time state management.
 *
 * Key Features:
 * - Visual workflow editing with React Flow (@xyflow/react)
 * - Real-time node and edge state management
 * - Custom node type registration system
 * - Global editor state management via Jotai atoms
 * - Snap-to-grid functionality for precise positioning
 * - Mini-map for navigation in large workflows
 * - Background controls and zoom functionality
 *
 * @see {@link https://reactflow.dev/} React Flow Documentation
 * @see {@link https://jotai.org/} Jotai State Management
 */

/**
 * Loading State Component for Editor
 *
 * Displays a loading indicator while the React Flow editor is initializing.
 * This component is shown during:
 * - Initial workflow data fetching
 * - React Flow library loading
 * - Node component registration
 *
 * @returns {JSX.Element} Loading view with appropriate message
 * @see {@link https://reactflow.dev/learn/troubleshooting/ssr} React Flow SSR Considerations
 */
export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

/**
 * Error State Component for Editor
 *
 * Displays an error message when the React Flow editor fails to load.
 * Common scenarios include:
 * - Workflow data fetch failures
 * - Invalid node/edge data structures
 * - React Flow initialization errors
 * - Missing required props or configuration
 *
 * @returns {JSX.Element} Error view with appropriate message
 * @see {@link https://reactflow.dev/learn/troubleshooting} React Flow Troubleshooting
 */
export const EditorError = () => {
  return <ErrorView message="Failed to load editor." />;
};

/**
 * Main Visual Workflow Editor Component
 *
 * A comprehensive React Flow-based workflow editor that provides visual editing
 * capabilities for workflow automation. This component manages the complete
 * editor state and handles all user interactions with the workflow canvas.
 *
 * Architecture:
 * - Uses React Flow (@xyflow/react) for the visual editing interface
 * - Manages local state for nodes and edges with React hooks
 * - Integrates with global Jotai atoms for editor instance management
 * - Fetches workflow data via tRPC with Suspense for optimal loading states
 *
 * Key Capabilities:
 * - Visual node placement and connection management
 * - Real-time edge creation between workflow nodes
 * - Snap-to-grid positioning for precise alignment
 * - Background pattern and zoom controls
 * - Mini-map for navigation in complex workflows
 * - Custom node type rendering via registered components
 * - Add node functionality via floating panel
 *
 * State Management Flow:
 * 1. Workflow data fetched via useSuspenseWorkflow (tRPC)
 * 2. Initial nodes/edges set from server data
 * 3. Local state updates managed by React Flow change handlers
 * 4. Editor instance stored in Jotai atom for global access
 *
 * @param {Object} props - Component props
 * @param {string} props.workflowId - Unique identifier for the workflow to edit
 * @returns {JSX.Element} The complete React Flow editor interface
 *
 * @see {@link https://reactflow.dev/api-reference/react-flow} ReactFlow Component API
 * @see {@link https://reactflow.dev/learn/concepts/core-concepts} React Flow Core Concepts
 * @see {@link https://reactflow.dev/examples/nodes/custom-node} Custom Node Examples
 * @see {@link https://jotai.org/docs/basics/primitives} Jotai Atoms
 * @see {@link https://tanstack.com/query/latest/docs/framework/react/guides/suspense} TanStack Query Suspense
 */
export const Editor = ({ workflowId }: { workflowId: string }) => {
  /**
   * Workflow Data Fetching
   *
   * Uses tRPC's useSuspenseWorkflow hook to fetch workflow data with Suspense integration.
   * This provides automatic loading states and error boundaries. The workflow data includes:
   * - Workflow metadata (name, created date, etc.)
   * - Nodes array (transformed from Prisma to React Flow format)
   * - Edges array (connections between nodes)
   *
   * Data transformation happens in the tRPC router (workflowsRouter.getOne)
   * where Prisma Connection models are converted to React Flow Edge format.
   *
   * @see {@link https://trpc.io/docs/client/react/suspense} tRPC Suspense Integration
   * @see {@link https://reactflow.dev/learn/concepts/core-concepts#nodes} React Flow Node Format
   * @see {@link https://reactflow.dev/learn/concepts/core-concepts#edges} React Flow Edge Format
   */
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const { resolvedTheme } = useTheme();

  // Hydration-safe theme state to prevent SSR/client mismatch
  const [mounted, setMounted] = useState(false);
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && resolvedTheme) {
      setColorMode(resolvedTheme === "dark" ? "dark" : "light");
    }
  }, [mounted, resolvedTheme]);

  /**
   * Global Editor State Management
   *
   * Sets the React Flow instance in a global Jotai atom for access across components.
   * This enables other parts of the application to programmatically interact with
   * the editor, such as:
   * - Adding nodes from external components
   * - Triggering layout algorithms
   * - Saving workflow state
   * - Implementing undo/redo functionality
   *
   * @see {@link https://jotai.org/docs/basics/primitives#usesetatom} Jotai useSetAtom
   * @see {@link https://reactflow.dev/api-reference/react-flow#on-init} React Flow onInit Callback
   */
  const setEditor = useSetAtom(editorAtom);

  /**
   * Local Editor State Management
   *
   * Manages the current state of nodes and edges in the React Flow editor.
   * This local state is initialized from the fetched workflow data and
   * updates in real-time as users interact with the editor.
   *
   * State Structure:
   * - nodes: Array of React Flow Node objects with position, type, and data
   * - edges: Array of React Flow Edge objects defining connections between nodes
   *
   * The state is kept local for performance reasons - React Flow handles
   * frequent updates internally, and we only sync to the server on explicit saves.
   *
   * @see {@link https://reactflow.dev/learn/concepts/core-concepts#controlled-or-uncontrolled} Controlled vs Uncontrolled Flow
   * @see {@link https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state} React useState Patterns
   */
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  /**
   * Node Change Handler
   *
   * Handles all node-related changes in the React Flow editor using the
   * applyNodeChanges utility from React Flow. This includes:
   * - Position changes (dragging nodes)
   * - Selection state changes
   * - Node removal
   * - Dimension updates
   * - Data property modifications
   *
   * Uses useCallback for performance optimization to prevent unnecessary
   * re-renders of child components that depend on this handler.
   *
   * @param {NodeChange[]} changes - Array of node change objects from React Flow
   * @see {@link https://reactflow.dev/api-reference/utils/apply-node-changes} applyNodeChanges API
   * @see {@link https://reactflow.dev/api-reference/types/node-change} NodeChange Types
   * @see {@link https://react.dev/reference/react/useCallback#optimizing-a-custom-hook} useCallback Optimization
   */
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes(nodesSnapshot => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  /**
   * Edge Change Handler
   *
   * Handles all edge-related changes in the React Flow editor using the
   * applyEdgeChanges utility. This includes:
   * - Edge removal (when user deletes connections)
   * - Selection state changes for edges
   * - Edge data modifications
   * - Style updates
   *
   * Similar to onNodesChange, this is memoized with useCallback to prevent
   * unnecessary re-renders and maintain optimal performance.
   *
   * @param {EdgeChange[]} changes - Array of edge change objects from React Flow
   * @see {@link https://reactflow.dev/api-reference/utils/apply-edge-changes} applyEdgeChanges API
   * @see {@link https://reactflow.dev/api-reference/types/edge-change} EdgeChange Types
   */
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges(edgesSnapshot => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  /**
   * Connection Handler
   *
   * Handles the creation of new connections (edges) between nodes when users
   * drag from one node handle to another. This uses React Flow's addEdge utility
   * to create properly formatted edge objects with:
   * - Source and target node IDs
   * - Source and target handle IDs
   * - Auto-generated unique edge ID
   * - Default styling and behavior
   *
   * The Connection object is automatically provided by React Flow when users
   * complete a connection gesture in the UI.
   *
   * @param {Connection} params - Connection parameters from React Flow drag interaction
   * @see {@link https://reactflow.dev/api-reference/utils/add-edge} addEdge API
   * @see {@link https://reactflow.dev/api-reference/types/connection} Connection Type
   * @see {@link https://reactflow.dev/learn/concepts/handles} Handle Concepts
   */
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges(edgesSnapshot => addEdge(params, edgesSnapshot)),
    []
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some(node => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="size-full">
      {/* 
        React Flow Main Component
        
        The core React Flow component that renders the entire visual workflow editor.
        This component provides a comprehensive set of features for visual workflow editing:
        
        Props Configuration:
        - nodes/edges: Current workflow state arrays
        - nodeTypes: Custom node component registry from src/config/node-components.ts
        - onInit: Callback to store React Flow instance in global state
        - fitView: Automatically fits all nodes in view on initial load
        - snapGrid/snapToGrid: Enables 10px grid snapping for precise positioning
        - panOnScroll: Enables mouse wheel panning (zoom with Ctrl+wheel)
        - panOnDrag: Disabled to prevent accidental panning during node manipulation
        - selectionOnDrag: Enables multi-node selection via drag rectangle
        - proOptions: Hides React Flow attribution (requires Pro license)
        
        Child Components:
        - Background: Renders dot pattern background for visual reference
        - Controls: Zoom in/out, fit view, and fullscreen buttons
        - MiniMap: Small overview map for navigation in large workflows
        - Panel: Floating UI panel for additional controls (Add Node button)
        
        @see {@link https://reactflow.dev/api-reference/react-flow} ReactFlow Component API
        @see {@link https://reactflow.dev/api-reference/react-flow#node-types} Custom Node Types
        @see {@link https://reactflow.dev/learn/customization/theming#overriding-built-in-classes} Background Component
        @see {@link https://reactflow.dev/learn/concepts/minimap} MiniMap Component
        @see {@link https://reactflow.dev/learn/concepts/controls} Controls Component
        @see {@link https://reactflow.dev/learn/concepts/panel} Panel Component
      */}
      <ReactFlow
        colorMode={colorMode}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
        proOptions={{
          hideAttribution: true,
        }}
      >
        {/* 
          Background Component
          
          Renders a customizable background pattern (dots, lines, or cross) that helps
          users visually align nodes and provides depth perception in the editor.
          
          @see {@link https://reactflow.dev/api-reference/background} Background API
        */}
        <Background
          id="1"
          // variant={BackgroundVariant.Dots}
          // gap={15}
          color="#D97706"
          // style={{
          //   opacity: 0.75,
          // }}
        />

        {/* 
          Controls Component
          
          Provides standard zoom and view controls including:
          - Zoom in/out buttons
          - Fit view button (resets zoom to show all nodes)
          - Fullscreen toggle
          - Lock/unlock interaction
          
          @see {@link https://reactflow.dev/api-reference/controls} Controls API
        */}
        <Controls />

        {/* 
          MiniMap Component
          
          Displays a small overview of the entire workflow with current viewport indicator.
          Essential for navigation in large, complex workflows that extend beyond the visible area.
          
          @see {@link https://reactflow.dev/api-reference/minimap} MiniMap API
        */}
        <MiniMap nodeColor={() => "#D97706"} pannable zoomable />

        {/*
          Panel Component
          
          Floating panel positioned at top-right containing workflow editing tools.
          Currently hosts the AddNodeButton component for inserting new nodes into the workflow.
          
          @see {@link https://reactflow.dev/api-reference/panel} Panel API
        */}
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecutionWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
