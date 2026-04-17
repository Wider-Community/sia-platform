import { Twitter, Github, Send } from 'lucide-react';

const footerLinks = {
  invest: {
    title: 'Invest',
    links: [
      { label: 'USDY', href: '#' },
      { label: 'OUSG', href: '#' },
      { label: 'Bridge', href: '#' },
      { label: 'Convert', href: '#' },
      { label: 'Global Markets', href: '#' },
    ],
  },
  partners: {
    title: 'Partners',
    links: [
      { label: 'Ecosystem', href: '#' },
      { label: 'Foundation', href: '#' },
      { label: 'Flux Finance', href: '#' },
    ],
  },
  explore: {
    title: 'Explore',
    links: [
      { label: 'Insights', href: '#' },
      { label: 'Docs', href: '#' },
      { label: 'Trust & Security', href: '#' },
      { label: 'Bug Bounty', href: '#' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'Team', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Media Kit', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Legal Notice */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-gray-600 leading-relaxed">
            The assets referenced on sia.finance (SIA Global Markets tokenized stocks, ETFs, and ADRs, USDY tokens and OUSG tokens) (the &quot;Tokens&quot;) have not been registered under the US Securities Act of 1933, as amended (the &quot;Act&quot;) or the securities or financial instrument laws of any other jurisdiction, and may not be offered or sold in the US or to US persons unless registered under the Act or an exemption from the registration requirements thereof is available. In certain jurisdictions, including the United Kingdom, Switzerland and (for certain Tokens) the European Economic Area, SIA GM Tokens and USDY tokens are offered and sold only to qualified investors or professional clients. OUSG tokens are available solely to persons who are accredited investors under the Act and qualified purchasers under the US Investment Company Act of 1940, as amended. Other prohibitions and restrictions apply. See important additional information below.*
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-medium text-[#1a1a1a] mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Full Legal Text */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="text-xs text-gray-500 leading-relaxed space-y-4 max-w-4xl">
            <p>
              * Important Information Regarding Token Regulatory and Eligibility Matters: The tokenized assets referenced herein (including SIA Global Markets tokenized stocks, tokenized ETFs, and tokenized ADRs, (collectively, the &quot;SIA GM Tokens&quot;), USDY tokens and OUSG tokens) (collectively, the &quot;Tokens&quot;) have not been registered under the US Securities Act of 1933, as amended (the &quot;Act&quot;) or the securities or financial instrument laws of any other jurisdiction. The Tokens may not be offered or sold in the United States or to US persons unless registered under the Act or an exemption from the registration requirements thereof is available. In certain jurisdictions, including the United Kingdom, Switzerland and (for certain Tokens) the European Economic Area (&quot;EEA&quot;), the SIA GM Tokens and USDY tokens are offered and sold only to qualified investors or professional clients, as the case may be (or that jurisdiction&apos;s analogue thereof). OUSG tokens are available solely to persons who are accredited investors (as defined in Rule 501 of Regulation D under the Act) and qualified purchasers (as defined in Section 2(a)(51) of the US Investment Company Act of 1940, as amended (the &quot;40 Act&quot;)). Other jurisdiction-based prohibitions and restrictions apply. See <a href="#" className="underline">docs.sia.finance</a> for details.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500">SIA © 2026</span>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors"
            >
              Privacy Policy
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com/SIAFinance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1a1a1a] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/omarhamdysh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1a1a1a] transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://t.me/siafinance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1a1a1a] transition-colors"
              aria-label="Telegram"
            >
              <Send className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
