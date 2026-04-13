import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { ToolDefinition } from './types.js';

const PROJECT_ROOT = process.cwd();

export const tools: Record<string, ToolDefinition> = {
  list_files: {
    spec: {
      type: 'function',
      function: {
        name: 'list_files',
        description: 'Lists files and directories in a given path relative to the project root.',
        parameters: {
          type: 'object',
          properties: {
            directory: {
              type: 'string',
              description: 'The directory to list (relative to project root, e.g., "src" or ".").',
            },
          },
          required: ['directory'],
        },
      },
    },
    execute: async ({ directory }) => {
      try {
        const fullPath = path.resolve(PROJECT_ROOT, directory);
        if (!fullPath.startsWith(PROJECT_ROOT)) {
          return 'Error: Access denied. Paths must be within the project directory.';
        }
        const entries = await fs.readdir(fullPath, { withFileTypes: true });
        return entries
          .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
          .join('\n') || '(Empty directory)';
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    },
  },
  read_file: {
    spec: {
      type: 'function',
      function: {
        name: 'read_file',
        description: 'Reads the content of a file relative to the project root.',
        parameters: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'The path of the file to read (relative to project root).',
            },
          },
          required: ['filePath'],
        },
      },
    },
    execute: async ({ filePath }) => {
      try {
        const fullPath = path.resolve(PROJECT_ROOT, filePath);
        if (!fullPath.startsWith(PROJECT_ROOT)) {
          return 'Error: Access denied. Paths must be within the project directory.';
        }
        return await fs.readFile(fullPath, 'utf8');
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    },
  },
  write_file: {
    spec: {
      type: 'function',
      function: {
        name: 'write_file',
        description: 'Writes or updates a file with the provided content.',
        parameters: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'The path of the file to write (relative to project root).',
            },
            content: {
              type: 'string',
              description: 'The full content of the file.',
            },
          },
          required: ['filePath', 'content'],
        },
      },
    },
    execute: async ({ filePath, content }) => {
      try {
        const fullPath = path.resolve(PROJECT_ROOT, filePath);
        if (!fullPath.startsWith(PROJECT_ROOT)) {
          return 'Error: Access denied. Paths must be within the project directory.';
        }
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content, 'utf8');
        return `Successfully wrote to ${filePath}`;
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    },
  },
  search_files: {
    spec: {
      type: 'function',
      function: {
        name: 'search_files',
        description: 'Searches for files containing a specific pattern in the project.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search term or regex pattern.',
            },
          },
          required: ['query'],
        },
      },
    },
    execute: async ({ query }) => {
      try {
        // Simple recursive search using built-in logic to avoid external deps for now
        const results: string[] = [];
        const walk = async (dir: string) => {
          const files = await fs.readdir(dir, { withFileTypes: true });
          for (const file of files) {
            const res = path.resolve(dir, file.name);
            if (file.name === 'node_modules' || file.name === '.git' || file.name === 'dist') continue;
            if (file.isDirectory()) {
              await walk(res);
            } else {
              const content = await fs.readFile(res, 'utf8');
              if (content.includes(query)) {
                results.push(path.relative(PROJECT_ROOT, res));
              }
            }
          }
        };
        await walk(PROJECT_ROOT);
        return results.join('\n') || 'No matches found.';
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    },
  },
};
