import { useEffect, useRef, useState } from 'react';
import Orders from '../api/Orders/api';
import Products from '../api/products/api';

export default function useUserOrders(user, opts = {}) {
    const { minLoadingMs = 300 } = opts;

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState(null);
    const mountedRef = useRef(true);
    const fetchIdRef = useRef(0);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const formatDate = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const fetchProductIfMissing = async (item) => {
        try {
            if (typeof Products !== 'undefined' && Products.getProductWithImages) {
                const resp = await Products.getProductWithImages(item.productId);
                return resp?.data ?? resp;
            }
        } catch (err) {
            console.warn('Failed to fetch product', item.productId, err);
        }
        return {
            id: item.productId,
            name: 'Unknown product',
            price: Number(item.price) || 0,
            image: `https://placehold.co/64x64/6b7280/ffffff?text=?`
        };
    };

    useEffect(() => {
        const currentFetchId = ++fetchIdRef.current;
        setLoadingOrders(true);
        setOrdersError(null);

        const start = Date.now();

        const finishLoading = () => {
            const elapsed = Date.now() - start;
            const extra = Math.max(0, minLoadingMs - elapsed);
            setTimeout(() => {
                if (!mountedRef.current) return;
                if (currentFetchId !== fetchIdRef.current) return;
                setLoadingOrders(false);
            }, extra);
        };

        const doFetch = async () => {
            if (!user) {
                setOrders([]);
                finishLoading();
                return;
            }

            try {
                const response = await Orders.getOrdersByUserId(user.id);
                const rawOrders = response?.data ?? response;

                if (!mountedRef.current || currentFetchId !== fetchIdRef.current) return;

                const transformed = await Promise.all(
                    (Array.isArray(rawOrders) ? rawOrders : []).map(async (order) => {
                        const items = await Promise.all(
                            (order.items ?? []).map(async (item) => {
                                const product = await fetchProductIfMissing(item);
                                const image =
                                    product.imageUrl ?? product.image ?? product.images?.[0] ??
                                    `https://placehold.co/64x64/111111/ffffff?text=${encodeURIComponent((product.name || 'P').slice(0, 2))}`;
                                const price = Number(item.price ?? product.price ?? 0);
                                return {
                                    name: product.name ?? `Product ${product.id ?? item.productId}`,
                                    price,
                                    quantity: Number(item.quantity ?? 1),
                                    image,
                                };
                            })
                        );

                        const totalFromApi = (order.totalAmount !== undefined && order.totalAmount !== null)
                            ? Number(order.totalAmount)
                            : null;
                        const computedTotal = items.reduce((s, it) => s + it.price * it.quantity, 0);

                        return {
                            id: order.id ? `ORD-${order.id}` : `ORD-${Math.floor(Math.random() * 10000)}`,
                            date: formatDate(order.createdAt ?? order.date ?? order.updatedAt),
                            status: order.status ?? order.paymentStatus ?? 'unknown',
                            total: totalFromApi ?? computedTotal,
                            items,
                            _raw: order,
                        };
                    })
                );

                if (!mountedRef.current || currentFetchId !== fetchIdRef.current) return;

                setOrders(transformed);
            } catch (err) {
                if (!mountedRef.current || currentFetchId !== fetchIdRef.current) return;
                console.error('[useUserOrders] fetch error', err);
                setOrdersError(err);
                setOrders([]);
            } finally {
                finishLoading();
            }
        };

        doFetch();
    }, [user?.id]);

    return { orders, loadingOrders, ordersError };
}