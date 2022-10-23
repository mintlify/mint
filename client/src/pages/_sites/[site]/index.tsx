import Page from './[[...slug]]';

export const getStaticProps = async ({ params }: any) => {
  return null;
};

export default function HomePage(props: any) {
  return <Page {...props} />;
}
