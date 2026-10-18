import dotenv from "dotenv"

dotenv.config()

export const getEnvVar = (key: string, defaultValue?: string) => {
  const value = process.env[key]
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is missing.`)
  }
  return value || defaultValue!
}
