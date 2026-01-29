
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixtxdrhvgjunuiwahkut.supabase.co';
const supabaseAnonKey = 'sb_publishable_WRbfR2R7UZhORjjqCCL9Dw_QDTRxvCR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * DATABASE SCHEMA SETUP (Execute in Supabase SQL Editor)
 * 
 * -- Create roles table
 * CREATE TABLE public.roles (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   name TEXT UNIQUE NOT NULL
 * );
 * 
 * -- Create users profile table (linked to auth.users)
 * CREATE TABLE public.profiles (
 *   id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
 *   full_name TEXT,
 *   role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
 *   phone TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- Create service_categories table
 * CREATE TABLE public.service_categories (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   name TEXT UNIQUE NOT NULL,
 *   icon TEXT,
 *   description TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- Create services table
 * CREATE TABLE public.services (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   category_id UUID REFERENCES service_categories(id),
 *   name TEXT NOT NULL,
 *   description TEXT,
 *   image_url TEXT,
 *   marked_price NUMERIC,
 *   discount_price NUMERIC,
 *   is_active BOOLEAN DEFAULT true,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- Create bookings table
 * CREATE TABLE public.bookings (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES public.profiles(id),
 *   status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
 *   total_amount NUMERIC,
 *   scheduled_at TIMESTAMP WITH TIME ZONE,
 *   address TEXT,
 *   contact_number TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 */
