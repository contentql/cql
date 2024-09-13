# CQL

CQL package extends your base payload configuration with predefined configuration

## Getting Started

**Example Usage**

Add this code in your `payload.config.ts` file to get a base configuration

```ts
import { cqlConfig } from "cql";
import { buildConfig } from "payload";

// Add the configuration you want!
const coreConfig = cqlConfig({
  dbURL: process.env.DATABASE_URI,
  s3: {
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
  },
  typescript: {
    outputFile: finalPath,
  },
  secret: process.env.PAYLOAD_SECRET,
  cors: [process.env.PAYLOAD_URL],
  csrf: [process.env.PAYLOAD_URL],
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    defaultFromAddress: process.env.RESEND_SENDER_EMAIL,
    defaultFromName: process.env.RESEND_SENDER_NAME,
  },
});

export default buildConfig(coreConfig);
```
