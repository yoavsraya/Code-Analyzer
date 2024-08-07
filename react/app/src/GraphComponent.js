import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import './GraphComponent.css';

const SpinningGroup = ({ children }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

const GraphComponent = () => {
  console.log("Graph Component started");
  const [graphData, setGraphData] = useState({ Vertices: [], Edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("useEffect running");
    setGraphData({ Vertices: [], Edges: [] }); // Reset graph data before fetching new data
    setLoading(true);
    setError(null);

    fetch('http://54.243.195.75:3000/api/getGraphData')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Data fetched", data);
        setGraphData(data);
        setLoading(false);
      })
      .catch(err => {
        console.log("Error fetching data", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const radius = 7; // Radius of the sphere
  const center = [0, 0, 0]; // Center point of the sphere

  const vertices = useMemo(() => {
    return graphData.Vertices.map((vertex, index) => {
      const phi = Math.acos(-1 + (2 * index) / graphData.Vertices.length);
      const theta = Math.sqrt(graphData.Vertices.length * Math.PI) * phi;
      const x = center[0] + radius * Math.cos(theta) * Math.sin(phi);
      const y = center[1] + radius * Math.sin(theta) * Math.sin(phi);
      const z = center[2] + radius * Math.cos(phi);

      return {
        id: vertex.Label,
        position: [x, y, z],
        degree: vertex.degree,
      };
    });
  }, [graphData.Vertices]); // Ensure this dependency is correct

  const edges = useMemo(() => {
    return graphData.Edges.map((edge) => {
      const fromVertex = vertices.find((v) => v.id === edge.From);
      const toVertex = vertices.find((v) => v.id === edge.To);
      const midpoint = [
        (fromVertex.position[0] + toVertex.position[0]) / 2,
        (fromVertex.position[1] + toVertex.position[1]) / 2,
        (fromVertex.position[2] + toVertex.position[2]) / 2,
      ];
      return {
        from: fromVertex.position,
        to: toVertex.position,
        midpoint,
        label: edge.Label,
      };
    });
  }, [vertices]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        fontSize: '24px',
      }}>
        <div className="spinner"></div>
        <div style={{ marginTop: '20px', color: 'white' }}>Loading graph data...</div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  if (vertices.length === 0 || edges.length === 0) {
    return <div>No graph data available.</div>;
  }

  return (
    <div className="graph-container">
      <Canvas className="canvas-container">
        <OrbitControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <SpinningGroup>
          {vertices.map((vertex) => (
            <mesh key={vertex.id} position={vertex.position}>
              <sphereGeometry args={[0.7, 32, 32]} />
              <meshStandardMaterial color="#81E979" />
              <Html distanceFactor={10}>
                <div
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    textAlign: 'center',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {vertex.id} (Degree: {vertex.degree})
                </div>
              </Html>
            </mesh>
          ))}

          {edges.map((edge, index) => {
            const points = new Float32Array([...edge.from, ...edge.to]);
            const lineGeometry = new LineGeometry();
            lineGeometry.setPositions(points);

            return (
              <React.Fragment key={index}>
                <primitive
                  object={
                    new Line2(
                      lineGeometry,
                      new LineMaterial({
                        color: 0xffffff,
                        linewidth: 2.4, // Adjust the linewidth as needed
                        resolution: [window.innerWidth, window.innerHeight], // Add resolution for proper scaling
                      })
                    )
                  }
                />
                <Html position={edge.midpoint} distanceFactor={10}>
                  <div
                    style={{
                      color: '#e5c100',
                      fontSize: '20px',
                      textAlign: 'center',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {edge.label}
                  </div>
                </Html>
              </React.Fragment>
            );
          })}
        </SpinningGroup>
      </Canvas>
    </div>
  );
};

export default GraphComponent;
