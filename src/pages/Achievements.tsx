import React, { useState } from 'react';
import { Badge, Trophy, Star, Zap, Target, Clock, BookOpen, Award, Search, X } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import BadgeDisplay from '../components/achievements/BadgeDisplay';

const Achievements = () => {
  const { userAchievements, getEarnedCount, getTotalCount } = useProgress();
  const { user } = useUser();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = [
    { id: 'all', label: 'All', icon: <Trophy size={16} /> },
    { id: 'streak', label: 'Streaks', icon: <Zap size={16} /> },
    { id: 'problem', label: 'Problems', icon: <Target size={16} /> },
    { id: 'time', label: 'Time', icon: <Clock size={16} /> },
    { id: 'course', label: 'Courses', icon: <BookOpen size={16} /> },
    { id: 'milestone', label: 'Milestones', icon: <Star size={16} /> },
  ];
  
  // Generate dynamic achievements based on user progress
  const generateDynamicAchievements = () => {
    const userProgress = {
      problemsSolved: user?.problems_solved || 0,
      studyTime: user?.total_study_time || 0,
      currentStreak: user?.current_streak || 0,
      coursesCompleted: user?.courses_completed || 0,
      totalXP: user?.total_xp || 0
    };

    const futureAchievements = [
      {
        id: 'future-1',
        title: 'Problem Solver Pro',
        description: 'Solve 100 coding problems',
        category: 'problem',
        icon: '🎯',
        earned: false,
        progress: userProgress.problemsSolved,
        requiredProgress: 100,
        xpReward: 500
      },
      {
        id: 'future-2',
        title: 'Study Marathon',
        description: 'Study for 50 hours total',
        category: 'time',
        icon: '⏰',
        earned: false,
        progress: Math.floor(userProgress.studyTime / 60),
        requiredProgress: 50,
        xpReward: 750
      },
      {
        id: 'future-3',
        title: 'Streak Legend',
        description: 'Maintain a 30-day learning streak',
        category: 'streak',
        icon: '🔥',
        earned: false,
        progress: userProgress.currentStreak,
        requiredProgress: 30,
        xpReward: 1000
      },
      {
        id: 'future-4',
        title: 'Course Master',
        description: 'Complete 10 courses',
        category: 'course',
        icon: '📚',
        earned: false,
        progress: userProgress.coursesCompleted,
        requiredProgress: 10,
        xpReward: 1500
      },
      {
        id: 'future-5',
        title: 'XP Champion',
        description: 'Earn 5000 total XP',
        category: 'milestone',
        icon: '⭐',
        earned: false,
        progress: userProgress.totalXP,
        requiredProgress: 5000,
        xpReward: 2000
      },
      {
        id: 'future-6',
        title: 'Speed Learner',
        description: 'Complete 5 lessons in one day',
        category: 'milestone',
        icon: '⚡',
        earned: false,
        progress: 0,
        requiredProgress: 5,
        xpReward: 300
      }
    ];

    return futureAchievements;
  };

  const dynamicAchievements = generateDynamicAchievements();
  
  // Combine user achievements with dynamic ones
  const allAchievements = [
    ...userAchievements.map(ua => ({
      id: ua.achievement?.id || ua.id,
      title: ua.achievement?.title || 'Unknown Achievement',
      description: ua.achievement?.description || '',
      category: ua.achievement?.category || 'general',
      icon: ua.achievement?.icon || '🏆',
      earned: ua.is_earned || false,
      progress: ua.progress || 0,
      requiredProgress: ua.achievement?.required_value || 1,
      xpReward: ua.achievement?.xp_reward || 0,
      earnedAt: ua.earned_at ? new Date(ua.earned_at).toLocaleDateString() : undefined
    })),
    ...dynamicAchievements
  ];

  // Sort achievements: earned first, then by progress percentage
  const sortedAchievements = allAchievements.sort((a, b) => {
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    
    if (a.earned && b.earned) {
      // Both earned, sort by earned date (most recent first)
      if (a.earnedAt && b.earnedAt) {
        return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
      }
      return 0;
    }
    
    // Both not earned, sort by progress percentage
    const aProgress = (a.progress / a.requiredProgress) * 100;
    const bProgress = (b.progress / b.requiredProgress) * 100;
    return bProgress - aProgress;
  });

  // Filter achievements based on active tab and search term
  const filteredAchievements = sortedAchievements.filter(achievement => {
    const matchesCategory = activeTab === 'all' || achievement.category === activeTab;
    const matchesSearch = searchTerm === '' || 
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  const earnedCount = getEarnedCount();
  const totalCount = allAchievements.length;
  const percentComplete = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent`}>
            🏆 Achievements
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Track your learning milestones and unlock new badges
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className={`flex items-center px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} w-full max-w-xs relative`}>
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`ml-2 flex-1 outline-none border-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              >
                <X size={14} className="text-gray-500" />
              </button>
            )}
          </div>
          
          {/* Progress Stats */}
          <div className={`flex items-center space-x-4 px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center">
              <Award className="text-amber-500 mr-2" size={20} />
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {earnedCount}/{totalCount} Earned
              </span>
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center">
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300" 
                  style={{ width: `${percentComplete}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {percentComplete}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`p-1 rounded-lg flex flex-wrap md:inline-flex ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium m-1 transition-colors
              ${activeTab === category.id 
                ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-300' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAchievements.map((achievement) => (
          <BadgeDisplay 
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <Trophy className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No achievements found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try a different search term' : 'Keep learning to unlock new achievements!'}
          </p>
        </div>
      )}

      {/* Achievement Progress Summary */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🎯 Your Progress
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {user?.problems_solved || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Problems Solved</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.floor((user?.total_study_time || 0) / 60)}h
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Study Time</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {user?.current_streak || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Current Streak</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {user?.total_xp || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total XP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;