import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '../ui';
import type { Theme } from '../../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: () => void;
  isAuthenticated?: boolean;
  user?: {
    name: string;
    avatar?: string;
    role?: 'USER' | 'MODERATOR' | 'ADMIN';
  };
  hasProductsForSale?: boolean;
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  onThemeToggle: () => void;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onSellClick?: () => void;
  onDashboardClick?: () => void;
  onLogoutClick?: () => void;
}

const Header = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isAuthenticated = false,
  user,
  hasProductsForSale = false,
  theme,
  resolvedTheme,
  onThemeToggle,
  onLoginClick,
  onRegisterClick,
  onSellClick,
  onDashboardClick,
  onLogoutClick
}: HeaderProps) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-2xl font-black hover:opacity-80 transition-opacity"
              style={{ color: 'var(--color-text-primary)', fontWeight: '900' }}
            >
              <span style={{ color: 'var(--color-primary)', fontWeight: '900' }}>Uni</span>
              <span style={{ color: 'var(--color-secondary)', fontWeight: '900' }}>Shop</span>
            </a>
          </div>

          {/* Desktop Search Bar - Only for authenticated users */}
          {isAuthenticated && (
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
                <input
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSearchSubmit?.();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)'
                  }}
                />
              </form>
            </div>
          )}


          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">

            {isAuthenticated ? (
              <>
                {/* Mobile Search Button - Only visible on mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  className="md:hidden"
                  aria-label="Buscar productos"
                >
                  <Search className="h-4 w-4" />
                </Button>

                {user?.role === 'MODERATOR' && (
                  <Button variant="outline" size="sm">
                    Moderar
                  </Button>
                )}
                <div className="relative group" ref={dropdownRef}>
                  <div
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[var(--color-border)] flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {/* Dropdown Menu */}
                  <div className={`absolute right-0 mt-2 w-48 bg-[var(--color-surface)] rounded-md shadow-lg border border-[var(--color-border)] transition-all duration-200 z-50 ${
                    showUserDropdown ? 'opacity-100 visible' : 'md:group-hover:opacity-100 md:group-hover:visible opacity-0 invisible'
                  }`}>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onSellClick?.();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-hover)] transition-colors font-medium"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        Vender
                      </button>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onDashboardClick?.();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-hover)] transition-colors"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        Panel de Usuario
                      </button>
                      <div className="border-t border-[var(--color-border)] my-1"></div>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onLogoutClick?.();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-hover)] transition-colors"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLoginClick}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="hidden md:flex"
                  onClick={onRegisterClick}
                >
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Search Bar - Expandable */}
      {showMobileSearch && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
            <input
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
            />
          </form>
        </div>
      )}

      {/* Floating Theme Toggle Button */}
      <button
        onClick={onThemeToggle}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: `2px solid var(--color-border)`,
          color: 'var(--color-text-primary)'
        }}
        aria-label={`Tema actual: ${resolvedTheme === 'light' ? 'claro' : 'oscuro'}. Haz clic para cambiar`}
        title={`Tema: ${resolvedTheme === 'light' ? 'Claro' : 'Oscuro'}`}
      >
        {resolvedTheme === 'light' ? '☀️' : '🌙'}
      </button>
    </header>
  );
};

export default Header;