import { getEnvVar } from "./env"

export type NodeEnvOptions = "production" | "development"

export type Config = {
  nodeEnv: NodeEnvOptions
  port: string
}

// Export configurations
export const config: Config = {
  nodeEnv: getEnvVar("NODE_ENV", "development") as NodeEnvOptions,
  port: getEnvVar("PORT", "3000"),
}
