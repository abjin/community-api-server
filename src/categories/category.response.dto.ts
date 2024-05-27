export class CategoryResponseDto {
  id: number;
  title: string;

  constructor(partial: Partial<CategoryResponseDto>) {
    Object.assign(this, partial);
  }
}
