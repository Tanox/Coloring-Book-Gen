/* components/Footer.tsx v1.0.0 */
import React from 'react';

interface FooterProps {
  version: string;
}

const Footer: React.FC<FooterProps> = ({ version }) => {
  return (
    <footer className="py-6 text-center text-slate-400 dark:text-slate-600 text-xs font-bold tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">
        {version}
    </footer>
  );
};

export default Footer;