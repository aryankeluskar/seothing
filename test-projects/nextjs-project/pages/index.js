import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Next.js Test Project</title>
        <meta name="description" content="Next.js test project for SEOthing testing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Next.js Test Project</h1>
        
        <section>
          <h2>Hero Section</h2>
          <img src="/images/hero-banner.jpg" alt="Hero Banner" width={800} height={400} />
        </section>
        
        <section>
          <h2>About</h2>
          <p>This is a Next.js project for testing SEOthing.</p>
          <img src="/images/about-team.png" alt="Our Team" width={600} height={300} />
        </section>
        
        <section>
          <h2>Portfolio</h2>
          <img src="/images/portfolio1.jpeg" alt="Portfolio Item 1" width={300} height={200} />
          <img src="/images/portfolio2.gif" alt="Portfolio Item 2" width={300} height={200} />
        </section>
      </main>
    </div>
  );
} 