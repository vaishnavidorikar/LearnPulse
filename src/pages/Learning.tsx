import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { BarChart, BookOpen, CheckCircle, ChevronRight, Clock, Filter, Search, Star, Play, MapPin, ArrowRight, Brain, Zap, X } from 'lucide-react';
import CourseViewer from '../components/learning/CourseViewer';
import { useCourses } from '../hooks/useCourses';

const Learning = () => {
  const { userCourses, getRecommendedCourses, enrollInCourse } = useProgress();
  const { fetchCourseWithLessons, completeLesson, submitQuizAnswer } = useCourses();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('inProgress');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showCourseViewer, setShowCourseViewer] = useState(false);
  const [showPathDetails, setShowPathDetails] = useState<number | null>(null);
  
  const tabs = [
    { id: 'inProgress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'paths', label: 'Learning Paths' },
  ];
  
  const filteredCourses = activeTab === 'inProgress'
    ? userCourses.filter(userCourse => (userCourse.progress_percentage || 0) < 100)
    : activeTab === 'completed'
      ? userCourses.filter(userCourse => (userCourse.progress_percentage || 0) === 100)
      : [];
  
  const learningPaths = [
    {
      id: 1,
      title: 'Full Stack Web Development',
      description: 'Master frontend and backend development with modern technologies including React, Node.js, and databases',
      thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
      totalCourses: 5,
      completedCourses: 1,
      difficulty: 'Intermediate',
      estimatedTime: '120 hours',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
      features: ['Interactive Projects', 'Real-world Applications', 'Industry Mentorship'],
      courses: [
        { 
          id: 'web-1', 
          title: 'HTML & CSS Fundamentals', 
          duration: '8 hours', 
          completed: true,
          videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE',
          description: 'Learn the building blocks of web development'
        },
        { 
          id: 'web-2', 
          title: 'JavaScript Essentials', 
          duration: '12 hours', 
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg',
          description: 'Master JavaScript programming fundamentals'
        },
        { 
          id: 'web-3', 
          title: 'React Development', 
          duration: '15 hours', 
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM',
          description: 'Build modern user interfaces with React'
        },
        { 
          id: 'web-4', 
          title: 'Node.js Backend', 
          duration: '10 hours', 
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
          description: 'Create server-side applications with Node.js'
        },
        { 
          id: 'web-5', 
          title: 'Full Stack Project', 
          duration: '20 hours', 
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/98BzS5Oz5E4',
          description: 'Build a complete full-stack application'
        }
      ]
    },
    {
      id: 2,
      title: 'AI & Machine Learning Path',
      description: 'Learn artificial intelligence and machine learning from scratch with Python, TensorFlow, and practical projects',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
      totalCourses: 4,
      completedCourses: 0,
      difficulty: 'Advanced',
      estimatedTime: '80 hours',
      skills: ['Python', 'TensorFlow', 'Neural Networks', 'Data Science', 'Deep Learning'],
      features: ['Hands-on Projects', 'Industry Datasets', 'AI Model Deployment'],
      courses: [
        { 
          id: 'ai-1', 
          title: 'Python for AI', 
          duration: '15 hours', 
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
          description: 'Python programming for AI and ML'
        },
        { 
          id: 'ai-2', 
          title: 'Machine Learning Basics', 
          duration: '20 hours', 
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU',
          description: 'Fundamental ML algorithms and concepts'
        },
        { 
          id: 'ai-3', 
          title: 'Deep Learning with TensorFlow', 
          duration: '25 hours', 
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/tPYj3fFJGjk',
          description: 'Build neural networks with TensorFlow'
        },
        { 
          id: 'ai-4', 
          title: 'AI Project Portfolio', 
          duration: '20 hours', 
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
          description: 'Create real-world AI applications'
        }
      ]
    },
    {
      id: 3,
      title: 'Data Science Mastery',
      description: 'Complete data science workflow with Python, pandas, visualization, and statistical analysis',
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
      totalCourses: 3,
      completedCourses: 0,
      difficulty: 'Intermediate',
      estimatedTime: '60 hours',
      skills: ['Python', 'Pandas', 'Matplotlib', 'Statistics', 'SQL'],
      features: ['Real Data Projects', 'Statistical Analysis', 'Data Visualization'],
      courses: [
        { 
          id: 'ds-1', 
          title: 'Data Analysis with Python', 
          duration: '18 hours', 
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
          description: 'Analyze data using Python and pandas'
        },
        { 
          id: 'ds-2', 
          title: 'Statistical Methods', 
          duration: '15 hours', 
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/xxpc-HPKN28',
          description: 'Statistical analysis and hypothesis testing'
        },
        { 
          id: 'ds-3', 
          title: 'Data Visualization', 
          duration: '12 hours', 
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/UO98lJQ3QGI',
          description: 'Create compelling data visualizations'
        }
      ]
    }
  ];
  
  const recommendedCourses = getRecommendedCourses();

  const handleCourseClick = async (courseId: string) => {
    // First enroll the user in the course if not already enrolled
    await enrollInCourse(courseId);
    
    // Then fetch the course with lessons
    const courseWithLessons = await fetchCourseWithLessons(courseId);
    if (courseWithLessons) {
      setSelectedCourse(courseWithLessons);
      setShowCourseViewer(true);
    }
  };

  const handlePathCourseClick = async (pathCourse: any) => {
    // Create a mock course object for path courses
    const mockCourse = {
      id: pathCourse.id,
      title: pathCourse.title,
      description: pathCourse.description,
      lessons: [
        {
          id: `${pathCourse.id}-lesson-1`,
          title: pathCourse.title,
          description: pathCourse.description,
          video_url: pathCourse.videoUrl,
          duration_minutes: parseInt(pathCourse.duration),
          lesson_order: 1,
          is_free: true,
          quizzes: []
        }
      ]
    };
    
    setSelectedCourse(mockCourse);
    setShowCourseViewer(true);
  };

  const handleLessonComplete = async (lessonId: string, watchTime: number) => {
    await completeLesson(lessonId, watchTime);
  };

  const handleQuizComplete = async (lessonId: string, score: number, totalPoints: number) => {
    console.log(`Lesson ${lessonId} quiz completed with score ${score}/${totalPoints}`);
  };

  const filteredRecommended = recommendedCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewAllCourses = () => {
    setActiveTab('paths');
  };

  const handleViewPath = (pathId: number) => {
    setShowPathDetails(pathId);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (showCourseViewer && selectedCourse) {
    return (
      <CourseViewer
        course={selectedCourse}
        onBack={() => setShowCourseViewer(false)}
        onLessonComplete={handleLessonComplete}
        onQuizComplete={handleQuizComplete}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
            🎓 Learning Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Interactive video learning with AI-powered quizzes and progress tracking
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} w-full max-w-xs relative`}>
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search courses..."
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
          
          <button 
            onClick={() => console.log('Filter clicked')}
            className={`p-2 rounded-md transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Filter size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className={`mb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' 
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {activeTab === 'paths' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <div key={path.id} className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 border border-gray-200 dark:border-gray-700`}>
                <div className="h-48 relative">
                  <img 
                    src={path.thumbnail} 
                    alt={path.title} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-full font-medium">
                    {path.difficulty}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="text-white" size={16} />
                      <span className="text-white text-sm font-medium">{path.skills.length} Skills</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <MapPin className="text-indigo-500 mr-2" size={18} />
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {path.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {path.description}
                  </p>
                  
                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {path.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                        {skill}
                      </span>
                    ))}
                    {path.skills.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        +{path.skills.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {path.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Zap className="text-amber-500 mr-2" size={14} />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center">
                        <BookOpen className="text-indigo-500 mr-2" size={16} />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Courses</p>
                          <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {path.totalCourses}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center">
                        <Clock className="text-green-500 mr-2" size={16} />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                          <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {path.estimatedTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Progress
                    </span>
                    <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {path.completedCourses}/{path.totalCourses}
                    </span>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" 
                      style={{ width: `${Math.round((path.completedCourses / path.totalCourses) * 100)}%` }}
                    ></div>
                  </div>
                  
                  <button 
                    onClick={() => handleViewPath(path.id)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span>Explore Path</span>
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((userCourse) => (
                <div key={userCourse.id} onClick={() => handleCourseClick(userCourse.course_id)} className="cursor-pointer">
                  <div className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 border border-gray-200 dark:border-gray-700`}>
                    <div className="h-40 relative">
                      <img 
                        src={userCourse.course?.thumbnail_url || 'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                        alt={userCourse.course?.title || 'Course'} 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-md">
                          {userCourse.course?.category}
                        </span>
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-md font-medium">
                          {userCourse.progress_percentage}% Complete
                        </span>
                      </div>
                      
                      {/* Interactive Learning Badge */}
                      <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full font-medium flex items-center">
                        <Brain size={12} className="mr-1" />
                        AI-Powered
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {userCourse.course?.title || 'Unknown Course'}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center">
                          <CheckCircle size={14} className="mr-1" />
                          <span>{userCourse.completed_lessons}/{userCourse.course?.total_lessons || 0} lessons</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{userCourse.course?.estimated_hours || 0}h</span>
                        </div>
                      </div>
                      
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" 
                          style={{ width: `${userCourse.progress_percentage}%` }}
                        ></div>
                      </div>
                      
                      <button className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                        <Play size={16} className="mr-2" />
                        {userCourse.progress_percentage > 0 ? 'Continue Learning' : 'Start Course'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No {activeTab === 'inProgress' ? 'in-progress' : 'completed'} courses
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'inProgress' 
                  ? 'Start a new course to see it here.' 
                  : 'Complete courses to see them here.'}
              </p>
            </div>
          )}
          
          {activeTab === 'inProgress' && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    🌟 Recommended for You
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    AI-curated courses based on your learning preferences
                  </p>
                </div>
                <button 
                  onClick={handleViewAllCourses}
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center hover:underline"
                >
                  View all <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommended.slice(0, 6).map((course) => (
                  <div key={course.id} onClick={() => handleCourseClick(course.id)} className="cursor-pointer">
                    <div className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 border border-gray-200 dark:border-gray-700`}>
                      <div className="h-40 relative">
                        <img 
                          src={course.thumbnail_url || 'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                          alt={course.title} 
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-md">
                          {course.difficulty}
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-md">
                          <Star size={12} className="mr-1" />
                          <span>{Number(course.rating).toFixed(1)}</span>
                        </div>
                        
                        {/* Interactive Badge */}
                        <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full font-medium flex items-center">
                          <Brain size={12} className="mr-1" />
                          AI-Powered
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="mb-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          {course.category}
                        </div>
                        
                        <h3 className={`font-medium line-clamp-2 mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {course.title}
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center">
                            <BookOpen size={14} className="mr-1" />
                            <span>{course.total_lessons} lessons</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{course.estimated_hours}h</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>{course.student_count.toLocaleString()} students</span>
                          </div>
                          
                          <button className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/40 dark:hover:from-indigo-900/60 dark:hover:to-purple-900/60 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-md transition-all duration-300">
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Path Details Modal */}
      {showPathDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-4xl rounded-xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {learningPaths.find(p => p.id === showPathDetails)?.title}
              </h3>
              <button
                onClick={() => setShowPathDetails(null)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {learningPaths.find(p => p.id === showPathDetails)?.courses.map((course, index) => (
                <div key={course.id} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} mb-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {index + 1}. {course.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {course.description}
                      </p>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{course.duration}</span>
                        {course.completed && (
                          <span className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle size={14} className="mr-1" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handlePathCourseClick(course)}
                      className="ml-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center"
                    >
                      <Play size={16} className="mr-2" />
                      {course.completed ? 'Review' : 'Start'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learning;