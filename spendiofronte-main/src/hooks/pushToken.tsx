import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';

/**
 * Hook pour envoyer des notifications locales
 * Les notifications distantes (push) ne sont plus supportées dans Expo Go SDK 53+
 * Ce hook offre une alternative avec notifications locales
 */
export const useLocalNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Envoyer une notification locale
   * @param title - Titre de la notification
   * @param body - Corps du message
   * @param delaySeconds - Délai avant l'affichage (par défaut 0.5 seconde)
   */
  const sendLocalNotification = useCallback(
    async (title: string, body: string, delaySeconds: number = 0.5) => {
      try {
        setIsLoading(true);
        
        console.log(`📢 [NOTIFICATION] Envoi: "${title}" - "${body}"`);
        
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: title || 'Spendio',
            body: body || 'Notification',
            sound: true,
            badge: 1,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            // Données personnalisées
            data: {
              timestamp: new Date().toISOString(),
              source: 'spendio',
            },
          },
          // Délai avant affichage
          trigger: delaySeconds > 0 
            ? { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delaySeconds }
            : null,
        });
        
        console.log(`✅ [NOTIFICATION] Programmée avec ID: ${notificationId}`);
        return notificationId;
      } catch (error: any) {
        console.error(`❌ [NOTIFICATION] Erreur:`, error);
        console.error(`   Message: ${error?.message}`);
        console.error(`   Code: ${error?.code}`);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Envoyer une notification immédiate (sans délai)
   */
  const sendImmediateNotification = useCallback(
    async (title: string, body: string) => {
      console.log(`⚡ [NOTIFICATION] Immédiate: "${title}"`);
      return sendLocalNotification(title, body, 0.1);
    },
    [sendLocalNotification]
  );

  /**
   * Envoyer une notification avec délai personnalisé
   */
  const sendDelayedNotification = useCallback(
    async (title: string, body: string, delaySeconds: number) => {
      console.log(`⏱️ [NOTIFICATION] Programmée dans ${delaySeconds}s: "${title}"`);
      return sendLocalNotification(title, body, delaySeconds);
    },
    [sendLocalNotification]
  );

  return {
    sendLocalNotification,
    sendImmediateNotification,
    sendDelayedNotification,
    isLoading,
  };
};

/**
 * Hook legacy - maintenu pour compatibilité
 * Retourne undefined (pas de push token distant)
 */
export async function registerForPushNotificationsAsync() {
  console.log(
    '⚠️ Les notifications push distantes ne sont plus supportées dans Expo Go (SDK 53+).\n' +
    'Utilisez useLocalNotifications() pour les notifications locales.'
  );
  return undefined;
}