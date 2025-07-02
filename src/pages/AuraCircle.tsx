import { Card, CardContent } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Heart, Users, Star, Trophy } from 'lucide-react';

const communityPosts = [
  {
    id: 1,
    user: 'Sarah M.',
    auraScore: 92,
    color: 'gold',
    message: 'Feeling incredible energy today! My meditation practice is really paying off ✨',
    likes: 24,
    timeAgo: '2h ago'
  },
  {
    id: 2,
    user: 'Alex K.',
    auraScore: 78,
    color: 'purple',
    message: 'Anyone else feeling creative today? My aura reading said I have artistic energy flowing!',
    likes: 15,
    timeAgo: '4h ago'
  },
  {
    id: 3,
    user: 'Maya L.',
    auraScore: 85,
    color: 'blue',
    message: 'Third day streak! Love connecting with this amazing community 💙',
    likes: 31,
    timeAgo: '6h ago'
  }
];

const leaderboard = [
  { rank: 1, user: 'Luna Star', score: 94, streak: 12 },
  { rank: 2, user: 'Cosmic Ray', score: 91, streak: 8 },
  { rank: 3, user: 'Zen Master', score: 89, streak: 15 }
];

export default function AuraCircle() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

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
        <h1 className="text-xl font-semibold">Aura Circle 💖</h1>
        <div className="flex items-center gap-1 text-sm bg-aura-pink/10 text-aura-pink px-3 py-1 rounded-full">
          <Users className="w-4 h-4" />
          1.2k
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Message */}
        <div className="text-center p-6 bg-gradient-to-r from-aura-purple/10 to-aura-pink/10 rounded-lg border border-aura-purple/20">
          <h2 className="text-lg font-semibold mb-2">Welcome to the Community! 🌟</h2>
          <p className="text-sm text-muted-foreground">
            Share your aura journey and connect with like-minded souls
          </p>
        </div>

        {/* User Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Your Aura Stats</h3>
                <p className="text-sm text-muted-foreground">
                  Streak: {userProfile?.currentStreak || 0} days
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-aura-purple">
                  {userProfile?.currentStreak ? 87 : 0}
                </div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold">Top Auras This Week</h3>
            </div>
            
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div key={user.rank} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.rank === 1 ? 'bg-yellow-500 text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      'bg-orange-500 text-white'
                    }`}>
                      {user.rank}
                    </div>
                    <span className="font-medium">{user.user}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-aura-purple">{user.score}</div>
                    <div className="text-xs text-muted-foreground">{user.streak}d streak</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Posts */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-aura-pink" />
            Community Vibes
          </h3>
          
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-aura-purple to-aura-pink flex items-center justify-center text-white font-bold text-sm`}>
                      {post.auraScore}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{post.user}</span>
                        <span className={`px-2 py-1 text-xs rounded-full bg-${post.color}-100 text-${post.color}-600`}>
                          {post.color} aura
                        </span>
                        <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                      </div>
                      
                      <p className="text-sm mb-2">{post.message}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-aura-pink transition-colors">
                          <Heart className="w-3 h-3" />
                          {post.likes}
                        </button>
                        <button className="hover:text-aura-purple transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Share Button */}
        <div className="text-center">
          <GradientButton className="w-full">
            Share Your Aura ✨
          </GradientButton>
        </div>
      </div>
    </div>
  );
}