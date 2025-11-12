import { useState, useEffect } from 'react';
import { CartItem } from '@/types/book';
import { Book } from '@/types/book';

const CART_STORAGE_KEY = 'bookstore-cart';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (book: Book, quantity: number = 1) => {
    setItems(current => {
      const existingItem = current.find(item => item.book.id === book.id);
      
      if (existingItem) {
        return current.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...current, { book, quantity }];
    });
  };

  const removeItem = (bookId: string) => {
    setItems(current => current.filter(item => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(bookId);
      return;
    }
    
    setItems(current =>
      current.map(item =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
  };
};
