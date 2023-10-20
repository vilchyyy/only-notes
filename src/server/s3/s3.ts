import * as Minio from 'minio';
import { S3 } from "@aws-sdk/client-s3";



export const s3 = new S3({
  region: "us-east-1",
  credentials: {
    accessKeyId: "Rf4eIgsrknJHNhVA6orb",
    secretAccessKey: "UgDhRU2XweT4x7mwpg4lKhmUaiAMMzzjyMnXOrvY"
  },
  endpoint: "http://127.0.0.1:9000",
  forcePathStyle: true,

})