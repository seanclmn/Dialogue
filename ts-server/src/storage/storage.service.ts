import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

@Injectable()
export class StorageService {
  private readonly storage: Storage;

  constructor(private readonly config: ConfigService) {
    const keyFilename = config.get<string>('GCS_KEY_FILENAME');
    const projectId = config.get<string>('GCS_PROJECT_ID');
    this.storage = new Storage({
      ...(keyFilename ? { keyFilename } : {}),
      ...(projectId ? { projectId } : {}),
    });
  }

  async uploadUserAvatar(userId: string, buffer: Buffer, mimetype: string): Promise<string> {
    console.log("Uploading user avatar");
    const bucketName = this.config.get<string>('GCS_BUCKET_NAME');
    console.log("Bucket name: ", bucketName);
    if (!bucketName) {
      console.log("Bucket name not found");
      throw new BadRequestException(
        'Avatar upload is not configured. Set GCS_BUCKET_NAME and GOOGLE_APPLICATION_CREDENTIALS (or run on GCP with a service account).',
      );
    }
    const ext = ALLOWED_MIME[mimetype];
    console.log("Extension: ", ext);
    if (!ext) {
      throw new BadRequestException('Only JPEG, PNG, WebP, and GIF images are allowed.');
    }

    const objectName = `avatars/${userId}/${randomUUID()}.${ext}`;
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(objectName);
    console.log("File: ", file.name);
    await file.save(buffer, {
      metadata: { contentType: mimetype, cacheControl: 'public, max-age=31536000' },
    });

    const base =
      this.config.get<string>('GCS_PUBLIC_URL_BASE')?.replace(/\/$/, '') ||
      `https://storage.googleapis.com/${bucketName}`;

    return `${base}/${encodeURI(objectName)}`;
  }
}
