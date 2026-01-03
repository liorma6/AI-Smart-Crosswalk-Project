import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-full shadow-2xl">
              <AlertCircle className="text-white" size={64} />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 animate-pulse">
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          הדף לא נמצא
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          מצטערים, הדף שאתה מחפש לא קיים במערכת. ייתכן שהוא הוסר, שונה או שהכתובת שגויה.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <Home size={20} />
            חזרה לדף הבית
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-bold shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-200"
          >
            <ArrowLeft size={20} />
            חזור אחורה
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">דפים מומלצים:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            >
              לוח בקרה
            </button>
            <button
              onClick={() => navigate('/crosswalks')}
              className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
            >
              מעברי חצייה
            </button>
            <button
              onClick={() => navigate('/statistics')}
              className="px-4 py-2 text-sm bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition"
            >
              סטטיסטיקות
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full opacity-10 animate-bounce"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full opacity-10 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-pink-300 rounded-full opacity-10 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

