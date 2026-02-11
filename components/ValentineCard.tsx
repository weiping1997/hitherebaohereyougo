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

    // Get current dimensions
    const btnRect = noBtnRef.current.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;

    // Viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Safe padding to keep button well inside screen
    const padding = 20; 

    // Estimate max potential width of the button with long text to prevent clipping
    const estimatedMaxWidth = 280; 
    const effectiveWidth = Math.max(btnWidth, estimatedMaxWidth);

    // Calculate available space boundaries
    const minX = padding;
    const maxX = viewportWidth - effectiveWidth - padding;
    const minY = padding;
    const maxY = viewportHeight - btnHeight - padding;
    
    // Ensure we have valid ranges even on small screens
    const safeMaxX = Math.max(minX, maxX);
    const safeMaxY = Math.max(minY, maxY);

    // Define Avoidance Zone (Center of screen where content usually is)
    // Roughly 300px wide, 500px tall in the center
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const avoidRadiusX = 180; 
    const avoidRadiusY = 250;

    let newX = 0;
    let newY = 0;
    let attempts = 0;
    const maxAttempts = 50;

    // Try to find a spot that is NOT in the center
    do {
      newX = Math.random() * (safeMaxX - minX) + minX;
      newY = Math.random() * (safeMaxY - minY) + minY;
      
      // Check if inside the avoidance box
      const inAvoidanceZone = 
        newX + effectiveWidth > centerX - avoidRadiusX &&
        newX < centerX + avoidRadiusX &&
        newY + btnHeight > centerY - avoidRadiusY &&
        newY < centerY + avoidRadiusY;

      if (!inAvoidanceZone) break;
      attempts++;
    } while (attempts < maxAttempts);

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

  // If the user tries to resize window, reset button potentially to avoid it being lost
  useEffect(() => {
    const handleResize = () => {
      setNoBtnPosition(null);
      setIsHoveringNo(false);
      setNoBtnText(TEXTS.NO_BTN); // Reset text on resize/reset
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      <div 
        ref={cardRef}
        className="flex flex-col items-center text-center transition-all duration-500 transform"
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
                 e.preventDefault(); // Prevent accidental clicks on mobile
                 moveNoButton();
              }}
              onClick={moveNoButton}
              style={
                noBtnPosition
                  ? {
                      position: 'fixed',
                      left: noBtnPosition.x,
                      top: noBtnPosition.y,
                      transition: 'all 0.2s ease-out', 
                    }
                  : {
                      position: 'relative',
                    }
              }
              className={`
                px-8 py-4 bg-white text-valentine-600 border-2 border-valentine-200 font-bold rounded-full text-xl shadow-xl 
                z-50 cursor-pointer whitespace-nowrap touch-none
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
