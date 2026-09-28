export type DocumentType = 'pdf' | 'images';

export type ReadingStatus = 'notStarted' | 'reading' | 'completed';

export interface TableOfContentsEntry {
  title: string;
  page: number;
}

export interface BookCatalogEntry {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  coverColor: string;
  category: string;
  language: string;
  totalPages: number;
  filePath: string;
  documentType: DocumentType;
  tableOfContents: TableOfContentsEntry[];
}

export interface ReadingState {
  bookId: string;
  currentPage: number;
  lastReadAt: string;
}

export interface LibraryBook extends BookCatalogEntry {
  currentPage: number;
  completionPercent: number;
  readingStatus: ReadingStatus;
  lastReadAt?: string;
}

export interface CatalogIssue {
  bookId?: string;
  message: string;
}

export interface CatalogLoadResult {
  books: LibraryBook[];
  issues: CatalogIssue[];
}
