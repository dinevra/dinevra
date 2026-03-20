import { useState } from 'react';
import { ShoppingCart, Search, Trash2, Clock, Minus, Plus } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  cartId: string;
}

const CATEGORIES = ['Featured', 'Breakfast', 'Burgers', 'Salads', 'Drinks', 'Desserts'];

const DUMMY_MENU: MenuItem[] = [
  { id: '1', name: 'Avocado Toast', price: 12.50, category: 'Breakfast' },
  { id: '2', name: 'Pancakes Stack', price: 10.00, category: 'Breakfast' },
  { id: '3', name: 'Classic Burger', price: 14.99, category: 'Burgers' },
  { id: '4', name: 'Double Smash Burger', price: 18.50, category: 'Burgers' },
  { id: '5', name: 'Caesar Salad', price: 11.00, category: 'Salads' },
  { id: '6', name: 'Latte', price: 4.50, category: 'Drinks' },
  { id: '7', name: 'Iced Coffee', price: 3.50, category: 'Drinks' },
  { id: '8', name: 'Cheesecake', price: 7.00, category: 'Desserts' },
];

export default function PosTerminal() {
  const [activeCategory, setActiveCategory] = useState<string>('Breakfast');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const filteredMenu = DUMMY_MENU.filter(item => item.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1, cartId: Math.random().toString() }]);
    }
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.cartId === cartId) {
        const newQ = c.quantity + delta;
        return newQ > 0 ? { ...c, quantity: newQ } : c;
      }
      return c;
    }));
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(c => c.cartId !== cartId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCompleteOrder = () => {
    setCart([]);
    setIsPaymentOpen(false);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50">
      
      {/* Categories Sidebar */}
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col p-4 gap-2 overflow-y-auto">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>
        
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold transition-all ${
              activeCategory === cat 
                ? 'bg-blue-50 text-blue-700 border-2 border-blue-600 shadow-sm shadow-blue-500/10' 
                : 'bg-white text-gray-600 border-2 border-transparent hover:bg-gray-50 hover:border-gray-200'
            }`}
          >
            {cat}
            <span className={`text-xs ${activeCategory === cat ? 'text-blue-500' : 'text-gray-400'}`}>&rarr;</span>
          </button>
        ))}
      </div>

      {/* Main Menu Grid */}
      <div className="flex-1 flex flex-col px-6 py-6 pb-24 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6 text-gray-600 font-semibold text-sm">
          <Clock size={16} />
          <span>Last Used / {activeCategory}</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMenu.map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all group active:scale-95 flex flex-col justify-between aspect-square"
            >
              <span className="font-bold text-gray-900 group-hover:text-blue-700 text-left text-lg leading-tight">
                {item.name}
              </span>
              <span className="font-bold text-blue-600 self-start text-xl">
                ${item.price.toFixed(2)}
              </span>
            </button>
          ))}
          {filteredMenu.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 font-medium">
              No items found in this category.
            </div>
          )}
        </div>
      </div>

      {/* Cart Right Panel */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl z-20">
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-gray-50">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <ShoppingCart size={20} className="text-blue-600" />
            Current Order
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {cart.reduce((s, i) => s + i.quantity, 0)} Items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <ShoppingCart size={48} className="opacity-20" />
              <p className="font-medium text-sm">No items in cart</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartId} className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-gray-900 leading-tight pr-4">{item.name}</span>
                  <button onClick={() => removeFromCart(item.cartId)} className="text-red-400 hover:text-red-600 transition-colors bg-red-50 p-1.5 rounded-md">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.cartId, -1)} className="p-1.5 bg-white shadow-sm rounded-md hover:bg-gray-100 active:scale-95 text-gray-600">
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center font-bold text-sm select-none">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, 1)} className="p-1.5 bg-white shadow-sm rounded-md hover:bg-gray-100 active:scale-95 text-gray-600">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-200 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-sm font-semibold text-gray-600">Discount</span>
            <select className="text-sm bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium">
              <option>No Discount</option>
              <option>Staff (10%)</option>
              <option>Comp (100%)</option>
            </select>
          </div>
          
          <div className="space-y-2 text-sm font-medium text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-gray-900 pt-2 border-t border-gray-200 mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={() => setIsPaymentOpen(true)}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-sm transition-all active:scale-[0.98] mt-2 ${
              cart.length > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Charge ${total.toFixed(2)}
          </button>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        total={total}
        onComplete={handleCompleteOrder}
      />
    </div>
  );
}
