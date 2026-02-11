import React from 'react';
import { FloatingHeartsBg } from './components/FloatingHearts';
import { ValentineCard } from './components/ValentineCard';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-valentine-50 via-valentine-100 to-valentine-200 overflow-hidden">
      <FloatingHeartsBg />
      <ValentineCard />
    </div>
  );
};

export default App;
