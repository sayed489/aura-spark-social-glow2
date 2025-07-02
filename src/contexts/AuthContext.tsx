import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  uid: string;
  name: string;
  bio: string;
  gender: 'male' | 'female' | 'other';
  photoUrl?: string;
  chatPoints: number;
  auraGems: number;
  relationshipStage_mira: string;
  relationshipStage_rutwik: string;
  memories: string[];
  createdAt: Date;
  lastAuraReading?: Date;
  currentStreak: number;
  totalDuelWins: number;
  achievements: string[];
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back! ✨",
        description: "You've successfully signed in."
      });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else {
        throw new Error('Failed to sign in. Please check your credentials.');
      }
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const newUserProfile: UserProfile = {
        uid: result.user.uid,
        name: userData.name || '',
        bio: userData.bio || '',
        gender: userData.gender || 'other',
        photoUrl: userData.photoUrl || '',
        chatPoints: 100, // Starting points
        auraGems: 50, // Starting gems
        relationshipStage_mira: 'Stranger',
        relationshipStage_rutwik: 'Stranger',
        memories: [],
        createdAt: new Date(),
        currentStreak: 0,
        totalDuelWins: 0,
        achievements: []
      };

      await setDoc(doc(db, 'users', result.user.uid), newUserProfile);
      setUserProfile(newUserProfile);
      
      toast({
        title: "Welcome to Aura AI! 🌟",
        description: "Your account has been created successfully."
      });
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      } else {
        throw new Error('Failed to create account. Please try again.');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast({
        title: "See you soon! ✨",
        description: "You've been signed out successfully."
      });
    } catch (error) {
      throw new Error('Failed to sign out. Please try again.');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password reset sent! 📧",
        description: "Check your email for reset instructions."
      });
    } catch (error) {
      throw new Error('Failed to send password reset email.');
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user || !userProfile) return;

    try {
      const updatedProfile = { ...userProfile, ...data };
      await updateDoc(doc(db, 'users', user.uid), data);
      setUserProfile(updatedProfile);
      
      toast({
        title: "Profile updated! ✨",
        description: "Your changes have been saved."
      });
    } catch (error) {
      throw new Error('Failed to update profile.');
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}