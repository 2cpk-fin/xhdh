import React from 'react';

interface SpaceBackgroundProps {
  showPlanet?: boolean;
}

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const SpaceBackground: React.FC<SpaceBackgroundProps> = ({ showPlanet = false }) => {
  const stars = Array.from({ length: Math.round(180 * 1.3) }, (_, i) => i);
  const shootingStars = Array.from({ length: 26 }, (_, i) => i);

  return (
    <div className="space-background fixed inset-0 z-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={`star-${star}`}
          style={{
            left: `${random(0, 100)}%`,
            top: `${random(0, 100)}%`,
            animationDelay: `${random(0, 2)}s`,
            animationDuration: `${random(4, 7)}s`,
            width: `${random(1, 2)}px`,
            height: `${random(1, 2)}px`,
            opacity: random(0.3, 1),
          }}
          className="star"
        />
      ))}

      {shootingStars.map((shoot) => (
        <div
          key={`shooting-${shoot}`}
          className="shooting-star"
          style={{
            top: `${random(5, 80)}%`,
            left: `${random(-30, 110)}%`,
            animationDelay: `${random(0, 7)}s`,
            animationDuration: `${random(0.5, 1.1)}s`,
            opacity: random(0.7, 1),
            transform: `scale(${random(0.2, 0.9)})`,
          }}
        />
      ))}

      {showPlanet && (
        <div className="planet-overlay">
          <div className="planet-glow" />
          <div className="planet-surface">
            <div className="crater crater-1" />
            <div className="crater crater-2" />
            <div className="crater crater-3" />
            <div className="crater crater-4" />
            <div className="crater crater-5" />
            <div className="crater crater-6" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceBackground;
