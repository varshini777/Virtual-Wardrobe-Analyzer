import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Toast from './components/Toast.jsx';
import ItemModal from './components/ItemModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import WardrobePage from './pages/WardrobePage.jsx';
import RecommendationsPage from './pages/RecommendationsPage.jsx';
import SavedOutfitsPage from './pages/SavedOutfitsPage.jsx';
import PreferencesPage from './pages/PreferencesPage.jsx';

import { api, getAuthToken, getStoredUser, setAuthToken, setStoredUser } from './api/client.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [items, setItems] = useState([]);
  const [wardrobeStatus, setWardrobeStatus] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [history, setHistory] = useState([]);
  const [preferences, setPreferences] = useState(null);

  // Recommendation parameters state
  const [recWeather, setRecWeather] = useState('Hot');
  const [recOccasion, setRecOccasion] = useState('Casual');

  // Modals & UI States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalInitialCategory, setModalInitialCategory] = useState('Top');
  const [loading, setLoading] = useState(false);
  const [recLoading, setRecLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load all wardrobe data for authenticated user
  const loadData = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      // Auto-authenticate as demo user if no token exists for seamless first experience
      try {
        const demoRes = await api.loginDemo();
        if (demoRes.success) {
          setCurrentUser(demoRes.user);
        }
      } catch (err) {
        setIsAuthModalOpen(true);
        return;
      }
    }

    try {
      setLoading(true);
      const [itemsRes, statusRes, outfitsRes, historyRes, prefRes, meRes] = await Promise.all([
        api.getItems(),
        api.getWardrobeStatus(),
        api.getSavedOutfits(),
        api.getRecommendationHistory(),
        api.getPreferences(),
        api.getCurrentUser().catch(() => null)
      ]);

      if (itemsRes.success) setItems(itemsRes.items || []);
      if (statusRes.success) setWardrobeStatus(statusRes);
      if (outfitsRes.success) setSavedOutfits(outfitsRes.outfits || []);
      if (historyRes.success) setHistory(historyRes.history || []);
      if (prefRes.success) {
        setPreferences(prefRes.preferences);
        if (prefRes.preferences?.default_weather) setRecWeather(prefRes.preferences.default_weather);
        if (prefRes.preferences?.default_occasion) setRecOccasion(prefRes.preferences.default_occasion);
      }
      if (meRes?.success) {
        setCurrentUser(meRes.user);
        setStoredUser(meRes.user);
      }
    } catch (err) {
      console.error('Failed to load wardrobe data:', err);
      if (err.message?.includes('Authentication')) {
        setIsAuthModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    const handleAuthInvalid = () => {
      setCurrentUser(null);
      setIsAuthModalOpen(true);
    };

    window.addEventListener('wardrobe-auth-invalid', handleAuthInvalid);
    return () => {
      window.removeEventListener('wardrobe-auth-invalid', handleAuthInvalid);
    };
  }, [loadData]);

  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    setRecommendations([]);
    await loadData();
    showToast(`Welcome back, ${user.name}!`, 'success');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setItems([]);
    setSavedOutfits([]);
    setRecommendations([]);
    showToast('Signed out of wardrobe profile', 'info');
    setIsAuthModalOpen(true);
  };

  // Clothing Item CRUD Handlers
  const handleOpenAddItem = (category = 'Top') => {
    setEditingItem(null);
    setModalInitialCategory(category);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (formData, id) => {
    if (id) {
      const res = await api.updateItem(id, formData);
      if (res.success) {
        setItems(prev => prev.map(i => i.id === id ? res.item : i));
        showToast(`Updated "${res.item.name}"`);
      }
    } else {
      const res = await api.createItem(formData);
      if (res.success) {
        setItems(prev => [res.item, ...prev]);
        showToast(`Added "${res.item.name}" to your closet`);
      }
    }
    // Refresh status
    const statusRes = await api.getWardrobeStatus();
    if (statusRes.success) setWardrobeStatus(statusRes);
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to remove "${item.name}" from your wardrobe?`)) return;
    try {
      const res = await api.deleteItem(item.id);
      if (res.success) {
        setItems(prev => prev.filter(i => i.id !== item.id));
        showToast(`Removed "${item.name}" from closet`);
        const statusRes = await api.getWardrobeStatus();
        if (statusRes.success) setWardrobeStatus(statusRes);
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete item', 'error');
    }
  };

  const handleResetSample = async () => {
    if (!window.confirm('Restore sample wardrobe? This will replace your current items with 16 curated catalog pieces.')) return;
    try {
      setLoading(true);
      const res = await api.resetSampleWardrobe();
      if (res.success) {
        setItems(res.items || []);
        const statusRes = await api.getWardrobeStatus();
        if (statusRes.success) setWardrobeStatus(statusRes);
        showToast('Sample wardrobe restored with realistic visual catalog assets');
      }
    } catch (err) {
      showToast(err.message || 'Failed to restore sample', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your entire digital wardrobe?')) return;
    try {
      setLoading(true);
      const res = await api.clearAllItems();
      if (res.success) {
        setItems([]);
        const statusRes = await api.getWardrobeStatus();
        if (statusRes.success) setWardrobeStatus(statusRes);
        setRecommendations([]);
        showToast('All items removed from closet');
      }
    } catch (err) {
      showToast(err.message || 'Failed to clear items', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Recommendation Generation Handler
  const handleGenerateRecommendations = async (weather, occasion) => {
    setRecWeather(weather);
    setRecOccasion(occasion);
    try {
      setRecLoading(true);
      const res = await api.generateRecommendations(weather, occasion, 5);
      if (res.success) {
        setRecommendations(res.recommendations || []);
        if (res.recommendations?.length > 0) {
          showToast(`Curated ${res.recommendations.length} outfit pairings for ${weather} weather & ${occasion} occasion`);
          const histRes = await api.getRecommendationHistory();
          if (histRes.success) setHistory(histRes.history || []);
        } else {
          showToast(res.message || 'No outfits matched your closet and settings', 'info');
        }
      } else {
        showToast(res.message || 'Unable to generate outfits', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to generate recommendations', 'error');
    } finally {
      setRecLoading(false);
    }
  };

  const handleQuickGenerate = (weather, occasion) => {
    setActiveTab('recommendations');
    handleGenerateRecommendations(weather, occasion);
  };

  // Saved Outfits Handlers
  const handleSaveOutfit = async (outfit) => {
    try {
      const res = await api.saveOutfit({
        title: `${outfit.weather} ${outfit.occasion} Look`,
        weather: outfit.weather,
        occasion: outfit.occasion,
        top_id: outfit.top.id,
        bottom_id: outfit.bottom.id,
        shoes_id: outfit.shoes.id,
        accessory_id: outfit.accessory?.id || null,
        explanation: outfit.explanation,
        score: outfit.score
      });
      if (res.success) {
        showToast('Outfit saved to your collection!');
        const savedRes = await api.getSavedOutfits();
        if (savedRes.success) setSavedOutfits(savedRes.outfits || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to save outfit', 'error');
    }
  };

  const handleDeleteSavedOutfit = async (id) => {
    try {
      const res = await api.deleteOutfit(id);
      if (res.success) {
        setSavedOutfits(prev => prev.filter(o => o.id !== id));
        showToast('Saved outfit removed');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete saved outfit', 'error');
    }
  };

  // Preferences Handler
  const handleSavePreferences = async (newPrefs) => {
    try {
      const res = await api.updatePreferences(newPrefs);
      if (res.success) {
        setPreferences(res.preferences);
        showToast('Preferences updated successfully');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update preferences', 'error');
    }
  };

  const savedOutfitIds = new Set(
    savedOutfits.map(o => `outfit-${o.top.id}-${o.bottom.id}-${o.shoes.id}${o.accessory ? `-${o.accessory.id}` : ''}`)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-slate-800">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        itemCount={items.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardPage
            items={items}
            wardrobeStatus={wardrobeStatus}
            savedOutfits={savedOutfits}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAddItem={handleOpenAddItem}
            onQuickGenerate={handleQuickGenerate}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {activeTab === 'wardrobe' && (
          <WardrobePage
            items={items}
            wardrobeStatus={wardrobeStatus}
            onOpenAddItem={handleOpenAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onResetSample={handleResetSample}
            onClearAll={handleClearAll}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsPage
            recommendations={recommendations}
            loading={recLoading}
            weather={recWeather}
            occasion={recOccasion}
            wardrobeStatus={wardrobeStatus}
            preferences={preferences}
            savedOutfitIds={savedOutfitIds}
            onGenerate={handleGenerateRecommendations}
            onSaveOutfit={handleSaveOutfit}
            onOpenAddItem={handleOpenAddItem}
            onNavigatePreferences={() => setActiveTab('preferences')}
          />
        )}

        {activeTab === 'saved' && (
          <SavedOutfitsPage
            savedOutfits={savedOutfits}
            history={history}
            onDeleteSaved={handleDeleteSavedOutfit}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'preferences' && (
          <PreferencesPage
            preferences={preferences}
            onSavePreferences={handleSavePreferences}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-serif italic text-slate-600">
            "Style is a way to say who you are without having to speak." — Rachel Zoe
          </p>
          <p className="text-[11px] text-slate-400">
            Virtual Wardrobe Analyzer • Secure Token Authentication • Explainable Rule-Based Fashion Pairings
          </p>
        </div>
      </footer>

      {/* Add / Edit Clothing Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        item={editingItem}
        initialCategory={modalInitialCategory}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
