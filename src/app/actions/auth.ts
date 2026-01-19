'use server';

import { createClient } from '@supabase/supabase-js';

export async function createUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    // Initialize Supabase Admin Client
    // process.env.SUPABASE_SERVICE_ROLE_KEY is required for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        return { error: 'Server configuration error: Missing Service Role Key' };
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true // Auto-confirm for admin created users
        });

        if (error) {
            return { error: error.message };
        }

        return { success: true, user: data.user };
    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred' };
    }
}
