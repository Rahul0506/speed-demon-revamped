import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    process.env.NODE_ENV = 'production';

    app.use(helmet());
    app.enableCors();

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');

    const confService = app.get(ConfigService);
    const port = confService.get('port');
    console.log(`Listening on port: ${port}`);
    await app.listen(port);
}
bootstrap();
