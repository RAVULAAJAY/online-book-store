import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Book } from '@/types/book';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(book);
    toast.success('Added to cart', {
      description: `${book.title} has been added to your cart.`
    });
  };

  return (
    <Link to={`/book/${book.id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {book.originalPrice && (
            <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
              Sale
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-warm-accent text-warm-accent" />
            <span className="text-sm font-medium">{book.rating}</span>
            <span className="text-xs text-muted-foreground">({book.reviewCount})</span>
          </div>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">${book.price}</span>
            {book.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${book.originalPrice}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            size="sm"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
