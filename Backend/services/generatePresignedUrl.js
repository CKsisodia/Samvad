require("dotenv").config();
const AWS = require("aws-sdk");
const crypto = require("crypto");
const util = require("util");

exports.generatePresignedUrl = async () => {
  const bucketName = process.env.BUCKET_NAME;
  const iamUserAccessKey = process.env.IAM_USER_ACCESS_KEY;
  const iamUserSecretKey = process.env.IAM_USER_SECRET_KEY;
  const awsRegion = process.env.AWS_REGION;

  const randomBytes = util.promisify(crypto.randomBytes);
  const bytes = await randomBytes(16);
  const fileName = bytes.toString("hex");

  let s3Bucket = new AWS.S3({
    region: awsRegion,
    accessKeyId: iamUserAccessKey,
    secretAccessKey: iamUserSecretKey,
    signatureVersion: "v4",
  });

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 60,
    ACL: "public-read",
  };

  const signedUrl = await s3Bucket.getSignedUrlPromise("putObject", params);

  return signedUrl;
};
