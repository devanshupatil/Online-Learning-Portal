import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const INITIAL_CHAPTERS = [
  {
    id: 1,
    title: 'Chapter 1: Relations and Functions',
    description: 'Types of relations: reflexive, symmetric, transitive and equivalence relations. One-to-one and onto functions.',
    topics: [
      { id: 101, name: 'Cartesian product & Types of Relations', completed: true },
      { id: 102, name: 'Equivalence Relations & Partitions', completed: true },
      { id: 103, name: 'Composite Functions & Invertible Functions', completed: true },
      { id: 104, name: 'Binary Operations & Practice Problems', completed: false },
    ],
  },
  {
    id: 2,
    title: 'Chapter 2: Matrices and Determinants',
    description: 'Concept, notation, order, equality, types of matrices, transpose, symmetric and skew symmetric matrices.',
    topics: [
      { id: 201, name: 'Matrix Operations: Addition, Multiplication', completed: true },
      { id: 202, name: 'Properties of Determinants & Minors/Cofactors', completed: true },
      { id: 203, name: 'Adjoint & Inverse of a Matrix', completed: false },
      { id: 204, name: 'Solving Linear Systems with Matrix Method', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Chapter 3: Continuity and Differentiability',
    description: 'Continuity and differentiability, derivative of composite functions, chain rule, derivative of inverse trigonometric functions.',
    topics: [
      { id: 301, name: 'Limits and Continuity at a point', completed: true },
      { id: 302, name: 'Chain Rule & Exponential/Logarithmic Differentiation', completed: true },
      { id: 303, name: 'Second Order Derivatives', completed: false },
      { id: 304, name: "Rolle's and Lagrange's Mean Value Theorem", completed: false },
    ],
  },
  {
    id: 4,
    title: 'Chapter 4: Integrals & Applications',
    description: 'Integration as inverse process of differentiation. Fundamental theorem of calculus. Basic properties of definite integrals.',
    topics: [
      { id: 401, name: 'Integration by Substitution & Partial Fractions', completed: false },
      { id: 402, name: 'Integration by Parts', completed: false },
      { id: 403, name: 'Definite Integrals & Fundamental Theorems', completed: false },
      { id: 404, name: 'Area under Simple Curves', completed: false },
    ],
  },
  {
    id: 5,
    title: 'Chapter 5: Vectors & Three-Dimensional Geometry',
    description: 'Vectors and scalars, magnitude and direction of a vector. Direction cosines and direction ratios of a line.',
    topics: [
      { id: 501, name: 'Scalar and Vector Product of Vectors', completed: false },
      { id: 502, name: 'Direction Cosines & Line in 3D Space', completed: false },
      { id: 503, name: 'Shortest Distance Between Two Lines', completed: false },
    ],
  }
];

const TeacherSyllabus = () => {
  const { t } = useTranslation();
  const [chapters, setChapters] = useState(INITIAL_CHAPTERS);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  // Calculate stats
  const allTopics = chapters.flatMap(c => c.topics);
  const totalTopics = allTopics.length;
  const completedTopics = allTopics.filter(t => t.completed).length;
  const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const toggleTopic = (chapterId, topicId) => {
    setChapters(prev => prev.map(ch => {
      if (ch.id !== chapterId) return ch;
      return {
        ...ch,
        topics: ch.topics.map(tp => {
          if (tp.id !== topicId) return tp;
          const nextState = !tp.completed;
          toast.success(`"${tp.name}" marked as ${nextState ? 'Completed' : 'Pending'}`);
          return { ...tp, completed: nextState };
        })
      };
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-on-surface mb-1">Course Syllabus</h2>
          <p className="text-base text-on-surface-variant font-medium">
            Track and manage curriculum progress for {selectedSubject}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-surface-variant bg-surface text-on-surface font-semibold text-sm outline-none focus:border-primary cursor-pointer shadow-xs"
          >
            <option value="Mathematics">Mathematics (Class 12)</option>
            <option value="Physics">Physics (Class 12)</option>
            <option value="Chemistry">Chemistry (Class 12)</option>
          </select>
        </div>
      </div>

      {/* Progress Overview Card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Curriculum Completion</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-on-surface">{completionPercentage}%</span>
              <span className="text-sm font-medium text-on-surface-variant">
                ({completedTopics} of {totalTopics} topics completed)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-container text-on-primary">
              {chapters.length} Chapters
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-surface-container text-on-surface">
              {totalTopics - completedTopics} Topics Remaining
            </span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Chapter Wise Accordion / List */}
      <div className="space-y-4">
        {chapters.map((chapter, idx) => {
          const chCompleted = chapter.topics.filter(t => t.completed).length;
          const chPercent = chapter.topics.length > 0 ? Math.round((chCompleted / chapter.topics.length) * 100) : 0;
          return (
            <div
              key={chapter.id}
              className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs interactive-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">{chapter.title}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-1">{chapter.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs font-bold text-on-surface">{chPercent}%</span>
                    <span className="text-[11px] text-on-surface-variant ml-1">({chCompleted}/{chapter.topics.length})</span>
                  </div>
                  <div className="w-16 bg-surface-container-high rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${chPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Topics Check List */}
              <div className="divide-y divide-surface-variant/40 mt-4 border-t border-surface-variant/40 pt-2">
                {chapter.topics.map(topic => (
                  <div
                    key={topic.id}
                    onClick={() => toggleTopic(chapter.id, topic.id)}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-surface-container-low/50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={topic.completed}
                        onChange={() => {}} // Controlled by div click
                        className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer"
                      />
                      <span className={`text-sm ${topic.completed ? 'line-through text-on-surface-variant font-medium' : 'text-on-surface font-semibold'}`}>
                        {topic.name}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      topic.completed
                        ? 'bg-[#10B981]/15 text-[#10B981]'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {topic.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherSyllabus;
