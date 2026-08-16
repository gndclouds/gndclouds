"use client";

import { useMemo } from "react";
import LandingItemCard from "@/components/landing/landing-item-card";
import type { TabItem, TabItemType } from "@/components/landing/hover-preview-card";

export interface LandingCardMasonryEntry {
  item: TabItem;
  type: TabItemType;
}

interface LandingCardMasonryGridProps {
  items: LandingCardMasonryEntry[];
  onLibraryTagPathSelect?: (normalizedFullPath: string) => void;
}

/**
 * Two-column masonry on md+ (even/odd split), single column on small screens —
 * same layout as the home feed grid in LandingTabsWithCards.
 */
export default function LandingCardMasonryGrid({
  items,
  onLibraryTagPathSelect,
}: LandingCardMasonryGridProps) {
  const gridColumns = useMemo(() => {
    const left: LandingCardMasonryEntry[] = [];
    const right: LandingCardMasonryEntry[] = [];
    items.forEach((entry, i) => {
      (i % 2 === 0 ? left : right).push(entry);
    });
    return { left, right };
  }, [items]);

  return (
    <>
      <div className="flex flex-col gap-5 sm:gap-6 md:hidden">
        {items.map(({ item, type }) => (
          <div key={`${type}-${item.slug}`} className="min-w-0">
            <LandingItemCard
              item={item}
              type={type}
              layout="grid"
              onLibraryTagPathSelect={onLibraryTagPathSelect}
            />
          </div>
        ))}
      </div>
      <div className="hidden min-w-0 md:flex md:flex-row md:items-start md:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-5 sm:gap-6">
          {gridColumns.left.map(({ item, type }) => (
            <div key={`${type}-${item.slug}`} className="min-w-0">
              <LandingItemCard
                item={item}
                type={type}
                layout="grid"
                onLibraryTagPathSelect={onLibraryTagPathSelect}
              />
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5 sm:gap-6">
          {gridColumns.right.map(({ item, type }) => (
            <div key={`${type}-${item.slug}`} className="min-w-0">
              <LandingItemCard
                item={item}
                type={type}
                layout="grid"
                onLibraryTagPathSelect={onLibraryTagPathSelect}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
