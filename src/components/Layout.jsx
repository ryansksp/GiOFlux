import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  Megaphone,
  DollarSign,
  Sparkles,
  Menu,
  LogOut,
  User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import UserBadge from "./common/UserBadge";
import PendingUsersNotification from "./common/PendingUsersNotification";
import { canAccessFinancial } from "../utils/formatters";

const allNavigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    requiredRole: "consultora"
  },
  {
    title: "Clientes",
    url: createPageUrl("Clientes"),
    icon: Users,
    requiredRole: "consultora"
  },
  {
    title: "Agenda",
    url: createPageUrl("Agenda"),
    icon: Calendar,
    requiredRole: "consultora"
  },
  {
    title: "Procedimentos",
    url: createPageUrl("Procedimentos"),
    icon: Activity,
    requiredRole: "consultora"
  },
  {
    title: "Campanhas",
    url: createPageUrl("Campanhas"),
    icon: Megaphone,
    requiredRole: "gerente"
  },
  {
    title: "Financeiro",
    url: createPageUrl("Financeiro"),
    icon: DollarSign,
    requiredRole: "gerente"
  },
  {
    title: "Gerenciar Usuários",
    url: createPageUrl("UserManagement"),
    icon: Users,
    requiredRole: "admin"
  },
];



export default function Layout({ children }) {

  const location = useLocation();
  const { user, userProfile, signOut } = useAuth();

  const [navigationItems, setNavigationItems] = useState([]);



  useEffect(() => {

    if (userProfile) {

      // Filtrar itens de navegação baseado em permissões

      const filteredItems = allNavigationItems.filter(item => {

        if (item.requiredRole === "consultora") return true;

        if (item.requiredRole === "gerente") return canAccessFinancial(userProfile);

        return true;

      });

      // Adicionar Perfil para todos os usuários

      const perfilItem = {

        title: "Perfil",

        url: createPageUrl("Perfil"),

        icon: User,

        requiredRole: "consultora"

      };

      filteredItems.push(perfilItem);



      setNavigationItems(filteredItems);

    }

  }, [userProfile]);



  const handleLogout = async () => {

    try {

      await signOut();

    } catch (error) {

      console.error("Erro ao fazer logout:", error);

    }

  };



  return (

    <SidebarProvider>



      <div className="w-full min-h-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">

        <Sidebar className="border-r border-purple-100 bg-white/80 backdrop-blur-sm">

          <SidebarHeader className="border-b border-purple-100 p-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 bg-gradient-to-br from-[#823a80] to-[#c43c8b] rounded-xl flex items-center justify-center shadow-lg">

                <Sparkles className="w-6 h-6 text-white" />

              </div>

              <div>

                <h2 className="font-bold text-xl bg-gradient-to-r from-[#823a80] to-[#c43c8b] bg-clip-text text-transparent">SyncFlux</h2>

              </div>

            </div>

          </SidebarHeader>

          

          <SidebarContent className="p-3">

            <SidebarGroup>

              <SidebarGroupContent>

                <SidebarMenu>

                  {navigationItems.map((item) => {

                    const isActive = location.pathname === item.url;

                    return (

                      <SidebarMenuItem key={item.title}>

                        <SidebarMenuButton 

                          asChild 

                          className={`mb-1 transition-all duration-300 ${

                            isActive 

                              ? 'bg-gradient-to-r from-[#823a80] to-[#c43c8b] text-white shadow-md hover:shadow-lg' 

                              : 'hover:bg-purple-50 text-gray-700'

                          }`}

                        >

                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3 rounded-xl">

                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#823a80]'}`} />

                            <span className="font-medium">{item.title}</span>

                          </Link>

                        </SidebarMenuButton>

                      </SidebarMenuItem>

                    );

                  })}

                </SidebarMenu>

              </SidebarGroupContent>

            </SidebarGroup>

          </SidebarContent>



          <SidebarFooter className="border-t border-purple-100 p-4">
            {userProfile && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-purple-200">
                    <AvatarFallback className="bg-gradient-to-br from-[#823a80] to-[#c43c8b] text-white font-semibold">
                      {userProfile.displayName?.charAt(0) || userProfile.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{userProfile.displayName || user?.displayName || 'Usuário'}</p>
                    <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <UserBadge />
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-gray-500 hover:text-[#823a80] hover:bg-purple-50"
                    >
                      <Link to="/perfil">
                        <User className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </SidebarFooter>

        </Sidebar>



        <main className="flex-1 flex flex-col relative z-0">

          <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 px-6 py-4 md:hidden">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <SidebarTrigger className="hover:bg-purple-50 p-2 rounded-lg transition-colors duration-200">

                  <Menu className="w-5 h-5 text-[#823a80]" />

                </SidebarTrigger>

                <h1 className="text-xl font-bold bg-gradient-to-r from-[#823a80] to-[#c43c8b] bg-clip-text text-transparent">SyncFlux</h1>

              </div>

              {userProfile && <UserBadge />}

            </div>

          </header>



          <div className="flex-1 overflow-auto">
            {children}
          </div>

        </main>

      </div>

    </SidebarProvider>

  );

}