'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import type { Scores } from '@/lib/quiz/score';
import { dimensions, traits } from '@/lib/quiz/content';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export function RadarChart({ scores }: { scores: Scores }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();

    Chart.defaults.color = '#888888';
    Chart.defaults.font.family = 'Courier New, Courier, monospace';

    chartRef.current = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels: traits.map((t) => dimensions[t].split('\n')),
        datasets: [
          {
            data: traits.map((t) => scores[t]),
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: '#ffffff',
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#0a0a0a',
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        aspectRatio: 1,
        layout: { padding: 0 },
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 12,
            ticks: { display: false },
            grid: { color: 'rgba(255, 255, 255, 0.15)' },
            angleLines: { color: 'rgba(255, 255, 255, 0.15)' },
            pointLabels: { color: '#888888', font: { size: 10 } },
          },
        },
        plugins: { legend: { display: false } },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [scores]);

  return <canvas ref={canvasRef} />;
}
