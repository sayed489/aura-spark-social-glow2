import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GradientButton } from '@/components/ui/gradient-button';
import { useAuth } from '@/contexts/AuthContext';
import { generateChatResponse } from '@/services/geminiService';
import { PhotoUpload } from '@/components/PhotoUpload';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Star, Image as ImageIcon } from 'lucide-react';

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
    gradient: 'from-purple-400 to-pink-400'
  },
  rutwik: {
    name: 'Rutwik', 
    emoji: '💙',
    location: 'Los Angeles, USA',
    gradient: 'from-blue-400 to-purple-400'
  }
};

export default function ChatSession() {
  const { character } = useParams<{ character: 'mira' | 'rutwik' }>();
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ file: File; base64: string } | null>(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const companion = character ? companions[character] : null;

  useEffect(() => {
    if (!companion) {
      navigate('/chat');
      return;
    }

    // Load welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: `Hello ${userProfile?.name || 'beautiful'}! ✨ I'm ${companion.name}. How are you feeling today?`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [companion, userProfile?.name, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if ((!inputValue.trim() && !selectedPhoto) || !userProfile || !character) return;

    // Check chat points
    if (userProfile.chatPoints <= 0) {
      toast({
        title: "No chat points! 💎",
        description: "Visit the shop to get more points.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    // Add photo to user message if selected
    if (selectedPhoto) {
      userMessage.image = selectedPhoto.base64;
    }

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedPhoto(null);
    setShowPhotoUpload(false);
    setIsLoading(true);

    try {
      // Get relationship stage
      const relationshipStage = character === 'mira' 
        ? userProfile.relationshipStage_mira 
        : userProfile.relationshipStage_rutwik;

      // Generate AI response with photo if present
      const chatHistory = messages.map(m => `${m.isUser ? 'User' : companion?.name}: ${m.text}`);
      const response = await generateChatResponse(
        character,
        inputValue,
        userProfile,
        chatHistory,
        relationshipStage,
        selectedPhoto?.base64
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        timestamp: new Date(),
        characterImage: response.characterImage
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update user profile
      const updates: any = {
        chatPoints: userProfile.chatPoints - 1,
        memories: response.updatedMemories
      };

      if (character === 'mira') {
        updates.relationshipStage_mira = response.updatedRelationshipStage;
      } else {
        updates.relationshipStage_rutwik = response.updatedRelationshipStage;
      }

      await updateUserProfile(updates);

      // Show relationship stage update
      if (response.updatedRelationshipStage !== relationshipStage) {
        toast({
          title: "Relationship evolved! 💖",
          description: `You're now ${response.updatedRelationshipStage} with ${companion?.name}!`
        });
      }

    } catch (error) {
      toast({
        title: "Connection error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!companion) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
        <button 
          onClick={() => navigate('/chat')} 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <div className="text-center">
          <h1 className="font-semibold flex items-center gap-1">
            {companion.emoji} {companion.name}
          </h1>
          <p className="text-xs text-muted-foreground">{companion.location}</p>
        </div>
        
        <div className="flex items-center gap-1 text-xs bg-aura-purple/10 text-aura-purple px-2 py-1 rounded-full">
          <Star className="w-3 h-3" />
          {userProfile?.chatPoints || 0}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] ${
              message.isUser 
                ? 'bg-gradient-to-r from-aura-purple to-aura-pink text-white' 
                : 'bg-muted'
            }`}>
              <div className="p-3">
                {message.image && (
                  <img 
                    src={message.image} 
                    alt="Shared image" 
                    className="w-full max-w-xs h-32 object-cover rounded-lg mb-2"
                  />
                )}
                {message.characterImage && (
                  <img 
                    src={message.characterImage} 
                    alt={`${companion?.name} response`} 
                    className="w-20 h-20 object-cover rounded-full mb-2"
                  />
                )}
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 opacity-70 ${
                  message.isUser ? 'text-white/70' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-muted">
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200" />
                </div>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Photo Upload */}
      {showPhotoUpload && (
        <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
          <PhotoUpload
            onPhotoSelect={(file, base64) => setSelectedPhoto({ file, base64 })}
            disabled={isLoading}
          />
          <div className="flex gap-2 mt-3">
            <GradientButton
              onClick={() => setShowPhotoUpload(false)}
              variant="aura-outline"
              className="flex-1"
            >
              Cancel
            </GradientButton>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        {selectedPhoto && (
          <div className="mb-3 relative">
            <img 
              src={selectedPhoto.base64} 
              alt="Selected" 
              className="w-20 h-20 object-cover rounded-lg border"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowPhotoUpload(!showPhotoUpload)}
            disabled={isLoading || (userProfile?.chatPoints || 0) <= 0}
            className="p-2 border rounded-md hover:bg-muted transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${companion.name}...`}
            disabled={isLoading || (userProfile?.chatPoints || 0) <= 0}
            className="flex-1"
          />
          <GradientButton
            onClick={handleSend}
            disabled={(!inputValue.trim() && !selectedPhoto) || isLoading || (userProfile?.chatPoints || 0) <= 0}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </GradientButton>
        </div>
        
        {(userProfile?.chatPoints || 0) <= 0 && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            Out of chat points! Visit the shop to get more.
          </p>
        )}
      </div>
    </div>
  );
}