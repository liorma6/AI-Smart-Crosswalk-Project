# 🚀 Smart Crosswalk - Quick Start Guide

## הרצת המערכת המלאה (Backend + Frontend)

### 📋 דרישות מקדימות

- Node.js 18+ מותקן
- חיבור לאינטרנט (ל-MongoDB Atlas)

---

## 🎯 הפעלה מהירה (3 שלבים)

### שלב 1️⃣: אכלוס מסד הנתונים (פעם אחת)

```bash
cd Tests/BackTests
npm install
npm run seed
```

**פלט צפוי:**
```
[System] Connected to MongoDB via Backend Config.
[System] Old data cleared.
[System] Created 3 Crosswalks.
[System] Created 4 Alerts.
[System] Seeding process completed successfully.
```

---

### שלב 2️⃣: הפעלת הבאקאנד

פתח terminal חדש:

```bash
cd Backend
npm install  # פעם ראשונה בלבד
npm start
```

**פלט צפוי:**
```
[dotenv@17.2.3] injecting env
[System] MongoDB Connected: cluster0...
Server is running on http://localhost:3000
```

✅ **הבאקאנד רץ על:** `http://localhost:3000`

---

### שלב 3️⃣: הפעלת הפרונטאנד

פתח terminal שני:

```bash
cd Frontend
npm install  # פעם ראשונה בלבד
npm run dev
```

**פלט צפוי:**
```
VITE ready in XXX ms

➜  Local:   http://localhost:5173/
```

✅ **הפרונטאנד רץ על:** `http://localhost:5173`

---

## 🌐 גישה למערכת

פתח דפדפן וגלוש ל:
```
http://localhost:5173
```

תראה:
- 📊 Dashboard עם נתונים חיים
- 🗺️ מפות למעברי חצייה
- 📷 תמונות מהתראות
- 💡 סטטוס LED
- ⚠️ התראות סכנה

---

## 🔧 API Endpoints זמינים

### Frontend → Backend

| Endpoint | שיטה | תיאור |
|----------|------|-------|
| `/api/dashboard` | GET | כל נתוני הדשבורד |
| `/crosswalks` | GET | כל מעברי החצייה |
| `/alerts` | GET | כל ההתראות |
| `/ai/alerts` | POST | יצירת התראה חדשה |

---

## 📊 נתונים במערכת

### מעברי חצייה (3):
1. 📍 **Holon, Sokolov 48** - Active
2. 📍 **Holon, Shenkar 12** - Active
3. 📍 **Holon, Pinhas Lavon 2** - Maintenance

### התראות (4):
1. 🚶 Pedestrian waiting on edge
2. 🚴 Bicycle crossing fast
3. 👨‍👩‍👧‍👦 Group of children
4. 🐕 False Alarm - Small Animal

---

## ⚙️ משתני סביבה

### Backend/.env (כבר קיים):
```env
MONGO_URI=mongodb+srv://app_user:smartcross123@cluster0.cozip.mongodb.net/SmartCrosswalkDB?appName=Cluster0
PORT=3000
```

---

## 🔍 בדיקת חיבור

### בדיקת Backend:
```bash
curl http://localhost:3000/
```

תשובה:
```
AI Smart Crosswalk Backend is Running (Refactored Structure).
```

### בדיקת Dashboard API:
```bash
curl http://localhost:3000/api/dashboard
```

תשובה: JSON עם crosswalks, recentEvents, stats

---

## 🐛 פתרון בעיות

### בעיה: Port 3000 תפוס
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### בעיה: Frontend לא מתחבר לבאקאנד
1. ודא שהבאקאנד רץ על פורט 3000
2. בדוק Console בדפדפן (F12) לשגיאות
3. בדוק Network Tab לקריאות API

### בעיה: MongoDB Connection Error
1. בדוק חיבור לאינטרנט
2. ודא שה-MONGO_URI נכון ב-`.env`
3. ודא שה-IP שלך מורשה ב-MongoDB Atlas

---

## 📁 מבנה הפרויקט

```
AI-Smart-Crosswalk-Project/
├── Backend/
│   ├── server.js              # שרת Express
│   ├── config/db.js           # חיבור MongoDB
│   ├── models/
│   │   ├── Crosswalk.js
│   │   └── Alert.js
│   ├── routes/
│   │   ├── dashboardRoutes.js # נוסף!
│   │   ├── crosswalkRoutes.js
│   │   └── alertRoutes.js
│   └── .env                   # משתני סביבה
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx  # מחובר ל-API
│   │   │   ├── MiniMap.jsx    # מפות
│   │   │   └── mockData.js
│   │   ├── services/
│   │   │   └── api.js         # API calls
│   │   └── index.css
│   └── vite.config.js         # Proxy config
└── Tests/BackTests/
    ├── seed.js                # אכלוס DB
    └── package.json
```

---

## 🎉 סיימת!

המערכת מוכנה לשימוש. עכשיו אתה יכול:

1. ✅ לראות נתונים חיים מ-MongoDB
2. ✅ להוסיף התראות חדשות (POST /ai/alerts)
3. ✅ להוסיף מעברי חצייה חדשים
4. ✅ לראות הכל בממשק יפה ואינטראקטיבי

---

## 📞 עזרה נוספת

- **Backend Docs:** `Backend/README.md`
- **Frontend Docs:** `Frontend/README.md`
- **Deployment:** `Frontend/DEPLOYMENT.md`
- **Seed Docs:** `Tests/BackTests/README.md`

**תהנה! 🚀**
