
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Mail, RefreshCw, Copy, Trash2, Moon, Sun, Shield, 
  Layers, ChevronRight, Inbox as InboxIcon, CheckCircle, 
  ExternalLink, ArrowLeft, Clock, Zap 
} from 'lucide-react';
import { MailMessage, Theme } from './types';
import { DOMAINS, MOCK_MESSAGES_TEMPLATES } from './constants';

const Logo = () => (
  <div className="flex items-center gap-2 group">
    <div className="relative p-2 bg-indigo-600 rounded-xl overflow-hidden shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-300">
      <Mail className="w-6 h-6 text-white relative z-10" />
      <div className="absolute top-0 right-0 p-0.5 bg-amber-400 rounded-bl-lg">
        <Clock className="w-2.5 h-2.5 text-indigo-900" />
      </div>
      <div className="absolute -bottom-1 -left-1 opacity-20">
        <Zap className="w-8 h-8 text-white fill-current" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent leading-none">
        NOVAMAIL
      </span>
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mt-0.5">
        Disposable Inbox
      </span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [prefix, setPrefix] = useState<string>(() => Math.random().toString(36).substring(7));
  const [domain, setDomain] = useState<string>(DOMAINS[0].id);
  const [inbox, setInbox] = useState<MailMessage[]>([]);
  const [selectedMail, setSelectedMail] = useState<MailMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const generatorRef = useRef<HTMLElement>(null);
  const fullEmail = useMemo(() => `${prefix}${domain}`, [prefix, domain]);

  // Handle Theme Toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullEmail);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const generateNewEmail = () => {
    setPrefix(Math.random().toString(36).substring(7));
    setInbox([]);
    setSelectedMail(null);
  };

  const deleteMessage = (id: string) => {
    setInbox(prev => prev.filter(m => m.id !== id));
    if (selectedMail?.id === id) setSelectedMail(null);
  };

  const simulateArrival = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const template = MOCK_MESSAGES_TEMPLATES[Math.floor(Math.random() * MOCK_MESSAGES_TEMPLATES.length)];
      const newMessage: MailMessage = {
        id: Date.now().toString(),
        from: template.from,
        subject: template.subject,
        body: template.body,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      setInbox(prev => [newMessage, ...prev]);
      setIsLoading(false);
    }, 1200);
  }, []);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(simulateArrival, 3000);
    return () => clearTimeout(timer);
  }, [simulateArrival]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-6 mr-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <button onClick={scrollToGenerator} className="hover:text-indigo-600 transition-colors">Generator</button>
              <button onClick={() => setDomain(DOMAINS[3].id)} className="hover:text-indigo-600 transition-colors">Premium</button>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">Docs</a>
            </nav>
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button 
              onClick={scrollToGenerator}
              className="hidden sm:block px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-slate-900/10 dark:shadow-white/5"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
        {/* Email Generator Area */}
        <section 
          ref={generatorRef}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="p-6 md:p-12">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
                <Zap className="w-3.5 h-3.5" />
                Active Session
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4 dark:text-white">Your Anonymous Identity</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                Protect your privacy from trackers. Use our premium high-propagation domains for Netflix, Steam, and GitHub verification.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              {/* Prefix Input */}
              <div className="flex-1 flex flex-col min-w-0">
                <input 
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full px-6 py-4 bg-transparent outline-none font-mono font-bold text-xl text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
                />
              </div>

              {/* Domain Selector */}
              <div className="relative md:w-64">
                <select 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full appearance-none h-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 pr-10 cursor-pointer shadow-sm"
                >
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.isPremium ? '💎' : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                >
                  {isCopied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span>{isCopied ? 'Copied!' : 'Copy Address'}</span>
                </button>
                <button 
                  onClick={generateNewEmail}
                  className="flex items-center justify-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-all hover:rotate-180 duration-500 shadow-sm"
                  title="New Identity"
                >
                  <RefreshCw className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-semibold">End-to-End Privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 rounded">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="font-semibold">Premium Streaming Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* Inbox Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">
          {/* List - Hide on mobile if mail is selected */}
          <div className={`${selectedMail ? 'hidden lg:flex' : 'flex'} lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex-col shadow-xl shadow-slate-200/40 dark:shadow-none`}>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <InboxIcon className="w-4 h-4 text-white" />
                </div>
                <span className="font-black dark:text-white uppercase tracking-wider text-sm">Active Inbox</span>
                <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full ring-1 ring-indigo-200 dark:ring-indigo-800">
                  {inbox.length}
                </span>
              </div>
              <button 
                onClick={simulateArrival}
                disabled={isLoading}
                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
              {inbox.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-6 relative">
                    <Mail className="w-10 h-10 text-slate-200 dark:text-slate-800" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  </div>
                  <h4 className="text-slate-700 dark:text-slate-300 font-bold mb-2">Awaiting Messages</h4>
                  <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                    Messages usually arrive within 10-30 seconds of being sent.
                  </p>
                </div>
              ) : (
                inbox.map((mail) => (
                  <button
                    key={mail.id}
                    onClick={() => setSelectedMail(mail)}
                    className={`w-full text-left p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all relative group ${selectedMail?.id === mail.id ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-l-4 border-indigo-600' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm truncate pr-2 dark:text-slate-200">{mail.from.split('<')[0]}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap tracking-tighter">{mail.timestamp}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 truncate group-hover:text-indigo-600 transition-colors">{mail.subject}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[85%] line-clamp-1">{mail.body}</div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteMessage(mail.id); }}
                      className="absolute right-4 bottom-5 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all transform translate-x-2 group-hover:translate-x-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Viewer - Show on mobile if mail is selected */}
          <div className={`${!selectedMail ? 'hidden lg:flex' : 'flex'} lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex-col shadow-xl shadow-slate-200/40 dark:shadow-none`}>
            {selectedMail ? (
              <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-4 mb-6">
                    <button 
                      onClick={() => setSelectedMail(null)}
                      className="lg:hidden p-2 text-slate-500 hover:text-indigo-600 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-black dark:text-white leading-tight tracking-tight">{selectedMail.subject}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => deleteMessage(selectedMail.id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg">
                      {selectedMail.from.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black dark:text-slate-200 truncate">{selectedMail.from}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Received {selectedMail.timestamp}</div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800">
                      <Shield className="w-3 h-3" /> VERIFIED
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                  <div className="max-w-none text-slate-600 dark:text-slate-300 leading-loose text-base whitespace-pre-wrap">
                    {selectedMail.body}
                  </div>
                  
                  <div className="mt-16 p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col items-center gap-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                      <Shield className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h5 className="font-bold dark:text-white mb-2">Identity Shield Active</h5>
                      <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                        This email was scanned for malicious trackers and scripts. Your real identity remains hidden.
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/5">
                      VIEW ORIGINAL SOURCE <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <div className="w-32 h-32 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800 shadow-inner">
                  <InboxIcon className="w-14 h-14 opacity-5" />
                </div>
                <h3 className="text-xl font-black text-slate-700 dark:text-slate-300 mb-4 tracking-tight uppercase">Viewer Hub</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-400 font-medium">
                  Select a message from the sidebar to inspect its content, verify links, and manage attachments securely.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="text-base text-slate-500 dark:text-slate-400 max-w-sm mt-6 leading-relaxed">
              NovaMail is the premium choice for temporary communication. 
              Our servers are distributed globally to ensure 100% deliverability for account verifications and sensitive registrations.
            </p>
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-6 dark:text-white">Services</h4>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-4 font-semibold">
              <li><button onClick={scrollToGenerator} className="hover:text-indigo-600 transition-colors">Generate Inbox</button></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Premium Domains</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">API for Developers</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Blacklist Checker</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-6 dark:text-white">Support</h4>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-4 font-semibold">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">System Status</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Shield</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Report Abuse</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <p>© 2024 NOVAMAIL PREMIUM SERVICES. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span>GLOBAL CLUSTERS ACTIVE</span>
            </div>
            <span>v2.1.0-STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
