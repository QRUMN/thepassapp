import { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Head from 'next/head';
import { db } from '@/config/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';

interface Position {
  id: string;
  title: string;
  institution: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: string;
  imageUrl: string;
}

const DEMO_POSITIONS: Position[] = [
  {
    id: '1',
    title: 'High School Math Teacher',
    institution: 'Delaware High School',
    location: 'Wilmington, DE',
    type: 'Full-time',
    description: 'Seeking an experienced mathematics teacher for grades 9-12. Strong background in algebra and calculus required.',
    requirements: ['Delaware Teaching License', 'Master\'s Degree preferred', '3+ years experience'],
    salary: '$55,000 - $75,000',
    imageUrl: '/images/classroom1.jpg'
  },
  {
    id: '2',
    title: 'Elementary School Teacher',
    institution: 'Delaware Elementary',
    location: 'Dover, DE',
    type: 'Full-time',
    description: 'Join our dynamic elementary school teaching team. Focus on creating an engaging learning environment.',
    requirements: ['Delaware Teaching License', 'Bachelor\'s Degree', 'Elementary Education Certification'],
    salary: '$45,000 - $65,000',
    imageUrl: '/images/classroom2.jpg'
  },
  // Add more demo positions as needed
];

export default function Positions() {
  const [positions, setPositions] = useState<Position[]>(DEMO_POSITIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'right' | 'left' | null>(null);

  const [props, api] = useSpring(() => ({
    x: 0,
    rotation: 0,
    config: { tension: 300, friction: 20 }
  }));

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      // In a real app, fetch from Firestore
      // const positionsRef = collection(db, 'positions');
      // const q = query(positionsRef, limit(10));
      // const snapshot = await getDocs(q);
      // const loadedPositions = snapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data()
      // }));
      // setPositions(loadedPositions);
    } catch (error) {
      console.error('Error loading positions:', error);
    }
  };

  const handleDrag = (event: React.DragEvent) => {
    const x = event.clientX - window.innerWidth / 2;
    api.start({
      x: x,
      rotation: x / 20,
      immediate: true
    });
  };

  const handleDragEnd = (event: React.DragEvent) => {
    const x = event.clientX - window.innerWidth / 2;
    const threshold = window.innerWidth * 0.15;

    if (Math.abs(x) > threshold) {
      if (x > 0) {
        handleLike();
      } else {
        handleDislike();
      }
    } else {
      api.start({
        x: 0,
        rotation: 0
      });
    }
  };

  const handleLike = () => {
    setDirection('right');
    api.start({
      x: window.innerWidth,
      rotation: 50,
      onRest: nextPosition
    });
  };

  const handleDislike = () => {
    setDirection('left');
    api.start({
      x: -window.innerWidth,
      rotation: -50,
      onRest: nextPosition
    });
  };

  const nextPosition = () => {
    setCurrentIndex(i => (i + 1) % positions.length);
    setDirection(null);
    api.start({
      x: 0,
      rotation: 0,
      immediate: true
    });
  };

  const currentPosition = positions[currentIndex];

  return (
    <>
      <Head>
        <title>Browse Positions - The Pass App</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Browse Positions</h1>
            <button className="text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>

          <div className="relative h-[600px] flex items-center justify-center">
            <animated.div
              className="absolute w-full max-w-lg cursor-grab active:cursor-grabbing"
              style={{
                x: props.x,
                rotate: props.rotation,
                touchAction: 'none'
              }}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              draggable="true"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={currentPosition.imageUrl}
                  alt={currentPosition.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{currentPosition.title}</h2>
                  <p className="text-gray-600 mb-4">{currentPosition.institution}</p>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {currentPosition.location}
                  </div>

                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      {currentPosition.type}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{currentPosition.description}</p>

                  <div className="border-t pt-4">
                    <p className="text-lg font-semibold mb-2">Salary Range</p>
                    <p className="text-gray-600">{currentPosition.salary}</p>
                  </div>
                </div>
              </div>
            </animated.div>
          </div>

          <div className="flex justify-center gap-8 mt-8">
            <button
              onClick={handleDislike}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={handleLike}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
