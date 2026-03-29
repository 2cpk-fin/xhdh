import React, { useEffect, useState } from 'react';

interface AnnouncementBoxProps {
  message: string;
  isSuccess: boolean;
  duration?: number; // in milliseconds, default 5000
  onDismiss?: () => void;
}

const AnnouncementBox: React.FC<AnnouncementBoxProps> = ({
  message,
  isSuccess,
  duration = 5000,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsVisible(false);
        onDismiss?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onDismiss]);

  if (!isVisible) return null;

  const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
  const bgColor = isSuccess ? 'bg-green-500/10' : 'bg-red-500/10';
  const textColor = isSuccess ? 'text-green-400' : 'text-red-400';
  const lineColor = isSuccess ? 'bg-green-400' : 'bg-red-400';

  return (
    <div className={`fixed bottom-6 left-6 max-w-sm animate-slide-in-bottom`}>
      <div
        className={`${bgColor} border-2 ${borderColor} rounded-lg p-4 shadow-lg overflow-hidden`}
      >
        {/* Message */}
        <p className={`${textColor} font-semibold text-sm mb-3`}>
          {isSuccess ? '✓ Success' : '✗ Error'}
        </p>
        <p className="text-white text-sm mb-3">{message}</p>

        {/* Progress bar at bottom */}
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`${lineColor} h-full transition-all duration-100`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBox;
