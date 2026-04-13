import type { ChatCompletionTool } from 'openai/resources/index.js';
export interface ToolDefinition {
    spec: ChatCompletionTool;
    execute: (args: any) => Promise<string>;
}
export interface AgentConfig {
    model: string;
    systemPrompt: string;
}
//# sourceMappingURL=types.d.ts.map