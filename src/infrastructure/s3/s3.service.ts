import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { File } from 'multer';

@Injectable()
export class S3Service {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  async uploadFile(file: File, folder = 'profissionais'): Promise<{ success: boolean; message: string }> {
    if (!file) {
      return { success: false, message: 'Arquivo não enviado' };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      return { success: false, message: 'Tamanho máximo permitido: 5MB' };
    }

    const extension = file.originalname.split('.').pop();
    const filename = `${folder}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
      //ACL: 'public-read',
    });

    try {
      await this.s3.send(command);
      return {
        success: true,
        message: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`,
      };
    } catch (error) {
      return { success: false, message: '' };
    }
  }
}
