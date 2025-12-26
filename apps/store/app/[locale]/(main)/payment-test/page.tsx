'use client';

import { useMoyasarForm } from '@void/payment/client';
import { useState } from 'react';

export default function PaymentTestPage() {
  const { submit, isLoading, errors, paymentError } = useMoyasarForm();
  const [success, setSuccess] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const result = await submit({
      name: formData.get('name') as string,
      number: formData.get('number') as string,
      cvc: formData.get('cvc') as string,
      month: formData.get('month') as string,
      year: formData.get('year') as string,
    }, 100, 'SAR'); // 1.00 SAR

    if (result?.status === 'success') {
      setSuccess(result.data);
    }
  };

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payment Test (Moyasar)</h1>
      
      {success && (
        <div className="bg-green-100 p-4 rounded mb-4 text-green-800">
          <p className="font-bold">Payment Successful!</p>
          <pre className="text-xs overflow-auto mt-2">{JSON.stringify(success, null, 2)}</pre>
        </div>
      )}

      {paymentError && (
        <div className="bg-red-100 p-4 rounded mb-4 text-red-800">
          <p>Error: {paymentError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Card/Holder Name</label>
          <input name="name" defaultValue="Ali Test" className="w-full border p-2 rounded" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Card Number</label>
          <input name="number" placeholder="1234123412341234" className="w-full border p-2 rounded" />
          {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">CVC</label>
            <input name="cvc" placeholder="123" className="w-full border p-2 rounded" />
            {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Month</label>
            <input name="month" placeholder="01" className="w-full border p-2 rounded" />
            {errors.month && <p className="text-red-500 text-sm">{errors.month}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Year</label>
            <input name="year" placeholder="25" className="w-full border p-2 rounded" />
            {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
          </div>
        </div>

        <button 
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Pay 1.00 SAR'}
        </button>
      </form>
    </div>
  );
}
