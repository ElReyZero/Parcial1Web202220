import { Module } from '@nestjs/common';
import { CafeEntity } from './cafe.entity';
import { CafeService } from './cafe.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CafeEntity])],
  providers: [CafeService]
})
export class CafeModule {}
