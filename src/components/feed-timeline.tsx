"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

interface FeedTimelineProps {
  items: any[];
  onItemClick: (index: number) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export default function FeedTimeline({
  items,
  onItemClick,
  scrollContainerRef,
}: FeedTimelineProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isNearTimeline, setIsNearTimeline] = useState(false);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Throttle scroll updates using requestAnimationFrame
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight - container.clientHeight;
        const scrollPercent =
          scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        setScrollPosition(scrollPercent);
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scrollContainerRef]);

  // Memoize item positions to avoid recalculating
  const itemPositions = useMemo(() => {
    return items.map((_, index) => (index / (items.length - 1 || 1)) * 100);
  }, [items.length]);

  // Find the item closest to current scroll position
  const closestItemIndex = useMemo(() => {
    if (items.length === 0) return null;
    let closestIndex = 0;
    let minDistance = Math.abs(scrollPosition - itemPositions[0]);

    itemPositions.forEach((pos, index) => {
      const distance = Math.abs(scrollPosition - pos);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, [scrollPosition, itemPositions, items.length]);

  // Determine which item to show in the card
  const activeItemIndex =
    hoveredIndex !== null ? hoveredIndex : closestItemIndex;
  const activeItem = activeItemIndex !== null ? items[activeItemIndex] : null;

  if (items.length === 0) return null;

  return (
    <div
      ref={timelineRef}
      className="fixed right-0 top-0 bottom-0 w-32 z-30 flex flex-col items-center py-8 pointer-events-none"
      onMouseEnter={() => setIsNearTimeline(true)}
      onMouseMove={(e) => {
        // Use viewport coordinates for fixed positioning
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      }}
      onMouseLeave={() => {
        setIsNearTimeline(false);
        setHoveredIndex(null);
        setMousePosition(null);
      }}
    >
      {/* Vertical timeline spine */}
      <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-white/40 pointer-events-none"></div>

      {/* Timeline markers for each item */}
      {items.map((item, index) => {
        const itemPosition = itemPositions[index];
        const distanceFromScroll = Math.abs(scrollPosition - itemPosition);

        // Calculate scale based on scroll proximity (simplified for performance)
        const scrollScale = Math.max(0.5, 1 - distanceFromScroll / 40);
        const isHovered = hoveredIndex === index;
        const isNearScroll = distanceFromScroll < 8;

        // Line width and opacity (simplified calculations)
        const baseWidth = isHovered || isNearScroll ? 32 : 16;
        const finalWidth = baseWidth * scrollScale;
        const lineOpacity =
          isHovered || isNearScroll ? 0.9 : 0.3 + scrollScale * 0.4;

        return (
          <div
            key={item.id || index}
            className="absolute right-0 cursor-pointer pointer-events-auto"
            style={{
              top: `${itemPosition}%`,
              transform: "translateY(-50%)",
              width: "100%",
              height: "20px",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => onItemClick(index)}
          >
            {/* Horizontal line marker */}
            <div
              className="h-0.5 bg-white transition-all duration-200 ease-out hover:bg-white absolute right-4"
              style={{
                width: `${finalWidth}px`,
                opacity: lineOpacity,
                transformOrigin: "right center",
              }}
            />
          </div>
        );
      })}

      {/* Scroll position indicator */}
      <div
        className="absolute right-4 w-0.5 bg-white/80 transition-all duration-100 rounded-full pointer-events-none"
        style={{
          top: `${scrollPosition}%`,
          height: "8px",
          transform: "translateY(-50%)",
        }}
      />

      {/* Always-visible card that follows mouse and updates with scroll/hover */}
      {isNearTimeline && activeItem && mousePosition && (
        <div
          className="fixed w-56 bg-black/95 text-white text-xs p-3 rounded-lg shadow-xl pointer-events-none border border-gray-700 transition-all duration-100 z-40"
          style={{
            left: `${mousePosition.x - 240}px`, // Position to the left of mouse
            top: `${mousePosition.y - 40}px`, // Position above mouse with offset
            transform: "translateY(-50%)",
          }}
        >
          <div className="font-semibold truncate mb-1">
            {activeItem.title || "Untitled"}
          </div>
          <div className="text-gray-400 text-xs">
            {activeItem.type && (
              <span className="capitalize">{activeItem.type}</span>
            )}
            {activeItem.publishedAt && (
              <span className="ml-2">
                {new Date(activeItem.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

