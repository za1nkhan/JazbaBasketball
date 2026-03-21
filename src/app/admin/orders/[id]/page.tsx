'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface OrderItem {
  id: string;
  qty: number;
  unitPriceCents: number;
  product: { id: string; name: string; images: string[] };
  variant: { size: string };
}

interface Order {
  id: string;
  email: string;
  status: string;
  subtotalCents: number;
  currency: string;
  stripeSessionId: string | null;
  shippingName: string | null;
  shippingLine1: string | null;
  shippingLine2: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  shippingPostalCode: string | null;
  shippingCountry: string | null;
  createdAt: string;
  userId: string | null;
  user: { name: string | null; email: string } | null;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  paid: 'bg-yellow-100 text-yellow-700',
  fulfilled: 'bg-green-100 text-green-700',
  canceled: 'bg-red-100 text-red-500',
};

const statusLabels: Record<string, string> = {
  paid: 'Paid',
  fulfilled: 'Fulfilled',
  canceled: 'Canceled',
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    const res = await fetch(`/api/admin/orders/${id}`);
    if (res.status === 404) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    if (res.ok) setOrder(await res.json());
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const updateStatus = async (status: string) => {
    const label = status === 'fulfilled' ? 'fulfill' : 'cancel';
    if (!window.confirm(`Are you sure you want to ${label} this order?`)) return;
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setOrder(await res.json());
    setUpdating(false);
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  if (loading) {
    return <div className="p-12 text-center text-gray-400">Loading order...</div>;
  }

  if (notFound) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Order not found</p>
        <Link href="/admin/orders" className="text-brand-accent hover:underline text-sm font-medium">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const hasShipping = order.shippingName || order.shippingLine1;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order <span className="font-mono text-lg">{order.id.slice(0, 8)}...</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
          </p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}>
          {statusLabels[order.status] || order.status}
        </span>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Order Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Unit Price</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.product.images?.[0] && (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded object-cover"
                              unoptimized
                            />
                          )}
                          <Link
                            href={`/admin/products/${item.product.id}/edit`}
                            className="text-sm font-medium text-gray-900 hover:text-brand-accent"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.variant.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.qty}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatPrice(item.unitPriceCents)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        {formatPrice(item.qty * item.unitPriceCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <div className="text-right">
                <span className="text-sm text-gray-500">Subtotal: </span>
                <span className="text-lg font-bold text-gray-900">{formatPrice(order.subtotalCents)} {order.currency}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Shipping Address</h2>
            {hasShipping ? (
              <div className="text-sm text-gray-700 space-y-0.5">
                {order.shippingName && <p className="font-medium">{order.shippingName}</p>}
                {order.shippingLine1 && <p>{order.shippingLine1}</p>}
                {order.shippingLine2 && <p>{order.shippingLine2}</p>}
                <p>
                  {[order.shippingCity, order.shippingProvince, order.shippingPostalCode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                {order.shippingCountry && <p>{order.shippingCountry}</p>}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No shipping address collected</p>
            )}
          </div>

          {/* Stripe reference */}
          {order.stripeSessionId && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Payment Reference</h2>
              <p className="text-sm text-gray-500">
                Stripe Session:{' '}
                <a
                  href={`https://dashboard.stripe.com/payments/${order.stripeSessionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-brand-accent hover:underline"
                >
                  {order.stripeSessionId.slice(0, 24)}...
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          {/* Status card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Status</h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-4 ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}>
              {statusLabels[order.status] || order.status}
            </span>

            {order.status === 'paid' && (
              <div className="space-y-2 mt-2">
                <button
                  onClick={() => updateStatus('fulfilled')}
                  disabled={updating}
                  className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Mark as Fulfilled'}
                </button>
                <button
                  onClick={() => updateStatus('canceled')}
                  disabled={updating}
                  className="w-full px-4 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Cancel Order
                </button>
              </div>
            )}
            {order.status === 'fulfilled' && (
              <p className="text-sm text-green-600 font-medium mt-2">This order has been fulfilled.</p>
            )}
            {order.status === 'canceled' && (
              <p className="text-sm text-red-500 font-medium mt-2">This order was canceled.</p>
            )}
          </div>

          {/* Customer card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Customer</h2>
            <a href={`mailto:${order.email}`} className="text-sm text-brand-accent hover:underline block mb-1">
              {order.email}
            </a>
            {order.user?.name && <p className="text-sm text-gray-700 font-medium">{order.user.name}</p>}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${
              order.userId
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {order.userId ? 'Registered' : 'Guest'}
            </span>
          </div>

          {/* Timeline card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Timeline</h2>
            <div className="space-y-4">
              {/* Order placed */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-brand-deep rounded-full" />
                  <div className="w-px flex-1 bg-gray-200 mt-1" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-gray-900">Order placed</p>
                  <p className="text-xs text-gray-500">{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</p>
                </div>
              </div>

              {/* Payment received */}
              {(order.status === 'paid' || order.status === 'fulfilled') && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-px flex-1 bg-gray-200 mt-1" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-gray-900">Payment received</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              )}

              {/* Fulfilled */}
              {order.status === 'fulfilled' && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order fulfilled</p>
                  </div>
                </div>
              )}

              {/* Canceled */}
              {order.status === 'canceled' && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order canceled</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
