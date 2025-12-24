
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Mail, RefreshCw, Copy, Trash2, Moon, Sun, Shield, 
  Layers, ChevronRight, Inbox as InboxIcon, CheckCircle, 
  ExternalLink, ArrowLeft, Clock, Zap, ShieldCheck, EyeOff
} from 'lucide-react';
import { MailMessage, Theme } from './types.ts';
import { DOMAINS, MOCK_MESSAGES_TEMPLATES } from './constants.ts';

const Logo = () => (
  <div className="flex items-center gap-3 group">
    <div className="relative">
      <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-xl shadow-indigo-500/20 group-hover:rotate-6 transition-transform duration-500">
        <Mail className="w-7 h-7 text-white" />
      </div>
      <div className="absolute -top-1 -right-1 p-1 bg-amber-400 rounded-lg border-2 border-white dark:border-slate-950 shadow-sm animate-bounce group-hover:animate-none">
        <Clock className="w-3 h-3 text-indigo-950" />
      </div>
    </div>
    <div className="flex flex-col">
      <div className="flex items-baseline gap-0.5">
        <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
          NOVAMAIL
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
      </div>
      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase mt-1">
        Vanishing Identities
      </span>
    </div>
  </div>
);

const App: React.FC = () => {
  // Theme state with local storage persistence
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('novamail-theme') as Theme;
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

  // Effect to handle theme updates on the root HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('novamail-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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
    if (isLoading) return;
    setIsLoading(true);
    // Simulate server latency
    setTimeout(() => {
      const template = MOCK_MESSAGES_TEMPLATES[Math.floor(Math.random() * MOCK_MESSAGES_TEMPLATES.length)];
      const newMessage: MailMessage = {
        id: Math.random().toString(36).substring(2, 15),
        from: template.from,
        subject: template.subject,
        body: template.body,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      setInbox(prev => [newMessage, ...prev]);
      setIsLoading(false);
    }, 1500);
  }, [isLoading]);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-simulate arrival of a welcome mail
  useEffect(() => {
    const timer = setTimeout(simulateArrival, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button 
              onClick={scrollToGenerator}
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-sm font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5"
            >
              <Zap className="w-4 h-4 fill-current" />
              CREATE INBOX
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">
        {/* Generator Section */}
        <section 
          ref={generatorRef}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none"
        >
          <div className="p-8 md:p-16">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <ShieldCheck className="w-4 h-4" />
                Anti-Spam Shield Enabled
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 dark:text-white tracking-tight">
                Privacy is not a privilege. <br/>
                <span className="text-indigo-600 dark:text-indigo-400">It's a requirement.</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                Generate a temporary inbox in seconds. Use it for Netflix trials, GitHub, or any service you don't trust.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto bg-slate-100 dark:bg-slate-950 p-3 rounded-[2rem] border border-slate-200 dark:border-slate-800/50">
              <div className="flex-1 flex flex-col min-w-0">
                <input 
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full px-6 py-4 bg-transparent outline-none font-mono font-bold text-2xl text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="relative md:w-72">
                <select 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full appearance-none h-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-black text-slate-800 dark:text-slate-100 pr-12 cursor-pointer shadow-sm"
                >
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.isPremium ? '💎' : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/30 active:scale-95 whitespace-nowrap"
                >
                  {isCopied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span>{isCopied ? 'COPIED!' : 'COPY EMAIL'}</span>
                </button>
                <button 
                  onClick={generateNewEmail}
                  className="flex items-center justify-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 transition-all hover:rotate-180 duration-700 shadow-sm"
                  title="Refresh Identity"
                >
                  <RefreshCw className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-black uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-indigo-500" />
                Zero Tracking
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Instant Delivery
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Auto-Purge
              </div>
            </div>
          </div>
        </section>

        {/* Inbox Console */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
          {/* List View */}
          <div className={`${selectedMail ? 'hidden lg:flex' : 'flex'} lg:col-span-5 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden flex-col shadow-xl`}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <InboxIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black dark:text-white uppercase tracking-wider text-sm">Inbox</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{inbox.length} Messages Total</span>
                </div>
              </div>
              <button 
                onClick={simulateArrival}
                disabled={isLoading}
                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
              {inbox.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-12 text-center fade-in">
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-8 relative border border-slate-100 dark:border-slate-800">
                    <Mail className="w-10 h-10 text-slate-200 dark:text-slate-800" />
                    <div className="absolute inset-0 border-2 border-dashed border-indigo-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
                  </div>
                  <h4 className="text-slate-800 dark:text-slate-200 font-black uppercase tracking-widest text-sm mb-3">Syncing Server...</h4>
                  <p className="text-xs text-slate-400 max-w-[220px] mx-auto leading-relaxed font-medium">
                    Our nodes are active. Your inbox is ready to receive messages from anywhere.
                  </p>
                </div>
              ) : (
                inbox.map((mail) => (
                  <button
                    key={mail.id}
                    onClick={() => setSelectedMail(mail)}
                    className={`w-full text-left p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all relative group border-l-[6px] ${selectedMail?.id === mail.id ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-600' : 'border-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-black text-sm truncate dark:text-slate-200">{mail.from.split('<')[0]}</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{mail.timestamp}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-300 mb-2 truncate group-hover:text-indigo-600 transition-colors">{mail.subject}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[90%] font-medium">{mail.body}</div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteMessage(mail.id); }}
                      className="absolute right-4 bottom-6 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Mail Content View */}
          <div className={`${!selectedMail ? 'hidden lg:flex' : 'flex'} lg:col-span-7 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden flex-col shadow-xl`}>
            {selectedMail ? (
              <div className="flex flex-col h-full fade-in">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40">
                  <div className="flex items-center gap-4 mb-8">
                    <button 
                      onClick={() => setSelectedMail(null)}
                      className="lg:hidden p-3 text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-2xl md:text-3xl font-black dark:text-white leading-none tracking-tight flex-1">
                      {selectedMail.subject}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => deleteMessage(selectedMail.id)}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 p-5 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                      {selectedMail.from.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-black dark:text-slate-100 truncate">{selectedMail.from}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1.5 flex items-center gap-2">
                        <span>SENT TO: {fullEmail}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <span>{selectedMail.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-10 overflow-y-auto">
                  <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                    {selectedMail.body}
                  </div>
                  
                  <div className="mt-16 p-10 rounded-[2.5rem] border-4 border-dashed border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950/20 flex flex-col items-center gap-8 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md">
                      <ShieldCheck className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <h5 className="text-xl font-black dark:text-white mb-3">VanishGuard™ Active</h5>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-medium">
                        This session is fully encrypted. All contents will be permanently deleted upon identity reset.
                      </p>
                    </div>
                    <button className="flex items-center gap-3 px-10 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-sm font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/30 dark:shadow-white/5 uppercase tracking-widest">
                      SOURCE CODE <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
                <div className="w-36 h-36 bg-slate-50 dark:bg-slate-950 rounded-[3rem] flex items-center justify-center mb-10 border border-slate-200 dark:border-slate-800 shadow-inner">
                  <InboxIcon className="w-16 h-16 text-slate-200 dark:text-slate-800" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-5 tracking-tight uppercase">Control Center</h3>
                <p className="max-w-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Open a message to interact with its content. Links and images are sanitized for your protection.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mt-8 font-medium leading-relaxed">
              Engineered for the modern web. NovaMail provides premium temporary mailboxes with high-reputation domains that bypass standard blocks.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 dark:text-white text-indigo-600">Product</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
              <li><button onClick={scrollToGenerator} className="hover:text-indigo-600 transition-colors">Generator</button></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Premium Node List</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 dark:text-white text-indigo-600">Governance</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Charter</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Service Status</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Abuse Desk</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 pt-10 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          <p>© 2024 NOVAMAIL PREMIUM. PROTECTING YOUR FOOTPRINT.</p>
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span>GLOBAL NODES: ONLINE</span>
            </div>
            <span>STABLE v2.5.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
