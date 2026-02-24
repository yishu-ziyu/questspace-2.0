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
  updateCard: (id: string, data: Partial<CardData>) => void;
  deleteCard: (id: string) => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],

      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) as CardNode[] });
      },

      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },

      onConnect: (connection) => {
        set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
      },

      addCard: (title, content, position = { x: 100, y: 100 }) => {
        const id = createCardId();
        const newNode: CardNode = {
          id,
          type: 'card',
          position,
          data: {
            title,
            content,
            createdAt: Date.now(),
          },
        };
        set({ nodes: [...get().nodes, newNode] });
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
    }
  )
);
