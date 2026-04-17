import { useState } from 'react';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Twitter, Github, Send } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-24 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
            The Future of Finance
          </h2>
          <p className="text-white/60 mb-8">
            Subscribe for the latest updates, insights, and news.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-10">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full px-5 py-3 h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <Button
              type="submit"
              className="bg-white text-[#1a1a1a] hover:bg-white/90 rounded-full px-8 h-12 font-medium transition-all hover:scale-[1.02]"
            >
              {isSubmitted ? 'Subscribed!' : 'Sign Up'}
            </Button>
          </form>

          <div className="flex justify-center gap-3">
            <a
              href="https://twitter.com/SIAFinance"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/omarhamdysh"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://t.me/siafinance"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all"
              aria-label="Telegram"
            >
              <Send className="w-5 h-5" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
