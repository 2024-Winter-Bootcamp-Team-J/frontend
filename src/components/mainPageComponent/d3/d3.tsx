import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import Nod from '../../../modals/nod/generalNod/nod';
import UserNod from '../../../modals/nod/userNod/userNod';
import { renderGraph } from './render';
import Group from '../groups';
import generalP from '../../../assets/generalP.png';

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

type D3CanvasProps = {
  selectedCategory: string;
};

const D3Canvas: React.FC<D3CanvasProps> = ({ selectedCategory }) => {
  const canvasRef = useRef<SVGSVGElement>(null!);
  const [selectedNode, setSelectedNode] = useState<D3Node | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [relationTypes, setRelationTypes] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const relationTypesResponse = await axios.get('http://localhost:8000/relations/types');
        const types = relationTypesResponse.data.reduce((acc: { [key: number]: string }, item: any) => {
          acc[item.relation_type_id] = item.name;
          return acc;
        }, {});
        setRelationTypes(types);

        const nodesResponse = await axios.get('http://localhost:8000/node');
        const apiData = nodesResponse.data;

        const userNode: D3Node = {
          id: 'User',
          name: 'User',
          node_img: localStorage.getItem('profileImage') || generalP,
          fx: 1500,
          fy: 1000,
        };

        const uniqueRelationIds = new Set<number>(
          apiData.flatMap((item: any) => (Array.isArray(item.relation_type_ids) ? item.relation_type_ids : []))
        );

        const groupNodes: D3Node[] = Array.from(uniqueRelationIds).map((relationId) => {
          const relationIdNumber = Number(relationId);
          return {
            id: `relation-${relationIdNumber}`,
            name: relationTypes[relationIdNumber] || `Relation ${relationIdNumber}`,
            x: 1500 + (Math.random() - 0.5) * 300,
            y: 1000 + (Math.random() - 0.5) * 300,
          };
        });

        const nodes: D3Node[] = apiData.map((item: any) => ({
          id: item.name,
          name: item.name,
          node_img: item.node_img || generalP,
          relation_type_id: item.relation_type_ids,
          node_id: item.node_id,
          x: 1500 + (Math.random() - 0.5) * 300,
          y: 1000 + (Math.random() - 0.5) * 300,
        }));

        let filteredNodes = [userNode, ...groupNodes, ...nodes];

        if (selectedCategory !== '전체') {
          const categoryId = Number(Object.keys(relationTypes).find(key => relationTypes[Number(key)] === selectedCategory));
          filteredNodes = [
            userNode,
            ...groupNodes.filter(group => group.id === `relation-${categoryId}`),
            ...nodes.filter(node => node.relation_type_id?.includes(categoryId))
          ];
        }

        const links: Link[] = [];
        filteredNodes.forEach((node) => {
          if (node.id.startsWith('relation-')) {
            links.push({ source: 'User', target: node.id });
          } else if (node.relation_type_id) {
            node.relation_type_id.forEach((relationId) => {
              if (filteredNodes.some(n => n.id === `relation-${relationId}`)) {
                links.push({ source: `relation-${relationId}`, target: node.id });
              }
            });
          }
        });

        renderGraph(canvasRef, filteredNodes, links, setSelectedNode, setIsUserModalOpen);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <>
      <svg ref={canvasRef} className="fixed top-0 left-0 z-10"></svg>
      {isUserModalOpen && <UserNod node={{ id: 'User', name: 'User' }} onClose={() => setIsUserModalOpen(false)} />}
      {selectedNode && (
        <Nod
          node={{
            id: selectedNode.id,
            name: selectedNode.name,
            node_img: selectedNode.node_img,
            relation_type_id: selectedNode.relation_type_id,
            node_id: selectedNode.node_id,
            memo: selectedNode.memo,
            time: selectedNode.time,
          }}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </>
  );
};

export default D3Canvas;
