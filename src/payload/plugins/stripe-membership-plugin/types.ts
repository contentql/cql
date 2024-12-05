export type PluginTypes =
  | {
      secretKey: string
      webhookSecretKey: string
      clientId: string
      publicURI: string
    }
  | undefined
