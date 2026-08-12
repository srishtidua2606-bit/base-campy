import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendEmail = async( options) => {
   const mailGenerator = new Mailgen({
        theme : "default",
        product : {
            name : "Task Manager",
            link : "https://taskmanagelink.com"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHtml = mailGenerator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host : process.env.MAILTRAP_SMTP_HOST,
        port : process.env.MAILTRAP_SMTP_PORT,
        auth : {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail = {
        from : "mail.taskmanager@example.com",
        to : options.email,
        subject: options.subject,
        text : emailTextual,
        html : emailHtml
    }
    try{
        await transporter.sendMail(mail)
    }catch(error){
        console.error("Email service failed. Make sure you have provided your MAILTRAP credetials in te . env file", error

        )
    }
}







const emailVerficationMailgenContent = (username , verficationUrl) => {
    return {
        body: {
            name : username,
            intro : "Welcome to our service! We're excited to have you on board.",
            action : {
                instructions : "To verify your email please click on the following button",
                button : {
                    color : "#22BC66",
                    text : "Verify your email",
                    link: verficationUrl
                },
                outro : 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        }
    }
}
const forgotPasswordMailgenContent = (username , passwordResetUrl) => {
    return {
        body: {
            name : username,
            intro : "We got a request to reset the passowrd of your acount.",
            action : {
                instructions : "To reset your password please click on the following button",
                button : {
                    color : "#bc4b22",
                    text : "Reset your password",
                    link: passwordResetUrl
                },
                outro : 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        }
    }
}
export {
    emailVerficationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}