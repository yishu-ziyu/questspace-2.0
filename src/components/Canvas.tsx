import { useEffect } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useReactFlow,
} from '@xyflow/react';
import type { NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCanvasStore } from '../stores/canvasStore';
import CardNodeComponent from './CardNode';

const nodeTypes: NodeTypes = {
  card: CardNodeComponent,
};

const FIT = {
  padding: 0.2,
  maxZoom: 1,
};

function FitAfterSplit() {
  const { fitView } = useReactFlow();
  const generation = useCanvasStore((s) => s.splitGeneration);

  useEffect(() => {
    if (generation === 0) return;
    const id = window.setTimeout(() => {
      void fitView({ ...FIT, duration: 220 });
    }, 80);
    return () => window.clearTimeout(id);
  }, [generation, fitView]);

  return null;
}

export function Canvas() {
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const onNodesChange = useCanvasStore((s) => s.onNodesChange);
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
  const onConnect = useCanvasStore((s) => s.onConnect);
  const generation = useCanvasStore((s) => s.splitGeneration);

  return (
    <div className="canvas-root">
      <ReactFlow
        key={generation}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={FIT}
        minZoom={0.1}
        maxZoom={1.6}
        deleteKeyCode={['Backspace', 'Delete']}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { stroke: 'var(--ink-3)', strokeWidth: 1.5 },
        }}
      >
        <FitAfterSplit />
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="var(--line)" />
        {nodes.length > 0 ? <Controls showInteractive={false} /> : null}
      </ReactFlow>
    </div>
  );
}
