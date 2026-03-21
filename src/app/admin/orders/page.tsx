'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

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
  shippingName: string | null;
  createdAt: string;
  userId: string | null;
  user: { name: string | null; email: string } | null;
  items: OrderItem[];
}

interface Summary {
  total: number;
  paid: number;
  fulfilled: number;
  canceled: number;
  revenueCents: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, paid: 0, fulfilled: 0, canceled: 0, revenueCents: 0 });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  const fetchOrders = useCallback(async (p: number, status: string, q: string, s: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(p));
    if (status) params.set('status', status);
    if (q) params.set('search', q);
    params.set('sort', s);

    const res = await fetch(`/api/admin/orders?${params}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
      setPagination(data.pagination);
      setSummary(data.summary);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders(page, statusFilter, search, sort);
  }, [page, statusFilter, sort, fetchOrders, search]);

  const handleSearchChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setSearch(value);
    }, 300);
  };

  const handleStatusFilter = (s: string) => {
    setStatusFilter(s === statusFilter ? '' : s);
    setPage(1);
  };

  const handleMarkFulfilled = async (id: string) => {
    if (!window.confirm('Mark this order as fulfilled?')) return;
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'fulfilled' }),
    });
    fetchOrders(page, statusFilter, search, sort);
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Orders
          {pagination.total > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">({pagination.total})</span>
          )}
        </h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(summary.revenueCents)} <span className="text-sm font-normal text-gray-400">CAD</span></p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fulfilled</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{summary.fulfilled}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Pending Fulfillment</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{summary.paid}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Status filters */}
        <div className="flex gap-2">
          {['', 'paid', 'fulfilled', 'canceled'].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-brand-deep text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === '' ? 'All' : statusLabels[s]}
              {s === 'paid' && summary.paid > 0 && (
                <span className="ml-1 text-xs opacity-75">({summary.paid})</span>
              )}
              {s === 'fulfilled' && summary.fulfilled > 0 && (
                <span className="ml-1 text-xs opacity-75">({summary.fulfilled})</span>
              )}
              {s === 'canceled' && summary.canceled > 0 && (
                <span className="ml-1 text-xs opacity-75">({summary.canceled})</span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by email, order ID, or name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0);
                  const productNames = order.items.map((i) => i.product.name).join(', ');

                  return (
                    <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-sm font-mono text-brand-accent hover:underline"
                        >
                          {order.id.slice(0, 8)}...
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">{order.email}</p>
                        {order.shippingName && (
                          <p className="text-xs text-gray-400">{order.shippingName}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell" title={productNames}>
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {formatPrice(order.subtotalCents)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-sm">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-brand-accent hover:underline"
                          >
                            View
                          </Link>
                          {order.status === 'paid' && (
                            <button
                              onClick={() => handleMarkFulfilled(order.id)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Fulfill
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
