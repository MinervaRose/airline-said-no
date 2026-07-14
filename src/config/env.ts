import "server-only";

type RequiredServerVariable = "OPENAI_API_KEY";
type ServerEnvironment = Readonly<Record<RequiredServerVariable, string>>;

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
  });
}
