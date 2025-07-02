import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Sword, Heart, Gem } from "lucide-react"
import { useNavigate } from "react-router-dom"

const features = [
  {
    title: "AI Chat",
    emoji: "💬",
    icon: MessageSquare,
    description: "Deep conversations with AI friends",
    color: "from-blue-400 to-purple-500"
  },
  {
    title: "Aura Duel",
    emoji: "⚔️", 
    icon: Sword,
    description: "Challenge friends to aura battles",
    color: "from-red-400 to-pink-500"
  },
  {
    title: "Aura Circle",
    emoji: "💖",
    icon: Heart,
    description: "Connect with your aura community",
    color: "from-pink-400 to-rose-500"
  },
  {
    title: "Shop & Rewards",
    emoji: "💎",
    icon: Gem,
    description: "Unlock premium features",
    color: "from-purple-400 to-indigo-500"
  }
]

export function FeatureGrid() {
  const navigate = useNavigate();

  const getFeatureRoute = (title: string) => {
    switch (title) {
      case 'AI Chat': return '/chat';
      case 'Aura Circle': return '/aura-circle';
      case 'Shop & Rewards': return '/shop';
      default: return '/';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {features.map((feature, index) => {
        const Icon = feature.icon
        return (
          <Card 
            key={feature.title}
            className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-aura-purple/20 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => navigate(getFeatureRoute(feature.title))}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`} />
            
            <CardContent className="relative p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">{feature.emoji}</span>
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}