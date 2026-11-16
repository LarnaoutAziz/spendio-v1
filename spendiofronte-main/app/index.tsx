import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

// 🔔 Configuration globale des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const { user, loading } = useAuth();

  console.log('🔐 [AUTH] Vérification:', { loading, user: user?.email });

  useEffect(() => {
    /**
     * 🔔 Configuration des notifications locales
     * - Crée le canal Android
     * - Configure les listeners
     */
    const setupNotifications = async () => {
      try {
        // 📱 Créer/configurer le canal de notification Android
        console.log('🔧 [NOTIFICATIONS] Configuration du canal Android...');
        
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Notifications',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FFB6D9', // Rose bébé
          sound: 'default',
          bypassDnd: false,
          enableVibrate: true,
          enableLights: true,
        });
        
        console.log('✅ [NOTIFICATIONS] Canal Android configuré');
      } catch (error: any) {
        console.log('ℹ️ [NOTIFICATIONS] Canal déjà configuré ou en mode web');
      }
    };

    // Configurer les notifications
    setupNotifications();

    // 👂 Listener 1: Notification reçue en arrière-plan
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📬 [NOTIFICATIONS] Reçue:', {
          title: notification.request.content.title,
          body: notification.request.content.body,
          timestamp: new Date().toISOString(),
        });
      }
    );

    // 👂 Listener 2: Utilisateur appuie sur la notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('👆 [NOTIFICATIONS] Utilisateur a tapé:', {
          title: response.notification.request.content.title,
          timestamp: new Date().toISOString(),
        });
        // Tu peux ajouter ici une navigation spécifique si besoin
      }
    );

    // Cleanup des listeners
    return () => {
      console.log('🧹 [NOTIFICATIONS] Nettoyage des listeners');
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // ⏳ Pendant le chargement
  if (loading) {
    console.log('⏳ [AUTH] Chargement en cours...');
    return null;
  }

  // ✅ Si connecté, aller au drawer
  if (user) {
    console.log('✅ [AUTH] Utilisateur connecté, redirection vers /drawer');
    return <Redirect href="/drawer" />;
  }

  // ❌ Sinon, aller au login
  console.log('❌ [AUTH] Pas d\'utilisateur, redirection vers /login');
  return <Redirect href="/login" />;
}
