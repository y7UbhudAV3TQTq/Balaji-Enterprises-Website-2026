import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  MessageCircle, 
  Ruler, 
  CheckCircle2, 
  ArrowRight,
  ChevronLeft,
  Search,
  Package,
  ArrowUpDown,
  Wand2,
  Sparkles,
  Loader2,
  Filter,
  ChevronRight,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll } from 'motion/react';
import { ALL_PRODUCTS, CATEGORIES, Product } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import { generateProductImage } from '../services/imageService';
import { useRef } from 'react';

// --- Local Utilities ---

const Magnetic = ({ children, strength = 0.5 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * strength);
    y.set((clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="magnetic-wrap"
    >
      {children}
    </motion.div>
  );
};

const SplitText = ({ text, className = "" }) => {
  const words = text.split(' ');
  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="split-line mr-[0.2em]">
          <motion.span
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            transition={{
              duration: 0.8,
              delay: i * 0.05,
              ease: [0.215, 0.61, 0.355, 1]
            }}
            viewport={{ once: true }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

interface CartItem extends Product {
  quantity: number;
  width?: string;
  height?: string;
}

// --- Quick View Modal ---

const QuickViewModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  onGenerateImage
}: { 
  product: Product | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onAddToCart: (p: Product, w?: string, h?: string) => void;
  onGenerateImage: (p: Product) => Promise<void>;
}) => {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-secondary/90 backdrop-blur-md z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl max-h-[90vh] bg-white z-[90] rounded-[3rem] shadow-premium overflow-hidden flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl z-10 transition-colors"
            >
              <X className="w-6 h-6 text-secondary" />
            </button>

            {/* Product Image Section */}
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5" />
              {product.image ? (
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain relative z-10 drop-shadow-3xl"
                />
              ) : (
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                  <h4 className="text-secondary font-black text-sm uppercase tracking-widest mb-2">Image Missing</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mb-6">Use AI to generate a deployment visual</p>
                  <button 
                    onClick={async () => {
                      setIsGenerating(true);
                      await onGenerateImage(product);
                      setIsGenerating(false);
                    }}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    {isGenerating ? 'Synthesizing...' : 'Generate with Imagen'}
                  </button>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-12 overflow-y-auto flex flex-col">
              <div className="mb-auto">
                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase mb-4 block">
                  {CATEGORIES.find(c => c.id === product.category)?.label}
                </span>
                <h2 className="text-3xl font-display font-black text-secondary mb-6 leading-tight">
                  {product.name}
                </h2>
                
                <p className="text-gray-400 font-medium leading-relaxed mb-8">
                  {product.description}
                </p>

                <div className="space-y-4 mb-10">
                  <h4 className="text-xs font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Technical Specs
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(230,57,70,0.4)]" />
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>

                {product.category === 'signage' && (
                  <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 mb-10">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
                      <Ruler className="w-4 h-4 text-primary" /> Custom Matrix
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-grow">
                        <input 
                          type="number" 
                          placeholder="W" 
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          className="w-full bg-white border border-gray-100 rounded-xl p-4 text-xs font-black outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-gray-300">IN</span>
                      </div>
                      <span className="text-gray-300 font-black">×</span>
                      <div className="relative flex-grow">
                        <input 
                          type="number" 
                          placeholder="H" 
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-full bg-white border border-gray-100 rounded-xl p-4 text-xs font-black outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-gray-300">IN</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onAddToCart(product, width, height);
                  onClose();
                }}
                className="w-full bg-primary text-white py-6 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] btn-hover flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 mt-8"
              >
                ADD TO MISSION ORDER
                <ShoppingCart className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ProductCard = ({ product, onAddToCart, onQuickView, onGenerateImage }: { product: Product; onAddToCart: (p: Product, w?: string, h?: string) => void; onQuickView: (p: Product) => void; onGenerateImage: (p: Product) => Promise<void>; key?: string }) => {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group glass-morphism bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-premium transition-all duration-500 flex flex-col perspective-1000"
    >
      <div className="aspect-square relative overflow-hidden bg-gray-50/50 p-8">
        {product.badge && (
          <motion.span 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute top-6 right-6 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full z-10 shadow-xl shadow-primary/20 tracking-widest uppercase"
          >
            {product.badge}
          </motion.span>
        )}
        {product.image ? (
          <motion.img 
            animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 2 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain relative z-10 drop-shadow-2xl cursor-pointer"
            onClick={() => onQuickView(product)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
            <Package className="w-12 h-12 text-gray-200 mb-4" />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async (e) => {
                e.stopPropagation();
                setIsGenerating(true);
                await onGenerateImage(product);
                setIsGenerating(false);
              }}
              disabled={isGenerating}
              className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[8px] font-black text-primary uppercase tracking-[0.2em] shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              {isGenerating ? 'GEN...' : 'GENERATE'}
            </motion.button>
          </div>
        )}
        <div 
          className={`absolute inset-0 bg-primary/5 transition-opacity duration-700 cursor-pointer ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => onQuickView(product)}
        />
      </div>
      
      <div className="p-8 flex-grow flex flex-col relative">
        <button 
          onClick={() => onQuickView(product)}
          className="absolute top-8 right-8 w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/20 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        >
          <Search className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase mb-3 block">
          {CATEGORIES.find(c => c.id === product.category)?.label}
        </span>
        <h3 className="text-xl font-display font-black text-secondary mb-3 line-clamp-2 leading-[1.2] group-hover:text-primary transition-colors">{product.name}</h3>
        
        {product.category === 'signage' && (
          <motion.div 
            initial={false}
            animate={{ height: isHovered ? 'auto' : '0px', opacity: isHovered ? 1 : 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 mt-2">
              <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
                <Ruler className="w-3.5 h-3.5 text-primary" /> Dimension Matrix
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  placeholder="Width" 
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full bg-white border-0 rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                />
                <span className="text-gray-300 font-black">×</span>
                <input 
                  type="number" 
                  placeholder="Height" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-white border-0 rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                />
              </div>
              <p className="text-[9px] text-gray-400 mt-3 font-semibold uppercase tracking-wider">Inches • Custom Cut</p>
            </div>
          </motion.div>
        )}

        <div className="space-y-2 mb-8 flex-grow">
          {product.specs.map((spec, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
              <div className="w-1 h-1 bg-primary rounded-full" /> {spec}
            </div>
          ))}
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(product, width, height)}
          className="w-full bg-secondary text-white py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] btn-hover flex items-center justify-center gap-3 shadow-2xl shadow-secondary/20 group/btn"
        >
          LOG TO ORDER 
          <div className="bg-primary/20 p-1 rounded-lg group-hover/btn:bg-primary transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function ProductsPage({ 
  onBack,
  onOpenAdmin
}: { 
  onBack: () => void;
  onOpenAdmin?: (action?: 'new') => void;
}) {
  const { products, updateProduct } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'popularity' | 'none'>('none');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const EXTINGUISHER_TYPES = [
    { id: 'all', label: 'All Types' },
    { id: 'abc', label: 'ABC Type' },
    { id: 'bc', label: 'BC Type' },
    { id: 'co2', label: 'CO2 Type' },
    { id: 'clean', label: 'Clean Agent' },
    { id: 'water', label: 'Water' },
    { id: 'foam', label: 'Foam' },
    { id: 'li-ion', label: 'Li-ion' },
    { id: 'modular', label: 'Modular' },
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    
    // Sub-category matching for extinguishers
    let matchesSubCategory = true;
    if (activeCategory === 'extinguishers' && activeSubCategory !== 'all') {
      const name = p.name.toLowerCase();
      if (activeSubCategory === 'abc') matchesSubCategory = name.includes('abc');
      else if (activeSubCategory === 'bc') matchesSubCategory = name.includes('bc') && !name.includes('abc');
      else if (activeSubCategory === 'co2') matchesSubCategory = name.includes('co2');
      else if (activeSubCategory === 'clean') matchesSubCategory = name.includes('clean agent');
      else if (activeSubCategory === 'water') matchesSubCategory = name.includes('water');
      else if (activeSubCategory === 'foam') matchesSubCategory = name.includes('foam');
      else if (activeSubCategory === 'li-ion') matchesSubCategory = name.includes('lithium') || name.includes('li-ion');
      else if (activeSubCategory === 'modular') matchesSubCategory = name.includes('modular') || name.includes('moldren');
    }

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || (
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.specs.some(s => s.toLowerCase().includes(query)) ||
      p.category.toLowerCase().includes(query)
    );

    return matchesCategory && matchesSubCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'popularity') {
      const aBest = a.badge === 'Best Seller' || a.badge === 'Hot' ? 1 : 0;
      const bBest = b.badge === 'Best Seller' || b.badge === 'Hot' ? 1 : 0;
      return bBest - aBest;
    }
    return 0;
  });

  const resetFilters = () => {
    setActiveCategory('all');
    setActiveSubCategory('all');
    setSearchQuery('');
  };

  const handleAddToCart = (product: Product, w?: string, h?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.width === w && item.height === h);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.width === w && item.height === h) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, width: w, height: h }];
    });
    setIsCartOpen(true);
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleGenerateImage = async (product: Product) => {
    try {
      const imageUrl = await generateProductImage(product.name, product.description);
      if (imageUrl) {
        updateProduct({ ...product, image: imageUrl });
        if (selectedProduct?.id === product.id) {
          setSelectedProduct({ ...product, image: imageUrl });
        }
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
    }
  };

  const updateQuantity = (id: string, delta: number, w?: string, h?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.width === w && item.height === h) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => {
    if (confirm('Clear all items from your order?')) setCart([]);
  };

  const sendWhatsAppOrder = () => {
    const phone = '917411616167';
    let text = "*BALAJI ENTERPRISES - NEW ORDER REQUEST*\n\n";
    
    cart.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name.toUpperCase()}*\n`;
      if (item.category === 'signage') {
        text += `   📐 Size: ${item.width || 'Std'} x ${item.height || 'Std'} inches\n`;
      }
      text += `   📦 Quantity: ${item.quantity}\n\n`;
    });

    text += "📍 _Please provide delivery details and verify sizes._";
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <div className="noise-overlay" />
      {/* Header Area */}
      <div className="container mx-auto px-6 mb-8 relative z-10">
        <nav className="flex items-center gap-2 mb-12 overflow-x-auto no-scrollbar py-2">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-primary font-black text-[10px] uppercase tracking-widest transition-colors whitespace-nowrap"
          >
            Home
          </button>
          <div className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0" />
          <button 
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-colors whitespace-nowrap ${activeCategory === 'all' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
          >
            Products
          </button>
          {activeCategory !== 'all' && (
            <>
              <div className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0" />
              <button 
                onClick={() => setActiveSubCategory('all')}
                className={`font-black text-[10px] uppercase tracking-widest transition-colors whitespace-nowrap ${activeSubCategory === 'all' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
              >
                {CATEGORIES.find(c => c.id === activeCategory)?.label}
              </button>
            </>
          )}
          {activeSubCategory !== 'all' && (
            <>
              <div className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0" />
              <span className="text-primary font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
                {EXTINGUISHER_TYPES.find(t => t.id === activeSubCategory)?.label}
              </span>
            </>
          )}
        </nav>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-primary font-black tracking-widest text-[10px] uppercase block mb-3">Official Inventory</span>
            <h1 className="text-4xl md:text-[5rem] font-display font-black text-secondary leading-[0.9] tracking-tighter">
              <SplitText text="COMPLETE SAFETY CATALOG" />
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="lg:hidden flex gap-2">
              <button 
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 px-6 flex items-center justify-center gap-3 font-black text-xs tracking-widest text-secondary shadow-sm"
              >
                <Filter className="w-4 h-4 text-primary" /> FILTERS
              </button>
            </div>

            <div className="relative group flex-grow lg:w-64">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? 'text-primary' : 'text-gray-400'}`} />
              <input 
                type="text" 
                placeholder="Find equipment..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all" 
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="relative group">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-10 text-xs font-black uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="none">Sort Default</option>
                <option value="name">Sort Name A-Z</option>
                <option value="popularity">Sort Best Sellers</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-gray-400 pointer-events-none" />
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-primary text-white p-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-black text-xs tracking-widest shadow-xl shadow-primary/20 btn-hover relative"
            >
              ORDER LIST 
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-pulse">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {onOpenAdmin && (
              <button 
                onClick={() => onOpenAdmin('new')}
                className="bg-secondary text-white p-4 px-5 rounded-2xl flex items-center justify-center gap-2.5 font-black text-xs tracking-widest shadow-xl shadow-secondary/20 hover:bg-primary transition-all group"
                title="Product Adding Shortcut (Alt + N)"
              >
                <Plus className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                <span className="hidden sm:inline">Add Product</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 bg-white/10 text-white/70 text-[9px] font-mono rounded">Alt+N</kbd>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Toolbar - Hidden on Desktop Sidebar */}
      <div className="lg:hidden container mx-auto px-6 mb-12">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all' 
              ? products.length 
              : products.filter(p => p.category === cat.id).length;
              
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveSubCategory('all');
                }}
                className={`whitespace-nowrap px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeCategory === cat.id ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'bg-white text-gray-400 hover:text-secondary shadow-sm'}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-32 h-fit">
            <div className="space-y-12">
              <div>
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Category Deployment
                </h4>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => {
                    const isActive = activeCategory === cat.id;
                    const count = cat.id === 'all' 
                      ? products.length 
                      : products.filter(p => p.category === cat.id).length;
                    
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setActiveSubCategory('all');
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                          isActive 
                            ? 'bg-secondary text-white shadow-xl shadow-secondary/20' 
                            : 'hover:bg-white hover:text-secondary text-gray-400'
                        }`}
                      >
                        <span className="font-black text-[10px] uppercase tracking-widest">{cat.label}</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                            isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'
                          }`}>
                            {count}
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-90 text-white' : 'text-gray-300 group-hover:translate-x-1'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeCategory === 'extinguishers' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Agent Type Matrix</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {EXTINGUISHER_TYPES.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setActiveSubCategory(type.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                          activeSubCategory === type.id 
                            ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                            : 'bg-white border-gray-100 text-gray-400 hover:border-primary/20 hover:text-secondary'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${activeSubCategory === type.id ? 'bg-primary' : 'bg-gray-200'}`} />
                        <span className="font-black text-[9px] uppercase tracking-widest">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="p-8 bg-secondary rounded-[2.5rem] text-white">
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <h5 className="font-black text-xs uppercase tracking-widest mb-2 leading-tight">Tactical Support</h5>
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed mb-6">Need expert consultation on fire safety equipment?</p>
                <button 
                  onClick={() => window.open('https://wa.me/917411616167', '_blank')}
                  className="w-full bg-primary text-white py-4 rounded-xl font-black text-[8px] uppercase tracking-widest hover:scale-[1.02] transition-all"
                >
                  Contact Expert
                </button>
              </div>
            </div>
          </aside>

          {/* Grid Area */}
          <div className="flex-grow">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredProducts.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={handleAddToCart} 
                      onQuickView={handleQuickView}
                      onGenerateImage={handleGenerateImage}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100"
                >
                  <Package className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                  <h3 className="text-xl font-display font-black text-secondary uppercase tracking-tight">No Deployment Found</h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2 px-6 mb-8">Adjust your filters or mission search parameters.</p>
                  <button 
                    onClick={resetFilters}
                    className="bg-primary/10 text-primary px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    RESET MISSION PARAMETERS
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Filter Drawer - Mobile Only */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-white z-[110] rounded-t-[3rem] flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-display font-black text-secondary uppercase tracking-tight">Mission Filters</h2>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-10">
                <div>
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setActiveSubCategory('all');
                        }}
                        className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                          activeCategory === cat.id 
                            ? 'bg-secondary text-white shadow-xl' 
                            : 'bg-gray-50 text-gray-400'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {activeCategory === 'extinguishers' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Extinguisher Type</h4>
                      <div className="flex flex-wrap gap-2">
                        {EXTINGUISHER_TYPES.map(type => (
                          <button
                            key={type.id}
                            onClick={() => setActiveSubCategory(type.id)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-wide transition-all border ${
                              activeSubCategory === type.id 
                                ? 'bg-primary text-white border-primary shadow-lg' 
                                : 'bg-white text-gray-400 border-gray-100'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-8">
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full bg-secondary text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl"
                >
                  APPLY FILTERS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-[#f8fafc]">
                <div>
                  <h2 className="text-2xl font-display font-black text-secondary uppercase tracking-tight">Your Order</h2>
                  <p className="text-[10px] font-black text-primary tracking-widest uppercase">Balaji Enterprises Checkout</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingCart className="w-16 h-16 mb-4 text-gray-300" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={`${item.id}-${item.width}-${item.height}`} className="flex gap-4 p-4 rounded-3xl bg-gray-50 border border-gray-100">
                      <div className="w-20 h-20 bg-white rounded-2xl p-2 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xs font-black text-secondary leading-tight mb-1">{item.name}</h4>
                        {item.category === 'signage' && (
                          <p className="text-[10px] font-bold text-primary uppercase">Size: {item.width || 'Std'}x{item.height || 'Std'}"</p>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-full shadow-sm">
                            <button onClick={() => updateQuantity(item.id, -1, item.width, item.height)} className="text-gray-400 hover:text-primary"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-black text-secondary">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1, item.width, item.height)} className="text-gray-400 hover:text-primary"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => updateQuantity(item.id, -item.quantity, item.width, item.height)} className="text-gray-200 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 bg-white border-t border-gray-50">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Items</span>
                  <span className="text-xl font-display font-black text-secondary">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    disabled={cart.length === 0}
                    onClick={sendWhatsAppOrder}
                    className="w-full py-5 rounded-[1.5rem] bg-primary text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 btn-hover shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      disabled={cart.length === 0}
                      onClick={clearCart}
                      className="py-4 rounded-2xl bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Clear All
                    </button>
                    <button 
                      disabled={cart.length === 0}
                      onClick={sendWhatsAppOrder}
                      className="py-4 rounded-2xl bg-[#25D366]/10 text-[#25D366] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-all disabled:opacity-30"
                    >
                      WhatsApp <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-6 text-[9px] text-center font-bold text-gray-300 uppercase tracking-wider leading-relaxed">
                  Clicking "Send Order" will open WhatsApp with your itemized list pre-formatted for Balaji Enterprises.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuickViewModal 
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={handleAddToCart}
        onGenerateImage={handleGenerateImage}
      />
    </div>
  );
}
