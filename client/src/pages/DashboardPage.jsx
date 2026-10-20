import React from 'react';
import { 
  Shirt, 
  Sparkles, 
  Bookmark, 
  ArrowRight, 
  Plus, 
  Sun, 
  Snowflake, 
  CloudRain, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Compass,
  Palette,
  Briefcase,
  Umbrella,
  Crown,
  Zap,
  TrendingUp
} from 'lucide-react';
import MissingItemsAlert from '../components/MissingItemsAlert.jsx';
import OutfitCard from '../components/OutfitCard.jsx';
import ItemCard from '../components/ItemCard.jsx';

export default function DashboardPage({ 
  currentUser,
  items = [], 
  wardrobeStatus, 
  savedOutfits = [], 
  onNavigate, 
  onOpenAddItem, 
  onQuickGenerate,
  onEditItem,
  onDeleteItem
}) {
  const tops = items.filter(i => i.category === 'Top');
  const bottoms = items.filter(i => i.category === 'Bottom');
  const shoes = items.filter(i => i.category === 'Shoes');
  const accessories = items.filter(i => i.category === 'Accessories');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = currentUser?.name || currentUser?.username || 'Stylist';

  // Combinatorial styling potential: Tops × Bottoms × Shoes
  const totalCombinations = tops.length * bottoms.length * shoes.length;

  const stats = [
    { label: 'Tops', count: tops.length, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', cat: 'Top' },
    { label: 'Bottoms', count: bottoms.length, color: 'text-sky-600 bg-sky-50 border-sky-100', cat: 'Bottom' },
    { label: 'Shoes', count: shoes.length, color: 'text-amber-600 bg-amber-50 border-amber-100', cat: 'Shoes' },
    { label: 'Accessories', count: accessories.length, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', cat: 'Accessories' },
    { label: 'Saved Outfits', count: savedOutfits.length, color: 'text-purple-600 bg-purple-50 border-purple-100', cat: null }
  ];

  const totalGarments = items.length || 1;
  const topPct = Math.round((tops.length / totalGarments) * 100);
  const botPct = Math.round((bottoms.length / totalGarments) * 100);
  const shoPct = Math.round((shoes.length / totalGarments) * 100);
  const accPct = Math.round((accessories.length / totalGarments) * 100);

  // Curated editorial style capsules
  const styleCapsules = [
    {
      title: 'Corporate Boardroom',
      badge: 'Sharp Formal',
      badgeColor: 'bg-slate-900 text-white',
      desc: 'Navy blazers, crisp oxford shirts, charcoal wool trousers & handcrafted leather oxfords.',
      weather: 'Mild',
      occasion: 'Work / Formal',
      icon: Briefcase,
      accent: 'border-slate-200 hover:border-slate-800'
    },
    {
      title: 'Riviera & Weekend',
      badge: 'Breezy Linen',
      badgeColor: 'bg-amber-100 text-amber-800',
      desc: 'Airy linen shirts, waffle knit polos, tailored stretch chinos & clean white sneakers.',
      weather: 'Hot',
      occasion: 'Casual',
      icon: Sun,
      accent: 'border-slate-200 hover:border-amber-400'
    },
    {
      title: 'Monsoon Shield',
      badge: 'Weatherproof',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      desc: 'Water-resistant outerwear, dark denim, and treated lug-sole Chelsea boots.',
      weather: 'Rainy',
      occasion: 'Casual',
      icon: Umbrella,
      accent: 'border-slate-200 hover:border-cyan-400'
    },
    {
      title: 'Heritage & Festive',
      badge: 'Traditional Luxury',
      badgeColor: 'bg-rose-100 text-rose-800',
      desc: 'Embroidered kurtas, structured Nehru jackets, churidars & artisan leather juttis.',
      weather: 'Mild',
      occasion: 'Traditional',
      icon: Crown,
      accent: 'border-slate-200 hover:border-rose-400'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Personalized Hero Banner with Editorial Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-stone-900 text-white p-8 md:p-12 shadow-xl border border-amber-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-md mb-4 border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Fashion Tech • Rule-Based Engine</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            {getGreeting()}, {userName}.
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
            Curate intelligent outfit combinations tailored to your weather, daily occasion, and color theory using garments already in your closet.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('recommendations')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 text-xs md:text-sm font-bold hover:bg-amber-50 transition shadow-lg group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Generate Outfits</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onOpenAddItem()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-semibold border border-white/20 backdrop-blur-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Clothing Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Incomplete Wardrobe Warning if any essential categories are missing */}
      {wardrobeStatus && !wardrobeStatus.canGenerate && (
        <MissingItemsAlert
          missingCategories={wardrobeStatus.missingCategories}
          onAddItem={onOpenAddItem}
        />
      )}

      {/* Empty State Onboarding Guide for New Users */}
      {items.length === 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs">
          <div className="text-center max-w-lg mx-auto mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-bold text-xl text-slate-900">Get Started with Your Digital Closet</h2>
            <p className="text-xs text-slate-500 mt-1">
              Follow these three simple steps to start curating your personal style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-3">1</span>
                <h3 className="font-bold text-sm text-slate-800">Add Essential Garments</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add at least 1 Top, 1 Bottom, and 1 pair of Shoes so the recommendation engine can pair complete outfits.
                </p>
              </div>
              <button
                onClick={() => onOpenAddItem('Top')}
                className="mt-4 text-xs font-semibold text-slate-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Add an item now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-3">2</span>
                <h3 className="font-bold text-sm text-slate-800">Set Color Preferences</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tell the stylist your favorite shades and colors you avoid to personalize compatibility rankings.
                </p>
              </div>
              <button
                onClick={() => onNavigate('preferences')}
                className="mt-4 text-xs font-semibold text-slate-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Customize preferences</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-3">3</span>
                <h3 className="font-bold text-sm text-slate-800">Generate & Save Looks</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select your current weather and occasion to receive rule-based combinations with stylist explanations.
                </p>
              </div>
              <button
                onClick={() => onNavigate('recommendations')}
                className="mt-4 text-xs font-semibold text-slate-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Explore outfit generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wardrobe Overview Stats & Closet Health Formula */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 font-serif">Digital Wardrobe Overview</h2>
          <button
            onClick={() => onNavigate('wardrobe')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({items.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              onClick={() => {
                if (s.cat) onNavigate('wardrobe');
                else onNavigate('saved');
              }}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{s.label}</span>
                <span className={`w-2 h-2 rounded-full ${s.cat ? 'bg-slate-400' : 'bg-purple-500'}`} />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:scale-105 transition-transform origin-left font-serif">
                {s.count}
              </p>
              <span className="text-[11px] text-slate-400 block mt-1">
                {s.cat ? `Managed garments` : `Curated pairings`}
              </span>
            </div>
          ))}
        </div>

        {/* Closet Balance & Styling Potential Gauge */}
        {items.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Closet Balance & Pairing Potential
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Proportional distribution across garment layers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <TrendingUp className="w-3 h-3 text-amber-600" />
                  <span>{totalCombinations.toLocaleString()} Outfit Combinations</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Formula Ready</span>
                </span>
              </div>
            </div>

            {/* Stacked Percentage Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden bg-slate-100 flex">
              <div style={{ width: `${topPct}%` }} className="bg-indigo-500 h-full transition-all duration-500" title={`Tops: ${tops.length} (${topPct}%)`} />
              <div style={{ width: `${botPct}%` }} className="bg-sky-500 h-full transition-all duration-500" title={`Bottoms: ${bottoms.length} (${botPct}%)`} />
              <div style={{ width: `${shoPct}%` }} className="bg-amber-500 h-full transition-all duration-500" title={`Shoes: ${shoes.length} (${shoPct}%)`} />
              <div style={{ width: `${accPct}%` }} className="bg-emerald-500 h-full transition-all duration-500" title={`Accessories: ${accessories.length} (${accPct}%)`} />
            </div>

            {/* Legend */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>Tops ({topPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Bottoms ({botPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Shoes ({shoPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Accessories ({accPct}%)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Curated Style Capsules Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">Curated Style Capsules</h2>
            <p className="text-xs text-slate-500">Instant one-click styling formulas tailored for distinct life occasions</p>
          </div>
          <button
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Custom Generator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {styleCapsules.map((capsule) => {
            const IconComponent = capsule.icon;
            return (
              <div
                key={capsule.title}
                onClick={() => onQuickGenerate(capsule.weather, capsule.occasion)}
                className={`bg-white rounded-3xl p-5 border shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer ${capsule.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${capsule.badgeColor}`}>
                      {capsule.badge}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-700 transition">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 group-hover:text-amber-800 transition">
                    {capsule.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    {capsule.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-800 group-hover:text-amber-800">
                  <span>Generate Look</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Launch Recommendations Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Quick Context Recommendations</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your immediate weather and destination to generate instant combinations
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Explainable Color & Climate Matching</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onQuickGenerate('Hot', 'Casual')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-amber-600 mb-2 font-bold text-xs">
              <Sun className="w-4 h-4" />
              <span>Hot & Sunny • Casual</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Breathable & Relaxed</p>
            <p className="text-[11px] text-slate-500 mt-1">Lightweight linen, tees, shorts, breathable sneakers</p>
          </button>

          <button
            onClick={() => onQuickGenerate('Mild', 'Work / Formal')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/30 transition text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sky-600 mb-2 font-bold text-xs">
              <Sun className="w-4 h-4" />
              <span>Mild Day • Work / Formal</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Smart Office Look</p>
            <p className="text-[11px] text-slate-500 mt-1">Crisp button-downs, chinos, loafers, minimal accessories</p>
          </button>

          <button
            onClick={() => onQuickGenerate('Cold', 'Casual')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-blue-600 mb-2 font-bold text-xs">
              <Snowflake className="w-4 h-4" />
              <span>Cold Weather • Casual</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Cozy Layering</p>
            <p className="text-[11px] text-slate-500 mt-1">Sweaters, denim, rugged boots, warm scarves</p>
          </button>
        </div>
      </div>

      {/* Recent Wardrobe Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 font-serif">Recently Added Garments</h2>
          <button
            onClick={() => onNavigate('wardrobe')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Digital Closet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs">
            <Shirt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 font-serif">Your Wardrobe is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Add your clothing items or load sample starter items to begin generating outfit recommendations.
            </p>
            <button
              onClick={() => onOpenAddItem()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Item</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.slice(0, 4).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Saved Outfits if available */}
      {savedOutfits.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 font-serif">Saved Outfits</h2>
            <button
              onClick={() => onNavigate('saved')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All Saved ({savedOutfits.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {savedOutfits.slice(0, 2).map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                isSaved={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
