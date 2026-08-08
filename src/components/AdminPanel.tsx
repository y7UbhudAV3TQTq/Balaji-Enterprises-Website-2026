import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Package, 
  ShieldCheck, 
  LayoutGrid,
  Search,
  LogOut,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Wand2,
  Zap,
  Command,
  Check
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { Product, CATEGORIES } from '../data/products';
import { generateProductImage } from '../services/imageService';

interface AdminPanelProps {
  onClose: () => void;
  initialAction?: 'new' | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, initialAction }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { products, addProduct, removeProduct, updateProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(initialAction === 'new' ? 'new' : null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [specInput, setSpecInput] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: 'extinguishers',
    specs: []
  });

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [editingId]);

  // Keyboard Shortcuts Listener inside Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in inputs unless Ctrl/Cmd + Enter
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (editingId) {
          saveProduct();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (editingId) {
          setEditingId(null);
        } else {
          onClose();
        }
        return;
      }

      if ((e.altKey && e.key.toLowerCase() === 'n') || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n' && !isInput)) {
        e.preventDefault();
        setEditingId('new');
        setNewProduct({ category: 'extinguishers', specs: [] });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingId, newProduct]);

  const handleFile = (file: File | null) => {
    if (file && (file.type.startsWith('image/'))) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = async () => {
    if (!newProduct.name) return;
    setIsGenerating(true);
    try {
      const url = await generateProductImage(newProduct.name, newProduct.description || '');
      if (url) {
        setNewProduct(prev => ({ ...prev, image: url }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyTemplate = (type: 'extinguisher' | 'signage') => {
    if (type === 'extinguisher') {
      setNewProduct({
        name: 'CO2 Fire Extinguisher 4.5 Kg',
        category: 'extinguishers',
        description: 'High pressure Carbon Dioxide extinguisher ideal for electrical hazards and liquid fires.',
        specs: ['4.5kg Capacity', 'Class B & C Fires', 'ISI & CE Certified', 'Non-Corrosive'],
        image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/water.jpg'
      });
    } else {
      setNewProduct({
        name: 'Fire Exit Emergency Directional Sign Board',
        category: 'signage',
        description: 'High-visibility photoluminescent directional sign board for emergency evacuation routes.',
        specs: ['12x4 Inch', 'Photoluminescent Glow', 'Weather Proof', 'Wall Mounted'],
        image: 'https://uploads.onecompiler.io/43dtnu92q/43pnhyp7f/Gents_ladies.png'
      });
    }
  };

  const addSpec = () => {
    if (specInput.trim()) {
      setNewProduct(prev => ({
        ...prev,
        specs: [...(prev.specs || []), specInput.trim()]
      }));
      setSpecInput('');
    }
  };

  const removeSpec = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      specs: (prev.specs || []).filter((_, i) => i !== index)
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid mission credentials.');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setNewProduct(p);
  };

  const saveProduct = () => {
    if (editingId === 'new') {
      const id = `manual-${Date.now()}`;
      addProduct({ ...newProduct, id } as Product);
    } else {
      updateProduct(newProduct as Product);
    }
    setEditingId(null);
    setNewProduct({ category: 'extinguishers', specs: [] });
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[200] bg-secondary flex items-center justify-center p-6 backdrop-blur-3xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-12 rounded-[3rem] w-full max-w-md relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-black text-white tracking-tighter">CENTRAL COMMAND</h2>
            <p className="text-white/40 font-mono text-[10px] mt-2 uppercase tracking-[0.2em]">Restricted Access Area</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="text" 
                placeholder="OPERATOR ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono placeholder:text-white/10 focus:border-primary outline-none transition-colors"
                autoFocus
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="ACCESS KEY"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono placeholder:text-white/10 focus:border-primary outline-none transition-colors"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-primary text-xs font-bold justify-center bg-primary/10 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <button className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
              AUTHORIZE ACCESS
            </button>
          </form>

          <button onClick={onClose} className="mt-8 w-full text-white/20 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            ABORT MISSION
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-secondary p-8 flex flex-col text-white">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl leading-none">COMMAND</h3>
            <p className="text-[10px] text-white/40 font-mono">PANEL V1.0</p>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          <button className="w-full flex items-center gap-4 bg-white/10 p-4 rounded-2xl text-primary font-bold">
            <Package className="w-5 h-5" /> Inventory Management
          </button>
          <button 
            onClick={() => {
              setEditingId('new');
              setNewProduct({ category: 'extinguishers', specs: [] });
            }} 
            className="w-full flex items-center justify-between bg-primary/20 hover:bg-primary border border-primary/30 p-4 rounded-2xl text-white transition-all font-bold group"
          >
            <div className="flex items-center gap-3">
              <Plus className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
              <span>Deploy New Asset</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 bg-black/40 text-white/70 text-[9px] font-mono rounded border border-white/10">Alt+N</kbd>
          </button>
        </nav>

        {/* Shortcuts Cheat Sheet */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 my-4 text-[10px] text-white/50 space-y-1.5 font-mono">
          <div className="flex justify-between items-center text-white/70 font-bold mb-1">
            <span>SHORTCUT KEYS</span>
            <Zap className="w-3 h-3 text-primary" />
          </div>
          <div className="flex justify-between"><span>New Asset:</span><span className="text-primary font-bold">Alt + N</span></div>
          <div className="flex justify-between"><span>Quick Save:</span><span className="text-primary font-bold">Ctrl + Enter</span></div>
          <div className="flex justify-between"><span>Cancel/Exit:</span><span className="text-primary font-bold">Esc</span></div>
        </div>

        <button 
          onClick={onClose}
          className="mt-4 flex items-center gap-4 bg-red-500/10 text-red-500 p-4 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" /> TERMINATE SESSION
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-12 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div>
              <h2 className="text-5xl font-display font-black text-secondary tracking-tighter">Inventory Core</h2>
              <p className="text-gray-400 font-medium">Real-time control over all Balaji safety deployments.</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border-2 border-gray-100 rounded-2xl pl-14 pr-10 py-5 w-full lg:w-96 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {editingId && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-10 rounded-[3rem] border-2 border-primary/20 shadow-2xl relative mb-12"
                >
                  <button onClick={() => setEditingId(null)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div>
                      <h3 className="text-2xl font-display font-black text-secondary">
                        {editingId === 'new' ? 'Deploy New Asset' : 'Modify Existing Asset'}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-1">Use shortcuts or select a quick template to populate details faster.</p>
                    </div>

                    {/* Quick Preset Shortcuts */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider hidden sm:inline">Templates:</span>
                      <button 
                        type="button" 
                        onClick={() => applyTemplate('extinguisher')}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-red-200/50"
                      >
                        <Zap className="w-3 h-3 text-primary" /> Extinguisher
                      </button>
                      <button 
                        type="button" 
                        onClick={() => applyTemplate('signage')}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-slate-200/50"
                      >
                        <Zap className="w-3 h-3 text-slate-500" /> Signage
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Asset Designation</label>
                        <input 
                          ref={nameInputRef}
                          value={newProduct.name || ''}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder="e.g. Clean Agent Stored Pressure 6 Kg"
                          className="w-full bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Asset Visual</label>
                        <div className="space-y-4">
                          <div 
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragging(false);
                              const file = e.dataTransfer.files[0];
                              if (file) handleFile(file);
                            }}
                            className={`relative group flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-[2.5rem] transition-all overflow-hidden ${
                              isDragging ? 'border-primary bg-primary/5 scale-[0.98]' : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            {newProduct.image ? (
                              <div className="relative w-full h-full p-8 flex items-center justify-center group/img">
                                <img src={newProduct.image} className="max-h-40 object-contain drop-shadow-2xl" alt="Asset Preview" />
                                <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                  <button 
                                    onClick={() => setNewProduct({...newProduct, image: ''})}
                                    className="p-4 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transition-all hover:scale-110"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                  <label className="p-4 bg-white text-secondary rounded-2xl shadow-xl hover:bg-gray-100 transition-all hover:scale-110 cursor-pointer">
                                    <Upload className="w-5 h-5" />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
                                  </label>
                                </div>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center p-12 cursor-pointer w-full h-full group-hover:bg-primary/5 transition-all">
                                <div className="p-5 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                  <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-sm font-black text-secondary uppercase tracking-widest mb-1">Mobilize Asset Visual</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Drop tactical imagery or click to select</p>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
                              </label>
                            )}
                          </div>
                          
                          <button
                            onClick={handleGenerateAI}
                            disabled={isGenerating || !newProduct.name}
                            className="w-full bg-white border border-gray-100 p-4 rounded-2xl text-[10px] font-black text-secondary uppercase tracking-widest flex items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all disabled:opacity-30 group"
                          >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />}
                            {isGenerating ? 'Synthesizing Tactical Asset...' : 'Generate Intelligent Visual'}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Classification</label>
                        <select 
                          value={newProduct.category || ''}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                          className="w-full bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                        >
                          {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Operational Brief</label>
                        <textarea 
                          value={newProduct.description || ''}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          rows={4}
                          className="w-full bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Specifications Matrix</label>
                        <div className="flex gap-2 mb-3">
                          <input 
                            placeholder="Add tactical spec..." 
                            value={specInput}
                            onChange={(e) => setSpecInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                            className="flex-1 bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                          />
                          <button 
                            onClick={(e) => { e.preventDefault(); addSpec(); }}
                            className="bg-secondary text-white p-4 rounded-2xl hover:bg-primary transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(newProduct.specs || []).map((spec, i) => (
                            <span key={i} className="bg-gray-100 text-secondary px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                              {spec}
                              <button onClick={() => removeSpec(i)} className="hover:text-primary transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={saveProduct}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-between px-8 hover:translate-y-[-2px] transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Save className="w-5 h-5" />
                          <span>SAVE PRODUCT TO INVENTORY</span>
                        </div>
                        <kbd className="px-2.5 py-1 bg-black/20 text-white/80 text-[10px] font-mono rounded-lg border border-white/20">Ctrl + Enter</kbd>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Asset</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Classification</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-12 h-12 object-contain bg-gray-50 rounded-xl p-2" />
                          <span className="font-bold text-secondary">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-full text-gray-500">
                          {CATEGORIES.find(c => c.id === p.category)?.label || p.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button onClick={() => startEdit(p)} className="p-3 text-gray-400 hover:text-primary transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => removeProduct(p.id)} className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
