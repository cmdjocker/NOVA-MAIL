
export interface MailMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
}

export interface DomainOption {
  id: string;
  name: string;
  description: string;
  isPremium?: boolean;
}

export type Theme = 'light' | 'dark';

export interface UserContextType {
  email: string;
  prefix: string;
  domain: string;
  inbox: MailMessage[];
  selectedMail: MailMessage | null;
  theme: Theme;
  isLoading: boolean;
  setTheme: (theme: Theme) => void;
  setPrefix: (prefix: string) => void;
  setDomain: (domain: string) => void;
  setSelectedMail: (mail: MailMessage | null) => void;
  refreshInbox: () => void;
  generateNewEmail: () => void;
}
