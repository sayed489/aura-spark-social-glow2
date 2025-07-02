import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoSelect: (file: File, base64: string) => void;
  disabled?: boolean;
  className?: string;
}

export function PhotoUpload({ onPhotoSelect, disabled, className }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPreview(base64);
        onPhotoSelect(file, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={`relative ${className}`}>
      <CardContent className="p-4">
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Selected photo" 
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 w-6 h-6"
              onClick={clearPhoto}
              disabled={disabled}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div
            className="w-full h-32 border-2 border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-aura-purple/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-6 h-6 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Tap to add photo</p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
}