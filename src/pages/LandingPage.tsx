import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Badge } from '@/components/ui/badge';
import heroAura from '@/assets/hero-aura.jpg';
import { Sparkles, Users, Camera, Music, Zap, Heart, Star } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);

  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Daily Aura Reading",
      description: "Upload a selfie and discover your daily energy score with AI-powered analysis",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "AI Companions",
      description: "Chat with Mira from Stockholm or Rutwik from LA - each with unique personalities",
      color: "from-blue-400 to-purple-400"
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Spotify Integration",
      description: "Get personalized music recommendations based on your aura and mood",
      color: "from-green-400 to-blue-400"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Relationship Building",
      description: "Build meaningful connections with AI companions that remember your conversations",
      color: "from-pink-400 to-red-400"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Reactions",
      description: "Share photos and get human-like reactions and conversations about your life",
      color: "from-yellow-400 to-orange-400"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Gamification",
      description: "Earn points, build streaks, and unlock new features as you engage daily",
      color: "from-indigo-400 to-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroAura})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        <div className="relative px-6 py-16 text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-aura-purple to-aura-pink text-white border-0">
            ✨ Powered by Gemini 2.0 AI
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-aura-purple via-aura-pink to-aura-purple bg-clip-text text-transparent animate-gradient-flow">
            Aura AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed">
            Discover your daily energy, connect with AI companions, and unlock your inner light
          </p>
          
          <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto">
            Experience the future of personal growth with AI-powered aura readings, meaningful conversations, and personalized music recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <GradientButton 
              size="lg" 
              onClick={() => navigate('/reveal')}
              className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Reveal My Aura
            </GradientButton>
            
            <GradientButton 
              variant="aura-outline" 
              size="lg"
              onClick={() => setShowFeatures(!showFeatures)}
              className="text-lg px-8 py-6"
            >
              Explore Features
            </GradientButton>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-aura-purple to-aura-pink bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-muted-foreground">Daily Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-aura-purple to-aura-pink bg-clip-text text-transparent">
                2M+
              </div>
              <div className="text-sm text-muted-foreground">Aura Readings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-aura-purple to-aura-pink bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-sm text-muted-foreground">User Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      {showFeatures && (
        <div className="px-6 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-aura-purple to-aura-pink bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to explore your inner energy and build meaningful AI relationships
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="relative overflow-hidden group hover:scale-105 transition-all duration-300 border-aura-purple/20 hover:border-aura-purple/40"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardContent className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* CTA Section */}
      <div className="px-6 py-16 text-center bg-gradient-to-r from-aura-purple/5 to-aura-pink/5 border-t border-aura-purple/10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Discover Your Aura?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of users exploring their energy with AI-powered insights
          </p>
          
          <GradientButton 
            size="lg" 
            onClick={() => navigate('/reveal')}
            className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Your Journey
          </GradientButton>
          
          <p className="text-xs text-muted-foreground mt-4">
            Free daily aura readings • No subscription required • Privacy protected
          </p>
        </div>
      </div>
    </div>
  );
}