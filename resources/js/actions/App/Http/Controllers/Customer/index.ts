import TemplateController from './TemplateController'
import SubscriptionController from './SubscriptionController'
import MiniWebsiteController from './MiniWebsiteController'
import BusinessWebsiteController from './BusinessWebsiteController'
import BusinessCardController from './BusinessCardController'
const Customer = {
    TemplateController: Object.assign(TemplateController, TemplateController),
SubscriptionController: Object.assign(SubscriptionController, SubscriptionController),
MiniWebsiteController: Object.assign(MiniWebsiteController, MiniWebsiteController),
BusinessWebsiteController: Object.assign(BusinessWebsiteController, BusinessWebsiteController),
BusinessCardController: Object.assign(BusinessCardController, BusinessCardController),
}

export default Customer