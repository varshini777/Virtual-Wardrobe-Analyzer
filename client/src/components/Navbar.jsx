import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  LayoutDashboard, 
  Bookmark, 
  Sliders, 
  User, 
  Menu, 
  X,
  UserCheck,
  Plus
} from 'lucide-react';
import { setActiveUserId } from '../api/client.js';

export default function Navbar({ activeTab, onSelectTab, itemCount = 0, currentUser, users = [], onUserChange, onNewUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wardrobe', label: 'My Wardrobe', icon: Layers, badge: itemCount },
    { id: 'recommendations', label: 'Outfit Recommendations', icon: Sparkles },
    { id: 'saved', label: 'Saved Outfits', icon: Bookmark },
    { id: 'preferences', label: 'Preferences', icon: Sliders }
  ];

  const handleTabClick = (id) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  const handleSwitchUser = (userId) => {
    setActiveUserId(userId);
    onUserChange(userId);
    setUserDropdownOpen(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUsernameInput.trim()) return;
    await onNewUser(newUsernameInput.trim());
    setNewUsernameInput('');
    setShowAddUser(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => handleTabClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                Wardrobe Analyzer
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 block -mt-0.5">
                Smart Outfit Engine
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Section: User Profile & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* User Profile Selector */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition"
              >
                <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 font-bold text-[10px]">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate">{currentUser?.name || 'My Closet'}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-scale-up">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">Active Profile</p>
                    <p className="text-[11px] text-slate-500">Private closet & recommendations</p>
                  </div>

                  <div className="py-1 max-h-48 overflow-y-auto">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchUser(u.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition ${
                          currentUser?.id === u.id
                            ? 'bg-slate-100 text-slate-900 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.name}</span>
                        </div>
                        {currentUser?.id === u.id && <UserCheck className="w-3.5 h-3.5 text-slate-900" />}
                      </button>
                    ))}
                  </div>

                  {showAddUser ? (
                    <form onSubmit={handleCreateUser} className="p-2 border-t border-slate-100">
                      <input
                        type="text"
                        placeholder="New profile name"
                        value={newUsernameInput}
                        onChange={(e) => setNewUsernameInput(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 mb-2"
                        autoFocus
                      />
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowAddUser(false)}
                          className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-1 border-t border-slate-100">
                      <button
                        onClick={() => setShowAddUser(true)}
                        className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Profile</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
