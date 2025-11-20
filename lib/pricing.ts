import { PricingResult } from './types';
import { Denomination, Promo, PromoDiscountType } from '@prisma/client';

export class PricingEngine {
  static calculate(
    denomination: Pick<Denomination, 'priceSell' | 'feeFlat' | 'feePct'>,
    promo?: Pick<Promo, 'discountType' | 'value' | 'maxDiscount'> | null
  ): PricingResult {
    const basePrice = denomination.priceSell;
    const feeFlat = denomination.feeFlat;
    const feePct = denomination.feePct;
    
    // Calculate fee
    const feePercentAmount = Math.round(basePrice * feePct);
    const subtotal = basePrice + feeFlat + feePercentAmount;
    
    // Calculate promo discount
    let promoDiscount = 0;
    if (promo) {
      if (promo.discountType === PromoDiscountType.PERCENT) {
        promoDiscount = Math.round(subtotal * (promo.value / 100));
        if (promo.maxDiscount && promoDiscount > promo.maxDiscount) {
          promoDiscount = promo.maxDiscount;
        }
      } else if (promo.discountType === PromoDiscountType.FLAT) {
        promoDiscount = Math.round(promo.value);
      }
    }
    
    // Calculate total
    const total = Math.max(0, subtotal - promoDiscount);
    
    return {
      basePrice,
      feeFlat,
      feePct: feePercentAmount,
      promoDiscount,
      total,
    };
  }
  
  static formatCurrency(amount: number, currency: string = 'IDR'): string {
    if (currency === 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }
  
  static parseAmount(input: string): number {
    const cleaned = input.replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 0;
  }
}
