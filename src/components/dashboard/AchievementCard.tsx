import React from 'react';
import { Award, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface AchievementCardProps {
  recentAchievements: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
  }>;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ recentAchievements }) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const handleViewAllAchievements = () => {
    navigate('/achievements');
  };
  
  return (
    <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🏆 Recent Achievements
        </h2>
        <Award className="text-amber-500" size={20} />
      </div>
      
      <div className="space-y-4">
        {recentAchievements.length > 0 ? (
          recentAchievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                  <Award size={20} />
                </div>
                
                <div className="ml-3 flex-1">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                🎉 Earned {achievement.earnedAt}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No achievements yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Keep learning to unlock your first achievement!
            </p>
          </div>
        )}
      </div>
      
      <button 
        onClick={handleViewAllAchievements}
        className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
      >
        View All Achievements <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
};

export default AchievementCard;