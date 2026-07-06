import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CreditCard, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';

interface Plan {
    id: number;
    name: string;
    duration_months: number;
    price: number;
    description: string;
    is_active: boolean;
}

export default function BusinessCardPlansIndex({ plans }: { plans: Plan[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        duration_months: 1,
        price: 0,
        description: '',
        is_active: true,
    });

    const openModal = (plan?: Plan) => {
        if (plan) {
            setEditingPlan(plan);
            setData({
                name: plan.name,
                duration_months: plan.duration_months,
                price: plan.price,
                description: plan.description || '',
                is_active: plan.is_active,
            });
        } else {
            setEditingPlan(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPlan) {
            put(`/super-admin/business-card-plans/${editingPlan.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post(`/super-admin/business-card-plans`, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (plan: Plan) => {
        if (confirm(`Are you sure you want to delete the plan "${plan.name}"?`)) {
            router.delete(`/super-admin/business-card-plans/${plan.id}`);
        }
    };

    const handleToggleActive = (plan: Plan) => {
        router.put(`/super-admin/business-card-plans/${plan.id}`, {
            is_active: !plan.is_active
        }, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title="Subscription Plans" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Business Card Plans</h1>
                        <p className="text-sm text-muted-foreground">Manage subscription plans and pricing for business cards.</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow hover:bg-primary/90"
                    >
                        <Plus className="size-4" /> Add New Plan
                    </button>
                </div>

                <div className="rounded-lg border shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-800">Plan Name</th>
                                <th className="px-6 py-3 font-medium text-gray-800">Duration (Months)</th>
                                <th className="px-6 py-3 font-medium text-gray-800">Price (₹)</th>
                                <th className="px-6 py-3 font-medium text-gray-800">Status</th>
                                <th className="px-6 py-3 font-medium text-gray-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {plans.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No plans found.</td>
                                </tr>
                            ) : (
                                plans.map(plan => (
                                    <tr key={plan.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium ">{plan.name}</td>
                                        <td className="px-6 py-4">{plan.duration_months}</td>
                                        <td className="px-6 py-4 font-semibold">₹{plan.price}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleToggleActive(plan)} className="flex items-center gap-1.5 text-xs">
                                                {plan.is_active ? (
                                                    <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full"><CheckCircle className="size-3" /> Active</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded-full"><XCircle className="size-3" /> Inactive</span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openModal(plan)} className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded">
                                                    <Edit className="size-4" />
                                                </button>
                                                <button onClick={() => handleDelete(plan)} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded">
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-gray-600 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Plan Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration (Months)</label>
                                    <input type="number" min="1" value={data.duration_months} onChange={e => setData('duration_months', parseInt(e.target.value))} className="w-full border rounded-md px-3 py-2 text-sm" required />
                                    {errors.duration_months && <p className="text-red-500 text-xs mt-1">{errors.duration_months}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                                    <input type="number" min="0" value={data.price} onChange={e => setData('price', parseFloat(e.target.value))} className="w-full border rounded-md px-3 py-2 text-sm" required />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                                <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" rows={3}></textarea>
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="isActive" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded" />
                                <label htmlFor="isActive" className="text-sm">Active (Visible to customers)</label>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                                    {processing ? 'Saving...' : 'Save Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
