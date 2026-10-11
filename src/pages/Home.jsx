import { useQuery } from '@tanstack/react-query';
import { getComingSoon, getFeatured, getNowPlaying } from '../api/movies';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import CardBig from '../components/cards/CardBig';
import CardMedium from '../components/cards/CardMedium';
import CardSmall from '../components/cards/CardSmall';
import Hero from '../components/home/Hero';
import HomeSection, { SectionEmpty, SectionError } from '../components/home/HomeSection';
import MovieRow from '../components/home/MovieRow';
import { getRecentlyViewed } from '../hooks/useRecentlyViewed';

function Divider() {
  return <div className="my-10 h-px bg-raised" />;
}

function HeroArea({ query }) {
  if (query.isError) {
    return (
      <div className="-mt-27.75 flex h-190 flex-col items-center justify-center gap-3">
        <p className="text-body-m text-muted">Something went wrong while loading.</p>
        <Button variant="transparent" onClick={() => query.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!query.data) {
    return <Skeleton className="-mt-27.75 h-190 animate-pulse" />;
  }

  if (query.data.length === 0) {
    return <div className="-mt-27.75 h-190" />;
  }

  return <Hero movies={query.data} />;
}

function Row({ query, gap, skeleton, empty, render }) {
  if (query.isError) {
    return <SectionError onRetry={() => query.refetch()} />;
  }

  if (!query.data) {
    return (
      <MovieRow gap={gap}>
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className={`shrink-0 animate-pulse ${skeleton}`} />
        ))}
      </MovieRow>
    );
  }

  if (query.data.length === 0) {
    return <SectionEmpty>{empty}</SectionEmpty>;
  }

  return <MovieRow gap={gap}>{query.data.map(render)}</MovieRow>;
}

export default function Home() {
  const featured = useQuery({ queryKey: ['featured'], queryFn: getFeatured });
  const nowPlaying = useQuery({ queryKey: ['now-playing'], queryFn: () => getNowPlaying() });
  const comingSoon = useQuery({ queryKey: ['coming-soon'], queryFn: () => getComingSoon() });
  const recent = getRecentlyViewed();

  return (
    <div className="pb-9">
      <HeroArea query={featured} />

      <div className="px-17.5 pt-8">
        {recent.length > 0 && (
          <>
            <div className="pt-2.25">
              <HomeSection title="Recently viewed" titleClassName="text-h2" showAll={false}>
                <MovieRow gap="gap-5">
                  {recent.map((movie) => (
                    <CardSmall key={movie.id} movie={movie} />
                  ))}
                </MovieRow>
              </HomeSection>
            </div>
            <Divider />
          </>
        )}

        <HomeSection title="NOW PLAYING" titleClassName="text-h1" seeAllTo="/sessions">
          <Row
            query={nowPlaying}
            gap="gap-4.25"
            skeleton="h-113 w-65 rounded-[20px]"
            empty="No films are playing right now."
            render={(movie) => <CardBig key={movie.id} movie={movie} />}
          />
        </HomeSection>

        <Divider />

        <HomeSection title="COMING SOON..." titleClassName="text-h1">
          <Row
            query={comingSoon}
            gap="gap-5"
            skeleton="h-40 w-117.5 rounded-[20px]"
            empty="Nothing is coming soon right now."
            render={(movie) => <CardMedium key={movie.id} movie={movie} />}
          />
        </HomeSection>
      </div>
    </div>
  );
}
