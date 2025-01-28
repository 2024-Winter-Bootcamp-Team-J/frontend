import * as d3 from 'd3';

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

export const renderGraph = (
  canvasRef: React.RefObject<SVGSVGElement>,
  nodes: D3Node[],
  links: Link[],
  setSelectedNode: React.Dispatch<React.SetStateAction<D3Node | null>>,
  setIsUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

  const initialTransform = d3.zoomIdentity.translate(
    window.innerWidth / 2 - canvasWidth / 2,
    window.innerHeight / 2 - canvasHeight / 2
  );
  svg.call(zoomBehavior.transform, initialTransform);

  const simulation = d3
    .forceSimulation<D3Node>(nodes)
    .force(
      'link',
      d3.forceLink<D3Node, Link>(links).id((d) => d.id).distance(300)
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

        g.selectAll<SVGGElement, D3Node>('g.node')
        .attr('transform', (d) => `translate(${d.x}, ${d.y})`);
      
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
      if (!d.name || d.id.startsWith('relation-')) return;
      if (d.id === 'User') {
        setIsUserModalOpen(true);
        return;
      }
      setSelectedNode(d);
    });

  node.each(function (d) {
    const currentNode = d3.select<SVGGElement, D3Node>(this);
    const delay = Math.random() * 2000;

    if (d.id === 'User') {
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
          .on('end', animateRipple);
      }

      animateRipple();
    } else if (d.id.startsWith('relation-')) {

        
      currentNode
        .append('circle')
        .attr('r', 0)
        .attr('fill', '#F4A261')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 3)
        .transition()
        .duration(1500)
        .delay(delay)
        .attr('r', 70);

      currentNode
        .append('text')
        .attr('y', 120)
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
        .append('clipPath')
        .attr('id', `clip-${d.id}`)
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 60);

        if (d.node_img) {
            currentNode
              .append('image')
              .attr('href', d.node_img) // 이미지를 추가하기 전에 d.node_img 확인
              .attr('width', 0)
              .attr('height', 0)
              .attr('clip-path', `url(#clip-${d.id})`)
              .attr('x', 0)
              .attr('y', 0)
              .transition()
              .duration(1500)
              .delay(delay)
              .attr('width', 120)
              .attr('height', 120)
              .attr('x', -60)
              .attr('y', -60);
          }
          

      currentNode
        .append('text')
        .attr('y', 120)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '30px')
        .style('opacity', 0)
        .transition()
        .duration(1500)
        .delay(delay)
        .style('opacity', 1)
        .text(d.name || '');

      currentNode
        .on('mouseenter', function () {
          currentNode
            .select('circle')
            .transition()
            .duration(500)
            .attr('r', 70);

            currentNode
            .select(`clipPath circle`) // clipPath 안의 circle 선택
            .transition()
            .duration(500)
            .attr('r', 70); // clipPath의 반지름도 확대

            currentNode
            .select('image') // 이미지 선택
            .transition()
            .duration(500)
            .attr('width', 140) // 가로 크기 확대
            .attr('height', 140) // 세로 크기 확대
            .attr('x', -70) // 중심 정렬
            .attr('y', -70);

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
              d3.select(this).remove();
            });
        })
        .on('mouseleave', function () {
          currentNode
            .select('circle')
            .transition()
            .duration(500)
            .attr('r', 60);

            currentNode
            .select(`clipPath circle`) // clipPath 안의 circle 선택
            .transition()
            .duration(500)
            .attr('r', 60); // clipPath의 반지름 복구

            currentNode
            .select('image') // 이미지 선택
            .transition()
            .duration(500)
            .attr('width', 120) // 원래 크기 복구
            .attr('height', 120)
            .attr('x', -60) // 중심 정렬 복구
            .attr('y', -60);
        });
    }
  });

  return () => {
    simulation.stop();
    svg.selectAll('*').remove();
  };
};


