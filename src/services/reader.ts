import {LibraryBook} from '../types/book';

export interface PreparedBookData {
  book: LibraryBook;
  sourceType: 'pdf' | 'page-assets';
}

const PREPARE_DELAY_MS = 1400;

export async function prepareBookForReading(book: LibraryBook): Promise<PreparedBookData> {
  await new Promise(resolve => setTimeout(resolve, PREPARE_DELAY_MS));

  if (!book.id?.trim() || !book.filePath?.trim() || !Number.isInteger(book.totalPages) || book.totalPages <= 0
    || !['pdf', 'images'].includes(book.documentType)) {
    throw new Error('Dữ liệu sách chưa đầy đủ để mở trình đọc.');
  }

  return {
    book,
    sourceType: book.documentType === 'pdf' ? 'pdf' : 'page-assets',
  };
}
