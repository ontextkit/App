// src/components/KuskWizard/KuskWizard.tsx
import { useState } from 'react';
import type { MetaPrompt, KuskStage, ContextData, ClarifyData, CreateData, CritiqueData, Source, ToneType } from '../../types';
import { KUSK_STAGE_LABELS } from '../../types';
import { buildMetaPrompt, validateKuskData } from '../../utils/promptBuilder';
import { trackEvent } from '../../utils/analytics';  /* ← ← ← Добавить */
import { Tooltip } from "../common/Tooltip";

interface Props {
  projectId: string;
  onSave: (metaPrompt: MetaPrompt) => void;
  onCancel: () => void;
}

export function KuskWizard({ projectId, onSave, onCancel }: Props) {
  const [stage, setStage] = useState<KuskStage>('context');
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [context, setContext] = useState<ContextData>({
    sources: [],
    methodology: '',
    audience: '',
    tone: 'professional'
  });

  const [clarify, setClarify] = useState<ClarifyData>({
    goal: '',
    constraints: '',
    preferences: '',
    questions: ['']
  });

  const [create, setCreate] = useState<CreateData>({
    outputFormat: 'guide',
    structure: '',
    examples: '',
    successCriteria: ''
  });

  const [critique, setCritique] = useState<CritiqueData>({
    blindSpots: '',
    weaknesses: '',
    alternatives: '',
    nextSteps: ''
  });

  const previewPrompt = buildMetaPrompt({
    title,
    context,
    clarify,
    create,
    critique,
    description: ''
  });

  const handleSave = () => {
  const validation = validateKuskData({
    context,
    clarify,
    create,
    critique
  });

  if (!validation.isValid) {
    setValidationError(validation.missingFields.join(', '));  // ✅ Показываем ошибку в UI
    return;
  }
  
  setValidationError(null);  // Сбрасываем ошибку при успехе

  const metaPrompt: MetaPrompt = {
    id: crypto.randomUUID(),
    projectId,
    title: title || 'Новый мета-промпт',
    description: '',
    context,
    clarify,
    create,
    critique,
    generatedPrompt: previewPrompt,
    status: 'ready',
    iterations: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

    onSave(metaPrompt);
    trackEvent('meta_prompt_created', {
    outputFormat: create.outputFormat,
    hasSources: context.sources.length > 0
  });
  };

  const stages: KuskStage[] = ['context', 'clarify', 'create', 'critique'];
  const currentStepIndex = stages.indexOf(stage);

  return (
    <div className="kusk-wizard">
      <div className="kusk-progress">
        {stages.map((s, i) => (
          <button
            key={s}
            className={`kusk-step ${i <= currentStepIndex ? 'active' : ''} ${s === stage ? 'current' : ''}`}
            onClick={() => setStage(s)}
          >
            <span className="step-number">{i + 1}</span>
            <span className="step-label">{KUSK_STAGE_LABELS[s]}</span>
          </button>
        ))}
      </div>

      <div className="kusk-header">
        <input
          type="text"
          className="kusk-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название мета-промпта (например: «План контента на 30 дней»)"
        />
          {/* ✅ Ошибка валидации — показываем в интерфейсе */}
  {validationError && (
    <div className="validation-error">
      <span className="error-icon">!</span>
      <span>Заполните обязательные поля: {validationError}</span>
      <button className="error-close" onClick={() => setValidationError(null)}>×</button>
    </div>
  )}
      </div>

      <div className="kusk-stage-content">
        {stage === 'context' && (
          <ContextStep context={context} onChange={setContext} />
        )}
        {stage === 'clarify' && (
          <ClarifyStep clarify={clarify} onChange={setClarify} />
        )}
        {stage === 'create' && (
          <CreateStep create={create} onChange={setCreate} />
        )}
        {stage === 'critique' && (
          <CritiqueStep critique={critique} onChange={setCritique} />
        )}
      </div>

      <div className="kusk-preview">
        <h4>Превью мета-промпта</h4>
        <pre className="kusk-preview-content">{previewPrompt}</pre>
      </div>

      <div className="kusk-actions">
        <button
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Отмена
        </button>

        {currentStepIndex > 0 && (
  <button
    className="btn btn-secondary"
    onClick={() => setStage(stages[currentStepIndex - 1])}
  >
    Назад
  </button>
)}

        {currentStepIndex < stages.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => setStage(stages[currentStepIndex + 1])}
          >
            Далее
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{ background: '#10b981' }}
          >
            Сохранить мета-промпт
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// КОМПОНЕНТЫ ШАГОВ
// ============================================================================

function ContextStep({ context, onChange }: {
  context: ContextData;
  onChange: (data: ContextData) => void;
}) {
  const addSource = () => {
    onChange({
      ...context,
      sources: [...context.sources, { id: crypto.randomUUID(), type: 'manual', value: '', description: '', addedAt: new Date().toISOString() }]
    });
  };

  const updateSource = (index: number, field: keyof Source, value: string) => {
    const newSources = [...context.sources];
    newSources[index] = { ...newSources[index], [field]: value };
    onChange({ ...context, sources: newSources });
  };

  const removeSource = (index: number) => {
    onChange({ ...context, sources: context.sources.filter((_, i) => i !== index) });
  };

  return (
    <div className="kusk-step-content">
      <h3>Контекст</h3>
      <p className="kusk-step-description">
        Опишите, что ИИ должен знать о вас и вашем подходе. Чем больше контекста — тем персонализированнее ответ.
      </p>

      <div className="form-group">
        <label className="form-label">Источники информации</label>
        {context.sources.map((source, index) => (
          <div key={source.id} className="source-item">
            <input
              type="text"
              className="form-input"
              placeholder="Описание (например: «Методика из видео X»)"
              value={source.description}
              onChange={(e) => updateSource(index, 'description', e.target.value)}
            />
            <input
              type="text"
              className="form-input"
              placeholder="URL, текст или путь к файлу"
              value={source.value}
              onChange={(e) => updateSource(index, 'value', e.target.value)}
            />
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => removeSource(index)}
            >
              Удалить
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={addSource}>
          Добавить источник
        </button>
      </div>

      <div className="form-group">
  <label className="form-label">
    Методология / подход эксперта
    <Tooltip content="Укажите методику или эксперта, чей подход вы используете. Это поможет ИИ адаптировать ответ под ваш стиль.">
      <span className="tooltip-icon">i</span>
    </Tooltip>
  </label>
  <input
    type="text"
    className="form-input"
    placeholder="Например: «Методика Александра Левитаса», «Подход из книги Пиши, сокращай»"
    value={context.methodology}
    onChange={(e) => onChange({ ...context, methodology: e.target.value })}
  />
</div>

      <div className="form-group">
        <label className="form-label">Целевая аудитория</label>
        <input
          type="text"
          className="form-input"
          placeholder="Например: «Предприниматели 25-40 лет», «Начинающие контент-мейкеры»"
          value={context.audience}
          onChange={(e) => onChange({ ...context, audience: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Тон коммуникации</label>
        <select
          className="form-select"
          value={context.tone}
          onChange={(e) => onChange({ ...context, tone: e.target.value as ToneType })}
        >
          <option value="professional">Профессиональный</option>
          <option value="casual">Дружеский</option>
          <option value="provocative">Провокационный</option>
          <option value="academic">Академический</option>
          <option value="custom">Свой вариант</option>
        </select>
      </div>
    </div>
  );
}

function ClarifyStep({ clarify, onChange }: {
  clarify: ClarifyData;
  onChange: (data: ClarifyData) => void;
}) {
  const addQuestion = () => {
    onChange({ ...clarify, questions: [...clarify.questions, ''] });
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...clarify.questions];
    newQuestions[index] = value;
    onChange({ ...clarify, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    onChange({ ...clarify, questions: clarify.questions.filter((_, i) => i !== index) });
  };

  return (
    <div className="kusk-step-content">
      <h3>Уточнение</h3>
      <p className="kusk-step-description">
        Чётко сформулируйте цель и ограничения. Не позволяйте ИИ решать всё за вас — участвуйте в процессе.
      </p>

      <div className="form-group">
        <label className="form-label required">Цель</label>  {/* ← ← ← Добавить класс */}
        <label className="form-label">Цель</label>
        <input
          type="text"
          className="form-input"
          placeholder="Например: «Создать план контента на 30 дней для личного бренда»"
          value={clarify.goal}
          onChange={(e) => onChange({ ...clarify, goal: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Ограничения (время, бюджет, ресурсы)</label>
        <textarea
          className="form-textarea"
          placeholder="Например: «2 часа в день», «Без платных инструментов», «Только смартфон»"
          value={clarify.constraints}
          onChange={(e) => onChange({ ...clarify, constraints: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Предпочтения (формат, стиль, длина)</label>
        <textarea
          className="form-textarea"
          placeholder="Например: «Короткие посты до 500 знаков», «Видео до 1 минуты», «Структурированный список»"
          value={clarify.preferences}
          onChange={(e) => onChange({ ...clarify, preferences: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Вопросы, которые ИИ должен вам задать</label>
        {clarify.questions.map((question, index) => (
          <div key={index} className="question-item">
            <input
              type="text"
              className="form-input"
              placeholder="Например: «Какая главная цель этого контента?»"
              value={question}
              onChange={(e) => updateQuestion(index, e.target.value)}
            />
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => removeQuestion(index)}
            >
              Удалить
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={addQuestion}>
          Добавить вопрос
        </button>
      </div>
    </div>
  );
}

function CreateStep({ create, onChange }: {
  create: CreateData;
  onChange: (data: CreateData) => void;
}) {
  return (
    <div className="kusk-step-content">
      <h3>Создание</h3>
      <p className="kusk-step-description">
        Определите формат и структуру результата. Чем точнее описание — тем лучше ИИ поймёт задачу.
      </p>

<div className="form-group">
  <label className="form-label">Формат вывода</label>
  <select
    className="form-select"
    value={create.outputFormat}
    onChange={(e) => onChange({ ...create, outputFormat: e.target.value as CreateData['outputFormat'] })}
  >
    <option value="guide">Пошаговое руководство</option>
    <option value="plan">План / дорожная карта</option>
    <option value="script">Сценарий видео / поста</option>
    <option value="dialogue">Диалог с ИИ</option>
    <option value="brief">Бриф для команды</option>
    <option value="article">Статья / лонгрид</option>
    <option value="custom">Свой формат</option>
  </select>
  
  {/* Поле ввода для "Свой формат" */}
  {create.outputFormat === 'custom' && (
    <input
      type="text"
      className="form-input"
      style={{ marginTop: '0.75rem' }}
      placeholder="Опишите желаемый формат (например: «Чек-лист с примерами»)"
      value={create.customFormat || ''}
      onChange={(e) => onChange({ ...create, customFormat: e.target.value })}
    />
  )}
</div>

      <div className="form-group">
        <label className="form-label">Примеры желаемого результата</label>
        <textarea
          className="form-textarea"
          placeholder="Вставьте ссылку или текст примера, который вам нравится"
          value={create.examples}
          onChange={(e) => onChange({ ...create, examples: e.target.value })}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Критерии успеха</label>
        <input
          type="text"
          className="form-input"
          placeholder="Например: «Пост набирает 100+ лайков», «Читатель дочитывает до конца»"
          value={create.successCriteria}
          onChange={(e) => onChange({ ...create, successCriteria: e.target.value })}
        />
      </div>
    </div>
  );
}

function CritiqueStep({ critique, onChange }: {
  critique: CritiqueData;
  onChange: (data: CritiqueData) => void;
}) {
  return (
    <div className="kusk-step-content">
      <h3>Критика</h3>
      <p className="kusk-step-description">
        Продумайте, что проверить в ответе ИИ. Это критически важный этап для персонализации — помогает избежать ошибок и адаптировать план под ваши реальные возможности.
      </p>

      <div className="form-group">
        <label className="form-label">Слепые зоны (что вы боитесь упустить?)</label>
        <textarea
          className="form-textarea"
          placeholder="Например: «Могу упустить важные детали аудитории», «Не учту сезонность»"
          value={critique.blindSpots}
          onChange={(e) => onChange({ ...critique, blindSpots: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Слабые места (что проверить в аргументации?)</label>
        <textarea
          className="form-textarea"
          placeholder="Например: «Проверить, есть ли доказательства эффективности», «Оценить реалистичность сроков»"
          value={critique.weaknesses}
          onChange={(e) => onChange({ ...critique, weaknesses: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Альтернативные подходы</label>
        <textarea
          className="form-textarea"
          placeholder="Например: «Предложить 2-3 альтернативных стратегии», «Сравнить с конкурентами»"
          value={critique.alternatives}
          onChange={(e) => onChange({ ...critique, alternatives: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Следующие шаги (что делать после ответа?)</label>
        <input
          type="text"
          className="form-input"
          placeholder="Например: «Протестировать 3 поста», «Показать команде», «Скорректировать план»"
          value={critique.nextSteps}
          onChange={(e) => onChange({ ...critique, nextSteps: e.target.value })}
        />
      </div>
    </div>
  );
}