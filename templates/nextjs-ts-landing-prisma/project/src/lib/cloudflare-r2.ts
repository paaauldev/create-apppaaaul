import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configuración del cliente S3 para Cloudflare R2
const createS3Client = () => {
  const endpoint = process.env.CLOUDFLARE_ENDPOINT;
  const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY;
  const secretAccessKey = process.env.CLOUDFLARE_SECRET_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 environment variables are not properly configured");
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

export interface UploadUrlResponse {
  presignedUrl: string;
  publicUrl: string;
  key: string;
}

export async function generateUploadUrl(
  fileName: string,
  fileType: string,
  userId: string,
): Promise<UploadUrlResponse> {
  const s3Client = createS3Client();
  const bucketName = process.env.CLOUDFLARE_BUCKET;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!bucketName) {
    throw new Error("CLOUDFLARE_BUCKET environment variable is not set");
  }

  if (!accountId) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID environment variable is not set");
  }

  // Generar nombre único para el archivo
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `tickets/${userId}/${timestamp.toString()}-${sanitizedFileName}`;

  // Crear comando para subir archivo
  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  });

  // Generar URL presignada (válida por 5 minutos)
  const presignedUrl = await getSignedUrl(s3Client, putCommand, {
    expiresIn: 300, // 5 minutos
  });

  // URL pública del archivo (después de ser subido)
  const publicDomain = process.env.CLOUDFLARE_PUBLIC_URL;

  const publicUrl = publicDomain
    ? `${publicDomain}/${key}`
    : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;

  return {
    presignedUrl,
    publicUrl,
    key,
  };
}

// Función para eliminar un archivo de R2
export async function deleteFile(key: string): Promise<void> {
  const s3Client = createS3Client();
  const bucketName = process.env.CLOUDFLARE_BUCKET;

  if (!bucketName) {
    throw new Error("CLOUDFLARE_BUCKET environment variable is not set");
  }

  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(deleteCommand);
}

// Función para extraer la key de una URL pública
export function extractKeyFromUrl(publicUrl: string): string | null {
  try {
    // Obtener el dominio público configurado
    const publicDomain = process.env.CLOUDFLARE_PUBLIC_URL;

    if (publicDomain && publicUrl.startsWith(publicDomain)) {
      // URL con dominio personalizado: https://images.skinsbrain.com/tickets/user123/1234567890-image.jpg
      return publicUrl.replace(`${publicDomain}/`, "");
    }

    // URL estándar de R2: https://bucket.accountid.r2.cloudflarestorage.com/tickets/user123/1234567890-image.jpg
    const bucketName = process.env.CLOUDFLARE_BUCKET;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    if (bucketName && accountId) {
      const standardDomain = `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/`;

      if (publicUrl.startsWith(standardDomain)) {
        return publicUrl.replace(standardDomain, "");
      }
    }

    return null;
  } catch (error) {
    console.error("Error extracting key from URL:", error);

    return null;
  }
}
