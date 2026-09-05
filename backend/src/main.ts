import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const allowedOrigins = [
    ...(process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
      : []),
    'http://localhost:3000',
    'http://localhost:3005',
  ];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // allow requests with no origin (mobile apps, curl, Render health checks)
      if (!origin) return callback(null, true);
      // allow any vercel.app subdomain (covers preview deployments)
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin "${origin}" not allowed`));
    },
    credentials: true,
  });

  const port = process.env.PORT ?? 3005;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
await bootstrap();
