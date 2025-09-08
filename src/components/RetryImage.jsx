import React, { useEffect, useMemo, useRef, useState } from 'react';
import { assetUrl } from '../utils/api';

// A resilient <img> wrapper that retries loading with backoff before showing fallback
const RetryImage = ({ src, alt, className, fallback = assetUrl(''), maxRetries = 3, onClick }) => {
  const [attempt, setAttempt] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(() => (src ? assetUrl(src) : fallback));
  const timeoutRef = useRef(null);

  // Normalize src whenever it changes
  const normalizedSrc = useMemo(() => (src ? assetUrl(src) : ''), [src]);

  useEffect(() => {
    // Reset attempts when the source changes
    setAttempt(0);
    setCurrentSrc(normalizedSrc || fallback);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedSrc]);

  const handleError = () => {
    if (attempt < maxRetries && normalizedSrc) {
      const nextAttempt = attempt + 1;
      const delayMs = Math.min(2000, 200 * Math.pow(2, attempt));
      timeoutRef.current = setTimeout(() => {
        // Bust cache to avoid stuck 404/opaque errors
        const bust = normalizedSrc.includes('?') ? `${normalizedSrc}&r=${Date.now()}` : `${normalizedSrc}?r=${Date.now()}`;
        setCurrentSrc(bust);
        setAttempt(nextAttempt);
      }, delayMs);
    } else {
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onClick={onClick}
      crossOrigin="anonymous"
      loading="lazy"
    />
  );
};

export default RetryImage;


