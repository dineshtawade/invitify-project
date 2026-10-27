import Auth from './Auth'
import Customer from './Customer'
import PublicSiteController from './PublicSiteController'
import PublicBusinessSiteController from './PublicBusinessSiteController'
import PublicCardController from './PublicCardController'
import MediaUploadController from './MediaUploadController'
import SuperAdmin from './SuperAdmin'
import InvoiceController from './InvoiceController'
import Reseller from './Reseller'
import ReferralPartner from './ReferralPartner'
import Settings from './Settings'
const Controllers = {
    Auth: Object.assign(Auth, Auth),
Customer: Object.assign(Customer, Customer),
PublicSiteController: Object.assign(PublicSiteController, PublicSiteController),
PublicBusinessSiteController: Object.assign(PublicBusinessSiteController, PublicBusinessSiteController),
PublicCardController: Object.assign(PublicCardController, PublicCardController),
MediaUploadController: Object.assign(MediaUploadController, MediaUploadController),
SuperAdmin: Object.assign(SuperAdmin, SuperAdmin),
InvoiceController: Object.assign(InvoiceController, InvoiceController),
Reseller: Object.assign(Reseller, Reseller),
ReferralPartner: Object.assign(ReferralPartner, ReferralPartner),
Settings: Object.assign(Settings, Settings),
}

export default Controllers