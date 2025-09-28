import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Database, Blueprint, Home, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const Layout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Data Ingestion', href: '/data-ingestion', icon: Database },
    { name: 'IMO Creator', href: '/imo-creator', icon: Blueprint },
    { name: 'Documentation', href: '/docs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-card shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Database className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Integrated Data & IMO System</h1>
                <p className="text-muted-foreground">Data ingestion and blueprint management platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t">
            <div className="flex space-x-8 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;