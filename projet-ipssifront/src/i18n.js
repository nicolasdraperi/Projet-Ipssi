import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "settings": "Settings",
      "theme": "Theme",
      "language": "Language",
      "reset": "Reset Settings"
    }
  },
  fr: {
    translation: {
      "settings": "Paramètres",
      "theme": "Thème",
      "language": "Langue",
      "reset": "Réinitialiser les paramètres"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fr",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
