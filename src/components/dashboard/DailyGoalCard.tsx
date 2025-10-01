import React, { useState } from 'react';
import { Target, CheckCircle, Plus, Edit, X, Save, Trash2, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { useUser } from '../../context/UserContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const DailyGoalCard: React.FC = () => {
  const { darkMode } = useTheme();
  const { dailyGoals, goalsLoading, completeGoal, createGoal, updateGoalProgress, deleteGoal } = useProgress();
  const { updateProgress } = useUser();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: 1
  });

  const handleToggleGoal = async (goalId: string, isCompleted: boolean) => {
    if (isCompleted) {
      // Delete completed goal
      await deleteGoal(goalId);
    } else {
      // Complete the goal
      await completeGoal(goalId);
      // Award some XP for completing a goal
      await updateProgress(0, 0, 25);
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoal.title.trim()) return;
    
    await createGoal(newGoal.title, newGoal.description, newGoal.target);
    setNewGoal({ title: '', description: '', target: 1 });
    setShowCreateForm(false);
  };

  const handleEditGoal = (goalId: string) => {
    setEditingGoal(goalId);
  };

  const handleSaveEdit = async (goalId: string, newTitle: string) => {
    // In a real app, you'd have an updateGoal function
    setEditingGoal(null);
  };

  const predefinedGoals = [
    { title: 'Solve 5 Problems', description: 'Complete 5 coding problems', target: 5 },
    { title: 'Study 45 Minutes', description: 'Spend 45 minutes learning', target: 45 },
    { title: 'Complete 2 Lessons', description: 'Finish 2 course lessons', target: 2 },
    { title: 'Watch 3 Videos', description: 'Watch 3 educational videos', target: 3 },
    { title: 'Practice 30 Minutes', description: 'Practice coding for 30 minutes', target: 30 },
    { title: 'Read 1 Article', description: 'Read one technical article', target: 1 },
    { title: 'Complete 1 Quiz', description: 'Finish one quiz with 100% score', target: 1 },
    { title: 'Review Notes', description: 'Review previous lesson notes', target: 1 },
  ];

  if (goalsLoading) {
    return (
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex items-center justify-center`}>
        <LoadingSpinner />
      </div>
    );
  }

  const completed = dailyGoals.filter(goal => goal.is_completed).length;
  const total = dailyGoals.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🎯 Daily Goals
        </h2>
        <div className="flex items-center space-x-2">
          <Target className="text-indigo-500" size={20} />
          <button
            onClick={() => setShowCreateForm(true)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {completed}/{total}
          </span>
        </div>
        
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
          {dailyGoals.map((goal) => (
            <div key={goal.id} className="flex items-center group">
              <button
                onClick={() => handleToggleGoal(goal.id, goal.is_completed)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  goal.is_completed 
                    ? 'bg-green-500 border-green-500 text-white hover:bg-red-500 hover:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
                }`}
                title={goal.is_completed ? 'Click to remove goal' : 'Click to complete goal'}
              >
                {goal.is_completed ? <X size={12} /> : <Check size={12} className="opacity-0 group-hover:opacity-100" />}
              </button>
              
              <div className="ml-3 flex-1">
                {editingGoal === goal.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      defaultValue={goal.title}
                      className={`flex-1 text-sm px-2 py-1 rounded border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit(goal.id, e.currentTarget.value);
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(goal.id, '')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Save size={14} />
                    </button>
                    <button
                      onClick={() => setEditingGoal(null)}
                      className="text-gray-500 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        goal.is_completed 
                          ? 'text-gray-600 dark:text-gray-300 line-through' 
                          : 'text-gray-900 dark:text-white font-medium'
                      }`}>
                        {goal.title}
                      </span>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditGoal(goal.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit size={12} />
                        </button>
                        {goal.is_completed && (
                          <div className="text-green-600 dark:text-green-400">
                            <CheckCircle size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                    {goal.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {goal.description}
                      </p>
                    )}
                    <div className="mt-1 flex items-center">
                      <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{ width: `${Math.min(100, (goal.current_value / goal.target_value) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {goal.current_value}/{goal.target_value}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Create Goal Form */}
      {showCreateForm && (
        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ✨ Create New Goal
          </h4>
          
          {/* Predefined Goals */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick add:</p>
            <div className="grid grid-cols-2 gap-1">
              {predefinedGoals.map((goal, index) => (
                <button
                  key={index}
                  onClick={() => setNewGoal(goal)}
                  className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-left"
                >
                  {goal.title}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Goal title (e.g., Complete 3 lessons)"
              value={newGoal.title}
              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-3 py-2 text-sm rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
            />
            
            <input
              type="text"
              placeholder="Description (optional)"
              value={newGoal.description}
              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full px-3 py-2 text-sm rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
            />
            
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Target:</label>
              <input
                type="number"
                placeholder="1"
                value={newGoal.target}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                min="1"
                className={`w-20 px-3 py-2 text-sm rounded border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGoal}
              disabled={!newGoal.title.trim()}
              className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded transition-colors"
            >
              Create Goal
            </button>
          </div>
        </div>
      )}
      
      {completed === total && total > 0 ? (
        <div className="mt-6 px-4 py-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={16} />
            <p className="text-sm text-green-800 dark:text-green-300">
              🎉 Awesome! You've completed all your daily goals. +50 XP bonus!
            </p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setShowCreateForm(true)}
          className="mt-6 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
        >
          ➕ Add New Goal
        </button>
      )}
    </div>
  );
};

export default DailyGoalCard;