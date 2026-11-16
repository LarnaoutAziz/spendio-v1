import { useState } from 'react';
import { api } from '../services/api';

interface EditProfilePayload {
  name?: string;
  email?: string;
}

interface EditProfileResponse {
  message: string;
}

export const useEditProfileMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (payload: EditProfilePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('📝 Données du profil envoyées:', payload);
      const response = await api.put<EditProfileResponse>('/auth/profile', payload);
      console.log('✅ Profil mis à jour avec succès');
      return response.data;
    } catch (err: any) {
      const errorObj = new Error(err.response?.data?.message || err.message);
      console.error('❌ Erreur lors de la mise à jour:', err.response?.data?.message || err.message);
      setError(errorObj);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};
