import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';

export const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { items, clearCart, total } = useCart();

  useEffect(() => {
    // If there's no items, redirect to home
    if (items.length === 0) {
      navigate('/');
    }
  }, [items.length, navigate]);

  const orderNumber = `BH${Date.now().toString().slice(-8)}`;
  const orderTotal = (total * 1.1).toFixed(2);

  const handleFinish = () => {
    clearCart();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <Card className="max-w-2xl w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order Successful!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        <div className="bg-muted rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Order #{orderNumber}</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Total:</span>
              <span className="font-semibold text-foreground">${orderTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items:</span>
              <span className="font-semibold text-foreground">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-accent/10 rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground">
            A confirmation email has been sent to your email address with your order details and tracking information.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={handleFinish} size="lg" className="w-full">
            <Home className="h-5 w-5 mr-2" />
            Continue Shopping
          </Button>
          <Link to="/catalog">
            <Button variant="outline" size="lg" className="w-full">
              Browse More Books
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
