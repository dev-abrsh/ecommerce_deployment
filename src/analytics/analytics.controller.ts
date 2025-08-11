import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('products-per-category')
  async getProductsPerCategory() {
    return this.analyticsService.productsPerCategory();
  }

  @Get('products-per-brand')
  async getProductsPerBrand() {
    return this.analyticsService.productsPerBrand();
  }

  @Get('sales-per-product')
  async getSalesPerProduct() {
    return this.analyticsService.totalSalesPerProduct();
  }
}
