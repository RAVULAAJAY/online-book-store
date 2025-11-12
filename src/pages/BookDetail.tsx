import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Package, Truck, Shield } from 'lucide-react';
import { books } from '@/data/books';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

export const BookDetail = () => {
  const { id } = useParams();
  const book = books.find(b => b.id === id);
  const { addItem } = useCart();

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Book not found</h1>
          <Link to="/catalog">
            <Button>Browse Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(book);
    toast.success('Added to cart', {
      description: `${book.title} has been added to your cart.`
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link to="/catalog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalog
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Book Image */}
          <div>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted shadow-lg">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              {book.originalPrice && (
                <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                  Save ${(book.originalPrice - book.price).toFixed(2)}
                </Badge>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div>
            <div className="mb-4">
              <Badge variant="secondary" className="mb-3">{book.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(book.rating)
                          ? 'fill-warm-accent text-warm-accent'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {book.rating} ({book.reviewCount} reviews)
                </span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-primary">${book.price}</span>
                {book.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${book.originalPrice}
                  </span>
                )}
              </div>
              
              <div className="flex gap-3 mb-6">
                <Button onClick={handleAddToCart} size="lg" className="flex-1">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 text-center">
                  <Package className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">In Stock</p>
                </Card>
                <Card className="p-3 text-center">
                  <Truck className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Fast Shipping</p>
                </Card>
                <Card className="p-3 text-center">
                  <Shield className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Secure</p>
                </Card>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">About This Book</h2>
              <p className="text-muted-foreground mb-4">{book.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ISBN:</span>
                  <p className="font-medium text-foreground">{book.isbn}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Publisher:</span>
                  <p className="font-medium text-foreground">{book.publisher}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pages:</span>
                  <p className="font-medium text-foreground">{book.pages}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Format:</span>
                  <p className="font-medium text-foreground">{book.format}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Language:</span>
                  <p className="font-medium text-foreground">{book.language}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Published:</span>
                  <p className="font-medium text-foreground">
                    {new Date(book.publishDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
