import DashboardController from './DashboardController'
import WalletController from './WalletController'
import PaymentHistoryController from './PaymentHistoryController'
import ShopController from './ShopController'
import PurchaseController from './PurchaseController'
import TemplateController from './TemplateController'
import HostingController from './HostingController'
import MiniWebsiteController from './MiniWebsiteController'
import BusinessWebsiteController from './BusinessWebsiteController'
const Reseller = {
    DashboardController: Object.assign(DashboardController, DashboardController),
WalletController: Object.assign(WalletController, WalletController),
PaymentHistoryController: Object.assign(PaymentHistoryController, PaymentHistoryController),
ShopController: Object.assign(ShopController, ShopController),
PurchaseController: Object.assign(PurchaseController, PurchaseController),
TemplateController: Object.assign(TemplateController, TemplateController),
HostingController: Object.assign(HostingController, HostingController),
MiniWebsiteController: Object.assign(MiniWebsiteController, MiniWebsiteController),
BusinessWebsiteController: Object.assign(BusinessWebsiteController, BusinessWebsiteController),
}

export default Reseller