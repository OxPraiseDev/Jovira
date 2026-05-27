import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Home, Users, Package, ShoppingCart, Shield, DollarSign, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'KYC Requests', path: '/kyc' },
    { icon: Shield, label: 'Moderation', path: '/moderation' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: DollarSign, label: 'Finance', path: '/finance' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="p-4">
            <h1 className="text-2xl font-bold">Jovira Admin</h1>
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
          </div>

          <nav className="mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`sidebar-link ${pathname === item.path ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 w-full p-4">
            <button
              onClick={logout}
              className="sidebar-link w-full"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}