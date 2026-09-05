"use client";

import { useMemo, useState } from "react";
import { Edit3, FolderPlus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import { adminJsonRequest } from "@/lib/adminContentClient";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

interface Props {
  initialItems: Category[];
  products: Product[];
}

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10";

export default function AdminCategoryManager({
  initialItems,
  products,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<Category | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);
  const counts = useMemo(
    () =>
      new Map(
        items.map((item) => [
          item.slug,
          products.filter((product) => product.category === item.slug)
            .length,
        ]),
      ),
    [items, products],
  );

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") || "").trim();
    const payload = { name };
    setBusy(true);
    try {
      const url = editing
        ? `/api/admin/content/categories/${encodeURIComponent(editing.id)}`
        : "/api/admin/content/categories";
      const result = await adminJsonRequest<{ item: Category }>(
        url,
        editing ? "PUT" : "POST",
        payload,
      );
      setItems((current) =>
        editing
          ? current
              .map((item) => (item.id === editing.id ? result.item : item))
              .sort((a, b) => a.name.localeCompare(b.name))
          : [...current, result.item].sort((a, b) =>
              a.name.localeCompare(b.name),
            ),
      );
      setEditing(null);
      form.reset();
      toast.success(editing ? "Category updated." : "Category created.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Category could not be saved.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    try {
      await adminJsonRequest(
        `/api/admin/content/categories/${encodeURIComponent(pendingDelete.id)}`,
        "DELETE",
      );
      setItems((current) =>
        current.filter((item) => item.id !== pendingDelete.id),
      );
      toast.success("Category deleted.");
      setPendingDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Category could not be deleted.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <form
        key={editing?.id || "new"}
        onSubmit={save}
        className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">
              {editing ? "Edit category" : "Add category"}
            </h2>
            <p className="text-xs text-slate-500">
              Use a clear name for the product catalog.
            </p>
          </div>
          {editing ? (
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Cancel editing"
            >
              <X size={17} />
            </button>
          ) : (
            <FolderPlus className="text-orange-600" size={20} />
          )}
        </div>
        <label className="block text-sm font-semibold">
          Name
          <input
            name="name"
            required
            maxLength={120}
            defaultValue={editing?.name}
            className={`mt-1.5 ${inputClass}`}
          />
        </label>
        <button
          disabled={busy}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
        >
          <Save size={17} />
          {busy ? "Saving..." : editing ? "Update category" : "Create category"}
        </button>
      </form>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold">All categories</h2>
          <p className="text-xs text-slate-500">{items.length} categories</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Products</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4">
                    <strong>{item.name}</strong>
                  </td>
                  <td className="px-5 py-4">{counts.get(item.slug) || 0}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing(item)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(item)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete category?"
        description={
          pendingDelete
            ? `Delete “${pendingDelete.name}”? Categories assigned to products cannot be deleted.`
            : ""
        }
        busy={busy}
        onCancel={() => setPendingDelete(null)}
        onConfirm={remove}
      />
    </div>
  );
}
