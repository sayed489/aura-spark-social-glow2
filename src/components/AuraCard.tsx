import { Card, CardContent } from "@/components/ui/card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Star } from "lucide-react"

interface AuraCardProps {
  isRevealed?: boolean
  score?: number
  reading?: string
  streak?: number
}

export function AuraCard({ isRevealed = false, score, reading, streak = 0 }: AuraCardProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background to-muted/20 border-2 border-transparent bg-clip-padding">
      <div className="absolute inset-0 bg-gradient-to-r from-aura-purple/10 to-aura-pink/10 opacity-50" />
      
      <CardContent className="relative p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold">Your Daily Aura</h2>
            <span className="text-2xl">✨</span>
          </div>
          
          {streak > 0 && (
            <div className="flex items-center justify-center gap-1 text-sm font-medium text-aura-purple">
              <span>🔥</span>
              <span>{streak} Day Streak!</span>
            </div>
          )}
          
          {isRevealed ? (
            <div className="space-y-4">
              <div className="relative">
                <div className="text-6xl font-bold bg-gradient-to-r from-aura-purple to-aura-pink bg-clip-text text-transparent animate-aura-pulse">
                  {score}
                </div>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor((score || 0) / 20) ? "fill-aura-pink text-aura-pink" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">{reading}</p>
              
              <GradientButton variant="aura-outline" size="sm">
                Share Your Aura ✨
              </GradientButton>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-aura-purple/20 to-aura-pink/20 flex items-center justify-center animate-aura-pulse">
                <span className="text-3xl">✨</span>
              </div>
              
              <p className="text-muted-foreground">Ready to discover today's energy?</p>
              
              <GradientButton size="lg" className="w-full" onClick={() => window.location.href = '/reveal'}>
                Reveal Today's Aura
              </GradientButton>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}