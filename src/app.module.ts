import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CafeModule } from './cafe/cafe.module';
import { TiendaModule } from './tienda/tienda.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeEntity } from './cafe/cafe.entity';
import { TiendaEntity } from './tienda/tienda.entity';
import { CafeTiendaModule } from './cafe-tienda/cafe-tienda.module';

@Module({
  imports: [CafeModule, TiendaModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial1',
      entities: [CafeEntity, TiendaEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }), CafeTiendaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
 })
export class AppModule {}
