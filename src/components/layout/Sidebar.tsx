"use client";

import React from "react";
import { LayoutDashboard, BarChart3, Settings, Menu, X, Plus, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { LoginButton } from "@/components/auth/LoginButton";
import { User as UserType } from "@supabase/supabase-js";

const menuItems = [
  { icon: LayoutDashboard, label: "看板", value: "kanban" },
  { icon: BarChart3, label: "甘特圖", value: "gantt" },
  { icon: Menu, label: "日曆", value: "calendar" },
  { icon: Settings, label: "設定", value: "settings" },
];

export function Sidebar({ activeView, onViewChange, onNewTask }: {
  activeView: string,
  onViewChange: (view: string) => void,
  onNewTask: () => void
}) {
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
      {/* Mobile Menu Button ... */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#fdfbfa] border-r border-[#e8e3dd] transition-transform lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo / Header */}
          <div className="p-6">
            <h1 className="text-xl font-bold text-[#4a3f35] flex items-center gap-2">
              <div className="w-8 h-8 bg-[#8a9a5b] rounded-lg flex items-center justify-center text-white font-black text-xs shadow-sm">F</div>
              Fusion 任務管理
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
                  "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  activeView === item.value
                    ? "bg-[#8a9a5b]/10 text-[#8a9a5b]"
                    : "text-[#6d6257] hover:bg-[#a68b6d]/5 hover:text-[#4a3f35]"
                )}
              >
                <item.icon size={20} className={activeView === item.value ? "text-[#8a9a5b]" : "text-[#a68b6d]"} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="p-4 border-t border-[#f1efe9] flex flex-col gap-3">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2 py-1">
                  <div className="w-8 h-8 rounded-full bg-[#f1efe9] flex items-center justify-center text-[#8a9a5b] font-bold overflow-hidden border border-[#e8e3dd]">
                    {user.user_metadata.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="avatar" />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-[#4a3f35] truncate">{user.user_metadata.full_name || user.email}</p>
                    <p className="text-[10px] text-[#a68b6d] truncate uppercase tracking-wider font-semibold">正式成員</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-[#a68b6d] hover:text-[#d27d56] hover:bg-[#d27d56]/5 rounded-lg text-xs font-medium transition-all"
                >
                  <LogOut size={14} />
                  登出
                </button>
              </div>
            ) : (
              <div className="px-2">
                <p className="text-[11px] text-[#a68b6d] mb-2 px-1 font-semibold uppercase tracking-wider">帳號存取</p>
                <LoginButton />
              </div>
            )}

            <button
              onClick={onNewTask}
              className="flex items-center gap-2 w-full mt-2 px-4 py-2.5 bg-[#8a9a5b] text-white rounded-lg text-sm font-bold hover:bg-[#7a8a4b] transition-all shadow-md active:scale-95 shadow-[#8a9a5b]/20"
            >
              <Plus size={18} />
              新增任務
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
