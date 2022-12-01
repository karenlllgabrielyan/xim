import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function start() {
  const PORT = process.env.PORT || 7000;
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('XIM Task Swagger')
    .setDescription('Description')
    .setVersion('1.0.0')
    .addTag('APIs')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);


  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
start().then();
