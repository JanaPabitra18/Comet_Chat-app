import React from 'react';

export default function CometBackground() {
  return (
    <div className="comet-container" aria-hidden="true">
      <span className="comet" style={{ top: '10%', left: '-10%', animationDelay: '0s' }} />
      <span className="comet" style={{ top: '30%', left: '110%', animationDelay: '2s' }} />
      <span className="comet" style={{ top: '60%', left: '-15%', animationDelay: '4s' }} />
      <span className="comet" style={{ top: '80%', left: '105%', animationDelay: '6s' }} />
      <span className="comet" style={{ top: '45%', left: '50%', animationDelay: '1s' }} />
    </div>
  );
}
