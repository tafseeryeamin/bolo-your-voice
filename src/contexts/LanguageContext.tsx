import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.demos': 'Demos',
    'header.myAgents': 'My Agents',
    'header.admin': 'Admin',
    'header.demoTesting': 'Demo & Testing',
    'header.manageDemos': 'Manage Demos',
    'header.welcome': 'Welcome',
    'header.signOut': 'Sign Out',
    'header.signIn': 'Sign In',
    'header.getStarted': 'Get Started',
    
    // Hero Section
    'hero.title': 'Turn Visitors into Customers with AI Voice Solutions',
    'hero.subtitle1': 'Missing leads despite ad spend?',
    'hero.subtitle2': 'Website feels boring or hard to navigate?',
    'hero.subtitle3': 'Want to stay ahead with AI?',
    'hero.bookDemo': 'Book a Demo',
    
    // Features
    'feature1.title': 'Booking, FAQ & Inquiries',
    'feature1.description': 'Let customers instantly book, ask questions, and get answers with voice.',
    'feature2.title': 'E-commerce Product Info',
    'feature2.description': 'Help shoppers find products, learn details, and get recommendations hands-free.',
    'feature3.title': 'Redirect & Track Orders',
    'feature3.description': 'Guide users to the right pages and track orders via voice in real-time.',
  },
  ja: {
    // Header
    'header.demos': 'デモ',
    'header.myAgents': 'マイエージェント',
    'header.admin': '管理者',
    'header.demoTesting': 'デモ＆テスト',
    'header.manageDemos': 'デモ管理',
    'header.welcome': 'ようこそ',
    'header.signOut': 'サインアウト',
    'header.signIn': 'サインイン',
    'header.getStarted': '始める',
    
    // Hero Section
    'hero.title': 'AIボイスソリューションで訪問者を顧客に変える',
    'hero.subtitle1': '広告費を使っているのにリードが不足していませんか？',
    'hero.subtitle2': 'ウェブサイトが退屈で使いにくいと感じていませんか？',
    'hero.subtitle3': 'AIで先行したいですか？',
    'hero.bookDemo': 'デモを予約',
    
    // Features
    'feature1.title': '予約、FAQ、お問い合わせ',
    'feature1.description': '音声で顧客が即座に予約、質問、回答を得ることができます。',
    'feature2.title': 'Eコマース商品情報',
    'feature2.description': 'ハンズフリーで商品の検索、詳細の確認、おすすめの取得をサポートします。',
    'feature3.title': 'リダイレクト＆注文追跡',
    'feature3.description': 'ユーザーを適切なページに案内し、音声でリアルタイムに注文を追跡します。',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Auto-detect language from browser settings
    const browserLang = navigator.language || navigator.languages?.[0];
    if (browserLang?.startsWith('ja')) {
      return 'ja';
    }
    return 'en';
  });

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};