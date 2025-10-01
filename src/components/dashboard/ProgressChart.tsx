import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { useLearningData } from '../../hooks/useLearningData';

interface ProgressChartProps {
  data: Array<{
    date: string;
    problems: number;
    timeSpent: number;
  }>;
  period: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, period }) => {
  const { darkMode } = useTheme();
  const { learningSessions, userActivity } = useLearningData();
  
  const [activeDataKey, setActiveDataKey] = React.useState('problems');
  
  // Generate dynamic data based on period and actual user data
  const getDataForPeriod = () => {
    const now = new Date();
    let chartData: Array<{ date: string; problems: number; timeSpent: number }> = [];

    switch (period) {
      case 'week':
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          // Find activity for this date
          const activity = userActivity.find(a => a.activity_date === dateStr);
          const sessions = learningSessions.filter(s => s.session_date === dateStr);
          
          const problems = activity?.problems_solved || 0;
          const timeSpent = sessions.reduce((total, session) => total + session.duration_minutes, 0);
          
          chartData.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            problems,
            timeSpent
          });
        }
        break;
        
      case 'month':
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const endDate = new Date(now);
          endDate.setDate(endDate.getDate() - (i * 7));
          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 6);
          
          // Aggregate data for the week
          let weekProblems = 0;
          let weekTimeSpent = 0;
          
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const activity = userActivity.find(a => a.activity_date === dateStr);
            const sessions = learningSessions.filter(s => s.session_date === dateStr);
            
            weekProblems += activity?.problems_solved || 0;
            weekTimeSpent += sessions.reduce((total, session) => total + session.duration_minutes, 0);
          }
          
          chartData.push({
            date: `Week ${4 - i}`,
            problems: weekProblems,
            timeSpent: weekTimeSpent
          });
        }
        break;
        
      case 'year':
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          
          // Aggregate data for the month
          let monthProblems = 0;
          let monthTimeSpent = 0;
          
          for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const activity = userActivity.find(a => a.activity_date === dateStr);
            const sessions = learningSessions.filter(s => s.session_date === dateStr);
            
            monthProblems += activity?.problems_solved || 0;
            monthTimeSpent += sessions.reduce((total, session) => total + session.duration_minutes, 0);
          }
          
          chartData.push({
            date: date.toLocaleDateString('en-US', { month: 'short' }),
            problems: monthProblems,
            timeSpent: Math.floor(monthTimeSpent / 60) // Convert to hours for yearly view
          });
        }
        break;
        
      default:
        chartData = data.length > 0 ? data : [
          { date: 'Today', problems: 0, timeSpent: 0 }
        ];
    }

    return chartData;
  };

  const chartData = getDataForPeriod();
  
  return (
    <div>
      <div className="flex items-center justify-start mb-4 space-x-4">
        <button
          onClick={() => setActiveDataKey('problems')}
          className={`flex items-center text-sm font-medium px-3 py-1 rounded-full transition-colors ${
            activeDataKey === 'problems' 
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
          Problems Solved
        </button>
        
        <button
          onClick={() => setActiveDataKey('timeSpent')}
          className={`flex items-center text-sm font-medium px-3 py-1 rounded-full transition-colors ${
            activeDataKey === 'timeSpent' 
              ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
          Time Spent ({period === 'year' ? 'hours' : 'min'})
        </button>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            stroke={darkMode ? '#9ca3af' : '#6b7280'} 
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            stroke={darkMode ? '#9ca3af' : '#6b7280'} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderColor: darkMode ? '#374151' : '#e5e7eb',
              color: darkMode ? '#f9fafb' : '#111827',
              borderRadius: '8px',
            }}
            labelStyle={{ color: darkMode ? '#f9fafb' : '#111827' }}
          />
          {activeDataKey === 'problems' && (
            <Line
              type="monotone"
              dataKey="problems"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }}
              activeDot={{ r: 7, fill: '#4f46e5', strokeWidth: 0 }}
            />
          )}
          {activeDataKey === 'timeSpent' && (
            <Line
              type="monotone"
              dataKey="timeSpent"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={{ r: 5, fill: '#14b8a6', strokeWidth: 0 }}
              activeDot={{ r: 7, fill: '#0d9488', strokeWidth: 0 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;