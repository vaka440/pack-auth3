import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationFilter } from './validations/validation-filter';
import { ValidationException } from './validations/validation-exception';
import { ValidationError, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5600'],
  });


  app.useGlobalFilters(
    new ValidationFilter()    
  );

  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties: false,
    exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
            return {
                error: `${error.property} has wrong value ${error.value}.`,
                message: Object.values(error.constraints).join(''),
            }
        })

        return new ValidationException(messages);
    }
  }));  

  const config = new DocumentBuilder()
    .setTitle('Nestjs role-based auth')
    .setDescription(
      'Nestjs role-based auth, allowing user to login, and admin to perform CRUD operations. DB needs to be seeded with admin account.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-api', app, document);

  await app.listen(3000);
}
bootstrap();
