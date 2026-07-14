import "server-only";

type RequiredServerVariable = "OPENAI_API_KEY";
type ServerEnvironment = Readonly<{
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
}>;

function readRequiredVariable(name: RequiredServerVariable): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getServerEnvironment(): ServerEnvironment {
  return Object.freeze({
    OPENAI_API_KEY: readRequiredVariable("OPENAI_API_KEY"),
    OPENAI_MODEL: process.env.OPENAI_MODEL?.trim() || "gpt-5.6",
  });
}
