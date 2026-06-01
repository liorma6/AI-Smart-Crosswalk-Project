# Database Seeding Script

קובץ seed.js מאכלס את מסד הנתונים MongoDB בנתונים ראשוניים.

## 🚀 איך להריץ

### שלב 1: ודא שיש קובץ .env בתיקיית Backend

הקובץ צריך להכיל:
```env
# Keep the real MongoDB connection string and any local port override only in Backend/.env.
# Do not copy production credentials into documentation or source control.
```

### שלב 2: התקן dependencies (פעם אחת)

```bash
cd Tests/BackTests
npm install
```

### שלב 3: הרץ את הסקריפט

```bash
npm run seed
```

או ישירות:
```bash
node seed.js
```

## 📊 מה הסקריפט עושה

1. **מתחבר ל-MongoDB** באמצעות ה-connection string מ-.env
2. **מנקה נתונים קיימים** (Alert, Crosswalk)
3. **יוצר 3 מעברי חצייה**:
   - Holon, Sokolov 48 (active)
   - Holon, Shenkar 12 (active)
   - Holon, Pinhas Lavon 2 (maintenance)
4. **יוצר 4 alerts**:
   - Pedestrian waiting on edge
   - Bicycle crossing fast
   - Group of children
   - False Alarm - Small Animal

## ✅ פלט צפוי

```
[System] Connected to MongoDB via Backend Config.
[System] Old data cleared.
[System] Created 3 Crosswalks.
[System] Created 4 Alerts.
[System] Seeding process completed successfully.
```

## ⚠️ פתרון בעיות

### שגיאה: Cannot find module

**פתרון:**
```bash
npm install
```

### שגיאה: MongoDB connection string is not defined

**פתרון:**
ודא שיש קובץ `.env` ב-`Backend/` עם מחרוזת חיבור תקינה ל-MongoDB.
```
Backend/.env
```

### שגיאה: Failed to connect to MongoDB

**פתרון:**
1. בדוק את ה-connection string
2. ודא שיש חיבור לאינטרנט
3. ודא שה-IP שלך מורשה ב-MongoDB Atlas

## 📁 מבנה הקבצים

```
Tests/BackTests/
├── seed.js           # הסקריפט עצמו
├── index.js          # קובץ טסט אחר
├── package.json      # הגדרות npm
└── README.md         # המדריך הזה
```

## 🔗 קישורים למודלים

הסקריפט משתמש במודלים מ:
- `Backend/models/Crosswalk.js`
- `Backend/models/Alert.js`
- `Backend/config/db.js`

## 💡 טיפים

- הרץ את הסקריפט כל פעם שאתה רוצה לאפס את מסד הנתונים
- התמונות בשדה `imageUrl` הן URLs חיצוניים
- אפשר לערוך את הנתונים ב-`seed.js` לפני ההרצה
