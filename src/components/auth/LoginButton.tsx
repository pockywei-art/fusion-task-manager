"use client";

import React from "react";
import { supabase } from "@/lib/supabase";
import { LogIn } from "lucide-react";

export function LoginButton() {
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        });

        if (error) {
            console.error('Error logging in:', error.message);
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all shadow-sm"
        >
            <LogIn size={18} />
            Login with Google
        </button>
    );
}
