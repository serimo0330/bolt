import React from 'react';
import { Shield, Eye } from 'lucide-react';

export const ClassifiedHeader: React.FC = () => {
  return (
    <div className="w-full bg-red-900/20 border-t-2 border-b-2 border-red-500 py-3 mb-8">
      <div className="flex items-center justify-center gap-4">
        <Shield className="w-6 h-6 text-red-400" />
        <span className="text-red-400 font-mono text-lg font-bold tracking-widest">
          [ CLASSIFIED - TOP SECRET ]
        </span>
        <Eye className="w-6 h-6 text-red-400" />
      </div>
      <div className="text-center mt-2">
        <span className="text-red-300 font-mono text-sm">
          AUTHORIZED PERSONNEL ONLY - SECURITY CLEARANCE REQUIRED
        </span>
      </div>
    </div>
  );
};