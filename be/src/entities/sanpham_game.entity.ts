import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sanpham_game')
export class SanphamGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  img: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255 })
  img_demo: string;

  @Column({ type: 'varchar', length: 255 })
  link_youtube: string;

  @Column({ type: 'varchar', length: 255 })
  link_source: string;

  @Column({ type: 'varchar', length: 255 })
  link_view: string;
}
