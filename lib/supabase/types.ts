/**
 * Types Supabase — version typée à la main (regénérable via `supabase gen types`
 * une fois la CLI configurée). Couvre les tables éditoriales et transactionnelles.
 */

export type AdminRole = 'admin' | 'editor' | 'viewer';

export interface AdminUserRow {
  id: string;
  role: AdminRole;
  email: string | null;
  created_at: string;
}

export interface FaqItemRow {
  id: string;
  category:
    | 'livraison'
    | 'sur-mesure'
    | 'entretien'
    | 'paiement'
    | 'retours'
    | 'atelier';
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventRow {
  id: string;
  title: string;
  type: 'defile' | 'showroom' | 'ceremonie' | 'presse' | 'collection';
  start_date: string;
  end_date: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  cta: { label?: string; href?: string } | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PressEntryRow {
  id: string;
  publication: string;
  logo_text: string | null;
  published_at: string;
  title: string;
  excerpt: string | null;
  article_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollectionRow {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string;
  long_description: string | null;
  price_amount: number;
  price_currency: string;
  category_slug: string;
  materials: string[];
  details: Record<string, unknown>;
  tags: string[];
  is_signature: boolean;
  is_new: boolean;
  related_product_slugs: string[];
  care_pictos: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_id: string | null;
  body_json: unknown;
  reading_time: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthorRow {
  id: string;
  name: string;
  slug: string | null;
  portrait_url: string | null;
  bio: string | null;
  role_title: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderRow {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  email: string;
  status: OrderStatus;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  currency: string;
  shipping_address: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  variant_color_name: string | null;
  size: string | null;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
}

export interface NewsletterSubscriberRow {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface ProductReviewRow {
  id: string;
  product_id: string | null;
  customer_name: string;
  customer_email: string | null;
  rating: number;
  title: string | null;
  body: string;
  verified_buyer: boolean;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntryRow {
  id: string;
  product_id: string | null;
  product_slug: string;
  email: string;
  variant_id: string | null;
  size: string | null;
  notified_at: string | null;
  created_at: string;
}

export type PromoDiscountType = 'percent' | 'fixed';

export interface PromoCodeRow {
  id: string;
  code: string;
  label: string | null;
  discount_type: PromoDiscountType;
  discount_value: number;
  min_amount_cents: number;
  max_uses: number | null;
  uses_count: number;
  starts_at: string;
  ends_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type ReturnReason =
  | 'taille'
  | 'qualite'
  | 'pas-conforme'
  | 'changement-avis'
  | 'defaut'
  | 'autre';

export type ReturnStatus =
  | 'pending'
  | 'approved'
  | 'received'
  | 'refunded'
  | 'rejected';

export interface ReturnRequestRow {
  id: string;
  order_id: string | null;
  email: string;
  reason: ReturnReason;
  details: string | null;
  status: ReturnStatus;
  created_at: string;
  updated_at: string;
}

export interface GiftCardRow {
  id: string;
  code: string;
  initial_amount_cents: number;
  remaining_cents: number;
  currency: string;
  recipient_name: string | null;
  recipient_email: string | null;
  sender_name: string | null;
  message: string | null;
  expires_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type VipTier = 'silver' | 'gold' | 'platinum';

export interface VipMemberRow {
  id: string;
  email: string;
  full_name: string | null;
  tier: VipTier;
  joined_at: string;
  invited_by: string | null;
  notes: string | null;
  active: boolean;
  updated_at: string;
}

export interface LoyaltyPointRow {
  id: string;
  email: string;
  points: number;
  reason: string | null;
  order_id: string | null;
  created_at: string;
}
