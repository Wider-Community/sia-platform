import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  {
    label: 'Products',
    href: '#',
    items: [
      { label: 'USDY', href: '#' },
      { label: 'OUSG', href: '#' },
      { label: 'Global Markets', href: '#' },
    ],
  },
  {
    label: 'Resources',
    href: '#',
    items: [
      { label: 'Insights', href: '#' },
      { label: 'Docs', href: '#' },
      { label: 'Trust & Security', href: '#' },
    ],
  },
  { label: 'Ecosystem', href: '#' },
  { label: 'About', href: '#' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-10 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
              scrolled ? 'border-[#1a1a1a]' : 'border-white'
            }`}>
              <svg
                viewBox="0 0 24 24"
                className={`w-5 h-5 transition-colors ${
                  scrolled ? 'text-[#1a1a1a]' : 'text-white'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10" />
              </svg>
            </div>
            <span className={`text-xl font-medium transition-colors ${
              scrolled ? 'text-[#1a1a1a]' : 'text-white'
            }`}>
              SIA
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.items ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70 ${
                        scrolled ? 'text-[#1a1a1a]' : 'text-white'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 bg-background border border-border shadow-lg rounded-xl">
                    {link.items.map((item) => (
                      <DropdownMenuItem key={item.label} asChild>
                        <a href={item.href} className="w-full text-foreground hover:bg-muted cursor-pointer">
                          {item.label}
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:opacity-70 ${
                    scrolled ? 'text-[#1a1a1a]' : 'text-white'
                  }`}
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              asChild
              className="bg-white text-[#1a1a1a] hover:bg-white/90 rounded-full px-5 py-2 text-sm font-medium transition-all hover:scale-[1.02] shadow-sm"
            >
              <a href="#">
                Launch Global Markets
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              scrolled ? 'text-[#1a1a1a]' : 'text-white'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background rounded-2xl mt-2 p-4 shadow-lg border border-border"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <a
                    href={link.href}
                    className="text-foreground font-medium py-2 block"
                  >
                    {link.label}
                  </a>
                  {link.items && (
                    <div className="pl-4 flex flex-col gap-2">
                      {link.items.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="text-muted-foreground text-sm py-1"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button
                asChild
                className="bg-[#1a1a1a] text-white rounded-full mt-2"
              >
                <a href="#">
                  Launch Global Markets
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
