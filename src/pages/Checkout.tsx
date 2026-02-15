import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [upiApp, setUpiApp] = useState<'none' | 'phonepe' | 'gpay' | 'paytm'>('none');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const orderItems = items
      .map(
        (item, i) =>
          `${i + 1}. ${item.book.title} (x${item.quantity}) — ₹${(item.book.price * item.quantity).toFixed(2)}`
      )
      .join('\n');

    const orderTotal = (total + 5.99 + total * 0.1).toFixed(2);
    const paymentType = paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment';

    // ─── 1. Send email to admin via FormSubmit ───
    try {
      const res = await fetch('https://formsubmit.co/ajax/1f4c47477f58bb4e8a43760452d0fe9c', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `🛒 New Order #${Date.now().toString(36).toUpperCase()} — ₹${orderTotal} from ${formData.fullName}`,
          _replyto: formData.email,
          _template: 'table',
          _captcha: 'false',
          'Order Date': orderDate,
          'Customer Name': formData.fullName,
          'Customer Email': formData.email,
          'Customer Phone': formData.phone,
          'Street Address': formData.address,
          'City': formData.city,
          'ZIP Code': formData.zipCode,
          'Items Ordered': orderItems,
          'Subtotal': `₹${total.toFixed(2)}`,
          'Shipping': '₹5.99',
          'Tax (10%)': `₹${(total * 0.1).toFixed(2)}`,
          'Grand Total': `₹${orderTotal}`,
          'Payment Method': paymentType,
        }),
      });
      const data = await res.json();
      if (!data.success) console.error('FormSubmit error:', data);
    } catch (err) {
      console.error('Email notification failed:', err);
    }

    toast.success('✅ Order placed successfully!', {
      description: 'Thank you for your purchase! Order details have been sent to the admin.',
    });

    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = total;
  const shipping = 5.99;
  const tax = total * 0.1;
  const finalTotal = subtotal + shipping + tax;

  // UPI IDs for each payment app
  const upiConfig = {
    phonepe: { pa: 'ravulaajay9@ybl', pn: 'Ravula Ajay' },
    gpay: { pa: 'ravulaajay9@oksbi', pn: 'Ravula Ajay' },
    paytm: { pa: '6309680667@ptyes', pn: 'Ravula Ajay' },
  };

  // Generate UPI payment URL with amount
  const getUpiUrl = (app: 'phonepe' | 'gpay' | 'paytm') => {
    const { pa, pn } = upiConfig[app];
    return `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${finalTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Online Book Store Payment')}`;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/cart')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-6">
              Checkout
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                <div className="flex gap-4 mb-6">
                  <Button
                    type="button"
                    variant={paymentMethod === 'cod' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('cod')}
                    className="flex-1"
                  >
                    💵 Cash on Delivery
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('upi')}
                    className="flex-1"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    UPI Payment
                  </Button>
                </div>

                {paymentMethod === 'cod' ? (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-1">
                      💵 Cash on Delivery
                    </p>
                    <p className="text-sm text-foreground">
                      Pay with cash when your order is delivered to your doorstep.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Please keep exact change ready for the delivery person.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <p className="text-sm text-muted-foreground">
                      Select a UPI app to pay <span className="font-semibold text-foreground">₹{(total + 5.99 + total * 0.1).toFixed(2)}</span>
                    </p>

                    {/* UPI App Selector Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setUpiApp(upiApp === 'phonepe' ? 'none' : 'phonepe')}
                        className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                          upiApp === 'phonepe'
                            ? 'border-purple-500 bg-purple-50/80 shadow-lg ring-1 ring-purple-200'
                            : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                        }`}
                      >
                        {upiApp === 'phonepe' && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">₱</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-800">PhonePe</p>
                          <p className="text-xs text-gray-500">Scan & Pay</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiApp(upiApp === 'gpay' ? 'none' : 'gpay')}
                        className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                          upiApp === 'gpay'
                            ? 'border-blue-500 bg-blue-50/80 shadow-lg ring-1 ring-blue-200'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        {upiApp === 'gpay' && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-green-400 to-yellow-400 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">G</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-800">Google Pay</p>
                          <p className="text-xs text-gray-500">Scan & Pay</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiApp(upiApp === 'paytm' ? 'none' : 'paytm')}
                        className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                          upiApp === 'paytm'
                            ? 'border-sky-500 bg-sky-50/80 shadow-lg ring-1 ring-sky-200'
                            : 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-sm'
                        }`}
                      >
                        {upiApp === 'paytm' && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">₹</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-800">Paytm</p>
                          <p className="text-xs text-gray-500">Scan & Pay</p>
                        </div>
                      </button>
                    </div>

                    {/* QR Code Display */}
                    {upiApp !== 'none' && (
                      <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className={`rounded-2xl overflow-hidden border-2 shadow-xl mx-auto max-w-[280px] ${
                          upiApp === 'phonepe' ? 'border-purple-200' : upiApp === 'gpay' ? 'border-blue-200' : 'border-sky-200'
                        }`}>
                          {/* Header */}
                          <div className={`py-3 px-4 text-center ${
                            upiApp === 'phonepe'
                              ? 'bg-gradient-to-r from-purple-600 to-purple-500'
                              : upiApp === 'gpay'
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                                : 'bg-gradient-to-r from-sky-500 to-sky-400'
                          }`}>
                            <p className="text-white text-sm font-semibold tracking-wide">
                              {upiApp === 'phonepe' ? '📱 PhonePe' : upiApp === 'gpay' ? '📱 Google Pay' : '📱 Paytm'}
                            </p>
                            <p className="text-white/80 text-xs mt-0.5">Scan to Pay</p>
                          </div>

                          {/* QR Code - Dynamic with amount */}
                          <div className="bg-white p-4 flex justify-center">
                            <QRCodeSVG
                              value={getUpiUrl(upiApp as 'phonepe' | 'gpay' | 'paytm')}
                              size={200}
                              level="H"
                              includeMargin={true}
                              className="rounded-lg"
                            />
                          </div>

                          {/* Footer */}
                          <div className={`py-3 px-4 text-center ${
                            upiApp === 'phonepe' ? 'bg-purple-50' : upiApp === 'gpay' ? 'bg-blue-50' : 'bg-sky-50'
                          }`}>
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Ravula Ajay</p>
                            <div className={`inline-block mt-2 py-1.5 px-5 rounded-full text-sm font-bold ${
                              upiApp === 'phonepe'
                                ? 'bg-purple-600 text-white'
                                : upiApp === 'gpay'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-sky-500 text-white'
                            }`}>
                              ₹{(total + 5.99 + total * 0.1).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {upiApp === 'none' && (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <Smartphone className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-400">
                          Select a payment app to view QR code
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              <Button type="submit" size="lg" className="w-full">
                Complete Order
              </Button>
            </form>
          </div>

          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.book.id} className="flex gap-4">
                    <img
                      src={item.book.image}
                      alt={item.book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.book.title}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">₹{(item.book.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
