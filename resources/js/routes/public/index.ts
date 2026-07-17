import site from './site'
import business from './business'
import card from './card'
const publicMethod = {
    site: Object.assign(site, site),
business: Object.assign(business, business),
card: Object.assign(card, card),
}

export default publicMethod