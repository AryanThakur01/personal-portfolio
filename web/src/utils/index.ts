let CLOUDFRONT_REGION = '---';
const getCloudfrontRegion = async () => {
  const res = await fetch('https://d2h4lszp1ffbsn.cloudfront.net/favicon.svg', {
    cache: 'no-store',
  });
  const pop = res.headers.get('x-amz-cf-pop');
  console.log('CloudFront POP:', pop);
  if (pop) {
    CLOUDFRONT_REGION = pop;
  }
};
getCloudfrontRegion().catch(() => {});

export { CLOUDFRONT_REGION };
