'use client'
import Lenis from 'lenis';
import { IWithChildren } from '@/types/tehnic';
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

interface Props extends IWithChildren {
  wrapper?: HTMLDivElement | null;
  root?: boolean;
  enableScrollTransfer?: boolean;
  noAnimation?: boolean;
}

function SmoothScrolling({
  children,
  root,
  wrapper,
  enableScrollTransfer = false,
  noAnimation = false,
}: Props) {
  const lenisRef = useRef<Lenis | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef(0);
  const lastTouchY = useRef(0);

  const animation = (target: HTMLElement, direction: 'top' | 'bottom') => {
    const el = target.closest('.lenis__content') as HTMLDivElement | null;

    if (!el || el.classList.contains('enableScrollTransfer')) return;

    el.style.transform = `translateY(${direction === 'bottom' ? -15 : 15}rem)`;
    setTimeout(() => {
      el.style.transform = '';
    }, 300);
  };

  const isEnd = (deltaY: number, el: Element) => {
    const { scrollTop, scrollHeight, clientHeight } = el as HTMLElement;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 1 && deltaY > 0;
    const isTop = scrollTop === 0 && deltaY < 0;

    return { isBottom, isTop };
  };

  const handleScrollTransfer = (deltaY: number, el: Element) => {
    const lenisCurrent = lenisRef.current;
    if (!enableScrollTransfer || !lenisCurrent) return false;

    const { isTop, isBottom } = isEnd(deltaY, el);

    if (isBottom || isTop) {
      lenisCurrent.stop();
      return true;
    }

    lenisCurrent.start();
    return false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
    lastTouchY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentTouchY = e.touches[0].clientY;
    const deltaY = -(currentTouchY - lastTouchY.current);
    lastTouchY.current = currentTouchY;

    const el = (e.target as HTMLElement).closest('.lenis.lenis-smooth');
    if (!el) return;

    if (enableScrollTransfer) {
      handleScrollTransfer(deltaY, el);
    } else if (!noAnimation) {
      const { isTop, isBottom } = isEnd(deltaY, el);

      if (isBottom) {
        animation(e.target as HTMLElement, 'bottom');
      } else if (isTop) {
        animation(e.target as HTMLElement, 'top');
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement).closest('.lenis.lenis-smooth');
    if (!el) return;

    if (enableScrollTransfer) {
      handleScrollTransfer(e.deltaY, el);
    } else if (!noAnimation) {
      const { isTop, isBottom } = isEnd(e.deltaY, el);

      if (isBottom) {
        animation(e.target as HTMLElement, 'bottom');
      } else if (isTop) {
        animation(e.target as HTMLElement, 'top');
      }
    }
  };

  useEffect(() => {
    const lenis = new Lenis({
      ...(root
        ? {}
        : {
            wrapper: wrapper ?? wrapperRef.current ?? undefined,
            content: contentRef.current ?? undefined,
          }),
      lerp: 0.1,
      duration: 1.5,
      smoothWheel: true,
      syncTouch: true,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    const observer = new MutationObserver(() => {
      lenis.resize();
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [root, wrapper]);

  if (!root && !wrapper) {
    return (
      <div ref={wrapperRef} className="lenis lenis-smooth">
        <div
          ref={contentRef}
          className={cn('lenis__content', { enableScrollTransfer })}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={contentRef}
      className={cn('lenis__content', { enableScrollTransfer })}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {children}
    </div>
  );
}

export default SmoothScrolling;
