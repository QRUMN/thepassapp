import { useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface Position {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  imageUrl: string;
}

interface SwipeCardProps {
  position: Position;
  onSwipe: (direction: 'left' | 'right') => void;
}

export default function SwipeCard({ position, onSwipe }: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const [{ x, rotation }, api] = useSpring(() => ({
    x: 0,
    rotation: 0,
    config: { tension: 300, friction: 20 }
  }));

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => {
    setIsDragging(false);
    setSwipeDirection(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (!isDragging) return;
    
    const dragX = e.clientX - window.innerWidth / 2;
    api.start({
      x: dragX,
      rotation: dragX / 20,
      immediate: true
    });

    // Update swipe direction for visual indicator
    if (dragX > 50) {
      setSwipeDirection('right');
    } else if (dragX < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }

    if (Math.abs(dragX) > window.innerWidth * 0.15) {
      onSwipe(dragX > 0 ? 'right' : 'left');
      api.start({
        x: dragX > 0 ? window.innerWidth : -window.innerWidth,
        rotation: dragX > 0 ? 50 : -50
      });
    } else {
      api.start({
        x: 0,
        rotation: 0
      });
    }
  };

  return (
    <animated.div
      className="absolute w-full max-w-lg cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate: rotation,
        touchAction: 'none'
      }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      draggable="true"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
        {/* Swipe Indicators */}
        <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none">
          <div
            className={`transform transition-opacity ${
              swipeDirection === 'left' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold transform -rotate-12">
              PASS
            </div>
          </div>
          <div
            className={`transform transition-opacity ${
              swipeDirection === 'right' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold transform rotate-12">
              LIKE
            </div>
          </div>
        </div>

        <img
          src={position.imageUrl}
          alt={position.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{position.title}</h2>
          <p className="text-gray-600 mb-4">{position.company}</p>
          
          <div className="flex items-center text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {position.location}
          </div>

          <div className="mb-4">
            <p className="text-gray-600">{position.description}</p>
          </div>

          <div className="border-t pt-4">
            <p className="text-lg font-semibold mb-2">Requirements</p>
            <ul className="list-disc list-inside text-gray-600">
              {position.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="border-t mt-4 pt-4">
            <p className="text-lg font-semibold mb-2">Salary Range</p>
            <p className="text-gray-600">{position.salary}</p>
          </div>
        </div>
      </div>
    </animated.div>
  );
}
