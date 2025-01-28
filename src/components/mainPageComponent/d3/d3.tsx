import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import Nod from '../../../modals/nod/nod';
import UserNod from '../../../modals/nod/userNod';
import { renderGraph } from './render';

type D3Node = d3.SimulationNodeDatum & {
  id: string;
  name?: string;
  node_img?: string;
  relation_type_id?: number[];
  node_id?: number;
  memo?: string;
  time?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};

type Link = d3.SimulationLinkDatum<D3Node> & {
  source: string | D3Node;
  target: string | D3Node;
};

const D3Canvas: React.FC = () => {
  const canvasRef = useRef<SVGSVGElement>(null!); // Assert non-null with `null!`
  const [selectedNode, setSelectedNode] = useState<D3Node | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const relationTypesResponse = await axios.get('http://localhost:8000/relations/types');
        const relationTypes = relationTypesResponse.data.reduce((acc: { [key: number]: string }, item: any) => {
          acc[item.relation_type_id] = item.name;
          return acc;
        }, {});

        const nodesResponse = await axios.get('http://localhost:8000/node');
        const apiData = nodesResponse.data;

        const userNode: D3Node = {
          id: 'User',
          name: 'User',
          node_img: localStorage.getItem('profileImage') || '/path/to/default-profile.png',
          fx: 1500,
          fy: 1000,
        };

        const groupNodes: D3Node[] = Array.from(
          new Set(apiData.flatMap((item: any) => item.relation_type_ids as number[]))
        ).map((relationId) => ({
          id: `relation-${relationId as number}`, // Explicitly cast relationId to `number`
          name: relationTypes[relationId as number] || `Relation ${relationId}`,
          x: 1500 + (Math.random() - 0.5) * 300,
          y: 1000 + (Math.random() - 0.5) * 300,
        }));

        const nodes: D3Node[] = apiData.map((item: any) => ({
          id: item.name,
          name: item.name,
          node_img: item.node_img,
          relation_type_id: item.relation_type_ids,
          node_id: item.node_id,
          x: 1500 + (Math.random() - 0.5) * 300,
          y: 1000 + (Math.random() - 0.5) * 300,
        }));

        const links: Link[] = [];
        groupNodes.forEach((groupNode) => links.push({ source: userNode.id, target: groupNode.id }));
        nodes.forEach((node) => {
          node.relation_type_id?.forEach((relationId) => {
            const groupNode = groupNodes.find((group) => group.id === `relation-${relationId}`);
            if (groupNode) links.push({ source: groupNode.id, target: node.id });
          });
        });

        const allNodes = [userNode, ...groupNodes, ...nodes];
        renderGraph(canvasRef, allNodes, links, setSelectedNode, setIsUserModalOpen);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <svg ref={canvasRef} className="fixed top-0 left-0 z-10"></svg>
      {isUserModalOpen && <UserNod node={{ id: 'User', name: 'User' }} onClose={() => setIsUserModalOpen(false)} />}
      {selectedNode && <Nod node={selectedNode} onClose={() => setSelectedNode(null)} />}
    </>
  );
};

export default D3Canvas;
