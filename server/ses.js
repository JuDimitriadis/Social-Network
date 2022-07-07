const AWS = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

AWS.config.update({
    accessKeyId: secrets.aws.key,
    secretAccessKey: secrets.aws.secret,
    region: secrets.aws.ses.region,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

const sendEmail = (email, code) => {
    const params = {
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: `Here it's the code to reset your password ${code}`,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "The Expat Mom - reset you password",
            },
        },
        ReturnPath: secrets.aws.ses.from.default,
        Source: secrets.aws.ses.from.default,
    };

    ses.sendEmail(params, (err, data) => {
        if (err) {
            return console.log(err, err.stack);
        } else {
            console.log("Email sent.", data);
            return data;
        }
    });
};

module.exports = { sendEmail };
