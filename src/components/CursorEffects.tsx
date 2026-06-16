import { useEffect, useState, useRef } from 'react';

interface Trail {
  x: number;
  y: number;
  id: number;
}

export default function CursorEffects() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState<Trail[]>([]);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const idRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      idRef.current++;
      setTrails((prev) => [...prev.slice(-8), { x: e.clientX, y: e.clientY, id: idRef.current }]);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMobile]);

  useEffect(() => {
    if (trails.length === 0) return;
    const timer = setTimeout(() => {
      setTrails((prev) => prev.slice(1));
    }, 80);
    return () => clearTimeout(timer);
  }, [trails]);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Trail dots */}
      {trails.map((trail, i) => (
        <div
          key={trail.id}
          className="absolute rounded-full bg-blue-400/30"
          style={{
            width: 4 + i * 0.5,
            height: 4 + i * 0.5,
            left: trail.x - 2,
            top: trail.y - 2,
            opacity: (i + 1) / trails.length * 0.4,
            transition: 'opacity 0.3s',
          }}
        />
      ))}
      {/* Main cursor glow */}
      {visible && (
        <div
          className="absolute rounded-full"
          style={{
            width: 24,
            height: 24,
            left: pos.x - 12,
            top: pos.y - 12,
            background: 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(37,99,235,0.1) 50%, transparent 70%)',
            transition: 'left 0.05s, top 0.05s',
          }}
        />
      )}
    </div>
  );
}
