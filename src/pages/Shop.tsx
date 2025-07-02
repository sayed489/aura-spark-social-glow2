import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Star, Gem, Heart, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const shopItems = [
  {
    id: 'chat_points_small',
    title: '50 Chat Points',
    price: 10,
    currency: 'gems',
    icon: Star,
    description: 'Continue conversations with AI companions',
    color: 'from-blue-400 to-purple-400'
  },
  {
    id: 'chat_points_large',
    title: '200 Chat Points',
    price: 35,
    currency: 'gems',
    icon: Star,
    description: 'Unlimited chatting for weeks',
    color: 'from-purple-400 to-pink-400',
    popular: true
  },
  {
    id: 'premium_features',
    title: 'Premium Unlock',
    price: 100,
    currency: 'gems',
    icon: Zap,
    description: 'Voice messages, custom AI personalities',
    color: 'from-yellow-400 to-orange-400'
  },
  {
    id: 'aura_boost',
    title: 'Aura Boost',
    price: 20,
    currency: 'gems',
    icon: Heart,
    description: '+10 to your next aura reading',
    color: 'from-pink-400 to-rose-400'
  }
];

export default function Shop() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useAuth();

  const handlePurchase = async (item: typeof shopItems[0]) => {
    if (!userProfile) return;

    if (userProfile.auraGems < item.price) {
      toast({
        title: "Not enough gems! 💎",
        description: "Complete daily aura readings to earn more gems.",
        variant: "destructive"
      });
      return;
    }

    try {
      const updates: any = {
        auraGems: userProfile.auraGems - item.price
      };

      if (item.id.includes('chat_points')) {
        const points = item.id === 'chat_points_small' ? 50 : 200;
        updates.chatPoints = userProfile.chatPoints + points;
      }

      await updateUserProfile(updates);
      
      toast({
        title: "Purchase successful! ✨",
        description: `You bought ${item.title}!`
      });
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-xl font-semibold">Shop & Rewards 💎</h1>
        <div className="flex items-center gap-1 text-sm bg-aura-purple/10 text-aura-purple px-3 py-1 rounded-full">
          <Gem className="w-4 h-4" />
          {userProfile?.auraGems || 0}
        </div>
      </div>

      {/* Shop Items */}
      <div className="p-4 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold mb-2">Enhance Your Experience</h2>
          <p className="text-sm text-muted-foreground">
            Use gems earned from daily aura readings
          </p>
        </div>

        {shopItems.map((item) => {
          const Icon = item.icon;
          const canAfford = (userProfile?.auraGems || 0) >= item.price;
          
          return (
            <Card 
              key={item.id}
              className={`relative overflow-hidden ${item.popular ? 'border-aura-purple' : ''}`}
            >
              {item.popular && (
                <div className="absolute top-2 right-2 bg-aura-purple text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-5`} />
              
              <CardContent className="relative p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <div className="flex items-center gap-1 text-aura-purple font-bold">
                        <Gem className="w-4 h-4" />
                        {item.price}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    
                    <div className="pt-3">
                      <GradientButton 
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className="w-full"
                        variant={canAfford ? "aura" : "aura-outline"}
                      >
                        {canAfford ? 'Purchase' : 'Not Enough Gems'}
                      </GradientButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="text-center p-6 bg-gradient-to-r from-aura-purple/5 to-aura-pink/5 rounded-lg border border-aura-purple/10 mt-8">
          <h3 className="font-semibold mb-2">💎 How to Earn Gems</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Complete daily aura readings (+5 gems)</li>
            <li>• Maintain chat streaks (+2 gems daily)</li>
            <li>• Unlock achievements (+10 gems each)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}