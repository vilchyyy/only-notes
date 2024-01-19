import * as Minio from 'minio';
import { S3 } from "@aws-sdk/client-s3";
import { env } from 'process';



export const s3 = new S3({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY || "",
    secretAccessKey: env.S3_SECRET_KEY || ""
  },
  endpoint: env.S3_URL,
  forcePathStyle: true,

})