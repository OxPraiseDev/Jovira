import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { sellerApi } from '../services/api';
import Layout from '../components/Layout';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      const [statsRes, walletRes] = await Promise.all([
        sellerApi.getStats(),
        sellerApi.getWallet(),
      ]);
      setStats(statsRes.data);
      setWallet(walletRes.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats?.totalOrders || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {stats?.pendingOrders || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ${Number(stats?.totalRevenue || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Wallet Balance</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">
              ${Number(wallet?.balance || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-primary">Add New Product</button>
              <button className="w-full btn-secondary">View Orders</button>
              <button className="w-full btn-secondary">Request Payout</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <p className="text-gray-500">No recent activity</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}