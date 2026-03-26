// src/order/dto/create-order.dto.ts
export class CreateOrderDto {
  readonly itemId: number;
  readonly price: number;
  readonly userId: number;
  readonly name: string;
  readonly status?: string;
}
