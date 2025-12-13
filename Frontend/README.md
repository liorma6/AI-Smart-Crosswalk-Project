# Smart Crosswalk AI - Frontend

פרונטאנד למערכת Smart Crosswalk AI בנוי עם React, Vite ו-Tailwind CSS.

## דרישות מקדימות

- Node.js 18+
- npm או yarn

## התקנה

```bash
npm install
```

## הרצה במצב פיתוח

### הרצת הפרונטאנד (מחובר ל-API אמיתי)

```bash
npm run dev
```

המערכת תרוץ על `http://localhost:5173` ותתחבר אוטומטית לבאקאנד על `http://localhost:3000`.

### דרישות להרצה מוצלחת:

1. **הבאקאנד חייב לרוץ על פורט 3000:**
   ```bash
   cd ../Backend
   PORT=3000 MONGO_URI="mongodb+srv://app_user:smartcross123@cluster0.cozip.mongodb.net/SmartCrosswalkDB?appName=Cluster0" npm start
   ```

2. **הפרונטאנד משתמש ב-Proxy:**
   - כל קריאה ל-`/api/*` מועברת אוטומטית ל-`http://localhost:3000`
   - ראה הגדרות ב-[vite.config.js](vite.config.js:7-14)

### חזרה ל-Mock Data (לפיתוח ללא Backend)

אם תרצה לעבוד עם נתונים מדומים ללא חיבור לבאקאנד:

1. ערוך את [Dashboard.jsx](src/components/Dashboard.jsx:2):
   ```javascript
   // שנה מ:
   import { fetchDashboardData } from "../services/api";

   // ל:
   import { getDashboardData as fetchDashboardData } from "./mockData";
   ```

2. זהו! אין צורך לשנות דבר נוסף - ה-interface זהה

## מבנה הפרויקט

```
Frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # קומפוננטת הדשבורד הראשית
│   │   └── mockData.js        # נתונים מדומים לפיתוח
│   ├── services/
│   │   └── api.js             # פונקציות API לחיבור לבאקאנד
│   ├── App.jsx                # קומפוננטת האפליקציה הראשית
│   ├── main.jsx               # נקודת הכניסה
│   └── index.css              # סגנונות גלובליים
├── vite.config.js             # הגדרות Vite (כולל proxy)
└── package.json
```

## API Endpoints

הפרונטאנד תומך ב-API endpoints הבאים (ראה `src/services/api.js`):

- `GET /api/dashboard` - נתוני דשבורד מלאים
- `GET /api/crosswalks` - כל מעברי החצייה
- `GET /api/crosswalks/:id/alerts` - התראות למעבר חצייה ספציפי
- `GET /api/alerts?limit=10` - התראות אחרונות
- `POST /api/alerts` - יצירת התראה חדשה
- `POST /api/crosswalks/:id/led/activate` - הפעלת LED

## התאמה למודלים של Backend

### Crosswalk Model
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "Allenby-Rothschild Junction",
  location: { lat: 32.0853, lng: 34.7818 },
  status: "active", // active | maintenance | inactive
  ledSystemUrl: "http://192.168.1.100/led"
}
```

### Alert Model
```javascript
{
  _id: "alert_123",
  crosswalkId: "507f1f77bcf86cd799439011",
  imageUrl: "/images/alert_1.jpg",
  description: "Pedestrian detected approaching crosswalk",
  detectionDistance: 2.4, // optional
  detectedObjectsCount: 3, // default: 1
  ledActivated: true,
  isHazard: false,
  timestamp: "2024-01-15T14:32:15.000Z"
}
```

## תכונות

- ✅ **Real-time Updates** - עדכון אוטומטי כל 3 שניות
- ✅ **Responsive Design** - תומך במסכי מובייל, טאבלט ודסקטופ
- ✅ **Interactive Maps** - מפות מיני אינטראקטיביות לכל מעבר חצייה
- ✅ **Image Preview** - תצוגה מקדימה של תמונות מהמצלמות
- ✅ **Hazard Highlighting** - הדגשת אירועים מסוכנים
- ✅ **LED Status** - מעקב אחר מצב LED
- ✅ **Live Statistics** - גרפים דינמיים
- ✅ **Location Tracking** - מיקום גיאוגרפי מדויק על מפת OpenStreetMap

## Build לפרודקשן

```bash
npm run build
```

הקבצים ייווצרו בתיקיית `dist/`.

## Environment Variables

ניתן להגדיר את כתובת ה-API דרך משתני סביבה:

```bash
# .env.development
VITE_API_URL=http://localhost:3000/api

# .env.production
VITE_API_URL=https://api.smartcrosswalk.com/api
```

ואז ב-`api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

## טיפים לפיתוח

1. **Hot Reload** - השינויים יופיעו אוטומטית במהלך הפיתוח
2. **Console Logs** - בדוק את ה-console לשגיאות או warnings
3. **Network Tab** - השתמש ב-DevTools → Network לבדיקת קריאות API
4. **Mock Data** - ניתן לשנות את `mockData.js` לבדיקת מצבים שונים

## טיפול בתמונות

### איך התמונות עובדות:

1. **מהבאקאנד**: ה-`imageUrl` מה-API יכול להיות:
   - נתיב מלא: `http://backend.com/uploads/alert.jpg`
   - נתיב יחסי: `/images/alert.jpg` → מומר ל-`http://localhost:3000/images/alert.jpg`
   - Data URI: `data:image/jpeg;base64,...`

2. **פונקציית `getImageUrl()`** ב-[api.js](src/services/api.js:8-25) מטפלת בכל המקרים:
   ```javascript
   import { getImageUrl } from '../services/api';

   <img src={getImageUrl(event.imageUrl)} alt="Alert" />
   ```

3. **Fallback**: אם התמונה לא נטענת, מוצג "No preview"

### הוספת תמונות לפיתוח:

צור תיקייה בבאקאנד:
```bash
mkdir -p Backend/public/images
# העתק תמונות לתיקייה הזו
```

או השתמש בשירות ענן כמו Cloudinary/AWS S3 לתמונות.

## חיבור MongoDB (Backend)

הבאקאנד מתחבר ל-MongoDB עם:
```
MONGO_URI="mongodb+srv://app_user:smartcross123@cluster0.cozip.mongodb.net/SmartCrosswalkDB?appName=Cluster0"
PORT=3000
```

ודא שהבאקאנד רץ על פורט 3000 כדי שה-proxy של Vite יעבוד נכון.
