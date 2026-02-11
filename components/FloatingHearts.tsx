import React, { useEffect, useState } from 'react';
import { FloatingHeartProps } from '../types';

const FloatingHeart: React.FC<FloatingHeartProps> = ({ delay, duration, left, size }) => (
  <div
    className="absolute text-valentine-300 opacity-60 pointer-events-none"
    style={{
      left: `${left}%`,
      bottom: '-50px',
      fontSize: `${size}px`,
      animation: `float-up ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    ❤
  </div>
);

export const FloatingHeartsBg: React.FC = () => {
  const [hearts, setHearts] = useState<FloatingHeartProps[]>([]);

  useEffect(() => {
    // Generate static configuration for hearts to avoid hydration mismatch or re-render jitter
    const newHearts: FloatingHeartProps[] = Array.from({ length: 20 }).map((_, i) => ({
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      left: Math.random() * 100,
      size: 20 + Math.random() * 30,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {hearts.map((props, i) => (
        <FloatingHeart key={i} {...props} />
      ))}
    </div>
  );
};
