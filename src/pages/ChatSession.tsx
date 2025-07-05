import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GradientButton } from '@/components/ui/gradient-button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Star, Image as ImageIcon } from 'lucide-react';
import { PhotoUpload } from '@/components/PhotoUpload';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
  characterImage?: string;
}

const companions = {
  mira: {
    name: 'Mira',
    emoji: '💜',
    location: 'Stockholm, Sweden',
    profilePhoto: '/characters/mira-profile.jpg'
  },
  rutwik: {
    name: 'Rutwik',
    emoji: '💙',
    location: 'Los Angeles, USA',
    profilePhoto: '/characters/rutwik-profile.jpg'
  }
};

const ChatLoader = () => (
    <div className="flex-1 flex items-center justify-center p-4 text-center">
        <div>
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-aura-purple to-aura-pink rounded-full flex items-center justify-center animate-pulse">
              <span className="text-3xl">✨</span>
            </div>
            <p className="text-muted-foreground mt-4 font-medium">Connecting to your companion...</p>
        </div>
    </div>
);


export default function ChatSession() {
  const { character } = useParams<{ character: 'mira' | 'rutwik' }>();
  const navigate = useNavigate();
  const { userProfile, updateUserProfile, loading: authLoading } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ file: File; base64: string } | null>(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const companion = character ? companions[character] : null;

  useEffect(() => {
    if (!authLoading && userProfile && companion && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome-message',
        text: `Hey, ${userProfile.name || 'friend'}! ✨ I was just thinking about you. What's on your mind?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [companion, userProfile, authLoading, messages.length, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if ((!inputValue.trim() && !selectedPhoto) || !userProfile || !character) return;

    if (userProfile.chatPoints <= 0) {
      toast({
        title: "No chat points!",
        description: "Complete your daily aura reading or visit the shop to get more points.",
        variant: "destructive"
      });
      return;
    }

    const userMessageText = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
      image: selectedPhoto?.base64
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedPhoto(null);
    setShowPhotoUpload(false);
    setIsSending(true);

    try {
      // THIS IS THE CORRECTED VERCEL FETCH CALL
      const res = await fetch('/api/generateChatResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: character,
          userMessage: userMessageText,
          chatHistory: messages.slice(-10).map(m => `${m.isUser ? 'You' : companion?.name}: ${m.text}`),
          userProfile: { name: userProfile.name, bio: userProfile.bio },
          photoBase64: selectedPhoto?.base64
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'The server responded with an error.');
      }
      
      const response = await res.json();
  
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        timestamp: new Date(),
        characterImage: response.characterImage,
      };
  
      setMessages(prev => [...prev, aiMessage]);
  
      const relationshipKey = `relationshipStage_${character}`;
      const oldRelationshipStage = userProfile[relationshipKey as keyof typeof userProfile];
  
      await updateUserProfile({
        chatPoints: userProfile.chatPoints - 1,
        memories: response.updatedMemories,
        [relationshipKey]: response.updatedRelationshipStage
      });
  
      if (response.updatedRelationshipStage && response.updatedRelationshipStage !== oldRelationshipStage) {
        toast({
          title: "Relationship Evolved! 💖",
          description: `You and ${companion?.name} are now ${response.updatedRelationshipStage}.`
        });
      }

    } catch (error: any) {
      console.error("Error calling Vercel function:", error);
      toast({
        title: "Connection Error",
        description: error.message || "I'm having a bit of trouble connecting right now. Let's try that again.",
        variant: "destructive"
      });
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSend();
    }
  };

  if (authLoading || !userProfile || !companion) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
          <ChatLoader />
      </div>
    )
  }

  // ... THE REST OF THE JSX IS THE SAME AS THE LAST CORRECTED VERSION, so I will omit for brevity
  // The 'return (...)' part does not need any changes.

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <button 
          onClick={() => navigate('/chat')} 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <div className="text-center">
          <h1 className="font-semibold flex items-center gap-2">
            {companion.emoji} {companion.name}
          </h1>
          <p className="text-xs text-muted-foreground">{companion.location}</p>
        </div>
        
        <div className="flex items-center gap-1 text-xs bg-aura-purple/10 text-aura-purple px-2 py-1 rounded-full">
          <Star className="w-3 h-3" />
          {userProfile?.chatPoints || 0}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <img src={companion.profilePhoto} alt={companion.name} className="w-8 h-8 rounded-full"/>
            )}
            <Card className={`max-w-[80%] ${
              message.isUser 
                ? 'bg-gradient-to-r from-aura-purple to-aura-pink text-white rounded-br-none' 
                : 'bg-muted rounded-bl-none'
            }`}>
              <div className="p-3">
                {message.image && (
                  <img 
                    src={message.image} 
                    alt="User Upload" 
                    className="w-full max-w-xs rounded-lg mb-2"
                  />
                )}
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </Card>
          </div>
        ))}
        
        {isSending && (
          <div className="flex items-end gap-2 justify-start">
             <img src={companion.profilePhoto} alt={companion.name} className="w-8 h-8 rounded-full"/>
            <Card className="bg-muted rounded-bl-none">
              <div className="p-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]" />
                </div>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-background/80 backdrop-blur-sm sticky bottom-0">
          {showPhotoUpload && (
            <div className="mb-4">
                <PhotoUpload
                    onPhotoSelect={(file, base64) => setSelectedPhoto({ file, base64 })}
                    disabled={isSending}
                />
            </div>
           )}
           {selectedPhoto && (
             <div className="mb-3 relative w-24">
               <img 
                 src={selectedPhoto.base64} 
                 alt="Preview" 
                 className="w-24 h-24 object-cover rounded-lg border"
               />
               <button
                 onClick={() => setSelectedPhoto(null)}
                 className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
               >
                 ×
               </button>
             </div>
           )}
        
        <div className="flex gap-2 items-center">
          <GradientButton
            variant="aura-outline"
            size="icon"
            onClick={() => setShowPhotoUpload(!showPhotoUpload)}
            disabled={isSending || (userProfile?.chatPoints || 0) <= 0}
          >
            <ImageIcon className="w-5 h-5" />
          </GradientButton>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${companion.name}...`}
            disabled={isSending || (userProfile?.chatPoints || 0) <= 0}
            className="flex-1"
          />
          <GradientButton
            onClick={handleSend}
            disabled={(!inputValue.trim() && !selectedPhoto) || isSending}
            size="icon"
          >
            <Send className="w-5 h-5" />
          </GradientButton>
        </div>
      </div>
    </div>
  );
}