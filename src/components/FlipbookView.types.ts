export type FlipbookEvent =
  | {type: 'ready'; page: number; totalPages: number}
  | {type: 'pageChanged'; page: number; totalPages: number}
  | {type: 'error'; message: string};

export type FlipbookViewProps = {
  html: string;
  onEvent: (event: FlipbookEvent) => void;
};

export function parseFlipbookEvent(value: string): FlipbookEvent | null {
  try {
    const event = JSON.parse(value) as Partial<FlipbookEvent>;
    if (event.type === 'error' && typeof event.message === 'string') {
      return {type: 'error', message: event.message};
    }
    if ((event.type === 'ready' || event.type === 'pageChanged') && typeof event.page === 'number' && typeof event.totalPages === 'number') {
      return {type: event.type, page: event.page, totalPages: event.totalPages};
    }
  } catch {
    return null;
  }
  return null;
}
