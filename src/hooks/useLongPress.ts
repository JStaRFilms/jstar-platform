// src/hooks/useLongPress.ts
import { useCallback, useRef, useState } from 'react';

export interface LongPressOptions {
  onLongPress?: () => void;
  onTap?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  delay?: number;
  shouldPreventDefault?: boolean;
}

export function useLongPress(options: LongPressOptions = {}) {
  const {
    onLongPress,
    onTap,
    onPressStart,
    onPressEnd,
    delay = 500,
    shouldPreventDefault = true,
  } = options;

  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const target = useRef<EventTarget | null>(null);

  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (shouldPreventDefault && 'touches' in event) {
        event.preventDefault();
      }
      if (shouldPreventDefault) {
        event.preventDefault();
      }
      onPressStart?.();
      setIsLongPressActive(false);
      target.current = event.target;

      timeout.current = setTimeout(() => {
        onLongPress?.();
        setIsLongPressActive(true);
      }, delay);
    },
    [onLongPress, onPressStart, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event: React.TouchEvent | React.MouseEvent, shouldHandleOnClick = true) => {
      if (shouldPreventDefault && 'touches' in event) {
        event.preventDefault();
      }
      if (shouldPreventDefault) {
        event.preventDefault();
      }
      if (isLongPressActive) {
        // Long press already happened, don't fire onTap
        setIsLongPressActive(false);
        return;
      }

      timeout.current && clearTimeout(timeout.current);
      onPressEnd?.();

      // Only trigger tap if we should handle click and haven't already done long press
      if (shouldHandleOnClick) {
        onTap?.();
      }
    },
    [isLongPressActive, onPressEnd, onTap, shouldPreventDefault]
  );

  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
    isLongPressActive,
  };
}
