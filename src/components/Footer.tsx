
import { Bitcoin, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bitcoin size={24} className="text-primary" />
              <span className="text-lg font-bold gradient-text">BitGuardian</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Protecting your Bitcoin investments with AI-powered insights and fraud detection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/bitcoin-info" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Bitcoin Trends
                </Link>
              </li>
              <li>
                <Link to="/fraud-detection" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Fraud Detection
                </Link>
              </li>
              <li>
                <Link to="/smart-contracts" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Smart Contracts
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  AI Recommendations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BitGuardian. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-xs text-muted-foreground">
              Bitcoin price data provided by CoinGecko API
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
