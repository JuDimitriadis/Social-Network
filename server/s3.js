const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("../secrets.json");
}

const s3 = new aws.S3({
    accessKeyId: secrets.aws.key,
    secretAccessKey: secrets.aws.secret,
});

const fs = require("fs");

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file received");
        return res.sendStatus(500); // user didn't provide an img or sth went wrong with multer
    }

    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "auspic", // <--- should be spicedling if you are working with spiced provided credentials
            ACL: "public-read", // makes sure what we upload can be access online
            Key: filename, // is responsible for the name of the object created in the bucket
            Body: fs.createReadStream(path), // stream to where the file is that we like to upload
            ContentType: mimetype, // ensures that under the hood content type headers can be set
            ContentLength: size, // and most likely also content length headers
        })
        .promise();

    promise
        .then(() => {
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) =>
            console.log("something went wrong with uploading to the cloud", err)
        );
};
