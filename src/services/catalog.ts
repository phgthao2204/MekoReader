import rawCatalog from '../data/books.json';
import {initialReadingStates} from '../data/reading-state';
import {BookCatalogEntry, CatalogIssue, CatalogLoadResult, DocumentType, LibraryBook, ReadingState} from '../types/book';

const requiredTextFields: (keyof Pick<BookCatalogEntry, 'id' | 'title' | 'author' | 'description' | 'coverImage' | 'category' | 'language' | 'filePath'>)[] = ['id', 'title', 'author', 'description', 'coverImage', 'category', 'language', 'filePath'];
const supportedDocumentTypes: DocumentType[] = ['pdf', 'images'];

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateBook(record: unknown, index: number): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  const candidate = record !== null && typeof record === 'object' ? record as Partial<BookCatalogEntry> : {};
  const label = hasText(candidate.title) ? candidate.title : `Mục #${index + 1}`;

  requiredTextFields.forEach(field => {
    if (!hasText(candidate[field])) {
      issues.push({bookId: candidate.id, message: `${label}: thiếu trường bắt buộc “${field}”.`});
    }
  });
  if (!Number.isInteger(candidate.totalPages) || (candidate.totalPages ?? 0) <= 0) {
    issues.push({bookId: candidate.id, message: `${label}: “totalPages” phải là số nguyên dương.`});
  }
  if (!supportedDocumentTypes.includes(candidate.documentType as DocumentType)) {
    issues.push({bookId: candidate.id, message: `${label}: “documentType” chỉ nhận “pdf” hoặc “images”.`});
  }
  if (!Array.isArray(candidate.tableOfContents) || candidate.tableOfContents.length === 0) {
    issues.push({bookId: candidate.id, message: `${label}: thiếu mục lục hợp lệ.`});
  } else if (candidate.tableOfContents.some(entry => {
    if (entry === null || typeof entry !== 'object') return true;
    return !hasText(entry.title) || !Number.isInteger(entry.page) || entry.page < 1 || entry.page > (candidate.totalPages ?? 0);
  })) {
    issues.push({bookId: candidate.id, message: `${label}: mục lục có tiêu đề hoặc số trang không hợp lệ.`});
  }
  return issues;
}

function combineReadingState(book: BookCatalogEntry, readingState?: ReadingState): LibraryBook {
  const currentPage = Math.min(Math.max(readingState?.currentPage ?? 0, 0), book.totalPages);
  const completionPercent = Math.round((currentPage / book.totalPages) * 100);
  const readingStatus = currentPage === 0 ? 'notStarted' : currentPage === book.totalPages ? 'completed' : 'reading';
  return {...book, currentPage, completionPercent, readingStatus};
}

export async function loadBookCatalog(): Promise<CatalogLoadResult> {
  const catalog = rawCatalog as unknown;
  const issues: CatalogIssue[] = [];
  const validBooks: BookCatalogEntry[] = [];
  if (!Array.isArray(catalog)) {
    return {books: [], issues: [{message: 'Catalog phải là một danh sách sách.'}]};
  }
  catalog.forEach((record, index) => {
    const validationIssues = validateBook(record, index);
    if (validationIssues.length > 0) {
      issues.push(...validationIssues);
      return;
    }
    validBooks.push(record as BookCatalogEntry);
  });
  const stateByBookId = new Map(initialReadingStates.map(state => [state.bookId, state]));
  return {books: validBooks.map(book => combineReadingState(book, stateByBookId.get(book.id))), issues};
}
