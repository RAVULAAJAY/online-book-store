import { Link } from 'react-router-dom';
import { ShoppingCart, Search, BookOpen, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const { items } = useCart();
  const { user, signOut } = useAuth();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Online Book Store</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/catalog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Browse Books
            </Link>
            <Link to="/catalog?category=Fiction" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Fiction
            </Link>
            <Link to="/catalog?category=Science Fiction" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Sci-Fi
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            {user && (
              <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sign Out">
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

