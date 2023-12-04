import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function UserFlowChart() {
    const svgRef = useRef();

    useEffect(() => {
        const nodes = [
            { id: "Auth", type: "rect", width: 100, height: 30, x: 400, y: 100 },
            { id: "Profile Page", type: "rect", width: 100, height: 30, x: 300, y: 200 },
            { id: "Bet Page", type: "rect", width: 100, height: 30, x: 400, y: 200 },
            { id: "History Page", type: "rect", width: 100, height: 30, x: 500, y: 200 }
        ];

        const links = [
            { source: "Auth", target: "Profile Page" },
            { source: "Auth", target: "Bet Page" },
            { source: "Auth", target: "History Page" }
        ];

        const svg = d3.select(svgRef.current)
            .attr("width", 800)
            .attr("height", 600);

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(400, 300));

        // Create links
        svg.append("g")
            .attr("stroke", "#999")
            .selectAll("line")
            .data(links)
            .join("line");

        // Create nodes
        const node = svg.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g");

        node.append("rect")
            .attr("width", d => d.width)
            .attr("height", d => d.height)
            .attr("fill", "#69b3a2");

        node.append("text")
            .text(d => d.id)
            .attr("x", d => d.width / 2)
            .attr("y", d => d.height / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", "10px");

        simulation.on("tick", () => {
            node.attr("transform", d => `translate(${d.x - d.width / 2}, ${d.y - d.height / 2})`);

            svg.selectAll("line")
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
        });

        // Stop the simulation from moving the nodes
        simulation.stop();
    }, []);

    return (
        <div>
            <svg ref={svgRef} />
        </div>
    );
}

export default UserFlowChart;
