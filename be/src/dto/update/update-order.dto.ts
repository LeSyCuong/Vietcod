// src/order/dto/update-order.dto.ts
export class UpdateOrderDto {
  readonly quantity?: number;
  readonly price?: number;
  readonly name: string;
  readonly status?: string;
}
