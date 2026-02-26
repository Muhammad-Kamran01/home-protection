
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer'
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string;
  marked_price: number;
  discount_price: number;
  is_active: boolean;
  show_price?: boolean;
  category?: ServiceCategory;
}

export interface Booking {
  id: string;
  user_id?: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  scheduled_at: string;
  address: string;
  contact_number: string;
  notes?: string;
  created_at: string;
  customer?: User;
}

export interface Job {
  id: string;
  title: string;
  category: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  status: 'open' | 'closed';
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
}

export interface Review {
  id: string;
  service_id?: string;
  user_name: string;
  rating: number;
  comment: string;
  avatar_url?: string;
  location?: string;
}
