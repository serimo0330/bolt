import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "경고",
  message = "퀴즈를 건너뛰고 바로 실전 모의훈련으로 이동하시겠습니까? 퀴즈를 건너뛰면 '대응 리더' 배지를 획득할 수 없습니다."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-gray-900 border-2 border-red-500 rounded-lg p-8 max-w-md w-full mx-4 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-red-400 text-center mb-4">
          {title}
        </h2>
        
        {/* Message */}
        <p className="text-green-200 text-center mb-8 leading-relaxed">
          {message}
        </p>
        
        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg
                     hover:bg-gray-600 transition-all duration-300 font-bold"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg
                     hover:bg-red-700 transition-all duration-300 font-bold"
          >
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
};