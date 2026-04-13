import * as readline from 'node:readline/promises';
import { CoworkerAgent } from './agent.js';
import { SYSTEM_PROMPT_CODE } from './prompt.js';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
async function main() {
    const agent = new CoworkerAgent({
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        systemPrompt: SYSTEM_PROMPT_CODE,
    });
    console.log('Welcome to Coworker! I am your AI coding and file management assistant.');
    console.log('Type "exit" to quit.');
    console.log('---');
    while (true) {
        const userInput = await rl.question('> ');
        if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
            console.log('Goodbye!');
            break;
        }
        if (!userInput.trim())
            continue;
        try {
            console.log('\x1b[33mThinking...\x1b[0m');
            const response = await agent.chat(userInput, (update) => {
                if (update.startsWith('[Calling tool:')) {
                    console.log(`\x1b[32m${update}\x1b[0m`);
                }
                else {
                    // Streaming-like experience if we had streaming, for now just partial updates
                    // (Our agent doesn't stream yet, but we could add it)
                }
            });
            console.log(`\x1b[36mCoworker:\x1b[0m ${response}`);
        }
        catch (error) {
            console.error(`\x1b[31mError:\x1b[0m ${error.message}`);
        }
    }
    rl.close();
}
main().catch(console.error);
//# sourceMappingURL=cli.js.map