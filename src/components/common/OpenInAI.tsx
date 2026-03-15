// src/components/common/OpenInAI.tsx
interface Props {
  prompt: string;
}

const AI_PLATFORMS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
    icon: 'ChatGPT'
  },

{
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai/',
    icon: 'Claude'
  },

  {
    id: 'perplexity',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/',
    icon: 'Perplexity'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    icon: 'DeepSeek'
  },
  {
    id: 'qwen',
    name: 'Qwen',
    url: 'https://chat.qwen.ai/',
    icon: 'Qwen'
  }
];

export function OpenInAI({ prompt }: Props) {
  const handleOpen = (platformUrl: string) => {
    // Копируем промпт в буфер
    navigator.clipboard.writeText(prompt);
    
    // Открываем платформу в новой вкладке
    window.open(platformUrl, '_blank');
    
    // Показываем уведомление
    alert('Промпт скопирован. Вставьте его в Ваш ИИ чат.');
  };

  return (
    <div className="open-in-ai">
      <p className="open-in-ai-label">Открыть в:</p>
      <div className="open-in-ai-buttons">
        {AI_PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            type="button"
            className="ai-platform-btn"
            onClick={() => handleOpen(platform.url)}
            title={`Открыть в ${platform.name}`}
          >
            <span className="ai-platform-icon">{platform.icon}</span>
            <span className="ai-platform-name">{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}