"use client";

import React from "react";
import { LayoutDashboard, BarChart3, Settings, Menu, X, Plus, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { LoginButton } from "@/components/auth/LoginButton";
import { User as UserType } from "@supabase/supabase-js";

const menuItems = [
  { icon: LayoutDashboard, label: "Kanban Board", value: "kanban" },
  { icon: BarChart3, label: "Gantt Chart", value: "gantt" },
  { icon: Menu, label: "Calendar", value: "calendar" },
  { icon: Settings, label: "Settings", value: "settings" },
];

export function Sidebar({ activeView, onViewChange }: { activeView: string, onViewChange: (view: any) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<UserType | null>(null);

  React.useEffect(() => {
    // Check current session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo / Header */}
          <div className="p-6">
            <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">F</div>
              Fusion Tasks
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onViewChange(item.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  activeView === item.value
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2 py-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-blue-200">
                    {user.user_metadata.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="avatar" />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">{user.user_metadata.full_name || user.email}</p>
                    <p className="text-[10px] text-slate-400 truncate">Member</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium transition-all"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2">
                <p className="text-[11px] text-slate-400 mb-2 px-1 font-medium">Account Access</p>
                <LoginButton />
              </div>
            )}

            <button className="flex items-center gap-2 w-full mt-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm active:scale-95 shadow-blue-100/50">
              <Plus size={18} />
              New Task
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm"
        />
      )}
    </>
  );
}
