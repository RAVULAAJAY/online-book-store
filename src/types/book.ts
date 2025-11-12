export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  isbn: string;
  publisher: string;
  publishDate: string;
  pages: number;
  language: string;
  category: string;
  inStock: boolean;
  format: 'Hardcover' | 'Paperback' | 'Ebook';
}

export interface CartItem {
  book: Book;
  quantity: number;
}
