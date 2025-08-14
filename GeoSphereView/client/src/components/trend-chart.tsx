import { useEffect, useRef } from "react";

export default function TrendChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = 300;
    canvas.height = 150;

    // Mock chart data
    const data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Settlements",
          data: [12, 15, 13, 18, 21, 23],
          color: "#ef4444",
        },
        {
          label: "Dumping Sites", 
          data: [8, 9, 11, 7, 12, 14],
          color: "#f97316",
        },
        {
          label: "Deforestation",
          data: [5, 7, 6, 9, 8, 11],
          color: "#22c55e",
        },
      ],
    };

    // Draw basic chart
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...data.datasets.flatMap(d => d.data));

    // Draw axes
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();

    // X-axis  
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw data lines
    data.datasets.forEach((dataset) => {
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      dataset.data.forEach((value, index) => {
        const x = padding + (index / (data.labels.length - 1)) * chartWidth;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    });

    // Draw legend
    ctx.font = "12px Inter";
    data.datasets.forEach((dataset, index) => {
      const y = canvas.height - 15 + index * 15;
      ctx.fillStyle = dataset.color;
      ctx.fillRect(padding, y, 10, 2);
      ctx.fillStyle = "#374151";
      ctx.fillText(dataset.label, padding + 15, y + 8);
    });

  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Trends</h3>
      <div className="h-48 flex items-center justify-center">
        <canvas 
          ref={canvasRef}
          className="max-w-full h-auto"
          style={{ width: "300px", height: "150px" }}
        />
      </div>
    </div>
  );
}
