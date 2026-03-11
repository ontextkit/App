// src/components/ProfileWizard.tsx
import { useState } from 'react';
import type { LifeProfile, LifeDomain } from '../types';
import { DOMAIN_LABELS } from '../types';
import { getQuestionsForDomain } from '../config/profileQuestions';

interface Props {
  onSave: (profile: LifeProfile) => void;
  // ✅ onCancel удалён — не используется в интерфейсе
}

// ✅ Убрали onCancel из деструктуризации
export function ProfileWizard({ onSave }: Props) {
  const [domain, setDomain] = useState<LifeDomain>('work');
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({
    question1: '', question2: '', question3: '', question4: '', question5: ''
  });
  const [step, setStep] = useState<'domain' | 'questions' | 'narrative'>('domain');
  const [narrative, setNarrative] = useState('');

  const questions = getQuestionsForDomain(domain);

  const handleAnswerChange = (key: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers(prev => ({ ...prev, [key]: e.target.value }));
  };

  const generateNarrative = () => {
    const text = `В сфере "${DOMAIN_LABELS[domain]}" этот человек ценит: ${answers.question1 || 'не указано'}. 
Его роль и обязанности: ${answers.question2 || 'не указано'}. 
Его беспокоит: ${answers.question3 || 'не указано'}. 
Вдохновляет: ${answers.question4 || 'не указано'}. 
Главная цель: ${answers.question5 || 'не указано'}.`;
    setNarrative(text);
    setStep('narrative');
  };

  const handleSave = () => {
    const profile: LifeProfile = {
      id: crypto.randomUUID(),
      name: name || DOMAIN_LABELS[domain],
      domain,
      questionnaireAnswers: answers as LifeProfile['questionnaireAnswers'],
      narrative: narrative || generateNarrativeFromAnswers(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(profile);
  };

  const generateNarrativeFromAnswers = () => {
    return `В сфере "${DOMAIN_LABELS[domain]}" этот человек ценит: ${answers.question1 || 'не указано'}. Его роль и обязанности: ${answers.question2 || 'не указано'}. Его беспокоит: ${answers.question3 || 'не указано'}. Вдохновляет: ${answers.question4 || 'не указано'}. Главная цель: ${answers.question5 || 'не указано'}.`;
  };

  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', padding: '0 1rem' }}>
      
      <h2 className="text-center mb-3" style={{ fontSize: '1.25rem' }}>
        {step === 'domain' && '📁 Шаг 1: Выбери сферу жизни'}
        {step === 'questions' && '📝 Шаг 2: Расскажи о себе'}
        {step === 'narrative' && '✏️ Шаг 3: Отредактируй портрет'}
      </h2>

      {step === 'domain' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>
            <strong>Название профиля:</strong>
            <input
              type="text"
              className="input mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Работа в стартапе, Личные финансы, Спорт"
            />
          </label>

          <label>
            <strong>Сфера жизни:</strong>
            <select
              className="select mt-1"
              value={domain}
              onChange={(e) => setDomain(e.target.value as LifeDomain)}
            >
              {Object.entries(DOMAIN_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <button
            className="btn mt-1"
            onClick={() => setStep('questions')}
            style={{ padding: '0.875rem', fontSize: '16px' }}
          >
            Далее →
          </button>
        </div>
      )}

      {step === 'questions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Прогресс-бар */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${(Object.values(answers).filter(a => a.trim()).length / 5) * 100}%`,
                height: '100%',
                background: 'var(--color-primary)',
                transition: 'width 0.3s'
              }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem', textAlign: 'center' }}>
              {Object.values(answers).filter(a => a.trim()).length} из 5 ответов
            </p>
          </div>
          
          {questions.map((q, index) => (
            <label key={q.key} style={{ display: 'block', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <strong>{index + 1}. {q.label}</strong>
                <span className="tooltip" title="Напишите как другу: живо, конкретно, с примерами">💡</span>
              </div>
              <textarea
                className="textarea"
                value={answers[q.key]}
                onChange={handleAnswerChange(q.key)}
                rows={5}
                placeholder={q.placeholder}
              />
            </label>
          ))}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setStep('domain')}
              style={{ flex: 1, padding: '0.875rem' }}
            >
              ← Назад
            </button>
            <button 
              className="btn" 
              onClick={generateNarrative}
              style={{ flex: 1, padding: '0.875rem' }}
            >
              Далее →
            </button>
          </div>
        </div>
      )}

      {step === 'narrative' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ background: '#f0f7ff', borderLeft: '4px solid var(--color-primary)', padding: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>
              💡 <strong>Совет:</strong> Отредактируй текст ниже так, как если бы ты рассказывал о себе другу.
            </p>
          </div>

          <textarea
            className="textarea"
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            rows={10}
            style={{ borderColor: 'var(--color-primary)', borderWidth: '2px', minHeight: '200px' }}
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setStep('questions')}
              style={{ flex: 1, padding: '0.875rem' }}
            >
              ← Назад
            </button>
            <button 
              className="btn" 
              style={{ flex: 1, padding: '0.875rem', background: '#10b981' }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#059669')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#10b981')}
              onClick={handleSave}
            >
              ✅ Сохранить профиль
            </button>
          </div>
        </div>
      )}
    </div>
  );
}