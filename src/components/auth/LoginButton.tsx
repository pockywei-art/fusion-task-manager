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
            className="flex items-center justify-center gap-3 w-full px-4 py-2.5 bg-white border border-[#e8e3dd] text-[#4a3f35] rounded-xl font-bold hover:bg-[#f1efe9] transition-all shadow-sm active:scale-95 group"
        >
            <LogIn size={18} className="text-[#a68b6d] group-hover:text-[#8a9a5b] transition-colors" />
            使用 Google 登入
        </button>
    );
}
