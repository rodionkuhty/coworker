import type { AgentConfig } from './types.js';
export declare class CoworkerAgent {
    private readonly openai;
    private readonly messages;
    private readonly config;
    constructor(config: AgentConfig);
    chat(userInput: string, onUpdate?: (message: string) => void): Promise<string | null>;
}
//# sourceMappingURL=agent.d.ts.map