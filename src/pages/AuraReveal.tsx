import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Camera, Upload } from 'lucide-react';

export default function AuraReveal() {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [auraResult, setAuraResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { userProfile } = useAuth(); // Keep this to avoid breaking other parts of the app

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      toast({
        title: "Error",
        description: "Please upload a photo first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setStep('analyzing');

    // Simulate a 2.5-second delay for the analysis animation
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 50) + 51;
      const colors = ["Gold", "Purple", "Blue", "Green", "Pink"];
      const elements = ["Fire", "Water", "Earth", "Air", "Spirit"];
      const readings = [
        "Your energy radiates creativity and passion today.",
        "A calm and intuitive wave surrounds you. Trust your gut.",
        "Your spirit is bright and full of positive potential.",
        "You have a strong, grounding energy today. Stay centered."
      ];
      
      const fakeResult = {
        score: randomScore,
        reading: readings[Math.floor(Math.random() * readings.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        element: elements[Math.floor(Math.random() * elements.length)],
        // Make this random as we don't have userProfile
        matchedCharacter: Math.random() > 0.5 ? 'mira' : 'rutwik'
      };

      setAuraResult(fakeResult);
      setStep('result');
      setIsLoading(false);

      toast({
        title: "Aura revealed! ✨",
        description: `Your aura score is ${fakeResult.score}! (Offline mode)`
      });

    }, 2500);
  };

  const handleFinish = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          {step === 'upload' && (
            <div className="space-y-6 text-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Daily Aura Reading ✨</h1>
                <p className="text-muted-foreground">
                  Take or upload a selfie to reveal your aura
                </p>
              </div>

              {imagePreview ? (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-48 h-48 mx-auto object-cover rounded-full border-4 border-aura-purple/20"
                  />
                  <div className="flex gap-2">
                    <GradientButton 
                      variant="aura-outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Change
                    </GradientButton>
                    <GradientButton 
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Analyzing...' : 'Analyze Aura'}
                    </GradientButton>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div 
                    className="w-48 h-48 mx-auto border-2 border-dashed border-aura-purple/30 rounded-full flex items-center justify-center cursor-pointer hover:border-aura-purple/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto text-aura-purple/50 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Tap to upload selfie
                      </p>
                    </div>
                  </div>
                  
                  <GradientButton 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </GradientButton>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          )}

          {step === 'analyzing' && (
            <div className="space-y-6 text-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Analyzing Your Aura ✨</h1>
                <p className="text-muted-foreground">
                  Reading your energy patterns...
                </p>
              </div>

              <div className="w-32 h-32 mx-auto">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-aura-purple to-aura-pink animate-pulse opacity-70" />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Scanning aura field...</div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-aura-purple to-aura-pink h-2 rounded-full animate-gradient-flow w-full" style={{ backgroundSize: '200% 200%' }}/>
                </div>
              </div>
            </div>
          )}

          {step === 'result' && auraResult && (
            <div className="space-y-6 text-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Your Aura Revealed ✨</h1>
              </div>

              <div className="space-y-4">
                <div className="text-6xl font-bold bg-gradient-to-r from-aura-purple to-aura-pink bg-clip-text text-transparent">
                  {auraResult.score}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-center gap-2">
                    <span className="px-3 py-1 bg-aura-purple/10 text-aura-purple text-sm rounded-full font-medium">
                      {auraResult.color}
                    </span>
                    <span className="px-3 py-1 bg-aura-pink/10 text-aura-pink text-sm rounded-full font-medium">
                      {auraResult.element}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed px-2">
                  {auraResult.reading}
                </p>

                <div className="p-4 bg-gradient-to-r from-aura-purple/5 to-aura-pink/5 rounded-lg border border-aura-purple/10">
                  <p className="text-sm font-medium mb-1">
                    AI Companion Match: {auraResult.matchedCharacter === 'mira' ? 'Mira 💜' : 'Rutwik 💙'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {auraResult.matchedCharacter === 'mira' 
                      ? 'Empathetic and creative companion from Stockholm'
                      : 'Witty and ambitious tech enthusiast from LA'
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <GradientButton variant="aura-outline" onClick={handleFinish} className="flex-1">
                  Done
                </GradientButton>
                <GradientButton onClick={() => navigate('/chat')} className="flex-1">
                  Start Chatting
                </GradientButton>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}