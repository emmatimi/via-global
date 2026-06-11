import { Hero } from '../components/Hero';
import { FinishedWorks } from '../components/FinishedWorks';
import { Programs } from '../components/Programs';
import { UpcomingPrograms } from '../components/UpcomingPrograms';
import { Events } from '../components/Events';
import { Testimonials } from '../components/Testimonials';
import { Partner } from '../components/Partner';

export function Home() {
  return (
    <>
      <Hero />
      <FinishedWorks />
      <Programs />
      <UpcomingPrograms />
      <Events />
      <Testimonials />
      <Partner />
    </>
  );
}
