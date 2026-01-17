"use client";
import { useEffect, useRef } from "react";

interface CounterAnimationProps {
  target: number;
  duration?: number;
  className?: string;
}

export default function CounterAnimation({
  target,
  duration = 2000,
  className = "",
}: CounterAnimationProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateCounter();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  const animateCounter = () => {
    if (!counterRef.current) return;

    const startTime = Date.now();
    const startValue = 0;
    const isDecimal = target % 1 !== 0;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (target - startValue) * easeOutQuart;

      if (counterRef.current) {
        if (isDecimal) {
          counterRef.current.textContent = currentValue.toFixed(1);
        } else {
          counterRef.current.textContent = Math.floor(currentValue).toString();
        }
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  return (
    <span ref={counterRef} className={className}>
      0
    </span>
  );
}
