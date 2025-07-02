import { Header } from "@/components/Header"
import { AuraCard } from "@/components/AuraCard"
import { FeatureGrid } from "@/components/FeatureGrid"
import { useAuth } from "@/contexts/AuthContext"
import heroAura from "@/assets/hero-aura.jpg"

const Index = () => {
  const { userProfile } = useAuth();
  
  // Check if user has done daily aura reading
  const today = new Date().toDateString();
  const lastReading = userProfile?.lastAuraReading ? new Date(userProfile.lastAuraReading).toDateString() : null;
  const hasRevealedToday = lastReading === today;
  
  // Mock aura data - in real implementation this would come from Firestore
  const mockAuraScore = 87;
  const mockAuraReading = "Your energy radiates creativity and passion today. Trust your intuition in new endeavors.";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroAura})` }}
        />
        <div className="relative px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-aura-purple to-aura-pink bg-clip-text text-transparent">
            Aura AI
          </h1>
          <p className="text-muted-foreground mb-6">
            Discover your daily energy and connect with AI companions
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-4 pb-8 space-y-6">
        {/* Daily Aura Card */}
        <AuraCard 
          isRevealed={hasRevealedToday}
          score={hasRevealedToday ? mockAuraScore : undefined}
          reading={hasRevealedToday ? mockAuraReading : undefined}
          streak={userProfile?.currentStreak || 0}
        />
        
        {/* Feature Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Explore Your Universe</h2>
          <FeatureGrid />
        </div>
        
        {/* Daily Quote */}
        <div className="text-center p-6 bg-gradient-to-r from-aura-purple/5 to-aura-pink/5 rounded-lg border border-aura-purple/10">
          <p className="text-sm text-muted-foreground italic">
            "Your aura is the reflection of your inner light. Let it shine bright today." ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
