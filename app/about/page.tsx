export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Pollify</h1>
        <p className="text-muted-foreground mb-8">
          Pollify helps communities make decisions together. Create polls, share them, and let people vote in real time. Whether it’s choosing a feature, planning an event, or taking the pulse of your audience, Pollify makes feedback fast and visual.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="border border-border rounded-lg p-6 bg-secondary">
            <h3 className="text-lg font-semibold mb-2">Create</h3>
            <p className="text-sm text-muted-foreground">Spin up polls in seconds with clean UI, categories, and multiple options.</p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-secondary">
            <h3 className="text-lg font-semibold mb-2">Vote</h3>
            <p className="text-sm text-muted-foreground">Anyone can participate. Results update instantly and are easy to understand.</p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-secondary">
            <h3 className="text-lg font-semibold mb-2">Decide</h3>
            <p className="text-sm text-muted-foreground">Use insights to make clear decisions backed by your community.</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Our Principles</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <li className="border border-border rounded-lg p-5">
            <span className="font-medium">Clarity</span>
            <p className="text-sm text-muted-foreground mt-1">Simple, focused experiences that keep the signal high.</p>
          </li>
          <li className="border border-border rounded-lg p-5">
            <span className="font-medium">Inclusivity</span>
            <p className="text-sm text-muted-foreground mt-1">Everyone should be able to vote and be heard.</p>
          </li>
          <li className="border border-border rounded-lg p-5">
            <span className="font-medium">Privacy</span>
            <p className="text-sm text-muted-foreground mt-1">We protect user data and use secure authentication.</p>
          </li>
          <li className="border border-border rounded-lg p-5">
            <span className="font-medium">Transparency</span>
            <p className="text-sm text-muted-foreground mt-1">Results and rules are clear and reliable.</p>
          </li>
        </ul>
      </section>
    </main>
  );
}