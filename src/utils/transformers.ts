import { Decimal } from '@prisma/client/runtime/library';

export function transformProperty(property: any): any {
  return {
    ...property,
    price: property.price instanceof Decimal ? property.price.toNumber() : property.price
  };
}
