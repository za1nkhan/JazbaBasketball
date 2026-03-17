'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
  showInStrip: boolean;
  showInShowcase: boolean;
  displayOrder: number;
  active: boolean;
}

const emptyForm = {
  name: '',
  logoUrl: '',
  website: '',
  showInStrip: true,
  showInShowcase: true,
  displayOrder: 0,
};

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [logoPreviewError, setLogoPreviewError] = useState(false);

  const fetchSponsors = useCallback(async () => {
    const res = await fetch('/api/admin/sponsors');
    if (res.ok) setSponsors(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchSponsors(); }, [fetchSponsors]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setLogoPreviewError(false);
    setShowForm(true);
  };

  const openEdit = (s: Sponsor) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      logoUrl: s.logoUrl,
      website: s.website || '',
      showInStrip: s.showInStrip,
      showInShowcase: s.showInShowcase,
      displayOrder: s.displayOrder,
    });
    setError('');
    setLogoPreviewError(false);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const url = editingId ? `/api/admin/sponsors/${editingId}` : '/api/admin/sponsors';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        website: form.website.trim() || null,
        displayOrder: Number(form.displayOrder),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    closeForm();
    fetchSponsors();
  };

  const handleToggleActive = async (s: Sponsor) => {
    await fetch(`/api/admin/sponsors/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !s.active }),
    });
    fetchSponsors();
  };

  const handleDelete = async (s: Sponsor) => {
    if (!window.confirm(`Permanently delete "${s.name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/sponsors/${s.id}`, { method: 'DELETE' });
    fetchSponsors();
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sponsors</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage logos shown in the strip banner and sponsors showcase
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-brand-deep text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-deep/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Sponsor
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            {editingId ? 'Edit Sponsor' : 'Add Sponsor'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sponsor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Nike"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://sponsor.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                />
              </div>
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={form.logoUrl}
                onChange={(e) => {
                  setForm({ ...form, logoUrl: e.target.value });
                  setLogoPreviewError(false);
                }}
                placeholder="https://example.com/logo.png"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              />
              {/* Logo preview */}
              {form.logoUrl && !logoPreviewError && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg inline-flex items-center gap-3">
                  <Image
                    src={form.logoUrl}
                    alt="Logo preview"
                    width={80}
                    height={40}
                    className="object-contain h-10 w-20"
                    onError={() => setLogoPreviewError(true)}
                    unoptimized
                  />
                  <span className="text-xs text-gray-500">Preview</span>
                </div>
              )}
              {logoPreviewError && (
                <p className="mt-1 text-xs text-amber-600">Could not load image preview — URL may be invalid or not publicly accessible.</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Show in strip */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showInStrip}
                  onChange={(e) => setForm({ ...form, showInStrip: e.target.checked })}
                  className="w-4 h-4 accent-brand-accent"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">Strip banner</span>
                  <span className="block text-xs text-gray-400">Scrolling marquee</span>
                </span>
              </label>

              {/* Show in showcase */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showInShowcase}
                  onChange={(e) => setForm({ ...form, showInShowcase: e.target.checked })}
                  className="w-4 h-4 accent-brand-accent"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">Sponsor showcase</span>
                  <span className="block text-xs text-gray-400">Grid section</span>
                </span>
              </label>

              {/* Display order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                  min={0}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">Lower = shown first</p>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-deep text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-deep/90 transition-colors disabled:opacity-60"
              >
                {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Sponsor'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sponsors table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : sponsors.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-3">No sponsors yet.</p>
            <button
              onClick={openAdd}
              className="text-brand-accent text-sm font-medium hover:underline"
            >
              Add your first sponsor
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Logo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">Strip</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">Showcase</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sponsors.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  {/* Logo */}
                  <td className="px-6 py-4">
                    <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      <Image
                        src={s.logoUrl}
                        alt={s.name}
                        width={64}
                        height={40}
                        className="object-contain w-full h-full"
                        unoptimized
                        onError={() => {}}
                      />
                    </div>
                  </td>

                  {/* Name + website */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{s.name}</p>
                    {s.website && (
                      <a
                        href={s.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-brand-accent truncate max-w-[140px] block"
                      >
                        {s.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </td>

                  {/* Strip */}
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`inline-block w-2 h-2 rounded-full ${s.showInStrip ? 'bg-green-400' : 'bg-gray-300'}`} />
                  </td>

                  {/* Showcase */}
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`inline-block w-2 h-2 rounded-full ${s.showInShowcase ? 'bg-green-400' : 'bg-gray-300'}`} />
                  </td>

                  {/* Order */}
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                    {s.displayOrder}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {s.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-sm">
                      <button
                        onClick={() => openEdit(s)}
                        className="text-brand-accent hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(s)}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        {s.active ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
                        className="text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section legend */}
      <div className="mt-4 flex gap-6 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400" /> Enabled in that section
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-300" /> Disabled in that section
        </span>
      </div>
    </div>
  );
}
