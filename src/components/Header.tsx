import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gem, Star, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export function Header() {
  const { userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <header className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 border-2 border-aura-purple/20">
          <AvatarImage src={userProfile?.photoUrl} />
          <AvatarFallback className="bg-gradient-to-r from-aura-purple to-aura-pink text-white font-semibold">
            {userProfile?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="font-semibold text-lg">
            Hello, {userProfile?.name || "Beautiful"} ✨
          </h1>
          <p className="text-xs text-muted-foreground">Ready for today's reading?</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
        </Button>
        
        <Badge variant="secondary" className="gap-1">
          <Star className="w-3 h-3 fill-current text-aura-purple" />
          {userProfile?.chatPoints || 50}
        </Badge>
        
        <Badge variant="secondary" className="gap-1">
          <Gem className="w-3 h-3 fill-current text-aura-pink" />
          {userProfile?.auraGems || 100}
        </Badge>
      </div>
    </header>
  )
}