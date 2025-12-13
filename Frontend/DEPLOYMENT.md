# 🚀 Smart Crosswalk Frontend - Deployment Guide

## סיכום מהיר

הפרונטאנד **מחובר לבאקאנד אמיתי** ומוכן לשימוש מלא!

## 📋 מה שונה מהגרסה הקודמת

### ✅ שינויים שבוצעו:

1. **חיבור ל-API אמיתי**
   - החלפת Mock Data ב-API אמיתי
   - [Dashboard.jsx](src/components/Dashboard.jsx:2) משתמש ב-`fetchDashboardData` מ-[api.js](src/services/api.js)

2. **Proxy Configuration**
   - [vite.config.js](vite.config.js:7-14) מכיל proxy ל-`http://localhost:3000`
   - כל קריאה ל-`/api/*` מועברת אוטומטית לבאקאנד

3. **תמיכה בתמונות**
   - פונקציית `getImageUrl()` ממירה נתיבים יחסיים לכתובות מלאות
   - תמיכה ב-URLs מלאים, Data URIs, ונתיבים יחסיים

4. **מפות אינטראקטיביות**
   - קומפוננטת [MiniMap.jsx](src/components/MiniMap.jsx) עם Leaflet
   - כל מעבר חצייה מציג מפה מיני עם סמן צבעוני לפי סטטוס
   - סמנים: 🟢 Active | 🟠 Maintenance | 🔴 Inactive

5. **התאמה מלאה למודלים**
   - כל השדות מ-Crosswalk Model
   - כל השדות מ-Alert Model
   - טיפול נכון ב-optional fields (`detectionDistance`)
   - ברירות מחדל (`detectedObjectsCount = 1`)

## 🏃 הרצה מהירה

### שלב 1: הפעלת הבאקאנד

```bash
cd Backend
PORT=3000 MONGO_URI="mongodb+srv://app_user:smartcross123@cluster0.cozip.mongodb.net/SmartCrosswalkDB?appName=Cluster0" npm start
```

### שלב 2: הפעלת הפרונטאנד

```bash
cd Frontend
npm install  # פעם אחת
npm run dev
```

### שלב 3: גלוש ל:

```
http://localhost:5173
```

## 🗂️ מבנה הקבצים החדשים

```
Frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      ✨ מחובר ל-API
│   │   ├── MiniMap.jsx         🆕 מפות מיני
│   │   └── mockData.js         📦 גיבוי למצב פיתוח
│   ├── services/
│   │   └── api.js              🆕 שירותי API
│   └── index.css               ✨ + Leaflet styles
├── vite.config.js              ✨ + Proxy config
├── .env.example                🆕 דוגמת משתני סביבה
├── .gitignore                  ✨ + .env files
├── README.md                   ✨ עודכן
└── DEPLOYMENT.md               🆕 מדריך זה
```

## 📊 מבנה הנתונים (API Response)

### מהבאקאנד ל-Frontend:

```javascript
{
  crosswalks: [
    {
      _id: "507f1f77bcf86cd799439011",
      name: "Allenby-Rothschild Junction",
      location: { lat: 32.0853, lng: 34.7818 },
      status: "active",
      ledSystemUrl: "http://192.168.1.100/led"
    }
  ],
  recentEvents: [
    {
      id: "alert_123",
      time: "14:32:15",
      type: "Pedestrian",
      objectsCount: 3,
      location: "Allenby-Rothschild Junction",
      distance: "2.4m",
      ledActivated: true,
      isHazard: false,
      imageUrl: "/images/alert_1.jpg",
      description: "Pedestrian detected approaching crosswalk"
    }
  ],
  stats: [
    { name: "Detection Only", value: 70 },
    { name: "True Alert (LEDs)", value: 30 }
  ],
  currentUser: { name: "Israel Israeli", role: "Admin" }
}
```

## 🔧 פתרון בעיות

### בעיה: המפות לא נטענות

**פתרון:**
```bash
npm install react-leaflet leaflet
```

ווידוא שב-[index.css](src/index.css) יש:
```css
@import 'leaflet/dist/leaflet.css';
```

### בעיה: התמונות לא מוצגות

**פתרון:**
1. ווידוא שהבאקאנד משרת תמונות מ-`/images/` או `/uploads/`
2. או שימוש ב-URLs מלאים מ-Cloudinary/S3
3. בדיקת `getImageUrl()` ב-[api.js](src/services/api.js:8-25)

### בעיה: API Error / Network Error

**פתרון:**
1. ווידוא שהבאקאנד רץ על **פורט 3000**
2. בדיקת ה-proxy ב-[vite.config.js](vite.config.js:7-14)
3. פתיחת DevTools → Network → בדיקת קריאות ל-`/api/`

### בעיה: CORS Error

**פתרון:**
הוסף לבאקאנד:
```javascript
const cors = require('cors');
app.use(cors());
```

## 🔄 חזרה ל-Mock Data

אם תרצה לפתח בלי חיבור לבאקאנד:

1. ערוך [Dashboard.jsx](src/components/Dashboard.jsx:2):
```javascript
// שנה מ:
import { fetchDashboardData } from "../services/api";

// ל:
import { getDashboardData as fetchDashboardData } from "./mockData";
```

2. זהו! המערכת תעבוד עם נתונים מדומים.

## 📦 Dependencies חדשות

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^5.0.0"
  }
}
```

## 🌍 Environment Variables (אופציונלי)

צור קובץ `.env`:
```bash
VITE_API_URL=http://localhost:3000/api
```

ושנה ב-[api.js](src/services/api.js:1):
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

## ✨ תכונות פעילות

| תכונה | סטטוס | מיקום |
|-------|-------|-------|
| Real-time Updates | ✅ | Dashboard.jsx:44 |
| API Integration | ✅ | api.js |
| Interactive Maps | ✅ | MiniMap.jsx |
| Image Preview | ✅ | Dashboard.jsx:207-224 |
| Hazard Alerts | ✅ | Dashboard.jsx:193-195 |
| LED Status | ✅ | Dashboard.jsx:245-256 |
| Responsive Design | ✅ | Tailwind CSS |

## 🎯 הבא בתור (אופציונלי)

1. **WebSocket** - עדכונים בזמן אמת במקום polling
2. **PWA** - Progressive Web App למובייל
3. **Dark Mode** - מצב לילה
4. **Export Data** - ייצוא נתונים ל-CSV/PDF
5. **Notifications** - התראות דחיפה
6. **User Authentication** - התחברות משתמשים

## 📞 תמיכה

שאלות? בדוק את:
- [README.md](README.md) - תיעוד מלא
- [package.json](package.json) - dependencies
- Console בדפדפן - שגיאות JavaScript
- Network Tab - בעיות API

---

**מוכן לשימוש! 🚀**
