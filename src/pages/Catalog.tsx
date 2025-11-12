import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookCard } from '@/components/BookCard';
import { books, categories } from '@/data/books';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All Books';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = useMemo(() => {
    let filtered = books;

    if (categoryParam !== 'All Books') {
      filtered = filtered.filter(book => book.category === categoryParam);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [categoryParam, searchQuery]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {categoryParam === 'All Books' ? 'All Books' : categoryParam}
          </h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search books or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={categoryParam === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                if (category === 'All Books') {
                  setSearchParams({});
                } else {
                  setSearchParams({ category });
                }
              }}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No books found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
