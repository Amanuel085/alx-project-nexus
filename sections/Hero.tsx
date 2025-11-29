import Image from "next/image";
import Link from "next/link";
import dnaImage from "@/public/dna.png";

export default function Hero() {
  return (
    <section className="bg-background">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-tight mb-6 text-foreground">
              Create. Vote. Decide.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-xl">
              A simple and interactive online polling system.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/create" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium shadow-sm">
                Create Poll
              </Link>
              <Link href="/polls" className="px-8 py-3 rounded-md font-medium border-2 border-primary text-primary bg-background">
                Browse Polls
              </Link>
            </div>
          </div>
          <div className="justify-self-center md:justify-self-end">
            <Image
              src={dnaImage}
              alt="Polling illustration"
              width={720}
              height={405}
              className="rounded-2xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}