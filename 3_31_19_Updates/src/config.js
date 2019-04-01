export default {
    // s3: {
    //   REGION: "YOUR_S3_UPLOADS_BUCKET_REGION",
    //   BUCKET: "YOUR_S3_UPLOADS_BUCKET_NAME"
    // },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://oco3d53axf.execute-api.us-east-1.amazonaws.com/prod/hello"
    },
    cognito: {
      REGION: "us-east-2",
      USER_POOL_ID: "us-east-2_JPUacg84r",
      APP_CLIENT_ID: "qn8njsu4ka9u6ssvbd2n47lmu",
      IDENTITY_POOL_ID: "us-east-2:cea56946-c081-4154-a035-056e8423522f"
    }
  };