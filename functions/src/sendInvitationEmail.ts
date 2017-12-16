import * as functions from 'firebase-functions'
import * as nodemailer from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/smtp-transport';
import { firestore } from 'firebase-admin';


const gmailEmail = functions.config().gmail.email
const gmailPassword = functions.config().gmail.password
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail, pass: gmailPassword
  }
})

const APP_NAME = 'Veislulist'

export const sendInvitation = functions.firestore.document('customerInvites/{id}').onCreate(event => {
  const data = event.data.data()
  const email = data.email
  const customerId = data.customerId
  return firestore().collection('customers').doc(customerId).get()
    .then(value => {
      const customer = value.data()
      return customer
    }).then(customer => {
       console.log('Sending invitation to', email, gmailEmail, gmailPassword)
       const mailOptions: MailOptions = {
         from: `${APP_NAME} <arnarp@gmail.com>`,
         to: email,
         subject: 'Boð í Netpöntun Veislulist',
         html: invitationEmail
         .replace(/{{customerName}}/g, customer.name)
         .replace(/{{url}}/g, `https://skutan-netpontun-web.firebaseapp.com/customerInvite/${event.params.id}`)
        }
        return mailTransport.sendMail(mailOptions)
    }).then(() => {
      console.log('Invite sent to: ', email)
    })
})

const invitationEmail = `<!DOCTYPE html PUBLIC>
  <html lang="is">

  <head>
    <meta http-equiv="Content-Type" charset='UTF-8'>
    <title>Netpöntun Veislulist</title>



  </head>

  <body bgcolor="#fafafa" topmargin="0" leftmargin="0" marginheight="0" marginwidth="0" style="-ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; background: #fafafa; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; line-height: 20px; margin: 0; min-width: 100%; padding: 0; text-align: center; width: 100% !important">
    <style type="text/css">
      body {
        width: 100% !important;
        min-width: 100%;
        -webkit-font-smoothing: antialiased;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        margin: 0;
        padding: 0;
        background: #fafafa;
      }

      .ExternalClass {
        width: 100%;
      }

      .ExternalClass {
        line-height: 100%;
      }

      #backgroundTable {
        margin: 0;
        padding: 0;
        width: 100% !important;
        line-height: 100% !important;
      }

      img {
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
        width: auto;
        max-width: 100%;
      }

      body {
        color: #333333;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-weight: normal;
        padding: 0;
        margin: 0;
        text-align: center;
        line-height: 1.3;
      }

      body {
        font-size: 14px;
        line-height: 20px;
      }

      a:hover {
        color: #4183C4;
      }

      a:active {
        color: #4183C4;
      }

      a:visited {
        color: #4183C4;
      }

      h1 a:active {
        color: #4183C4;
      }

      h2 a:active {
        color: #4183C4;
      }

      h3 a:active {
        color: #4183C4;
      }

      h4 a:active {
        color: #4183C4;
      }

      h5 a:active {
        color: #4183C4;
      }

      h6 a:active {
        color: #4183C4;
      }

      h1 a:visited {
        color: #4183C4;
      }

      h2 a:visited {
        color: #4183C4;
      }

      h3 a:visited {
        color: #4183C4;
      }

      h4 a:visited {
        color: #4183C4;
      }

      h5 a:visited {
        color: #4183C4;
      }

      h6 a:visited {
        color: #4183C4;
      }

      body.outlook p {
        display: inline !important;
      }

      @media only screen and (max-width: 600px) {
        table[class="body"] h1.primary-heading {
          font-size: 18px !important;
        }
        table[class="body"] div.panel p {
          line-height: 17px !important;
        }
        table[class="body"] img {
          width: auto !important;
          height: auto !important;
        }
        table[class="body"] img.avatar {
          width: 40px !important;
          height: 40px !important;
        }
        table[class="body"] img.content-header-octicon {
          width: 40px !important;
          height: 40px !important;
        }
        table[class="body"] center {
          min-width: 0 !important;
        }
        table[class="body"] .container {
          width: 95% !important;
        }
        table[class="body"] .row {
          width: 100% !important;
          display: block !important;
        }
        table[class="body"] .wrapper {
          display: block !important;
          padding-right: 0 !important;
        }
        table[class="body"] .columns {
          table-layout: fixed !important;
          float: none !important;
          width: 100% !important;
          padding-right: 0px !important;
          padding-left: 0px !important;
          display: block !important;
        }
        table[class="body"] .column {
          table-layout: fixed !important;
          float: none !important;
          width: 100% !important;
          padding-right: 0px !important;
          padding-left: 0px !important;
          display: block !important;
        }
        table[class="body"] .wrapper.first .columns {
          display: table !important;
        }
        table[class="body"] .wrapper.first .column {
          display: table !important;
        }
        table[class="body"] table.columns td {
          width: 100% !important;
        }
        table[class="body"] table.column td {
          width: 100% !important;
        }
        table[class="body"] .columns td.twelve {
          width: 100% !important;
        }
        table[class="body"] .column td.twelve {
          width: 100% !important;
        }
        table[class="body"] table.columns td.expander {
          width: 1px !important;
        }
        div[class="panel"] {
          padding: 12px !important;
        }
        td[class="panel"] {
          padding: 12px !important;
        }
        table[class="panel"] {
          padding: 12px !important;
        }
        table[class="body"] img.logo-wordmark {
          width: 102px !important;
        }
        table[class="body"] img.logo-invertocat {
          width: 40px !important;
        }
      }
    </style>

    <table class="body" style="background: #fafafa; border-collapse: collapse; border-spacing: 0; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; height: 100%; line-height: 20px; margin: 0; padding: 0; text-align: center; vertical-align: top; width: 100%"
      bgcolor="#fafafa">
      <tr style="padding: 0; text-align: center; vertical-align: top" align="center">
        <td class="center" align="center" valign="top" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0; text-align: center; vertical-align: top; word-break: break-word">
          <center style="min-width: 580px; width: 100%">
            <!--email content-->

            <table class="row header" style="border-collapse: collapse; border-spacing: 0; padding: 0px; position: relative; text-align: center; vertical-align: top; width: 100%">
              <tr style="padding: 0; text-align: center; vertical-align: top" align="center">
                <td class="center" align="center" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0; text-align: center; vertical-align: top; word-break: break-word"
                  valign="top">
                  <center style="min-width: 580px; width: 100%">

                    <table class="container" style="border-collapse: collapse; border-spacing: 0; margin: 0 auto; padding: 0; text-align: inherit; vertical-align: top; width: 580px">
                      <tr style="padding: 0; text-align: center; vertical-align: top" align="center">
                        <td class="wrapper last" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0 0px 0 0; position: relative; text-align: center; vertical-align: top; word-break: break-word"
                          align="center" valign="top">

                          <table class="twelve columns" style="border-collapse: collapse; border-spacing: 0; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 540px">
                            <tr style="padding: 0; text-align: center; vertical-align: top" align="center">
                              <td style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0px 0px 10px; text-align: center; vertical-align: top; word-break: break-word"
                                align="center" valign="top">
                                <div class="mark" style="text-align: center" align="center">
                                  <!-- add UTM params to URL -->
                                  <a href="https://github.com" style="color: #4183C4; text-decoration: none">
                                    <img alt="Veislulist" class="center logo-wordmark" src="http://veislulist.is/images/stories/LOGO/veislulist-skutan-banner-930x210-transparentbackground-interlaced.png"
                                      width="102" height="28" style="-ms-interpolation-mode: bicubic; border: none; float: none; margin: 0 auto; max-width: 100%; outline: none; padding: 25px 0 17px; text-align: center; text-decoration: none; width: auto"
                                      align="none">
                                  </a>
                                </div>
                              </td>
                              <td class="expander" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0; text-align: center; vertical-align: top; visibility: hidden; width: 0px; word-break: break-word"
                                align="center" valign="top"></td>
                            </tr>
                          </table>
                          <!--/.twelve.columns-->

                        </td>
                      </tr>
                    </table>
                    <!--/.container-->

                  </center>
                </td>
              </tr>
            </table>
            <!--/.row.header-->

            <table class="container" style="border-collapse: collapse; border-spacing: 0; margin: 0 auto; padding: 0; text-align: inherit; vertical-align: top; width: 580px">
              <tr style="padding: 0; text-align: center; vertical-align: top" align="center">
                <td style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0; text-align: center; vertical-align: top; word-break: break-word"
                  align="center" valign="top">

                  <table class="row" style="border-collapse: collapse; border-spacing: 0; display: block; padding: 0px; position: relative; text-align: center; vertical-align: top; width: 100%">
                    <tr style="padding: 0; text-align: center; vertical-align: top" align="center">
                      <td class="wrapper last" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0 0px 0 0; position: relative; text-align: center; vertical-align: top; word-break: break-word"
                        align="center" valign="top">

                        <div class="panel" style="background: #ffffff; border-radius: 3px; border: 1px solid #dddddd; box-shadow: 0 1px 3px rgba(0,0,0,0.05); padding: 20px">

                          <table class="twelve columns" style="border-collapse: collapse; border-spacing: 0; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 540px">
                            <tr style="padding: 0; text-align: center; vertical-align: top" align="center">
                              <td style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0px 0px 0; text-align: center; vertical-align: top; word-break: break-word"
                                align="center" valign="top">

                                <div class="email-content">

                                  <h1 class="primary-heading" style="color: #333; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; font-size: 24px; font-weight: 300; line-height: 1.2; margin: 10px 0 25px; padding: 0; text-align: center; word-break: normal"
                                    align="center">Þér hefur verið boðið að skrá þig sem starfsmann hjá {{customerName}} í Netpöntun Veislulist</h1>

                                  <hr class="rule" style="background: #d9d9d9; border: none; color: #d9d9d9; height: 1px; margin: 20px 0">

                                  <p style="color: #333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: none; line-height: 20px; margin: 15px 0 5px; padding: 0; text-align: left; word-wrap: normal"
                                    align="left">
                                    Til að klára skráninguna þarf þú að smella á eftirfarandi hnapp.
                                  </p>

                                  <!-- note: VML markup is fallback for Outlook 2007, 2010, and 2013; see http://buttons.cm/ -->
                                  <div class="cta-button-wrap cta-button-wrap-centered" style="color: #ffffff; padding: 20px 0 25px; text-align: center" align="center">
                                    <!--[if mso]>
  <p style="line-height:0px;height:0;font-size:1px;margin:0;padding:0;">&nbsp;</p>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://github.com/johannakb/veffoverk5/invitations" style="height:40px;v-text-anchor:middle;width:200px;" arcsize="8%" stroke="f" fillcolor="#4183C4">
    <w:anchorlock/>
    <center>
  <![endif]-->
                                    <a class="cta-button" href="{{url}}" style="-webkit-border-radius: 5px; -webkit-text-size-adjust: none; background: #4183C4; border-radius: 5px; box-shadow: 0px 3px 0px #25588c; color: #ffffff; display: inline-block; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 17px; font-weight: bold; letter-spacing: normal; margin: 0 auto; padding: 12px 44px; text-align: center; text-decoration: none; width: auto !important">
                                      Skoða boð
                                    </a>
                                    <!--[if mso]>
    </center>
  </v:roundrect>
  <![endif]-->
                                  </div>


                                  <p class="email-body-subtext" style="color: #333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: normal; hyphens: none; line-height: 20px; margin: 15px 0 5px; padding: 0; text-align: left; word-wrap: normal"
                                    align="left">
                                    <strong>Ath:</strong> Ef þú bjóst ekki við þessu boði þá getur þú hunsað þennan póst.
                                  </p>

                                  <hr class="rule" style="background: #d9d9d9; border: none; color: #d9d9d9; height: 1px; margin: 20px 0">

                                  <p class="email-text-small email-text-gray" style="color: #777777; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: normal; hyphens: none; line-height: 20px; margin: 15px 0 5px; padding: 0; text-align: left; word-wrap: normal"
                                    align="left">
                                    <strong>Virkar hnappurinn ekki?</strong> Opnaðu þennan tengil í vafranum þínum
                                    <br>
                                    <a href="{{url}}" style="color: #4183C4; text-decoration: none">{{url}}</a>
                                  </p>


                                </div>
                                <!--/.content-->

                              </td>
                              <td class="expander" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0; text-align: center; vertical-align: top; visibility: hidden; width: 0px; word-break: break-word"
                                align="center" valign="top"></td>
                            </tr>
                          </table>
                          <!--/.twelve-columns-->

                        </div>
                        <!--/.panel-->

                      </td>
                    </tr>
                  </table>
                  <!--/.row-->

                </td>
              </tr>
            </table>
            <!--/.container-->

            <table class="row layout-footer" style="border-collapse: collapse; border-spacing: 0; padding: 0px; position: relative; text-align: center; vertical-align: top; width: 100%">
              <tr style="padding: 0; text-align: center; vertical-align: top" align="center">
                <td class="center" align="center" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0; text-align: center; vertical-align: top; word-break: break-word"
                  valign="top">
                  <center style="min-width: 580px; width: 100%">

                    <table class="container" style="border-collapse: collapse; border-spacing: 0; margin: 0 auto; padding: 0; text-align: inherit; vertical-align: top; width: 580px">
                      <tr style="padding: 0; text-align: center; vertical-align: top" align="center">
                        <td class="wrapper last" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0 0px 0 0; position: relative; text-align: center; vertical-align: top; word-break: break-word"
                          align="center" valign="top">

                          <table class="twelve columns" style="border-collapse: collapse; border-spacing: 0; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 540px">
                            <tr style="padding: 0; text-align: center; vertical-align: top" align="center">
                              <td style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0px 0px 10px; text-align: center; vertical-align: top; word-break: break-word"
                                align="center" valign="top">

                                <div class="content" style="margin: 0 0 15px">

                                </div>
                                <div class="content" style="margin: 0 0 15px">
                                  <p class="footer-text" style="color: #999; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: normal; hyphens: none; line-height: 20px; margin: 0; padding: 0; text-align: center; word-wrap: normal"
                                    align="center">Veislulist ehf.</p>
                                  <p class="footer-text" style="color: #999; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: normal; hyphens: none; line-height: 20px; margin: 0; padding: 0; text-align: center; word-wrap: normal"
                                    align="center">Hólshrauni 3</p>
                                  <p class="footer-text" style="color: #999; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: normal; hyphens: none; line-height: 20px; margin: 0; padding: 0; text-align: center; word-wrap: normal"
                                    align="center">220 Hafnarfirði</p>
                                  <p class="footer-text" style="color: #999; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: normal; hyphens: none; line-height: 20px; margin: 0; padding: 0; text-align: center; word-wrap: normal"
                                    align="center">Sími 555 1810</p>
                                </div>
                              </td>
                              <td class="expander" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; padding: 0; text-align: center; vertical-align: top; visibility: hidden; width: 0px; word-break: break-word"
                                align="center" valign="top"></td>
                            </tr>
                          </table>
                          <!--/.twelve.columns-->

                        </td>
                      </tr>
                    </table>
                    <!--/.container-->

                  </center>
                </td>
              </tr>
            </table>
            <!--/.row.footer-->

            <!--/email content-->
          </center>
        </td>
      </tr>
    </table>
    <!--/.body-->
  </body>

  </html>`