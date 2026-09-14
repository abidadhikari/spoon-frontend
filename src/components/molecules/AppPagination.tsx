"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/client-services";

export interface AppPaginationProps {
  pagination?: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function AppPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = "",
}: AppPaginationProps) {
  if (!pagination) return null;

  const { page, page_size, total, total_pages } = pagination;

  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      {/* Mobile view */}
      <div className="flex flex-1 items-center justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {total_pages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= total_pages}
        >
          Next
        </Button>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{total === 0 ? 0 : (page - 1) * page_size + 1}</span> to{" "}
            <span className="font-medium">{Math.min(page * page_size, total)}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <select
              className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm transition-colors hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-ring"
              value={page_size}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
              }}
              aria-label="Select rows per page"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">
            Page {page} of {total_pages || 1}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= total_pages || total === 0}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

