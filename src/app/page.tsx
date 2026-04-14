import { Navbar } from '@/components/navigation/navbar';
import { Footer } from '@/components/navigation/footer';
import { AnalyticsWrapper } from '@/components/sections/analytics-wrapper';

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <AnalyticsWrapper />
      </main>
      <Footer />
    </>
  );
}
