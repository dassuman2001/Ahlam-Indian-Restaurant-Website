import React, { useState, useEffect } from 'react';
import { MenuService } from '../services/db';
import { Leaf, Award } from 'lucide-react';
import { MenuItem } from '../types';

const categories = [
  { id: 'all', label: 'Full Menu' },
  { id: 'chennai-starter', label: 'Chennai Starters' },
  { id: 'south-indian-main', label: 'South Indian Mains' },
];

const MenuSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
        try {
            const data = await MenuService.getAll();
            setMenuItems(data);
        } catch (error) {
            console.error("Failed to load menu", error);
        } finally {
            setLoading(false);
        }
    };
    loadMenu();
  }, []);

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 bg-elegant-base relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold-accent text-xs font-bold tracking-[0.2em] uppercase block mb-3">Our Selection</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Culinary Masterpieces</h2>
          <div className="w-16 h-[1px] bg-gold-accent mx-auto"></div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300 border rounded-sm ${
                activeCategory === cat.id 
                  ? 'border-gold-accent bg-gold-accent text-elegant-base font-bold shadow-lg shadow-gold-accent/20' 
                  : 'border-white/10 text-stone-300 hover:border-gold-accent hover:text-gold-accent bg-elegant-card'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
            <div className="text-center text-stone-300 py-12">Loading menu items...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredItems.map((item) => (
                <div key={item.id} className="group bg-elegant-card border border-white/5 hover:border-gold-accent/30 hover:shadow-2xl hover:shadow-black/50 transition-all duration-500 overflow-hidden flex flex-col h-full rounded-sm">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                    <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-elegant-card via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        {item.isVegan && (
                            <div className="bg-green-900/90 backdrop-blur-sm p-1.5 rounded-full border border-green-700/50" title="Vegan">
                                <Leaf size={14} className="text-green-400" />
                            </div>
                        )}
                        {item.isChefSpecial && (
                            <div className="bg-gold-accent/90 backdrop-blur-sm p-1.5 rounded-full border border-yellow-600/50" title="Chef's Special">
                                <Award size={14} className="text-elegant-base" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-xl font-serif text-white group-hover:text-gold-accent transition-colors duration-300">
                        {item.name}
                    </h3>
                    <span className="font-serif text-lg text-gold-accent font-bold">{item.price}</span>
                    </div>
                    <p className="text-stone-300 text-sm font-light leading-relaxed mb-6 flex-grow">{item.description}</p>
                    <button className="text-xs uppercase tracking-widest text-stone-400 group-hover:text-white transition-colors flex items-center gap-2 mt-auto">
                        Order Now <span className="block w-4 h-[1px] bg-stone-500 group-hover:bg-white transition-colors"></span>
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;