import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';
import { books } from '@/data/books';

export const Home = () => {
  const featuredBooks = books.slice(0, 4);
  const bestSellers = books.filter(book => book.rating >= 4.5).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-medium">Discover Your Next Great Read</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Books That Transform Your World
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
              Explore thousands of titles across every genre. Find your next favorite book and get it delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog">
                <Button variant="hero" size="lg" className="group">
                  Browse Collection
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/catalog?category=Fiction">
                <Button variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  View Fiction
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Books</h2>
              <p className="text-muted-foreground">Hand-picked selections just for you</p>
            </div>
            <Link to="/catalog">
              <Button variant="ghost">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-3xl font-bold text-foreground">Best Sellers</h2>
              <p className="text-muted-foreground">Most popular books this month</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Fiction', 'Science Fiction', 'Biography', 'Self-Help', 'Business', 'History', 'Thriller', 'Mystery'].map(category => (
              <Link key={category} to={`/catalog?category=${category}`}>
                <div className="group p-6 bg-card border rounded-lg hover:border-primary hover:shadow-md transition-all text-center">
                  <Star className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
