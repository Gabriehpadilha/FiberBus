import { initializeContextMenu } from './contextMenu.js';

export function renderTreeChart(treeData) {
    var container = d3.select("#container");
    var div = container.node().getBoundingClientRect();
    var padding = { top: 10, right: 10, bottom: 10, left: 10 };
    var width = div.width - padding.left - padding.right;
    var height = div.height - padding.top - padding.bottom;

    var svg = container.append("svg")
        .attr("width", width + padding.left + padding.right)
        .attr("height", height + padding.top + padding.bottom)
        .call(d3.drag()
            .on("start", panStarted)
            .on("drag", panning)
            .on("end", panEnded));

    var main = svg.append("g")
        .attr("transform", `translate(${padding.left},${padding.top})`);

    var treeLayout = d3.tree().size([height, width]);
    var root = d3.hierarchy(treeData, d => d.children);
    root.x0 = height / 2;
    root.y0 = 0;

    var i = 0;
    var panOffset = { x: 0, y: 0 };

    update(root);

    function update(source) {
        var treeData = treeLayout(root);
        var nodes = treeData.descendants();
        var links = treeData.links();

        nodes.forEach(d => d.y = d.depth * 180);

        var node = main.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++i));

        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${source.y0},${source.x0})`)
            .on('click', click);

        nodeEnter.append('rect')
            .attr('class', 'shape')
            .attr('height', 40)
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('y', -20)
            .attr('x', 0)
            .style("fill", d => d._children ? "lightsteelblue" : "#fff")
            .style("stroke", "steelblue")
            .style("stroke-width", "2px");

        nodeEnter.append('text')
            .attr('class', 'label')
            .attr('dy', '.35em')
            .attr('x', 10)
            .attr('y', 0)
            .attr('text-anchor', 'start')
            .text(d => d.data.name);

        nodeEnter.select('rect')
            .attr('width', function (d) {
                const textLength = this.parentNode.querySelector('text').getBBox().width;
                return textLength + 20;
            });

        var nodeUpdate = nodeEnter.merge(node);
        nodeUpdate.transition()
            .duration(200)
            .attr('transform', d => `translate(${d.y},${d.x})`);

        nodeUpdate.select('rect.shape')
            .style('fill', d => d._children ? "lightsteelblue" : "#fff");

        var nodeExit = node.exit().transition()
            .duration(200)
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .remove();

        nodeExit.select('rect')
            .attr('r', 1e-6);

        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        var link = main.selectAll('path.link')
            .data(links, d => d.target.id);

        var linkEnter = link.enter().insert('path', "g")
            .attr('class', 'link')
            .attr('d', d => {
                var o = { x: source.x0, y: source.y0 };
                return diagonal(o, o);
            });

        var linkUpdate = linkEnter.merge(link);
        linkUpdate.transition()
            .duration(200)
            .attr('d', d => diagonal(d.source, d.target));

        var linkExit = link.exit().transition()
            .duration(200)
            .attr('d', d => {
                var o = { x: source.x, y: source.y };
                return diagonal(o, o);
            })
            .remove();

        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        function diagonal(s, d) {
            return `M ${s.y} ${s.x} C ${(s.y + d.y) / 2} ${s.x}, ${(s.y + d.y) / 2} ${d.x}, ${d.y} ${d.x}`;
        }

        function click(event, d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }

        // Adiciona o menu de contexto a cada nó, para garantir que o evento seja aplicado mesmo após colapsar e expandir
        initializeContextMenu(svg, main, treeData);  // Chama o menu de contexto aqui após cada update
    }

    var initialMousePosition = null;

    function panStarted(event) {
        svg.style("cursor", "grabbing");
        initialMousePosition = { x: event.x - panOffset.x, y: event.y - panOffset.y };
    }

    function panning(event) {
        if (initialMousePosition) {
            panOffset.x = event.x - initialMousePosition.x;
            panOffset.y = event.y - initialMousePosition.y;
            main.attr("transform", `translate(${panOffset.x},${panOffset.y})`);
        }
    }

    function panEnded(event) {
        svg.style("cursor", "default");
        initialMousePosition = null;
    }
}
