import { X, CreditCard, Banknote, Wallet, Pizza } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onComplete: () => void;
}

export default function PaymentModal({ isOpen, onClose, total, onComplete }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [amountPaid, setAmountPaid] = useState<number>(0);

  if (!isOpen) return null;

  const methods = [
    { id: 'card', name: 'Card', icon: CreditCard },
    { id: 'cash', name: 'Cash', icon: Banknote },
    { id: 'wallet', name: 'Wallet App', icon: Wallet },
    { id: 'meal_plan', name: 'Meal Plan', icon: Pizza },
  ];

  const handleComplete = () => {
    toast.success('Payment completed successfully!');
    onComplete();
  };

  const handleAddPayment = () => {
    setAmountPaid(total);
    toast.success(`${methods.find(m => m.id === selectedMethod)?.name} payment added.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Payment</h2>
            <p className="text-sm font-medium text-blue-600">Total: ${total.toFixed(2)}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {methods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all active:scale-95 ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={24} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
                  <span className="font-semibold">{method.name}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Tender Amount</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                <input 
                  type="number" 
                  value={total.toFixed(2)} 
                  readOnly
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-lg font-bold text-gray-900 focus:outline-none"
                />
              </div>
              <button 
                onClick={handleAddPayment}
                className="px-6 py-3 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition-colors"
              >
                Add Payment
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-600">
              <span>Total Amount</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-green-600">
              <span>Total Paid</span>
              <span>${amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-blue-600 pt-2 border-t border-gray-200 mt-2">
              <span>Remaining Balance</span>
              <span>${(total - amountPaid).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <button 
            onClick={handleComplete}
            disabled={amountPaid < total}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-sm transition-all active:scale-[0.98] ${
              amountPaid >= total 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
}
