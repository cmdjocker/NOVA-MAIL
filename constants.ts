
import { DomainOption } from './types';

export const DOMAINS: DomainOption[] = [
  { id: '@nova-mail.com', name: '@nova-mail.com', description: 'Standard reliable domain' },
  { id: '@pro-verify.net', name: '@pro-verify.net', description: 'Optimized for dev services' },
  { id: '@cloud-sync.io', name: '@cloud-sync.io', description: 'Fast cloud propagation' },
  { id: '@netflix-safe.com', name: '@netflix-safe.com', description: 'Supports premium streaming servers', isPremium: true },
  { id: '@node-auth.org', name: '@node-auth.org', description: 'Legacy enterprise support' },
  { id: '@secure-inbox.vip', name: '@secure-inbox.vip', description: 'High-anonymity rotation', isPremium: true },
];

export const MOCK_MESSAGES_TEMPLATES = [
  {
    from: "Netflix <info@netflix.com>",
    subject: "Finish signing up for your account",
    body: "Hi there! Welcome to Netflix. To finish setting up your account, please click the button below to verify your email address. If you didn't request this, you can safely ignore this message."
  },
  {
    from: "GitHub <noreply@github.com>",
    subject: "[GitHub] Please verify your email address",
    body: "Hey! We noticed a new sign-up using this email. Enter the following code to verify your account: 827-103. This code expires in 10 minutes."
  },
  {
    from: "Steam Support <support@steampowered.com>",
    subject: "Your Steam account security code",
    body: "Hello! Here is the Steam Guard code you need to login to your account (J7X29). If you are not trying to log in, please change your password immediately."
  },
  {
    from: "Discord <noreply@discord.com>",
    subject: "Verify Email Address for Discord",
    body: "Welcome to Discord! We're excited to have you. Please verify your email address to get full access to all features."
  }
];
