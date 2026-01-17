export interface ProductImage {
  src: string;
}

export interface IQuestion {
  question: string;
  answers: string[];
}

export interface ITestimonial {
  name: string;
  age?: string;
  weightLoss: string;
  review: string;
}

export interface IBeforeAfterStory {
  name: string;
  age?: string;
  beforeWeight: string;
  afterWeight: string;
  story: string;
}

export type IProduct = {
  id: string;
  title: string;
  description: string;
  images: ProductImage[];
  mainImage: string;
  price: number;
  tags: string[];
  questions: IQuestion[];
  clickCount?: number; // Added to track product/test clicks
};

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Początkujący" | "Średniozaawansowany" | "Zaawansowany";
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  lessons: number;
  isPopular?: boolean;
  isNew?: boolean;
  pdfFile?: string; // URL to the PDF file
  questions?: IQuestion[]; // Added for diet test functionality
  createdAt: string;
  updatedAt: string;
}

export interface Diet {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  duration: string;
  difficulty: "Łatwy" | "Średni" | "Trudny";
  rating: number;
  followers: number;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  meals: number;
  calories: number;
  isPopular?: boolean;
  isNew?: boolean;
  pdfFile?: string; // URL to the PDF file
  tags: string[];
  questions: IQuestion[];
  clickCount?: number;

  // Professional dietetics fields
  nutritionistName: string;
  nutritionistCredentials: string;
  nutritionistBio: string;
  nutritionistImage?: string;

  // Detailed diet information
  dietOverview: string;
  benefits: string[];
  contraindications: string[];
  targetAudience: string[];
  mealPlanStructure:
    | string
    | {
        [key: string]: {
          Time: string;
          Calories: number;
          Example: string;
        };
      };
  shoppingList: string[];
  preparationTips: string[];
  progressTracking: string;
  maintenancePhase: string;

  // Scientific backing
  scientificReferences: string[];
  clinicalStudies: string[];

  // Success metrics
  averageWeightLoss: string;
  averageTimeToResults: string;
  successRate: string;

  // Additional content
  faq: IQuestion[];
  testimonials: ITestimonial[];
  beforeAfterStories: IBeforeAfterStory[];

  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionStatus: "free" | "premium";
  subscriptionEndDate?: string;
  totalPurchases?: number;
  totalSpent?: number;
  lastPurchaseDate?: string;
  purchasedCourses?: string[];
  createdAt?: string;
  updatedAt?: string;
}
