import RegisterOtpController from './RegisterOtpController'
import EmailOtpAuthController from './EmailOtpAuthController'
const Auth = {
    RegisterOtpController: Object.assign(RegisterOtpController, RegisterOtpController),
EmailOtpAuthController: Object.assign(EmailOtpAuthController, EmailOtpAuthController),
}

export default Auth