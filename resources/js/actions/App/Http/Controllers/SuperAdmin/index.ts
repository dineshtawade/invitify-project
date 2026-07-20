import DashboardController from './DashboardController'
import UserController from './UserController'
import MiniWebsiteTemplateController from './MiniWebsiteTemplateController'
import BusinessWebsiteTemplateController from './BusinessWebsiteTemplateController'
import TransactionController from './TransactionController'
import CategoryController from './CategoryController'
import CustomBlockController from './CustomBlockController'
import TemplateController from './TemplateController'
import PaymentSettingsController from './PaymentSettingsController'
import SettingsController from './SettingsController'
import BusinessCardPlanController from './BusinessCardPlanController'
import ReferralController from './ReferralController'
import WalletController from './WalletController'
import ResellerDepositController from './ResellerDepositController'
const SuperAdmin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
UserController: Object.assign(UserController, UserController),
MiniWebsiteTemplateController: Object.assign(MiniWebsiteTemplateController, MiniWebsiteTemplateController),
BusinessWebsiteTemplateController: Object.assign(BusinessWebsiteTemplateController, BusinessWebsiteTemplateController),
TransactionController: Object.assign(TransactionController, TransactionController),
CategoryController: Object.assign(CategoryController, CategoryController),
CustomBlockController: Object.assign(CustomBlockController, CustomBlockController),
TemplateController: Object.assign(TemplateController, TemplateController),
PaymentSettingsController: Object.assign(PaymentSettingsController, PaymentSettingsController),
SettingsController: Object.assign(SettingsController, SettingsController),
BusinessCardPlanController: Object.assign(BusinessCardPlanController, BusinessCardPlanController),
ReferralController: Object.assign(ReferralController, ReferralController),
WalletController: Object.assign(WalletController, WalletController),
ResellerDepositController: Object.assign(ResellerDepositController, ResellerDepositController),
}

export default SuperAdmin