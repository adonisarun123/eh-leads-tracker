
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
try {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    // console.log('Raw Env Config Length:', envConfig.length); 
    envConfig.split('\n').forEach(line => {
        // Handle lines like KEY=VALUE or KEY="VALUE"
        const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            const key = match[1];
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            process.env[key] = value;
        }
    });
    console.log('Loaded keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
} catch (e) {
    console.error('Could not read .env.local');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    // console.log('Loaded env:', process.env); // Don't log full env for security
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createAdmin() {
    console.log('Attempting to create user: contact@ezyhelpers.com');

    // Check if user exists first to avoid error or duplicate attempts (optional, but good for logs)
    // admin.createUser usually returns error if email taken.

    const { data, error } = await supabase.auth.admin.createUser({
        email: 'contact@ezyhelpers.com',
        password: 'EHi@4321',
        email_confirm: true,
        user_metadata: { role: 'admin' } // Optional: setting metadata
    });

    if (error) {
        console.error('Failed to create user:', error.message);
    } else {
        console.log('User created successfully!');
        console.log('ID:', data.user.id);
        console.log('Email:', data.user.email);
    }
}

createAdmin();
