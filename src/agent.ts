import OpenAI from 'openai';
import { tools } from './tools.js';
import { SYSTEM_PROMPT_CODE } from './prompt.js';
import type { AgentConfig } from './types.js';

export class CoworkerAgent {
  private readonly openai: OpenAI;
  private readonly messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  private readonly config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': 'Coworker Assistant',
        'X-OpenRouter-Title': 'Coworker Assistant',
      },
    });
    this.messages.push({ role: 'system', content: this.config.systemPrompt });
  }

  async chat(userInput: string, onUpdate?: (message: string) => void) {
    this.messages.push({ role: 'user', content: userInput });

    while (true) {
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: this.messages,
        tools: Object.values(tools).map((t) => t.spec),
      });

      const message = response.choices[0]!.message;
      this.messages.push(message);

      if (message.content && onUpdate) {
        onUpdate(message.content);
      }

      if (message.tool_calls && message.tool_calls.length > 0) {
        for (const toolCall of message.tool_calls) {
          if (toolCall.type === 'function') {
            const tool = tools[toolCall.function.name];
            if (tool) {
              if (onUpdate) onUpdate(`[Calling tool: ${toolCall.function.name} with ${toolCall.function.arguments}]`);
              const args = JSON.parse(toolCall.function.arguments);
              const result = await tool.execute(args);
              this.messages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: result,
              });
            } else {
              this.messages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: `Error: Tool ${toolCall.function.name} not found.`,
              });
            }
          }
        }
      } else {
        return message.content;
      }
    }
  }
}
