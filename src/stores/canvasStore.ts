import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import { createCardId } from '../utils/cardId';
import { nextCardPosition } from '../utils/cardPosition';
import { childPositions, type SplitCard } from '../utils/splitThought';

export interface CardData extends Record<string, unknown> {
  title: string;
  content: string;
  source?: string;
  createdAt: number;
}

export type CardNode = Node<CardData>;

interface CanvasState {
  nodes: CardNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<CardNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addCard: (title: string, content: string, position?: { x: number; y: number }) => void;
  applySplit: (input: {
    parentId?: string;
    hubTitle?: string;
    children: SplitCard[];
  }) => void;
  updateCard: (id: string, data: Partial<CardData>) => void;
  deleteCard: (id: string) => void;
  splittingId: string | null;
  setSplittingId: (id: string | null) => void;
  splitNote: string;
  setSplitNote: (note: string) => void;
  splitGeneration: number;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      splittingId: null,
      splitNote: '',
      splitGeneration: 0,

      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) as CardNode[] });
      },

      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },

      onConnect: (connection) => {
        set({ edges: addEdge({ ...connection, type: 'smoothstep', animated: false }, get().edges) });
      },

      setSplittingId: (id) => set({ splittingId: id }),
      setSplitNote: (note) => set({ splitNote: note }),

      applySplit: ({ parentId, hubTitle, children }) => {
        const { nodes, edges } = get();
        const createdAt = Date.now();
        let parent = parentId ? nodes.find((node) => node.id === parentId) : undefined;
        let nextNodes: CardNode[] = nodes.map((node) => ({ ...node, selected: false }));

        if (!parent) {
          const id = createCardId();
          parent = {
            id,
            type: 'card',
            position: nextCardPosition(nextNodes.length),
            selected: true,
            data: {
              title: hubTitle?.trim() || '未命名',
              content: '',
              createdAt,
            },
          };
          nextNodes = [...nextNodes, parent];
        }

        const occupied = nextNodes.map((n) => n.position);
        const spots = childPositions(parent.position, children.length, occupied);
        const childNodes = children.map((child, index) => ({
          id: createCardId(),
          type: 'card' as const,
          position: spots[index],
          selected: false,
          data: {
            title: child.title,
            content: child.content,
            createdAt,
          },
        }));

        const childEdges = childNodes.map((child) => ({
          id: `e-${parent.id}-${child.id}`,
          source: parent.id,
          target: child.id,
          sourceHandle: 'r',
          targetHandle: 'l',
          type: 'smoothstep',
          animated: false,
        }));

        set({
          nodes: [
            ...nextNodes.map((node) =>
              node.id === parent.id ? { ...node, selected: true } : node
            ),
            ...childNodes,
          ],
          edges: [...edges, ...childEdges],
          splitGeneration: get().splitGeneration + 1,
        });
      },

      addCard: (title, content, position) => {
        const nodes = get().nodes;
        const id = createCardId();
        const newNode: CardNode = {
          id,
          type: 'card',
          position: position ?? nextCardPosition(nodes.length),
          selected: true,
          data: {
            title,
            content,
            createdAt: Date.now(),
          },
        };
        set({
          nodes: [...nodes.map((node) => ({ ...node, selected: false })), newNode],
        });
      },

      updateCard: (id, data) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...data } } : node
          ),
        });
      },

      deleteCard: (id) => {
        set({
          nodes: get().nodes.filter((node) => node.id !== id),
          edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
        });
      },

    }),
    {
      name: 'questspace-canvas',
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
    }
  )
);
