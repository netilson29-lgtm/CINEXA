
export enum PlanType {
  FREE = 'FREE',
  PLUS = 'PLUS',
  PREMIUM = 'PREMIUM'
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  credits: number;
  isAdmin: boolean;
  avatarUrl?: string;
}

export interface Generation {
  id: string;
  userId: string;
  type: 'VIDEO' | 'IMAGE' | 'THUMBNAIL';
  prompt: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  url?: string;
  thumbnailUrl?: string;
  createdAt: string;
  settings: {
    modelId?: string; // Selected AI Model
    duration?: number; // in minutes
    aspectRatio?: string;
    style?: string;
    voiceId?: string;
    language?: string;
    captions?: boolean; // New: Auto-captions
    seoEnabled?: boolean; // New: SEO Toggle
    audioConfig?: { // New: Audio Settings
        musicStyle: string;
        soundEffects: boolean;
    };
    textOverlay?: { // New: Thumbnail specific
      title: string;
      subtitle: string;
      colorTheme: string;
    };
  };
  seo?: { // New: SEO Result Data
    title: string;
    description: string;
    tags: string[];
  };
}

export interface PlanDetails {
  id: PlanType;
  name: string;
  price: number;
  credits: number;
  features: string[];
  maxVideoDuration: number; // minutes
  hasWatermark: boolean;
}

export interface Voice {
  id: string;
  name: string;
  category: string;
  language: string;
  previewUrl: string;
  provider: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  description: string;
  isPremium: boolean; // Requires PLUS/PREMIUM
}

export interface PaymentMethod {
  id: string;
  name: string;
  detail: string; // Description like "Instantâneo"
  icon: string;
  isActive: boolean;
  // Banking details for manual transfers
  bankName?: string;      // e.g., "Banco BAI", "Nubank", "Binance"
  accountNumber?: string; // e.g., IBAN, Pix Key, Wallet Address
  beneficiary?: string;   // e.g., "AIVision Ltda"
}
