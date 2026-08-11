import React from 'react';

export const FloatingLeaves: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Leaf 1 */}
      <div className="absolute top-1/4 left-[8%] opacity-20 text-emerald-400 animate-float-slow">
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17,8C8,10 59,1617 3.5,12C2,7 7,2 17,8Z" />
        </svg>
      </div>

      {/* Leaf 2 */}
      <div className="absolute top-2/3 right-[10%] opacity-15 text-green-300 animate-float-reverse">
        <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      </div>

      {/* Leaf 3 */}
      <div className="absolute top-1/2 left-[85%] opacity-25 text-emerald-500 animate-float-slow">
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>
    </div>
  );
};
