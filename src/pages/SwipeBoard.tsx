import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';
import { FaHeart, FaTimes, FaUndo } from 'react-icons/fa';

interface Position {
  id: string;
  schoolName: string;
  title: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  imageUrl: string;
}

export default function SwipeBoard() {
  const { showToast } = useToast();
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [lastSwipedPosition, setLastSwipedPosition] = useState<Position | null>(null);

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockPositions: Position[] = [
        {
          id: '1',
          schoolName: 'Sunshine Elementary',
          title: 'Grade 3 Teacher',
          location: 'San Francisco, CA',
          salary: '$65,000 - $85,000',
          description: "Join our vibrant elementary school community! We're seeking an enthusiastic third-grade teacher who is passionate about fostering a love of learning.",
          requirements: ['Valid Teaching License', '2+ years experience', 'Masters in Education preferred'],
          imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'
        },
        {
          id: '2',
          schoolName: 'Tech Academy',
          title: 'Computer Science Teacher',
          location: 'Mountain View, CA',
          salary: '$75,000 - $95,000',
          description: 'Innovative private school seeking CS teacher to develop and teach programming curriculum for grades 9-12.',
          requirements: ['CS Degree', 'Teaching Credential', 'Industry experience a plus'],
          imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7'
        },
        {
          id: '3',
          schoolName: 'Arts & Music School',
          title: 'Music Teacher',
          location: 'Berkeley, CA',
          salary: '$60,000 - $80,000',
          description: 'Lead our music program and inspire students through instrumental and vocal instruction.',
          requirements: ['Music Education Degree', 'Performance experience', 'Multi-instrument proficiency'],
          imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae'
        },
      ];
      
      setPositions(mockPositions);
      setIsLoading(false);
    } catch (error) {
      showToast('Failed to load positions. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  const handleSwipe = (swipeDirection: 'left' | 'right') => {
    if (currentIndex >= positions.length) return;
    
    const position = positions[currentIndex];
    setDirection(swipeDirection);
    setLastSwipedPosition(position);
    
    if (swipeDirection === 'right') {
      showToast(`You matched with ${position.schoolName}!`, 'success');
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (currentIndex === 0 || !lastSwipedPosition) return;
    
    setCurrentIndex(prev => prev - 1);
    setDirection(null);
    setLastSwipedPosition(null);
    
    showToast('Previous swipe undone', 'info');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (currentIndex >= positions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No More Positions</h2>
        <p className="text-gray-600 text-center mb-8">
          You've viewed all available positions. Check back later for new opportunities!
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setDirection(null);
            setLastSwipedPosition(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Start Over
        </button>
      </div>
    );
  }

  const currentPosition = positions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto relative h-[600px]">
        <AnimatePresence>
          <motion.div
            key={currentPosition.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
              opacity: 0,
              transition: { duration: 0.2 }
            }}
            className="absolute w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentPosition.imageUrl})` }}
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentPosition.title}
                </h2>
                <h3 className="text-lg text-gray-700 mb-4">
                  {currentPosition.schoolName}
                </h3>
                <div className="flex items-center text-gray-600 mb-4">
                  <span className="mr-4">{currentPosition.location}</span>
                  <span>{currentPosition.salary}</span>
                </div>
                <p className="text-gray-600 mb-4">
                  {currentPosition.description}
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {currentPosition.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-8">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FaTimes className="w-8 h-8" />
          </button>
          <button
            onClick={handleUndo}
            disabled={currentIndex === 0 || !lastSwipedPosition}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaUndo className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg text-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaHeart className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
