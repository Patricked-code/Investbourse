export const internalServiceHeaderName = "x-investbourse-internal-token";

export function getInternalServiceToken() {
  return process.env.INTERNAL_SERVICE_TOKEN ?? "";
}

export function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

export function assertProductionSecret(name: string, value: string | undefined | null) {
  if (!isProductionRuntime()) return;

  if (!value || value.length < 32 || value.includes("change-me") || value.includes("replace-with")) {
    throw new Error(`${name}_REQUIRED_STRONG_SECRET_IN_PRODUCTION`);
  }
}
