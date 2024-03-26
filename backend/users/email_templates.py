import datetime

app_name = "Letsnote"
home_url = "https://letsnote.io"
logo_url = "https://github.com/gauravjot/letsnote/assets/11373684/cfd40335-db7e-4c50-92e5-76525763d9f7"
contact_email = "contact@letsnote.io"


def welcomeEmailTemplate(name: str, verify_url: str):
    content = '''
        <p>Hi ''' + name + ''',</p>
        <p>We are excited to have you onboard.</p>
        <p>With ''' + app_name + ''', you can create notes by simply logging in and start typing. You can make multiple share links for easy management, as well as set passwords!</p>
        <p>Use the button below to verify your account and start typing!</p>
        <br/>
        ''' + _cta_button(verify_url, "Complete Verification") + '''
        <br/>
        <p>
        If above button does not work, use this:<br/>''' + verify_url + '''
        </p>
    '''
    return _baseTemplate(head_title="Welcome to " + app_name,
                         preheader="We are excited to have you onboard!",
                         body_heading="Welcome!<br>Let's get you upto speed.",
                         content=content)


def emailChangedTemplate(name: str, verify_url: str):
    content = '''
        <p>Hi ''' + name + ''',</p>
        <p>The email for your account was changed. Please click the button below to finish verification.</p>
        <br/>
        ''' + _cta_button(verify_url, "Complete Verification") + '''
        <br/>
        <p>
        If above button does not work, use this:<br/>''' + verify_url + '''
        </p>
    '''
    return _baseTemplate(head_title="Verify your new email address",
                         preheader="Verify your new email address",
                         body_heading="Your email was changed",
                         content=content)


def passwordChangedTemplate(name: str, who: str, when: str, device: str):
    content = '''
        <p>Hi ''' + name + ''',</p>
        <p>The is an alert that your account password was recently changed. If it was not you, please send us an email to <i>''' + contact_email + '''</i> and we will investigate the issue.</p>
        <br/>
        <p>
            <b>Details</b>
        </p>
        <p>
            Time: ''' + when + '''
            <br/>
            IP Address: ''' + who + '''
            <br/>
            Device: ''' + device + '''
        </p>
    '''
    return _baseTemplate(head_title="Account Password Updated: " + app_name,
                         preheader="Your password was recently updated",
                         body_heading="Your password was changed",
                         content=content)


def deleteAccountTemplate(name: str, who: str, when: str, device: str):
    content = '''
        <p>We are sad to see you go, ''' + name + '''. You can sign up again for a new account anytime you wish.</p>
        <br/>
        <p>You data has been handled already!</p>
        <p>When you delete an account, every last peice of your data is removed along with it.</p>
        <br/>
        <p>Wasn't you?<p>
        <p>If it was not you, please send us an email to <i>''' + contact_email + '''</i> and we will investigate the situation.</p>
        <br/>
        <p>
            <b>Details</b>
        </p>
        <p>
            Time: ''' + when + '''
            <br/>
            IP Address: ''' + who + '''
            <br/>
            Device: ''' + device + '''
        </p>
    '''
    return _baseTemplate(head_title="Account Deleted: " + app_name,
                         preheader="Your account has been deleted",
                         body_heading="Account Deleted",
                         content=content)


def passwordResetTemplate(name: str, reset_url: str):
    content = '''
        <p>Hi ''' + name + ''',</p>
        <p>We have received a request to reset your password. If it was not you, please ignore this email.</p>
        <p>Use the button below to reset your password.</p>
        <br/>
        ''' + _cta_button(reset_url, "Reset Password") + '''
        <br/>
        <p>If above button does not work, use this:<br/>''' + reset_url + '''</p>
        <p>This link will expire in 24 hours.</p>
    '''
    return _baseTemplate(head_title="Reset your password",
                         preheader="We have received a request to reset your password",
                         body_heading="Reset your password",
                         content=content)


# Email Template Styles
# ----------------------------------------------------

stylesheet = '''body,table td{font-size:14px}.body,body{background-color:#f6f6f6}.container,.content{display:block;max-width:580px;padding:10px}.btn a,.btn table td{background-color:#fff}.btn,.btn a,.content,.wrapper{box-sizing:border-box}.align-center,.btn table td,.footer{text-align:center}.clear,.footer{clear:both}img{border:none;-ms-interpolation-mode:bicubic;max-width:100%}body{font-family:Helvetica,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.4;margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table{border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%}table td{font-family:sans-serif;vertical-align:top}.body{width:100%}.container{margin:0 auto!important;width:580px}.btn,.footer,.main{width:100%}.content{margin:0 auto}.main{background:#fff;border-radius:3px}.wrapper{padding:32px}.content-block{padding-bottom:10px;padding-top:10px}.footer{margin-top:10px}.footer a,.footer p,.footer span,.footer td{color:#999;font-size:12px;text-align:center}h1,h2,h3,h4{color:#000;font-weight:400;line-height:1.4;margin:0 0 30px}h1{font-size:35px;font-weight:300;line-height:1.15}ol,p,ul{color:#444;font-size:16px;font-weight:400;margin:0 0 15px}.btn a,a{color:#2372f5;text-decoration:none}ol li,p li,ul li{list-style-position:inside;margin-left:5px}a{font-weight:500}.btn>tbody>tr>td{padding-bottom:15px}.btn table{width:auto}.btn table td{border-radius:5px}.btn a{border:1px solid #2372f5;border-radius:2px;cursor:pointer;display:inline-block;font-size:14px;font-weight:500;margin:0;padding:12px 25px;text-transform:capitalize;letter-spacing:.5px}.btn-primary a{background-color:#2372f5;border-radius:4px;color:#fff;border:none}.last,.mb0{margin-bottom:0}.first,.mt0{margin-top:0}.align-right{text-align:right}.align-left{text-align:left}.text-sm{font-size:13px}.preheader{color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;visibility:hidden;width:0}.powered-by a{text-decoration:none}hr{border:0;border-bottom:1px solid #f6f6f6;margin:20px 0}.logo{font-size:36px;color:#000;letter-spacing:-.5px}@media only screen and (max-width:620px){table.body h1{font-size:28px!important;margin-bottom:10px!important}table.body a,table.body ol,table.body p,table.body span,table.body td,table.body ul{font-size:16px!important}table.body .article,table.body .wrapper{padding:10px!important}table.body .content{padding:0!important}table.body .container{padding:0!important;width:100%!important}table.body .main{border-left-width:0!important;border-radius:0!important;border-right-width:0!important}table.body .btn a,table.body .btn table{width:100%!important}table.body .img-responsive{height:auto!important;max-width:100%!important;width:auto!important}}@media all{.ExternalClass{width:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:100%}.apple-link a{color:inherit!important;font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;text-decoration:none!important}#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}.btn-primary a:hover,.btn-primary table td:hover{background-color:#2378fa!important}}'''

footer = '''<hr/><p class="text-sm">We may send emails in future if they be beneficial for you or to convey any policy changes. We will never send marketing emails.</p><br/><div class="align-center">''' + \
    app_name + ''' ''' + str(datetime.datetime.now().year) + '''. <a href="mailto:''' + \
    contact_email + '''" target="_blank">Contact Us</a></div>'''


def _baseTemplate(head_title: str, preheader: str, body_heading: str, content: str):
    base = '''<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>''' + \
        head_title + '''</title><style>''' + stylesheet + '''</style></head><body><span class="preheader">''' + \
        preheader + '''</span><table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body"><tr><td>&nbsp;</td><td class="container"><div class="content"><table role="presentation" class="main"><tr><td class="wrapper"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td><a href="''' + \
        home_url + '''" target="_blank" class="logo"><img src="''' + \
        logo_url + '''" width="220px" alt="''' + app_name + '''"></a><br><br><h1>''' +\
        body_heading + '''</h1><br/>''' + content + footer + \
        '''</td></tr></table></td></tr></table></div></td><td>&nbsp;</td></tr></table></body></html>'''
    return base


def _cta_button(url: str, button_text: str):
    return '''
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary"><tbody><tr>
            <td align="left">
                <a href="''' + url + '''" target="_blank">
                    ''' + button_text + '''
                </a>
            </td>
        </tr></tbody></table>
    '''


if __name__ == "__main__":
    print(welcomeEmailTemplate("John Doe", "https://letsnote.io/verify/123"))
