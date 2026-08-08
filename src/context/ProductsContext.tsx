import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALL_PRODUCTS, Product } from '../data/products';

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (product: Product) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('balaji_products');
        if (saved) {
          const parsed = JSON.parse(saved) as Product[];
          // Migrate old categories to new simplified 'signage' category
          const migrated = parsed.map(p => {
            const oldCategories = ['prohibition', 'mandatory', 'warning', 'emergency', 'direction', 'fire-safety', 'general', 'signboards'];
            if (oldCategories.includes(p.category)) {
              return { ...p, category: 'signage' as const };
            }
            return p;
          });
          return migrated;
        }
        return ALL_PRODUCTS;
      }
    } catch (e) {
      console.warn('LocalStorage access failed, using default inventory:', e);
    }
    return ALL_PRODUCTS;
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('balaji_products', JSON.stringify(products));
      }
    } catch (e) {
      console.warn('LocalStorage persistence failed:', e);
    }
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, removeProduct, updateProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within a ProductsProvider');
  return context;
};
