import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { envSchema } from './config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/catalog/categories/categories.module';
import { BrandsModule } from './modules/catalog/brands/brands.module';
import { ProductsModule } from './modules/catalog/products/products.module';
import { SkuVariationsModule } from './modules/catalog/sku-variations/sku-variations.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { CartModule } from './modules/cart/cart.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { VendorOrdersModule } from './modules/vendor-orders/vendor-orders.module';
import { OrderTimelineModule } from './modules/order-timeline/order-timeline.module';
import { FulfillmentModule } from './modules/fulfillment/fulfillment.module';
import { EscrowModule } from './modules/escrow/escrow.module';
import { ShippingZonesModule } from './modules/shipping-zones/shipping-zones.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SlaEnforcementJob } from './jobs/sla-enforcement.job';
import { LowStockAlertJob } from './jobs/low-stock-alert.job';
import { KycModule } from './modules/kyc/kyc.module';
import { ProductModerationModule } from './modules/product-moderation/product-moderation.module';
import { CommissionConfigModule } from './modules/commission-config/commission-config.module';
import { FinancialAuditModule } from './modules/financial-audit/financial-audit.module';
import { SystemConfigModule } from './modules/system-config/system-config.module';
import { GeneralLedgerModule } from './modules/general-ledger/general-ledger.module';
import { QueuesModule } from './modules/queues/queues.module';
import { HttpModule } from '@nestjs/axios';
import { CustomersModule } from './modules/customers/customers.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { PayoutsModule } from './modules/payouts/payouts.module';
import { RefundsModule } from './modules/refunds/refunds.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { FlashSalesModule } from './modules/flash-sales/flash-sales.module';
import { SearchModule } from './modules/search/search.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { AdminModule } from './modules/admin/admin.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: (config) => envSchema.parse(config),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    SkuVariationsModule,
     WarehousesModule,
    InventoryModule,
    ReservationsModule,
    CatalogModule,
     CartModule,
    CheckoutModule,
    OrdersModule,
     PaymentsModule,
    VendorOrdersModule,
    OrderTimelineModule,
    FulfillmentModule,
    EscrowModule,
    ShippingZonesModule,
     KycModule,
    ProductModerationModule,
    CommissionConfigModule,
    FinancialAuditModule,
    SystemConfigModule,
    GeneralLedgerModule,
    QueuesModule,
    HttpModule,
    CustomersModule,
    NotificationsModule,
    ReviewsModule,
    CouponsModule,
    WalletsModule,
    PayoutsModule,
    RefundsModule,
    ReturnsModule,
    DisputesModule,
    FlashSalesModule,
    SearchModule,
    ShippingModule,
    VendorModule,
    AdminModule,
    OrderItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SlaEnforcementJob, LowStockAlertJob],
})
export class AppModule {}