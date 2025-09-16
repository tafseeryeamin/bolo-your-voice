import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
    
    // Features Section
    'features.title': 'Powerful Voice AI Features',
    'features.subtitle': 'Everything you need to create an intelligent voice presence that represents your brand and connects with your audience.',
    'features.companyRep.title': 'Company Representation',
    'features.companyRep.description': 'Let AI voice assistants introduce your company, share your mission, and communicate your values to potential customers and partners.',
    'features.personalBranding.title': 'Personal Branding',
    'features.personalBranding.description': 'Create a voice presence that represents you professionally, sharing your expertise and building meaningful connections.',
    'features.availability.title': '24/7 Availability',
    'features.availability.description': 'Your voice assistant works around the clock, ensuring no opportunity is missed to connect with your audience.',
    'features.conversations.title': 'Intelligent Conversations',
    'features.conversations.description': 'Advanced AI understands context and provides relevant information about your business or personal brand.',
    'features.analytics.title': 'Analytics & Insights',
    'features.analytics.description': 'Track engagement metrics and understand how people interact with your voice assistant to optimize performance.',
    'features.security.title': 'Secure & Reliable',
    'features.security.description': 'Enterprise-grade security ensures your brand information and user interactions remain protected.',
    'features.customizable': 'BOLO VOICE OUTLOOK FULLY CUSTOMIZEABLE',
    'features.dashboardTitle': 'Dashboard Overview',
    'features.dashboardSubtitle': 'You will get full access of your dashboard and monitor your agent activities',
    
    // How It Works
    'howItWorks.badge': 'Convert More Visitors',
    'howItWorks.title': 'How It Works',
    'howItWorks.subtitle': 'Transform your website visitors into customers with our AI-powered conversation flow. Increase your conversion rate from 1-17% to 30%+ with intelligent engagement.',
    'howItWorks.step1.title': 'Visitor Arrives',
    'howItWorks.step1.description': 'Website visitor lands on your page looking for solutions',
    'howItWorks.step2.title': 'Click to Talk',
    'howItWorks.step2.description': 'Visitor clicks the AI chat button',
    'howItWorks.step3.title': 'AI Offers Options',
    'howItWorks.step3.description': 'AI presents 3 helpful pathways',
    'howItWorks.step4.title': 'Collect Contact',
    'howItWorks.step4.description': 'AI captures email for follow-up',
    'howItWorks.step5.title': 'Smart Follow-up',
    'howItWorks.step5.description': 'Automated reminders & nurturing',
    'howItWorks.result.title': 'The Result?',
    'howItWorks.result.conversion': 'Conversion Rate',
    'howItWorks.result.availability': 'AI Availability',
    'howItWorks.result.missed': 'Missed Opportunities',
    
    // CTA Section
    'cta.title': 'Bolo makes your website talk, sell, and support — all in one',
    'cta.subtitle': 'Transform visitor interactions with intelligent voice solutions that convert, engage, and delight your customers.',
    'cta.bookDemo': 'Book a Demo',
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
    
    // Features Section
    'features.title': '強力なボイスAI機能',
    'features.subtitle': 'ブランドを代表し、オーディエンスとつながるインテリジェントな音声プレゼンスを作成するために必要なすべて。',
    'features.companyRep.title': '会社代表',
    'features.companyRep.description': 'AIボイスアシスタントに会社の紹介、ミッションの共有、潜在顧客とパートナーへの価値観の伝達をさせます。',
    'features.personalBranding.title': 'パーソナルブランディング',
    'features.personalBranding.description': '専門的にあなたを代表し、専門知識を共有し、意味のあるつながりを築く音声プレゼンスを作成します。',
    'features.availability.title': '24時間365日対応',
    'features.availability.description': 'ボイスアシスタントは24時間体制で稼働し、オーディエンスとつながる機会を逃しません。',
    'features.conversations.title': 'インテリジェント会話',
    'features.conversations.description': '高度なAIが文脈を理解し、ビジネスやパーソナルブランドに関する関連情報を提供します。',
    'features.analytics.title': '分析＆インサイト',
    'features.analytics.description': 'エンゲージメント指標を追跡し、人々がボイスアシスタントとどのように相互作用するかを理解してパフォーマンスを最適化します。',
    'features.security.title': 'セキュア＆信頼性',
    'features.security.description': 'エンタープライズグレードのセキュリティにより、ブランド情報とユーザーインタラクションが確実に保護されます。',
    'features.customizable': 'BOLOボイス外観は完全カスタマイズ可能',
    'features.dashboardTitle': 'ダッシュボード概要',
    'features.dashboardSubtitle': 'ダッシュボードに完全アクセスし、エージェントアクティビティを監視できます',
    
    // How It Works
    'howItWorks.badge': 'より多くの訪問者を変換',
    'howItWorks.title': '仕組み',
    'howItWorks.subtitle': 'AI駆動の会話フローでウェブサイト訪問者を顧客に変換。インテリジェントエンゲージメントで変換率を1-17％から30％以上に増加させます。',
    'howItWorks.step1.title': '訪問者到着',
    'howItWorks.step1.description': 'ウェブサイト訪問者がソリューションを求めてページに到着',
    'howItWorks.step2.title': 'クリックして話す',
    'howItWorks.step2.description': '訪問者がAIチャットボタンをクリック',
    'howItWorks.step3.title': 'AIがオプション提示',
    'howItWorks.step3.description': 'AIが3つの有用なパスを提示',
    'howItWorks.step4.title': '連絡先収集',
    'howItWorks.step4.description': 'AIがフォローアップのためのメールを取得',
    'howItWorks.step5.title': 'スマートフォローアップ',
    'howItWorks.step5.description': '自動リマインダー＆育成',
    'howItWorks.result.title': '結果は？',
    'howItWorks.result.conversion': '変換率',
    'howItWorks.result.availability': 'AI可用性',
    'howItWorks.result.missed': '逃した機会',
    
    // CTA Section
    'cta.title': 'Boloはあなたのウェブサイトを話し、販売し、サポートさせます — すべて1つで',
    'cta.subtitle': 'コンバート、エンゲージ、顧客を喜ばせるインテリジェントなボイスソリューションで訪問者インタラクションを変換します。',
    'cta.bookDemo': 'デモを予約',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const detectLanguage = async () => {
      // First check browser language
      const browserLang = navigator.language || navigator.languages?.[0];
      if (browserLang?.startsWith('ja')) {
        setLanguage('ja');
        return;
      }

      // Then check location via IP geolocation
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code === 'JP') {
          setLanguage('ja');
        }
      } catch (error) {
        console.log('Location detection failed, using browser language');
      }
    };

    detectLanguage();
  }, []);

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