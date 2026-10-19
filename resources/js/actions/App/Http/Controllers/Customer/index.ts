import TemplateController from './TemplateController'
import MiniWebsiteController from './MiniWebsiteController'
import BusinessCardController from './BusinessCardController'
import SubscriptionController from './SubscriptionController'
import BusinessWebsiteController from './BusinessWebsiteController'
const Customer = {
    TemplateController: Object.assign(TemplateController, TemplateController),
MiniWebsiteController: Object.assign(MiniWebsiteController, MiniWebsiteController),
BusinessCardController: Object.assign(BusinessCardController, BusinessCardController),
SubscriptionController: Object.assign(SubscriptionController, SubscriptionController),
BusinessWebsiteController: Object.assign(BusinessWebsiteController, BusinessWebsiteController),
}

export default Customer