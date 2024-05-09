// import React, { useRef, useEffect, useState } from 'react';

// const WordSphere = ({ texts, counts, options }) => {
//   const canvasRef = useRef(null);
//   const [rx, setRx] = useState(options.initialRotationX);
//   const [rz, setRz] = useState(options.initialRotationZ);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const π = Math.PI;
//     const { width = 500, height = 500, radius = 150, tilt = 0, fontSize = 22 } = options;

//     canvas.width = width;
//     canvas.height = height;
//     ctx.font = `${fontSize}px Helvetica`;

//     const render = () => {
//       ctx.clearRect(0, 0, width, height);
      
//       let ix = 0, iz = 0;
//       for (const text of texts) {
//         const degZ = (π / (counts.length - 1)) * iz;
//         const degX = ((2 * π) / counts[iz]) * ix;

//         let x = radius * Math.sin(degZ) * Math.cos(degX);
//         let y = radius * Math.sin(degZ) * Math.sin(degX);
//         let z = radius * Math.cos(degZ) + 8 * (ix % 2);

//         // Apply rotation
//         const cosRz = Math.cos(rz);
//         const sinRz = Math.sin(rz);
//         const cosRx = Math.cos(rx);
//         const sinRx = Math.sin(rx);

//         const newY = y * cosRz - z * sinRz;
//         const newZ = y * sinRz + z * cosRz;
//         const newX = x * cosRx - newZ * sinRx;
//         const newZ2 = x * sinRx + newZ * cosRx;

//         // Project to 2D
//         const scaleFactor = 100 / (newZ2 + radius);
//         const projectedX = newX * scaleFactor + width / 2;
//         const projectedY = newY * scaleFactor + height / 2;

//         // Set text color to blue
//         ctx.fillStyle = 'blue';
//         ctx.fillText(text, projectedX, projectedY);

//         ix--;
//         if (ix < 0) {
//           iz++;
//           ix = counts[iz] - 1;
//         }
//       }

//       // Update rotation values
//       setRx(rx + 0.01);
//       setRz(rz + 0.01);

//       requestAnimationFrame(render);
//     };

//     render();

//     return () => cancelAnimationFrame(render);
//   }, [texts, counts, options, rx, rz]);

//   return <canvas ref={canvasRef} />;
// };

// export default WordSphere;

import React, { useRef, useEffect, useState } from 'react';

const WordSphere = ({ texts, counts, options }) => {
  const canvasRef = useRef(null);
  const [rz, setRz] = useState(options.initialRotationZ);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const π = Math.PI;
    const { width = 500, height = 500, radius = 150, tilt = 0, fontSize = 22 } = options;

    canvas.width = width;
    canvas.height = height;
    ctx.font = `${fontSize}px Helvetica`;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let ix = 0, iz = 0;
      for (const text of texts) {
        const θ = π * (ix / counts[iz]);
        const φ = π * (iz / (counts.length - 1));
        
        let x = radius * Math.sin(φ) * Math.cos(θ);
        let y = radius * Math.cos(φ);
        let z = radius * Math.sin(φ) * Math.sin(θ);

        // Apply rotation around the vertical axis (rz)
        const cosRz = Math.cos(rz);
        const sinRz = Math.sin(rz);

        const newX = x * cosRz - z * sinRz;
        const newZ = x * sinRz + z * cosRz;

        // Project to 2D
        const scaleFactor = 100 / (newZ + radius);
        const projectedX = newX * scaleFactor + width / 2;
        const projectedY = y * scaleFactor + height / 2;

        // Set text color to blue
        ctx.fillStyle = 'blue';
        ctx.fillText(text, projectedX, projectedY);

        ix++;
        if (ix >= counts[iz]) {
          iz++;
          ix = 0;
        }
      }

      // Update rotation value (rotate around vertical axis)
      setRz(rz + 0.01);

      requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(render);
  }, [texts, counts, options, rz]);

  return <canvas ref={canvasRef} />;
};

export default WordSphere;
