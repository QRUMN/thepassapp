import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import MobileLayout from '../../components/layouts/MobileLayout';
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaGraduationCap,
  FaBriefcase,
  FaUndo,
  FaTimes,
  FaCheck,
  FaBookmark,
  FaFilter
} from 'react-icons/fa';

interface Position {
  id: string;
  schoolName: string;
  title: string;
  location: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract';
  startDate: string;
  requirements: string[];
  description: string;
  matchScore: number;
  imageUrl: string;
}

interface SwipeState {
  positions: Position[];
  currentIndex: number;
  direction: string;
  likedPositions: Set<string>;
  dislikedPositions: Set<string>;
  savedPositions: Set<string>;
}

export default function SwipeBoard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const controls = useAnimation();
  const [state, setState] = useState<SwipeState>({
    positions: [],
    currentIndex: 0,
    direction: '',
    likedPositions: new Set(),
    dislikedPositions: new Set(),
    savedPositions: new Set(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const constraintsRef = useRef(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        // Simulated API call
        const response = await new Promise<Position[]>((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: '1',
                schoolName: 'Sunshine Elementary',
                title: 'Grade 3 Teacher',
                location: 'Boston, MA',
                salary: '$60,000 - $75,000',
                type: 'full-time',
                startDate: 'Fall 2024',
                requirements: ['Teaching License', '2+ years experience'],
                description: 'Join our vibrant elementary school community...',
                matchScore: 95,
                imageUrl: '/school1.jpg'
              },
              // Add more positions as needed
            ]);
          }, 1000);
        });

        setState(prev => ({
          ...prev,
          positions: response
        }));
        setIsLoading(false);
      } catch (error) {
        showToast('Error loading positions', 'error');
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, [showToast]);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const swipe = info.offset.x;
    const swipeThreshold = 50;

    if (Math.abs(swipe) > swipeThreshold) {
      const direction = swipe > 0 ? 'right' : 'left';
      await controls.start({ x: swipe * 2, opacity: 0 });
      handleSwipe(direction);
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const handleSwipe = (direction: string) => {
    const currentPosition = state.positions[state.currentIndex];
    if (!currentPosition) return;

    setState(prev => {
      const newState = { ...prev };
      
      if (direction === 'right') {
        newState.likedPositions.add(currentPosition.id);
        showToast('Position liked!', 'success');
      } else if (direction === 'left') {
        newState.dislikedPositions.add(currentPosition.id);
      }

      newState.currentIndex = prev.currentIndex + 1;
      newState.direction = direction;
      
      return newState;
    });

    controls.start({ x: 0, opacity: 1 });
  };

  const handleSave = (id: string) => {
    setState(prev => {
      const newState = { ...prev };
      if (newState.savedPositions.has(id)) {
        newState.savedPositions.delete(id);
        showToast('Position removed from saved', 'info');
      } else {
        newState.savedPositions.add(id);
        showToast('Position saved!', 'success');
      }
      return newState;
    });
  };

  const currentPosition = state.positions[state.currentIndex];

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!currentPosition) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">No More Positions</h2>
          <p className="text-gray-600 mb-6">You've viewed all available positions. Check back later for new opportunities!</p>
          <button
            onClick={() => navigate('/educator/dashboard')}
            className="btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">Find Positions</h1>
          <button
            onClick={() => setShowFilters(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FaFilter className="text-xl" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden" ref={constraintsRef}>
          <motion.div
            className="relative h-full w-full"
            drag="x"
            dragConstraints={constraintsRef}
            onDragEnd={handleDragEnd}
            animate={controls}
          >
            <div className="absolute inset-0 p-4">
              <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg overflow-hidden h-full">
                {/* School Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={currentPosition.imageUrl}
                    alt={currentPosition.schoolName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleSave(currentPosition.id)}
                      className={`p-2 rounded-full bg-white/90 dark:bg-dark-surface/90 shadow-lg
                        ${state.savedPositions.has(currentPosition.id) ? 'text-brand-primary' : 'text-gray-600'}`}
                    >
                      <FaBookmark className="text-xl" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-brand-primary text-white px-3 py-1 rounded-full">
                    {currentPosition.matchScore}% Match
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{currentPosition.title}</h2>
                  <h3 className="text-lg text-gray-600 dark:text-gray-400 mb-4">{currentPosition.schoolName}</h3>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FaMapMarkerAlt className="mr-2" />
                      {currentPosition.location}
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FaDollarSign className="mr-2" />
                      {currentPosition.salary}
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FaClock className="mr-2" />
                      {currentPosition.type}
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FaGraduationCap className="mr-2" />
                      {currentPosition.startDate}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                      {currentPosition.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-600 dark:text-gray-400">{currentPosition.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex justify-center space-x-4">
          <button
            onClick={() => handleSwipe('left')}
            className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500"
          >
            <FaTimes className="text-2xl" />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="p-4 rounded-full bg-green-100 dark:bg-green-900/20 text-green-500"
          >
            <FaCheck className="text-2xl" />
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
