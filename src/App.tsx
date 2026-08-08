import React, { useState, useEffect, useRef } from 'react';
import { 
  FireExtinguisher, 
  ShieldCheck, 
  Clock, 
  Users, 
  IndianRupee, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  ChevronUp, 
  Star, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Construction,
  Info,
  LogOut,
  Bell,
  Eye,
  Stethoscope,
  Target,
  Wind,
  ExternalLink,
  Globe,
  ShowerHead as Shower
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { ProductsProvider, useProducts } from './context/ProductsContext';
import { AdminPanel } from './components/AdminPanel';
import ProductsPage from './components/ProductsPage';

// --- Global Utilities ---

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

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isClicking, setIsClicking] = useState(false);
  const [smokeParticles, setSmokeParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Spawn white smoke at click location
      const newParticle = { id: Date.now(), x: e.clientX, y: e.clientY };
      setSmokeParticles(prev => [...prev.slice(-10), newParticle]);
      
      // Cleanup particle after animation
      setTimeout(() => {
        setSmokeParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1000);
    };

    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[110] overflow-hidden">
        <AnimatePresence>
          {smokeParticles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0.8, scale: 0.2, x: p.x - 20, y: p.y - 20 }}
              animate={{ opacity: 0, scale: 3, y: p.y - 120, x: p.x + (Math.random() * 40 - 20) }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute w-10 h-10 bg-white/40 blur-xl rounded-full"
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        className="fixed top-0 left-0 z-[120] pointer-events-none hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div 
          animate={{ scale: isClicking ? 0.8 : 1 }}
          className="relative w-8 h-8 flex items-center justify-center"
        >
          {/* Subtle Safety Pulse */}
          <div className="w-4 h-4 bg-primary/40 rounded-full blur-[2px]" />
          <motion.div 
            animate={{ scale: [1, 2], opacity: [0.3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 border-2 border-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </>
  );
};

// --- Components ---

const Navbar = ({ onNavigate, currentView }: { onNavigate: (v: string) => void; currentView: string }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', view: 'home' },
    { name: 'Products', view: 'products' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: any) => {
    if (link.view) {
      e.preventDefault();
      onNavigate(link.view);
      window.scrollTo(0, 0);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || currentView === 'products' ? 'glass-morphism py-3 shadow-premium' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button onClick={() => onNavigate('home')} className="flex items-center active:scale-95 transition-transform group">
          <div className="overflow-hidden">
            <img 
              src="https://uploads.onecompiler.io/43dtnu92q/43dtqfeb8/Balaji%20enterprisess%20invoce%20logo.png" 
              alt="Balaji Enterprises" 
              className="h-16 md:h-20 w-auto object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.view ? (
              <button 
                key={link.name}
                onClick={(e) => handleLinkClick(e, link)}
                className={`group relative font-bold text-[10px] uppercase tracking-[0.2em] transition-colors ${isScrolled || currentView === 'products' ? (currentView === link.view ? 'text-primary' : 'text-secondary/80 hover:text-primary') : 'text-white/80 hover:text-white'}`}
              >
                {link.name}
                {currentView === link.view && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" 
                  />
                )}
              </button>
            ) : (
              <a 
                key={link.name} 
                href={link.href} 
                className={`font-bold text-[10px] uppercase tracking-[0.2em] transition-colors ${isScrolled || currentView === 'products' ? 'text-secondary/80 hover:text-primary' : 'text-white/80 hover:text-white'}`}
              >
                {link.name}
              </a>
            )
          ))}
          <Magnetic strength={0.2}>
            <a 
              href="#contact" 
              className="bg-primary text-white px-8 py-3 rounded-full font-black text-[10px] tracking-widest btn-wow shadow-lg shadow-primary/20 uppercase"
            >
              FREE CONSULTATION
            </a>
          </Magnetic>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white bg-primary p-2 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-morphism border-b overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={(e) => link.view ? handleLinkClick(e, link) : (setMobileMenuOpen(false))}
                  className="text-left font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest text-[10px]"
                >
                  {link.view ? link.name : <a href={link.href}>{link.name}</a>}
                </button>
              ))}
              <a 
                href="#contact" 
                className="bg-primary text-white text-center py-3 rounded-xl font-bold shadow-lg text-[10px] tracking-widest"
                onClick={() => setMobileMenuOpen(false)}
              >
                CALL NOW
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const EmergencyBanner = () => (
  <div className="bg-primary text-white py-2 overflow-hidden relative">
    <div className="container mx-auto px-4 text-center">
      <motion.p 
        animate={{ x: [10, -10, 10] }} 
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="text-xs md:text-sm font-bold tracking-widest flex items-center justify-center gap-2"
      >
        <AlertTriangle className="w-4 h-4" /> 
        EMERGENCY FIRE SAFETY SERVICES 24/7 • CALL NOW: +91 74116 16167
      </motion.p>
    </div>
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
  </div>
);

const EmberField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(20)].map((_, i) => (
      <div 
        key={i} 
        className="ember" 
        style={{ 
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 5}s`
        }} 
      />
    ))}
  </div>
);

const Hero = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 300]);
  const yContent = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [isDischarging, setIsDischarging] = useState(false);

  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden bg-secondary">
      <EmberField />
      
      {/* Scroll Progress */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Parallax Background */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-r from-secondary via-secondary/70 to-transparent z-10 transition-colors duration-1000 ${isDischarging ? 'bg-blue-900/40' : 'fire-glow'}`} />
        <img 
          src="https://images.unsplash.com/photo-1611159063981-b8c8c4301869?auto=format&fit=crop&w=1920&q=80" 
          alt="Fire emergency background" 
          className={`w-full h-full object-cover scale-110 opacity-60 transition-all duration-1000 ${isDischarging ? 'filter grayscale brightness-125' : 'heat-haze'}`}
        />
      </motion.div>
      
      {/* Suppression Discharge Effect */}
      <AnimatePresence>
        {isDischarging && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent_60%)] blur-3xl shadow-[inset_0_0_100px_rgba(255,255,255,0.2)]"
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 relative z-30">
        <motion.div style={{ y: yContent }} className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full mb-10 backdrop-blur-md shadow-2xl"
          >
            <div className={`w-3 h-3 rounded-full ${isDischarging ? 'bg-blue-400' : 'bg-primary'} animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]`} />
            <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">ELITE SAFETY ENGINEERING • EST 2015</span>
          </motion.div>

          <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-display font-black text-white leading-[0.85] tracking-tighter mb-10">
            <SplitText text="EXTINGUISH THE RISK." className="" />
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl md:text-2xl text-white/40 max-w-2xl mb-14 leading-relaxed font-semibold italic"
          >
            Mission-critical fire suppression and industrial signage for Bangalore's high-stakes environments. Professional engineering meets rapid response.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-8"
          >
            <Magnetic strength={0.2}>
              <a href="#products-preview" className="bg-primary text-white border-2 border-primary px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest btn-wow flex items-center justify-center gap-4 shadow-2xl shadow-primary/30">
                COMMAND THE ARSENAL <Flame className="w-5 h-5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <button 
                onMouseDown={() => setIsDischarging(true)}
                onMouseUp={() => setIsDischarging(false)}
                onMouseLeave={() => setIsDischarging(false)}
                className="bg-white/5 text-white border border-white/20 hover:border-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest btn-wow flex items-center justify-center gap-4 group backdrop-blur-md"
              >
                TEST SUPPRESSION <div className="p-1 rounded-full bg-blue-500 group-hover:animate-ping"><Shower className="w-4 h-4" /></div>
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        style={{ opacity }}
        animate={{ y: [0, 20, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">MISSION READY</span>
        <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent opacity-50" />
      </motion.div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: 'Protection Coverage', value: '1M', sub: 'Sq. Ft', icon: ShieldCheck },
    { label: 'Response Units', value: '24', sub: 'Stations', icon: Clock },
    { label: 'High-Value Clients', value: '500+', sub: 'Enterprises', icon: Users },
    { label: 'Safety Compliance', value: '100%', sub: 'Global Stds', icon: Star },
  ];

  return (
    <section className="relative py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-3 scale-95 group-hover:rotate-0 group-hover:scale-100 transition-all duration-500" />
              <div className="relative p-10 text-center flex flex-col items-center">
                <div className="bg-white p-6 rounded-[2rem] shadow-premium mb-6 group-hover:scale-110 transition-transform duration-500 animate-float">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <motion.div 
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  className="text-5xl font-display font-black text-secondary tracking-tighter mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">{stat.label}</div>
                <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{stat.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionHeading = ({ subtitle, title, centered = true, white = false }: { subtitle: string; title: string; centered?: boolean; white?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
    <motion.span 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="text-primary font-black tracking-widest text-xs uppercase block mb-3"
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`text-4xl md:text-5xl font-display font-black ${white ? 'text-white' : 'text-secondary'}`}
    >
      {title}
    </motion.h2>
    <div className={`h-1.5 w-20 bg-primary mt-6 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
  </div>
);

const About = () => (
  <section id="about" className="py-24 bg-[#f8fafc]">
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <SectionHeading 
            subtitle="Who We Are" 
            title="Trusted Protection Since 2015" 
            centered={false}
          />
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Balaji Enterprises has been Bangalore's premier shield against fire hazards for nearly a decade. We combine state-of-the-art technology with deep regulatory expertise to bring you safety solutions that actually work.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'ISI Certified', icon: CheckCircle2 },
              { title: 'Certified Experts', icon: Users },
              { title: 'Best Prices', icon: IndianRupee },
              { title: 'Fast Delivery', icon: Clock },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <item.icon className="text-primary w-5 h-5 flex-shrink-0" />
                <span className="font-bold text-secondary text-sm">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:w-1/2 relative">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="rounded-3xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80" 
              alt="Fire safety inspection" 
              className="w-full h-auto"
            />
          </motion.div>
          <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-premium border border-gray-100 hidden md:block">
            <div className="text-4xl font-display font-black text-primary">8+</div>
            <div className="text-sm font-bold text-secondary mt-1">YEARS OF<br/>EXCELLENCE</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Services = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const services = [
    { 
      title: 'Signage Manufacturing', 
      desc: 'Industrial-grade production of safety, informative, and regulatory boards using global-standard materials.',
      icon: Construction,
      size: 'large',
      img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Site Logistics & Audit', 
      desc: 'Expert strategic assessment of physical premises to map critical safety points.',
      icon: Eye,
      size: 'small',
      color: 'bg-primary'
    },
    { 
      title: 'Certified Installation', 
      desc: 'Mission-ready mounting and calibration of active fire suppression hardware.',
      icon: ShieldCheck,
      size: 'small',
      color: 'bg-secondary'
    },
    { 
      title: 'Luminescent R&D', 
      desc: 'Pioneering zero-light visibility solutions using advanced photoluminescent technology.',
      icon: Star,
      size: 'medium',
      img: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="services" className="py-32 bg-[#fafafa]">
      <div className="container mx-auto px-6">
        <div className="mb-20 text-center">
          <SectionHeading subtitle="Active Ecosystem" title="The Architecture of Safety" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              onMouseMove={handleMouseMove}
              className={`bento-card group flex flex-col justify-between ${
                s.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                s.size === 'medium' ? 'md:col-span-2 md:row-span-1' : ''
              } ${s.color || 'bg-white'}`}
              style={{
                '--mouse-x': `${mousePos.x}px`,
                '--mouse-y': `${mousePos.y}px`,
              } as React.CSSProperties}
            >
              <div className="card-spotlight" />
              
              {s.img && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="relative z-10">
                <div className={`w-16 h-16 ${s.size === 'small' ? 'bg-white/20' : 'bg-primary/10'} rounded-3xl flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-[0_0_20px_rgba(230,57,70,0.2)]`}>
                  <s.icon className={`w-8 h-8 ${s.size === 'small' ? 'text-white' : 'text-primary'}`} />
                </div>
                <h3 className={`text-4xl font-display font-black mb-6 tracking-tighter leading-none ${s.size === 'small' ? 'text-white' : 'text-secondary'}`}>{s.title}</h3>
                <p className={`text-xl leading-relaxed ${s.size === 'small' ? 'text-white/90 font-medium' : 'text-slate-600 font-medium'}`}>{s.desc}</p>
              </div>

              <div className="flex justify-end relative z-10 mt-10">
                <div className={`p-4 rounded-full ${s.size === 'small' ? 'bg-white/10' : 'bg-gray-100'} group-hover:bg-primary group-hover:text-white group-hover:translate-x-3 transition-all duration-500`}>
                  <ArrowRight className={`w-5 h-5 ${s.size === 'small' ? 'text-white' : 'text-primary group-hover:text-white'}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SignBoards = () => {
  const signs = [
    { cat: 'PROHIBITION', icon: LogOut, name: 'No Smoking', color: 'text-red-500', bg: 'bg-red-50' },
    { cat: 'MANDATORY', icon: Bell, name: 'Safety Helmet', color: 'text-blue-500', bg: 'bg-blue-50' },
    { cat: 'WARNING', icon: AlertTriangle, name: 'High Voltage', color: 'text-amber-500', bg: 'bg-amber-50' },
    { cat: 'EMERGENCY', icon: Stethoscope, name: 'First Aid', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { cat: 'FIRE EQUIPMENT', icon: Flame, name: 'Fire Hose', color: 'text-red-600', bg: 'bg-red-50' },
    { cat: 'EXIT SIGNS', icon: ArrowRight, name: 'Directional', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <SectionHeading subtitle="Visual Safety" title="Signage Categories" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {signs.map((sign, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-3xl ${sign.bg} border border-transparent hover:border-gray-200 transition-all text-center`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-white shadow-sm ${sign.color}`}>
                <sign.icon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter mb-1">{sign.cat}</p>
              <h4 className="font-bold text-secondary text-sm">{sign.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FireSafetyGuide = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const extinguisherTypes = [
    { id: 1, title: 'ABC Fire Extinguishers', desc: 'Multipurpose devices for various fire classes. Effective for Class A, B, and C fires.' },
    { id: 2, title: 'BC Fire Extinguishers', desc: 'Ideal for flammable liquids (Class B) and energized electrical equipment (Class C).' },
    { id: 3, title: 'Clean Agent Extinguishers', desc: 'Safe for electronics, eco-friendly gaseous suppression that leaves no residue.' },
    { id: 4, title: 'CO2 Fire Extinguishers', desc: 'Displaces oxygen to suffocate fire; perfect for electrical fires with no cleanup required.' },
    { id: 5, title: 'Water Fire Extinguishers', desc: 'Dispenses a stream of water; suitable strictly for Class A fires (solids).' },
    { id: 6, title: 'Foam Fire Extinguishers', desc: 'Perfect for Class A and Class B (liquid) fires. Cannot handle gaseous fires.' },
    { id: 7, title: 'Li-ion Battery Extinguishers', desc: 'Specifically designed to suppress intense fires caused by battery failures.' },
    { id: 8, title: 'Automatic Modular Type', desc: 'Detects and suppresses fire automatically in unoccupied spaces.' },
    { id: 9, title: 'Special Application', desc: 'Protects against specialized hazards like Class K (kitchen) and Class D (metal) fires.' },
  ];

  const fireClasses = [
    { label: 'Class A', type: 'Solid Solids', desc: 'Wood, cloth, paper, plastic. The most common source of fire.' },
    { label: 'Class B', type: 'Flammable Liquids', desc: 'Oil, alcohol, gasoline, and petroleum-based products.' },
    { label: 'Class C', type: 'Gaseous Fires', desc: 'Hydrogen, butane, or methane. Explosive and fast-spreading.' },
    { label: 'Class D', type: 'Combustible Metals', desc: 'Magnesium, potassium. Requires specialized extinguishing agents.' },
    { label: 'Class E', type: 'Electrical Hazards', desc: 'Fires arising from electrically energized devices and wiring.' },
    { label: 'Class K/F', type: 'Cooking Media', desc: 'Super-heated cooking oils and fats in commercial or home kitchens.' },
  ];

  const maintenanceTips = [
    { title: 'Monthly Inspection', desc: 'Check for visible damage, leaks, or broken seals.' },
    { title: 'Pressure Gauge', desc: 'Ensure the needle stays in the green zone.' },
    { title: 'Cleanliness', desc: 'Wipe off dust or grease that might obstruct functionality.' },
    { title: 'Shake Chem Units', desc: 'Occasionally shake dry chemical units to prevent powder settling.' },
    { title: 'Annual Service', desc: 'Schedule a professional inspection at least once a year.' },
  ];

  return (
    <section className="py-32 bg-secondary text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-24">
          <SectionHeading subtitle="Expert Knowledge" title="Mastering Fire Safety" centered={false} white={true} />
          <p className="text-xl text-white/60 leading-relaxed font-medium">
            Understanding your equipment is the first step toward total protection. At Balaji Enterprises, we believe education is as vital as the hardware we provide.
          </p>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-display font-black text-primary">What is a Fire Extinguisher?</h3>
            <p className="text-white/70 leading-relaxed text-lg italic">
              "A Fire Extinguisher is a fire safety device to extinguish early stage fires quickly and prevent potential hazards. They are lightweight yet control fire before it spreads while saving lives and property."
            </p>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h4 className="text-xl font-bold mb-4">Why are they important?</h4>
              <p className="text-white/60 leading-relaxed">
                The reason is simple: It helps to put out small fires. By putting out fire at the primary level, it protects the environment from burning debris and smoke. Researches have shown that a small extinguisher can handle <span className="text-primary font-black">80%</span> of all fire incidents, stopping the fire from becoming more disastrous.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {fireClasses.map((f, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-primary/20 transition-all group">
                <div className="text-primary font-black text-xs tracking-widest mb-2">{f.label.includes('K') ? 'K / F' : f.label}</div>
                <h4 className="font-bold text-lg mb-1">{f.type}</h4>
                <p className="text-xs text-white/40 group-hover:text-white/80 transition-colors">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Types Grid */}
        <div className="mb-32">
          <SectionHeading subtitle="Hardware Selection" title="Types of Fire Extinguishers & Usage" white={true} />
          <p className="text-center text-white/50 max-w-2xl mx-auto -mt-10 mb-16">
            A single fire suppression device cannot tackle every type of fire. It's crucial to choose the right agent for perfect safety.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 1, title: 'ABC Fire Extinguishers', desc: 'Multipurpose devices effective for class A, B, and C fires.' },
              { id: 2, title: 'BC Fire Extinguishers', desc: 'Effective for Class B flammable liquids/gases and Class C energized electrical equipment.' },
              { id: 3, title: 'Clean Agent Fire Extinguishers', desc: 'Non-conductive, safe, eco-friendly gaseous suppression that reduces oxygen levels to stop chain reactions.' },
              { id: 4, title: 'CO2 Fire Extinguishers', desc: 'One of the cleanest extinguishers; uses CO2 to displace oxygen and suffocate the fire without residue.' },
              { id: 5, title: 'Water Fire Extinguishers', desc: 'Dispenses a stream of water; suitable for solid materials (Class A fires).' },
              { id: 6, title: 'Foam Fire Extinguishers', desc: 'Perfect for Class A and liquid Class B fires. Not suitable for gaseous fires.' },
              { id: 7, title: 'Lithium-ion Battery Extinguishers', desc: 'Specifically designed to suppress fires caused by failing lithium-ion battery packs.' },
              { id: 8, title: 'Automatic Modular Type', desc: 'Detects and suppresses fire without human intervention, perfect for unoccupied spaces.' },
              { id: 9, title: 'Special Application', desc: 'Protects against Class K (kitchen), Class D (metal), and other specialized combustible fires.' },
            ].map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-10 bg-white/5 rounded-[3rem] border border-white/10 hover:border-primary/50 transition-all group flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center font-black text-primary border border-primary/20">
                    {t.id}
                  </div>
                  <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{t.title}</h4>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PASS Method */}
        <div className="bg-primary rounded-[3rem] p-12 lg:p-20 mb-32 relative overflow-hidden group">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-display font-black mb-8">The P.A.S.S. Protocol</h3>
              <p className="text-white/90 text-lg mb-12">Acting fast requires a clear mind. Follow this simple 4-step protocol for maximum effectiveness.</p>
              
              <div className="space-y-6">
                {[
                  { l: 'P', name: 'Pull', desc: 'Pull the pin to break the safety seal.' },
                  { l: 'A', name: 'Aim', desc: 'Aim the nozzle at the base of the fire.' },
                  { l: 'S', name: 'Squeeze', desc: 'Squeeze the lever to discharge agent.' },
                  { l: 'S', name: 'Sweep', desc: 'Sweep side-to-side across the base.' },
                ].map((item, i) => (
                  <div 
                    key={i} 
                    onMouseEnter={() => setActiveStep(i)}
                    className={`flex items-center gap-6 p-4 rounded-2xl transition-all cursor-default ${activeStep === i ? 'bg-white/10 scale-105' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-xl transition-all ${activeStep === i ? 'bg-white text-primary border-white' : 'border-white text-white'}`}>
                      {item.l}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">{item.name}</h4>
                      <p className="text-white/70 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-full flex items-center justify-center">
              <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-white/20 blur-[100px] animate-pulse"></div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    {activeStep === 0 && (
                      <motion.div className="relative">
                        <FireExtinguisher className="w-48 h-48 text-white" />
                        <motion.div 
                          animate={{ y: [0, -40, 0], opacity: [1, 0, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute top-10 right-4 w-10 h-10 border-4 border-white rounded-full bg-primary flex items-center justify-center shadow-lg"
                        >
                          <span className="text-[10px] font-black">PIN</span>
                        </motion.div>
                      </motion.div>
                    )}
                    
                    {activeStep === 1 && (
                      <motion.div className="relative flex flex-col items-center">
                        <FireExtinguisher className="w-48 h-48 text-white rotate-[-45deg]" />
                        <motion.div 
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="absolute -bottom-4 -right-4"
                        >
                          <Target className="w-32 h-32 text-white" />
                        </motion.div>
                      </motion.div>
                    )}
                    
                    {activeStep === 2 && (
                      <motion.div className="relative">
                        <FireExtinguisher className="w-48 h-48 text-white" />
                        <motion.div 
                          animate={{ scaleY: [1, 0.7, 1] }}
                          transition={{ repeat: Infinity, duration: 0.4 }}
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/40 rounded-t-lg border border-white"
                        />
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0, 4], opacity: [0.4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6 }}
                          className="absolute top-20 -right-20 w-32 h-32 bg-white rounded-full blur-2xl"
                        />
                      </motion.div>
                    )}
                    
                    {activeStep === 3 && (
                      <motion.div className="relative">
                        <FireExtinguisher className="w-48 h-48 text-white rotate-[-30deg]" />
                        <motion.div 
                          animate={{ x: [-80, 80, -80] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          className="absolute -right-24 top-24 flex gap-4"
                        >
                          <Wind className="w-20 h-20 text-white/60" />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h3 className="text-3xl font-display font-black mb-8 text-primary">System Integrity</h3>
            <p className="text-white/60 mb-12">Maintaining your suppressors ensures they work when seconds count. Follow our maintenance blueprint for 100% readiness.</p>
            <div className="space-y-3">
              {maintenanceTips.map((tip, i) => (
                <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                  <CheckCircle2 className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">{tip.title}</h4>
                    <p className="text-xs text-white/40">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-[3rem] p-12 border border-white/10 flex flex-col justify-center">
            <h3 className="text-3xl font-display font-black mb-8">Why Balaji?</h3>
            <div className="space-y-6">
              {[
                'ISO-Certified International Standards',
                'Precision Engineered Suppression Systems',
                'Durability Meets Tactical Efficiency',
                'Comprehensive PAN India Network',
                'Expert Technical Guidance 24/7',
                'On-Time Deployment Promise'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="font-bold text-sm text-white/80">{text}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 p-8 bg-primary/10 rounded-3xl border border-primary/20">
              <p className="text-white/60 text-sm font-medium">For expert consultation, contact our technical wing at:</p>
              <p className="text-2xl font-black text-white mt-2">+91 74116 16167</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-24 bg-[#f8fafc]">
    <div className="container mx-auto px-6">
      <div className="glass-morphism bg-white rounded-[2.5rem] overflow-hidden shadow-premium flex flex-col lg:flex-row">
        {/* Contact Info */}
        <div className="lg:w-2/5 bg-secondary p-12 text-white relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-black mb-8">Contact Our Team</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-primary font-black uppercase tracking-widest text-[10px] mb-1">Our Base</h4>
                  <p className="text-white/60 text-sm leading-relaxed mb-2">
                    1st Main, Nageshi Mahalakshmi Temple Road, Vinayakanagara, Ramohalli Post, Bangalore - 560074
                  </p>
                  <a 
                    href="https://maps.google.com/?q=1st+Main,+Nageshi+Mahalakshmi+Temple+Road,+Vinayakanagara,+Ramohalli+Post,+Bangalore+-+560074" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors"
                  >
                    Open in Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-primary font-black uppercase tracking-widest text-[10px] mb-1">Call Us</h4>
                  <p className="text-lg font-bold">+91 74116 16167</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-primary font-black uppercase tracking-widest text-[10px] mb-1">Email Express</h4>
                  <a href="mailto:info.balajienterpriceses@gmail.com" className="text-sm font-bold break-all hover:text-primary transition-colors">info.balajienterpriceses@gmail.com</a>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-primary font-black uppercase tracking-widest text-[10px] mb-1">Official Domain</h4>
                  <a href="https://balajienterprisesfire.in" target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-1.5">
                    balajienterprisesfire.in <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-16 pt-8 border-t border-white/10">
              <h4 className="text-primary font-black uppercase tracking-widest text-[10px] mb-4">Follow Readiness</h4>
              <div className="flex gap-4">
                {['FB', 'IG', 'WA'].map(social => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs hover:bg-primary transition-colors cursor-pointer">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full"></div>
        </div>

        {/* Form */}
        <div className="lg:w-3/5 p-12">
          <h3 className="text-2xl font-display font-black text-secondary mb-8">Send a Quick Message</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Full Name</label>
                <input type="text" className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-semibold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Email Address</label>
                <input type="email" className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-semibold outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Enquiry Type</label>
              <select className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-semibold outline-none appearance-none">
                <option>Product Inquiry</option>
                <option>Service Request</option>
                <option>Safety Audit</option>
                <option>Emergency Service</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Message</label>
              <textarea rows={4} className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all font-semibold outline-none"></textarea>
            </div>
            <button className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs btn-hover shadow-xl shadow-primary/30">
              Deliver Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-secondary text-white pt-24 pb-12">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center mb-8">
            <div className="overflow-hidden">
              <img 
                src="https://uploads.onecompiler.io/43dtnu92q/43dtqfeb8/Balaji%20enterprisess%20invoce%20logo.png" 
                alt="Balaji Enterprises" 
                className="h-16 md:h-20 w-auto object-contain drop-shadow-md"
              />
            </div>
          </div>
          <p className="text-white/40 leading-relaxed text-sm mb-6">
            Bangalore's premium dedicated fire safety wing. Protecting high-value assets with professional grit since 2015.
          </p>
        </div>
        
        <div>
          <h4 className="font-display font-bold mb-6 text-primary tracking-widest text-xs uppercase">Quick Access</h4>
          <div className="flex flex-col gap-4 text-sm font-semibold text-white/50">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#products" className="hover:text-primary transition-colors">Products</a>
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#about" className="hover:text-primary transition-colors">About Us</a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold mb-6 text-primary tracking-widest text-xs uppercase">Core Services</h4>
          <div className="flex flex-col gap-4 text-sm font-semibold text-white/50">
            <p>Maintenance (AMC)</p>
            <p>Certified Installation</p>
            <p>Personnel Training</p>
            <p>Compliance Audit</p>
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold mb-6 text-primary tracking-widest text-xs uppercase">Newsletter</h4>
          <p className="text-white/40 text-xs mb-4 uppercase font-black tracking-tight">Stay Updated on Safety Standards</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email" className="bg-white/5 border-0 rounded-lg p-2 text-xs flex-grow outline-none focus:ring-1 focus:ring-primary/40" />
            <button className="bg-primary p-2 rounded-lg"><ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
      
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/20">
        <p>© 2026 Balaji Enterprises Co. All Rights Reserved. (<a href="https://balajienterprisesfire.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">balajienterprisesfire.in</a>)</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors tracking-tighter">Designed with <Flame className="inline w-2 h-2 text-primary" /> in BLR</a>
        </div>
      </div>
    </div>
  </footer>
);


function MainApp() {
  const [view, setView] = useState('home');
  const [showToTop, setShowToTop] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminAction, setAdminAction] = useState<'new' | null>(null);
  const { products } = useProducts();

  useEffect(() => {
    const handleScroll = () => setShowToTop(window.scrollY > 500);
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger global shortcut if active element is input/textarea
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);

      // Product adding shortcuts: Alt + N, Alt + Shift + A, Alt + Shift + L
      if (!isInput && (
        (e.altKey && e.key.toLowerCase() === 'n') || 
        (e.altKey && e.shiftKey && e.key.toLowerCase() === 'a') || 
        (e.altKey && e.shiftKey && e.key.toLowerCase() === 'l')
      )) {
        e.preventDefault();
        setAdminAction('new');
        setIsAdminOpen(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative selection:bg-primary/30 selection:text-secondary">
      <div className="noise-overlay" />
      <CustomCursor />
      {isAdminOpen && (
        <AdminPanel 
          initialAction={adminAction} 
          onClose={() => { 
            setIsAdminOpen(false); 
            setAdminAction(null); 
          }} 
        />
      )}
      <EmergencyBanner />
      <Navbar onNavigate={setView} currentView={view} />
      
      <main className="overflow-x-hidden">
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div
              key="home"
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "anticipate" }}
            >
              <Hero />
              <Stats />
              <About />
              <section id="products-preview" className="py-32 bg-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 blur-[100px] rounded-full" />

                <div className="container mx-auto px-6 text-center relative z-10">
                  <SectionHeading subtitle="Hardware Preview" title="Advanced Safety Armory" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20 perspective-2000">
                    {products.slice(0, 3).map((p, i) => (
                      <motion.div 
                        key={p.id} 
                        initial={{ opacity: 0, rotateY: -20, translateZ: -200 }}
                        whileInView={{ opacity: 1, rotateY: 0, translateZ: 0 }}
                        transition={{ delay: i * 0.2, duration: 1, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                        whileHover={{ 
                          scale: 1.05, 
                          rotateY: 10,
                          boxShadow: "0 50px 100px -20px rgba(0,0,0,0.1), 0 30px 60px -30px rgba(230,57,70,0.2)" 
                        }}
                        className="group p-10 rounded-[3rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/40 transform-gpu transition-all duration-500"
                      >
                        <div className="h-56 flex items-center justify-center mb-8 relative">
                          <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 blur-3xl" />
                          <motion.img 
                            src={p.image} 
                            alt={p.name} 
                            className="h-full object-contain relative z-10 animate-float transition-all"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 block">
                          {p.category === 'extinguishers' ? 'Fire Extinguisher' : 'Signage Board'}
                        </span>
                        <h4 className="text-xl font-display font-black text-secondary tracking-tight group-hover:text-primary transition-colors">{p.name}</h4>
                        
                        <div className="mt-8 pt-8 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Inventory Unit</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-24"
                  >
                    <Magnetic strength={0.2}>
                      <button 
                        onClick={() => { setView('products'); window.scrollTo(0,0); }}
                        className="group inline-flex items-center gap-4 bg-secondary text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest btn-hover shadow-2xl shadow-secondary/40"
                      >
                        EXPLORE FULL INVENTORY 
                        <div className="bg-primary p-1.5 rounded-full group-hover:translate-x-2 transition-transform">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </button>
                    </Magnetic>
                  </motion.div>
                </div>
              </section>
              <Services />
              <SignBoards />
              <FireSafetyGuide />
              <Contact />
            </motion.div>
          ) : view === 'products' ? (
            <motion.div
              key="products"
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "anticipate" }}
            >
              <ProductsPage 
                onBack={() => setView('home')} 
                onOpenAdmin={(action) => {
                  setAdminAction(action || 'new');
                  setIsAdminOpen(true);
                }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Back to Top */}
      <AnimatePresence>
        {showToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-xl shadow-2xl z-40 flex items-center justify-center btn-hover"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ProductsProvider>
      <MainApp />
    </ProductsProvider>
  );
}
