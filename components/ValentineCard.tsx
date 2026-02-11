import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IMAGES, TEXTS } from '../constants';
import { Position } from '../types';

export const ValentineCard: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState<Position | null>(null);
  const [isHoveringNo, setIsHoveringNo] = useState(false);
  const [noBtnText, setNoBtnText] = useState(TEXTS.NO_BTN);
  
  // Refs for calculating boundaries
  const cardRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  const handleAccept = () => {
    setIsAccepted(true);
  };

  const moveNoButton = useCallback(() => {
    if (!noBtnRef.current) return;

    // Viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Button dimensions
    // We assume a max width to prevent overflow even if text changes
    const estimatedBtnWidth = 150; // Roughly the size of the button with text
    const btnHeight = 50;
    const padding = 20;

    // Calculate strict boundaries
    // X: [padding, viewportWidth - estimatedBtnWidth - padding]
    const minX = padding;
    const maxX = viewportWidth - estimatedBtnWidth - padding;
    
    // Y: [padding, viewportHeight - btnHeight - padding]
    const minY = padding;
    const maxY = viewportHeight - btnHeight - padding;

    // Ensure range is valid (min <= max)
    const effectiveMaxX = Math.max(minX, maxX);
    const effectiveMaxY = Math.max(minY, maxY);

    // Random position
    let newX = Math.random() * (effectiveMaxX - minX) + minX;
    let newY = Math.random() * (effectiveMaxY - minY) + minY;

    setNoBtnPosition({ x: newX, y: newY });
    setIsHoveringNo(true);

    // Change text randomly
    const randomIndex = Math.floor(Math.random() * TEXTS.NO_BTN_VARIANTS.length);
    setNoBtnText(TEXTS.NO_BTN_VARIANTS[randomIndex]);
  }, []);

  useEffect(() => {
    if (isAccepted) {
      // Logic for after acceptance if needed
    }
  }, [isAccepted]);

  // Reset on resize
  useEffect(() => {
    const handleResize = () => {
      setNoBtnPosition(null);
      setIsHoveringNo(false);
      setNoBtnText(TEXTS.NO_BTN);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* Removed 'transform' class to ensure fixed positioning of child works relative to viewport */}
      <div 
        ref={cardRef}
        className="flex flex-col items-center text-center transition-all duration-500"
      >
        {/* Image Section */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 rounded-full overflow-hidden shadow-2xl border-4 border-white group">
          <img 
            src={IMAGES.MAIN_PHOTO} 
            alt="My Valentine" 
            className={`w-full h-full object-cover transition-transform duration-700 ${isAccepted ? 'scale-110' : 'group-hover:scale-105'}`}
          />
          {isAccepted && (
             <div className="absolute inset-0 bg-valentine-500/20 animate-pulse" />
          )}
        </div>

        {/* Text Section */}
        <div className="mb-8 drop-shadow-sm select-none">
          {!isAccepted ? (
            <h1 className="font-script text-5xl md:text-7xl text-valentine-600 mb-4 animate-float font-bold drop-shadow-lg">
              {TEXTS.QUESTION}
            </h1>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="font-script text-6xl md:text-8xl text-valentine-600 drop-shadow-lg">
                {TEXTS.SUCCESS_TITLE}
              </h1>
              <p className="font-sans text-2xl md:text-3xl text-valentine-800 font-bold drop-shadow-md">
                {TEXTS.SUCCESS_MESSAGE}
              </p>
              <div className="text-5xl animate-bounce pt-6">💖 💑 💖</div>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        {!isAccepted && (
          <div className="flex flex-row items-center justify-center gap-8 w-full relative h-20">
             {/* Yes Button */}
            <button
              onClick={handleAccept}
              className="px-10 py-4 bg-valentine-500 hover:bg-valentine-600 text-white font-bold rounded-full text-2xl shadow-xl transform transition-all hover:scale-110 active:scale-95 z-20 hover:shadow-valentine-500/50"
            >
              {TEXTS.YES_BTN}
            </button>

            {/* No Button */}
            <button
              ref={noBtnRef}
              onMouseEnter={moveNoButton}
              onTouchStart={(e) => {
                 e.preventDefault(); 
                 moveNoButton();
              }}
              onClick={moveNoButton}
              style={
                noBtnPosition
                  ? {
                      position: 'fixed',
                      left: `${noBtnPosition.x}px`,
                      top: `${noBtnPosition.y}px`,
                      zIndex: 9999, // Ensure it's on top
                    }
                  : {
                      position: 'relative',
                    }
              }
              className={`
                px-8 py-4 bg-white text-valentine-600 border-2 border-valentine-200 font-bold rounded-full text-xl shadow-xl 
                cursor-pointer whitespace-nowrap touch-none transition-all duration-200 ease-out
                ${isHoveringNo ? '' : 'hover:bg-gray-50'}
              `}
            >
              {noBtnText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
