import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Coupons',
        href: '/super-admin/coupons',
    },
];

interface Template { id: number; name: string; status: string; }
interface VirtualCard { id: number; name: string; is_active: boolean; }

interface Coupon {
    id: number;
    code: string;
    discount: number;
    start_date: string | null;
    end_date: string | null;
    target_type: string;
    target_ids: number[] | null;
    is_active: boolean;
}

interface CouponsProps {
    coupons: Coupon[];
    templates: Template[];
    imageTemplates: Template[];
    miniWebsites: Template[];
    virtualCards: VirtualCard[];
}

export default function CouponsIndex({ coupons, templates, imageTemplates, miniWebsites, virtualCards }: CouponsProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        code: '',
        discount: '',
        start_date: '',
        end_date: '',
        target_type: 'all',
        target_ids: [] as number[],
        is_active: true,
    });

    const openCreateDialog = () => {
        setEditingCoupon(null);
        reset();
        setIsDialogOpen(true);
    };

    const openEditDialog = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setData({
            code: coupon.code,
            discount: coupon.discount.toString(),
            start_date: coupon.start_date ? new Date(coupon.start_date).toISOString().slice(0, 16) : '',
            end_date: coupon.end_date ? new Date(coupon.end_date).toISOString().slice(0, 16) : '',
            target_type: coupon.target_type,
            target_ids: coupon.target_ids || [],
            is_active: coupon.is_active,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            destroy(`/super-admin/coupons/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingCoupon) {
            put(`/super-admin/coupons/${editingCoupon.id}`, {
                onSuccess: () => setIsDialogOpen(false),
            });
        } else {
            post('/super-admin/coupons', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const toggleTargetId = (id: number) => {
        const currentIds = data.target_ids;
        if (currentIds.includes(id)) {
            setData('target_ids', currentIds.filter(targetId => targetId !== id));
        } else {
            setData('target_ids', [...currentIds, id]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Coupons" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold leading-none tracking-tight">Coupons</h2>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" /> Add Coupon
                    </Button>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Code</th>
                                    <th className="px-6 py-4 font-medium">Discount</th>
                                    <th className="px-6 py-4 font-medium">Target Type</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{coupon.code}</td>
                                        <td className="px-6 py-4">{coupon.discount}%</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="capitalize">
                                                {coupon.target_type.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={coupon.is_active ? 'default' : 'secondary'} className={coupon.is_active ? 'bg-green-500 hover:bg-green-600' : ''}>
                                                {coupon.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(coupon)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => handleDelete(coupon.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {coupons.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            No coupons found. Create one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Coupon Code *</Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value.toUpperCase())}
                                    placeholder="e.g. SUMMER50"
                                    required
                                />
                                {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="discount">Discount Percentage (%) *</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={data.discount}
                                    onChange={e => setData('discount', e.target.value)}
                                    required
                                />
                                {errors.discount && <p className="text-sm text-red-500">{errors.discount}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date (Optional)</Label>
                                <Input
                                    id="start_date"
                                    type="datetime-local"
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                />
                                {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date">Expiry Date (Optional)</Label>
                                <Input
                                    id="end_date"
                                    type="datetime-local"
                                    value={data.end_date}
                                    onChange={e => setData('end_date', e.target.value)}
                                />
                                {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="target_type">Applies To</Label>
                                <select
                                    id="target_type"
                                    className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.target_type}
                                    onChange={e => {
                                        setData('target_type', e.target.value);
                                        setData('target_ids', []); // reset target IDs when changing type
                                    }}
                                >
                                    <option value="all">All Products</option>
                                    <option value="templates">Video Templates</option>
                                    <option value="image_templates">Image Templates</option>
                                    <option value="mini_websites">Mini Websites</option>
                                    <option value="virtual_cards">Virtual Card Plans</option>
                                </select>
                                {errors.target_type && <p className="text-sm text-red-500">{errors.target_type}</p>}
                            </div>

                            {data.target_type === 'templates' && (
                                <div className="space-y-2 md:col-span-2 bg-muted/30 p-4 rounded-lg">
                                    <Label>Select Video Templates (Leave empty to apply to all video templates)</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                                        {templates.map(item => (
                                            <Label key={item.id} className="flex items-center gap-2 p-2 border rounded hover:bg-muted cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={data.target_ids.includes(item.id)}
                                                    onChange={() => toggleTargetId(item.id)}
                                                    className="rounded"
                                                />
                                                <span className="truncate">{item.name}</span>
                                            </Label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data.target_type === 'image_templates' && (
                                <div className="space-y-2 md:col-span-2 bg-muted/30 p-4 rounded-lg">
                                    <Label>Select Image Templates (Leave empty to apply to all image templates)</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                                        {imageTemplates.map(item => (
                                            <Label key={item.id} className="flex items-center gap-2 p-2 border rounded hover:bg-muted cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={data.target_ids.includes(item.id)}
                                                    onChange={() => toggleTargetId(item.id)}
                                                    className="rounded"
                                                />
                                                <span className="truncate">{item.name}</span>
                                            </Label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data.target_type === 'mini_websites' && (
                                <div className="space-y-2 md:col-span-2 bg-muted/30 p-4 rounded-lg">
                                    <Label>Select Mini Websites (Leave empty to apply to all mini websites)</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                                        {miniWebsites.map(item => (
                                            <Label key={item.id} className="flex items-center gap-2 p-2 border rounded hover:bg-muted cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={data.target_ids.includes(item.id)}
                                                    onChange={() => toggleTargetId(item.id)}
                                                    className="rounded"
                                                />
                                                <span className="truncate">{item.name}</span>
                                            </Label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data.target_type === 'virtual_cards' && (
                                <div className="space-y-2 md:col-span-2 bg-muted/30 p-4 rounded-lg">
                                    <Label>Select Virtual Card Plans (Leave empty to apply to all plans)</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                                        {virtualCards.map(item => (
                                            <Label key={item.id} className="flex items-center gap-2 p-2 border rounded hover:bg-muted cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={data.target_ids.includes(item.id)}
                                                    onChange={() => toggleTargetId(item.id)}
                                                    className="rounded"
                                                />
                                                <span className="truncate">{item.name}</span>
                                            </Label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center space-x-2 md:col-span-2 pt-4 border-t">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="rounded border-neutral-300 text-purple-600 focus:ring-purple-600 size-4"
                                />
                                <Label htmlFor="is_active" className="flex flex-col gap-1 cursor-pointer">
                                    <span>Active Status</span>
                                    <span className="text-sm font-normal text-muted-foreground">If disabled, this coupon cannot be used.</span>
                                </Label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>{editingCoupon ? 'Update' : 'Create'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
