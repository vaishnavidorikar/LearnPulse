import React, { useState, useEffect } from 'react';
import { Trophy, Users, Crown, Medal, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import Avatar from '../ui/Avatar';
import LoadingSpinner from '../ui/LoadingSpinner';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  score: number;
  rank_position: number;
  profile: {
    full_name: string;
    avatar_url?: string;
  };
}

const LeaderboardCard: React.FC = () => {
  const { darkMode } = useTheme();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all_time'>('monthly');

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Calculate period dates
      const now = new Date();
      let periodStart: Date;
      let periodEnd: Date;

      switch (period) {
        case 'weekly':
          periodStart = new Date(now);
          periodStart.setDate(now.getDate() - now.getDay()); // Start of week
          periodEnd = new Date(periodStart);
          periodEnd.setDate(periodStart.getDate() + 6); // End of week
          break;
        case 'monthly':
          periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
          periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'all_time':
          periodStart = new Date('2020-01-01');
          periodEnd = new Date();
          break;
      }

      // First, get all users with their total XP as score
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, total_xp')
        .order('total_xp', { ascending: false })
        .limit(10);

      if (profilesError) throw profilesError;

      // Transform profiles into leaderboard entries
      const leaderboardData: LeaderboardEntry[] = profiles?.map((profile, index) => ({
        id: `${profile.id}-${period}`,
        user_id: profile.id,
        score: profile.total_xp,
        rank_position: index + 1,
        profile: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        }
      })) || [];

      // Update or insert leaderboard entries
      for (const entry of leaderboardData) {
        await supabase
          .from('leaderboard_entries')
          .upsert({
            user_id: entry.user_id,
            score: entry.score,
            rank_position: entry.rank_position,
            period_type: period,
            period_start: periodStart.toISOString().split('T')[0],
            period_end: periodEnd.toISOString().split('T')[0]
          }, {
            onConflict: 'user_id,period_type,period_start'
          });
      }

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={20} />;
      case 2:
        return <Medal className="text-gray-400" size={20} />;
      case 3:
        return <Award className="text-amber-600" size={20} />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return darkMode ? 'bg-yellow-900/30 border-yellow-800' : 'bg-yellow-50 border-yellow-200';
      case 2:
        return darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200';
      case 3:
        return darkMode ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200';
      default:
        return darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm h-full flex items-center justify-center`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm h-full`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🏆 Leaderboard
        </h2>
        <Users className="text-indigo-500" size={20} />
      </div>

      {/* Period Selector */}
      <div className="flex space-x-1 mb-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {(['weekly', 'monthly', 'all_time'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              period === p
                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {p === 'all_time' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="space-y-3">
        {leaderboard.length > 0 ? (
          leaderboard.map((entry) => (
            <div 
              key={entry.id} 
              className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${getRankBg(entry.rank_position)}`}
            >
              <div className="flex items-center justify-center w-8 h-8 mr-3">
                {getRankIcon(entry.rank_position)}
              </div>
              
              <div className="flex-1 flex items-center">
                <Avatar 
                  src={entry.profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.profile.full_name)}&background=random`} 
                  alt={entry.profile.full_name} 
                  size="sm" 
                />
                <div className="ml-3 flex-1 min-w-0">
                  <span className={`text-sm font-medium truncate block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {entry.profile.full_name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Rank #{entry.rank_position}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                {entry.rank_position <= 3 && (
                  <Trophy className="mr-1 text-amber-500" size={14} />
                )}
                <span className={`text-sm font-semibold ${
                  entry.rank_position === 1
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : entry.rank_position === 2
                      ? 'text-gray-600 dark:text-gray-400'
                      : entry.rank_position === 3
                        ? 'text-amber-600 dark:text-amber-400'
                        : darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {entry.score.toLocaleString()} XP
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Trophy className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No rankings yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Start learning to appear on the leaderboard!
            </p>
          </div>
        )}
      </div>
      
      <button 
        onClick={fetchLeaderboard}
        className="mt-4 w-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
      >
        🔄 Refresh Rankings
      </button>
    </div>
  );
};

export default LeaderboardCard;