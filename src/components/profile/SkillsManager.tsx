import React, { useState } from 'react';
import { Plus, X, Save, Edit } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Skill {
  name: string;
  value: number;
}

interface SkillsManagerProps {
  skills: Skill[];
  onSkillsUpdate: (skills: Skill[]) => void;
}

const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, onSkillsUpdate }) => {
  const { darkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSkills, setEditedSkills] = useState<Skill[]>(skills);
  const [newSkill, setNewSkill] = useState({ name: '', value: 50 });

  const predefinedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'CSS', 'HTML',
    'TypeScript', 'Java', 'C++', 'SQL', 'MongoDB', 'Express',
    'Vue.js', 'Angular', 'PHP', 'Ruby', 'Go', 'Rust',
    'Docker', 'Kubernetes', 'AWS', 'Git', 'Linux', 'Machine Learning'
  ];

  const handleAddSkill = () => {
    if (newSkill.name.trim() && !editedSkills.find(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
      setEditedSkills([...editedSkills, { ...newSkill, name: newSkill.name.trim() }]);
      setNewSkill({ name: '', value: 50 });
    }
  };

  const handleRemoveSkill = (index: number) => {
    setEditedSkills(editedSkills.filter((_, i) => i !== index));
  };

  const handleSkillValueChange = (index: number, value: number) => {
    const updated = [...editedSkills];
    updated[index].value = value;
    setEditedSkills(updated);
  };

  const handleSave = () => {
    onSkillsUpdate(editedSkills);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSkills(skills);
    setIsEditing(false);
  };

  const handlePredefinedSkillAdd = (skillName: string) => {
    if (!editedSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      setEditedSkills([...editedSkills, { name: skillName, value: 50 }]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Skills Management
        </h4>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            <Edit size={14} className="mr-1" />
            Edit Skills
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <Save size={14} className="mr-1" />
              Save
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="space-y-4">
          {/* Add New Skill */}
          <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
            <h5 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Add New Skill
            </h5>
            
            {/* Predefined Skills */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-1">
                {predefinedSkills.filter(skill => 
                  !editedSkills.find(s => s.name.toLowerCase() === skill.toLowerCase())
                ).slice(0, 8).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handlePredefinedSkillAdd(skill)}
                    className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Skill name"
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                className={`flex-1 px-3 py-2 text-sm rounded border ${
                  darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={newSkill.value}
                onChange={(e) => setNewSkill(prev => ({ ...prev, value: parseInt(e.target.value) }))}
                className="w-20"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 w-12">
                {newSkill.value}%
              </span>
              <button
                onClick={handleAddSkill}
                disabled={!newSkill.name.trim()}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Edit Existing Skills */}
          <div className="space-y-2">
            {editedSkills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const updated = [...editedSkills];
                    updated[index].name = e.target.value;
                    setEditedSkills(updated);
                  }}
                  className={`flex-1 px-3 py-2 text-sm rounded border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.value}
                  onChange={(e) => handleSkillValueChange(index, parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 w-12">
                  {skill.value}%
                </span>
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="p-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display Skills */}
      {!isEditing && (
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {skill.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {skill.value}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${skill.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsManager;