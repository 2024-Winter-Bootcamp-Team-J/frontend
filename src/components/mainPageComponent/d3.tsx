import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import Nod from '../../modals/nod/nod';
import UserNod from '../../modals/nod/userNod';

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
  const canvasRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<D3Node, Link> | null>(null);
  const [selectedNode, setSelectedNode] = useState<D3Node | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch relation types
        const relationTypesResponse = await axios.get('http://localhost:8000/relations/types');
        const relationTypes = relationTypesResponse.data.reduce((acc: { [key: number]: string }, item: any) => {
          acc[item.relation_type_id] = item.name;
          return acc;
        }, {});
  
        // Fetch nodes
        const nodesResponse = await axios.get('http://localhost:8000/node');
        const apiData = nodesResponse.data;
  
        // Define userNode
        const userNode: D3Node = {
          id: 'User',
          name: 'User',
          node_img: localStorage.getItem('profileImage') || '/path/to/default-profile.png',
          fx: 1500,
          fy: 1000,
        };
  
        // Define group nodes from relation_type_ids
        const groupNodes: D3Node[] = Array.from(
          new Set(apiData.flatMap((item: any) => item.relation_type_ids as number[])) as Set<number>
        ).map((relationId) => {
          const id = relationId as number;
          return {
            id: `relation-${id}`,
            name: relationTypes[id] || `Relation ${id}`,
            x: 1500 + (Math.random() - 0.5) * 300,
            y: 1000 + (Math.random() - 0.5) * 300,
          };
        });
        
        
  
        // Define item nodes
        const nodes: D3Node[] = apiData.map((item: any) => {
          return {
            id: item.name, // Use name instead of node_id
            name: item.name,
            node_img: item.node_img,
            relation_type_id: item.relation_type_ids,
            node_id: item.node_id,
            x: 1500 + (Math.random() - 0.5) * 300,
            y: 1000 + (Math.random() - 0.5) * 300,
          };
        });
  
        // Define links connecting userNode -> groupNodes and groupNodes -> itemNodes
        const links: Link[] = [];
  
        groupNodes.forEach((groupNode) => {
          links.push({ source: userNode.id, target: groupNode.id });
        });
  
        nodes.forEach((node) => {
          node.relation_type_id?.forEach((relationId) => {
            const groupNode = groupNodes.find((group) => group.id === `relation-${relationId}`);
            if (groupNode) {
              links.push({ source: groupNode.id, target: node.id });
            }
          });
        });
  
        const allNodes = [userNode, ...groupNodes, ...nodes];
        renderGraph(allNodes, links);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const renderGraph = (nodes: D3Node[], links: Link[]) => {
      const svg = d3.select<SVGSVGElement, unknown>(canvasRef.current!).style('background-color', '#232323');
      svg.selectAll('*').remove();
      const g = svg.append('g');
  
      const canvasWidth = 3000;
      const canvasHeight = 2000;
      svg.attr('width', canvasWidth).attr('height', canvasHeight);
  
      const zoomBehavior = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 4])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });
  
      svg.call(zoomBehavior);
  
      const initialTransform = d3.zoomIdentity.translate(window.innerWidth / 2 - canvasWidth / 2, window.innerHeight / 2 - canvasHeight / 2);
      svg.call(zoomBehavior.transform, initialTransform);
  
      const simulation = d3
        .forceSimulation<D3Node>(nodes)
        .force(
          'link',
          d3
            .forceLink<D3Node, Link>(links)
            .id((d) => d.id)
            .distance(300),
        )
        .force('charge', d3.forceManyBody().strength(-1000))
        .force('center', d3.forceCenter(canvasWidth / 2, canvasHeight / 2))
        .force('collision', d3.forceCollide(60))
        .alphaTarget(0.1)
        .on('tick', () => {
          g.selectAll<SVGLineElement, Link>('.link')
            .attr('x1', (d) => (d.source as D3Node).x!)
            .attr('y1', (d) => (d.source as D3Node).y!)
            .attr('x2', (d) => (d.target as D3Node).x!)
            .attr('y2', (d) => (d.target as D3Node).y!);
  
          g.selectAll<SVGGElement, D3Node>('g.node').attr('transform', (d) => `translate(${d.x}, ${d.y})`);
        });
  
      const drag = d3
        .drag<SVGGElement, D3Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        });
  
      g.selectAll<SVGLineElement, Link>('.link')
        .data(links)
        .join('line')
        .attr('class', 'link')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0)
        .transition()
        .duration(1500)
        .delay((_, i) => i * 100)
        .attr('opacity', 0.8);
  
        const node = g
        .selectAll<SVGGElement, D3Node>('g.node')
        .data(nodes)
        .join('g')
        .attr('class', 'node')
        .call(drag)
        .on('click', (_event, d) => {
          // Prevent group nodes from triggering click events
          if (!d.name || d.id.startsWith('relation-')) {
            return; // Ignore group nodes
          }
          if (d.id === 'User') {
            setIsUserModalOpen(true);
            return;
          }
          setSelectedNode(d);
        });
      
        node.each(function (d, i) {
          const currentNode = d3.select<SVGGElement, D3Node>(this);
          const delay = Math.random() * 2000; // 랜덤 딜레이 (최대 2초)
        
          if (d.id === 'User') {
            // User Node
            currentNode
              .append('circle')
              .attr('r', 0)
              .attr('fill', '#3A3A3A')
              .attr('stroke', '#FFFFFF')
              .attr('stroke-width', 4)
              .transition()
              .duration(1500)
              .delay(delay)
              .attr('r', 80);
        
            currentNode
              .append('text')
              .attr('y', 150)
              .attr('text-anchor', 'middle')
              .attr('fill', 'white')
              .attr('font-size', '30px')
              .style('opacity', 0)
              .transition()
              .duration(1500)
              .delay(delay)
              .style('opacity', 1)
              .text(d.name || 'User');
        
            // Continuous ripple animation for User Node
            const ripple = currentNode
              .append('circle')
              .attr('r', 80)
              .attr('fill', 'none')
              .attr('stroke', '#FFFFFF')
              .attr('stroke-width', 2)
              .attr('opacity', 0.6);
        
            function animateRipple() {
              ripple
                .attr('r', 80)
                .attr('opacity', 0.6)
                .transition()
                .duration(2000)
                .ease(d3.easeCubicOut)
                .attr('r', 150)
                .attr('opacity', 0)
                .on('end', animateRipple); // Loop animation
            }
        
            animateRipple();
          } else if (d.id.startsWith('relation-')) {
            // Group (relation) nodes
            currentNode
              .append('circle')
              .attr('r', 0)
              .attr('fill', '#F4A261') // Group node color
              .attr('stroke', '#FFFFFF')
              .attr('stroke-width', 3)
              .transition()
              .duration(1500)
              .delay(delay)
              .attr('r', 70);
        
            currentNode
              .append('text')
              .attr('y', 150)
              .attr('text-anchor', 'middle')
              .attr('fill', 'white')
              .attr('font-size', '30px')
              .style('opacity', 0)
              .transition()
              .duration(1500)
              .delay(delay)
              .style('opacity', 1)
              .text(d.name || 'Relation');
          } else {
            // Other nodes with node_id and node_img
            currentNode
              .append('circle')
              .attr('r', 0)
              .attr('fill', '#037EC8')
              .attr('stroke', '#FFFFFF')
              .attr('stroke-width', 3)
              .transition()
              .duration(1500)
              .delay(delay)
              .attr('r', 60);
        
            currentNode
              .append('image')
              .attr('href', d.node_img || '/path/to/default-item-profile.png') // 기본 이미지 추가
              .attr('width', 0)
              .attr('height', 0)
              .attr('x', 0)
              .attr('y', 0)
              .transition()
              .duration(1500)
              .delay(delay)
              .attr('width', 120)
              .attr('height', 120)
              .attr('x', -60)
              .attr('y', -60);
        
            currentNode
              .append('text')
              .attr('y', 150)
              .attr('text-anchor', 'middle')
              .attr('fill', 'white')
              .attr('font-size', '30px')
              .style('opacity', 0)
              .transition()
              .duration(1500)
              .delay(delay)
              .style('opacity', 1)
              .text(d.name || '');
        
            // Hover animation for other nodes
            currentNode
              .on('mouseenter', function () {
                currentNode
                  .select('circle')
                  .transition()
                  .duration(500)
                  .attr('r', 70); // Increase radius on hover
        
                currentNode
                  .append('circle')
                  .attr('class', 'hover-ripple')
                  .attr('r', 70)
                  .attr('fill', 'none')
                  .attr('stroke', '#FFFFFF')
                  .attr('stroke-width', 2)
                  .attr('opacity', 0.6)
                  .transition()
                  .duration(1000)
                  .ease(d3.easeCubicOut)
                  .attr('r', 100)
                  .attr('opacity', 0)
                  .on('end', function () {
                    d3.select(this).remove(); // Remove ripple after animation
                  });
              })
              .on('mouseleave', function () {
                currentNode
                  .select('circle')
                  .transition()
                  .duration(500)
                  .attr('r', 60); // Restore radius on mouse leave
              });
          }
        });
        
        
        
  
      simulationRef.current = simulation;
  
      return () => {
        simulation.stop();
        svg.selectAll('*').remove();
      };
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

