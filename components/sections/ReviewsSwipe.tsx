'use client';

import { useEffect } from 'react';

const PHONE = '(max-width: 899px)';
const SPEED = 26; // pixels per second
const RESUME_MS = 2500;

/**
 * Phones and tablets: the reviews row is a native sideways scroller (CSS), so it can be swiped.
 * This keeps it drifting slowly on its own, holds still while a finger is on it and for a moment
 * after, and loops seamlessly over the repeated sets of cards. Wide screens keep the CSS slide.
 */
export default function ReviewsSwipe({ target }: { target: string }) {
  useEffect(() => {
    const el = document.getElementById(target);
    const track = el?.querySelector<HTMLElement>('.reviews-marquee__track');
    if (!el || !track) return;
    const phone = window.matchMedia(PHONE);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf = 0;
    let last = 0;
    let pos = 0;
    let held = false;
    let visible = true;
    let resume: ReturnType<typeof setTimeout> | undefined;

    // One set of cards: the scroll distance after which the view looks the same again.
    const setWidth = () => track.scrollWidth / (Number(getComputedStyle(track).getPropertyValue('--copies')) || 2);

    // Keep the position within the first set: past it (or before it) the view is identical one
    // set further back (or on).
    const wrap = () => {
      const w = setWidth();
      if (w <= 0) return;
      if (pos >= w) pos -= w;
      else if (pos < 0) pos += w;
    };

    const tick = (t: number) => {
      const dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
      last = t;
      if (phone.matches && !still.matches && !held && visible) {
        pos += SPEED * dt;
        wrap();
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };

    const hold = () => {
      held = true;
      clearTimeout(resume);
      if (!phone.matches) return;
      // Move one set on (the view is identical) so a swipe back has room to go.
      const w = setWidth();
      if (w > 0 && el.scrollLeft < w / 2) el.scrollLeft += w;
    };
    const release = () => {
      clearTimeout(resume);
      resume = setTimeout(() => {
        pos = el.scrollLeft;
        wrap();
        el.scrollLeft = pos;
        held = false;
      }, RESUME_MS);
    };
    // A swipe (and its momentum) moves the view; keep the loop seamless while it does.
    const onScroll = () => {
      if (!held) return;
      const w = setWidth();
      const end = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= end - 1) el.scrollLeft -= w;
      else if (el.scrollLeft < 1) el.scrollLeft += w;
    };

    const start = () => {
      pos = 0;
      el.scrollLeft = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    start();
    phone.addEventListener('change', start);
    el.addEventListener('touchstart', hold, { passive: true });
    el.addEventListener('touchend', release, { passive: true });
    el.addEventListener('touchcancel', release, { passive: true });
    el.addEventListener('pointerdown', hold);
    el.addEventListener('pointerup', release);
    el.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resume);
      io.disconnect();
      phone.removeEventListener('change', start);
      el.removeEventListener('touchstart', hold);
      el.removeEventListener('touchend', release);
      el.removeEventListener('touchcancel', release);
      el.removeEventListener('pointerdown', hold);
      el.removeEventListener('pointerup', release);
      el.removeEventListener('scroll', onScroll);
    };
  }, [target]);

  return null;
}
