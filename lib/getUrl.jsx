export default function getUrl(key) {
  return `${process.env.NEXT_PUBLIC_S3_URL}/${key}`;
}
