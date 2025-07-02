import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { spotifyService } from '@/services/spotifyService';
import { toast } from '@/hooks/use-toast';

export default function SpotifyCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        toast({
          title: "Spotify connection failed",
          description: "You denied access to Spotify. Music features won't be available.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      if (!code || state !== 'aura-ai-auth') {
        toast({
          title: "Invalid callback",
          description: "Something went wrong with Spotify authentication.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      try {
        const success = await spotifyService.exchangeCodeForToken(code);
        
        if (success) {
          toast({
            title: "Spotify connected! 🎵",
            description: "You can now get personalized music recommendations based on your aura!"
          });
        } else {
          throw new Error('Failed to exchange token');
        }
      } catch (error) {
        toast({
          title: "Connection failed",
          description: "Failed to connect to Spotify. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
        navigate('/');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-2xl">🎵</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">
            {isProcessing ? 'Connecting to Spotify...' : 'Connection Complete!'}
          </h1>
          
          <p className="text-muted-foreground">
            {isProcessing 
              ? 'Please wait while we set up your music integration'
              : 'Redirecting you back to Aura AI...'
            }
          </p>
          
          {isProcessing && (
            <div className="mt-6">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full animate-gradient-flow w-full" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}