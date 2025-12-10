import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      pendingOrders,
      monthlyOrders,
      lastMonthOrders,
      recentOrders,
      topProducts,
      lowStockProducts,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: startOfMonth },
          paymentStatus: 'APPROVED',
        },
        select: { total: true },
      }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          paymentStatus: 'APPROVED',
        },
        select: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          total: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      prisma.product.findMany({
        where: { stock: { lte: 10 }, isActive: true },
        take: 10,
        orderBy: { stock: 'asc' },
        select: { id: true, name: true, slug: true, stock: true },
      }),
    ]);

    const monthlyRevenue = monthlyOrders.reduce((sum: number, order: { total: number | string }) => sum + Number(order.total), 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum: number, order: { total: number | string }) => sum + Number(order.total), 0);
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topProductIds = topProducts.map((p: any) => p.productId);
    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, slug: true },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topProductsWithDetails = topProducts.map((p: any) => ({
      ...p,
      product: topProductDetails.find((d: { id: string }) => d.id === p.productId),
    }));

    return NextResponse.json({
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalUsers: totalUsers || 0,
      totalRevenue: monthlyRevenue || 0,
      pendingOrders: pendingOrders || 0,
      monthlyRevenue: monthlyRevenue || 0,
      lastMonthRevenue: lastMonthRevenue || 0,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentOrders: recentOrders.map((order: any) => ({
        ...order,
        total: Number(order.total),
      })),
      topProducts: topProductsWithDetails,
      lowStockProducts,
      ordersByStatus: {
        PENDING: pendingOrders || 0,
      },
    });
  } catch (error) {
    console.error('Error obteniendo estadisticas:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
