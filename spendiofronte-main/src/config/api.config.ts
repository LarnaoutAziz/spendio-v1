// Configuration API centralisée
// Change cette valeur selon votre environnement

export const API_CONFIG = {
  // 🌐 URL Publique Clever Cloud (Production) ✅ ACTIVE
  BASE_URL: 'https://app-92fbc2c7-21cc-4f40-beb1-ff76864f76f9.cleverapps.io/api',

  // 📝 Autres configurations (pour référence):
  // ✅ Configuration LOCALE pour développement:
  // BASE_URL: 'http://192.168.1.36:5000/api',
  //
  // ⚙️ Pour ÉMULATEUR ANDROID:
  // BASE_URL: 'http://10.0.2.2:5000/api',
  //
  // 🏭 Pour développement sur même machine:
  // BASE_URL: 'http://localhost:5000/api',
};

// Fonction utilitaire pour déterminer la bonne URL selon l'environnement
export const getAPIURL = () => {
  // À adapter selon tes besoins:
  // - Si sur émulateur Android et ça ne marche pas: remplace par 10.0.2.2
  // - Si sur vrai device: utilise l'IP locale
  // - Si sur web/localhost: utilise localhost
  
  return API_CONFIG.BASE_URL;
};

