import * as Minio from 'minio';
import { S3 } from "@aws-sdk/client-s3";



export const s3 = new S3({
  region: "us-east-1",
  credentials: {
    accessKeyId: "V5pvZFb1itYEl0NHYiDW",
    secretAccessKey: "z9zf7IJA1zlpPIH4UfjDbXAWEKJ7Ui0N9lSaPtKL"
  },
  endpoint: "http://127.0.0.1:9000",
  forcePathStyle: true,

})