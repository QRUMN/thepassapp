interface SwipeControlsProps {
  onLike: () => void;
  onPass: () => void;
  onSave: () => void;
}

export default function SwipeControls({ onLike, onPass, onSave }: SwipeControlsProps) {
  return (
    <div className="flex justify-center space-x-4 mt-8">
      {/* Pass Button */}
      <button
        onClick={onPass}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Save Button */}
      <button
        onClick={onSave}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>

      {/* Like Button */}
      <button
        onClick={onLike}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  );
}
