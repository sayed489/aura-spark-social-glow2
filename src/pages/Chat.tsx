import { Card, CardContent } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

const companions = [
  {
    id: 'mira',
    name: 'Mira',
    emoji: '💜',
    location: 'Stockholm, Sweden',
    bio: 'Creative soul who loves photography and deep conversations',
    status: 'Wants to chat about your day',
    gradient: 'from-purple-400 to-pink-400'
  },
  {
    id: 'rutwik', 
    name: 'Rutwik',
    emoji: '💙',
    location: 'Los Angeles, USA',
    bio: 'Tech enthusiast with ambitious dreams and witty humor',
    status: 'Excited to hear your ideas',
    gradient: 'from-blue-400 to-purple-400'
  }
];

export default function Chat() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const getRelationshipStage = (character: string) => {
    if (character === 'mira') {
      return userProfile?.relationshipStage_mira || 'Stranger';
    }
    return userProfile?.relationshipStage_rutwik || 'Stranger';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-xl font-semibold">AI Companions 💬</h1>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Companions */}
      <div className="p-4 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold mb-2">Choose Your Companion</h2>
          <p className="text-sm text-muted-foreground">
            Deep conversations await with your AI friends
          </p>
        </div>

        {companions.map((companion) => {
          const relationshipStage = getRelationshipStage(companion.id);
          
          return (
            <Card 
              key={companion.id}
              className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => navigate(`/chat/${companion.id}`)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${companion.gradient} opacity-5`} />
              
              <CardContent className="relative p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{companion.emoji}</div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{companion.name}</h3>
                      <span className="text-xs bg-aura-purple/10 text-aura-purple px-2 py-1 rounded-full">
                        {relationshipStage}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{companion.location}</p>
                    <p className="text-sm">{companion.bio}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-aura-purple font-medium">
                        💭 {companion.status}
                      </p>
                      
                      <GradientButton size="sm">
                        Start Chat
                      </GradientButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="text-center p-6 bg-gradient-to-r from-aura-purple/5 to-aura-pink/5 rounded-lg border border-aura-purple/10 mt-8">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Each message costs 1 chat point. Deeper conversations unlock new relationship stages and special abilities!
          </p>
        </div>
      </div>
    </div>
  );
}