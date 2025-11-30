export default function LegalPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Terms of Service & Privacy Policy</h2>
        <p className="text-sm text-[#7E7B7B] mb-8">
          Welcome to Pollify. Please read our Terms of Service and Privacy Policy carefully to understand your rights and responsibilities when using our platform.
        </p>

        {/* Terms of Service */}
        <div className="space-y-6 mb-12">
          <h3 className="text-xl font-semibold">Terms of Service</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium">1. User Responsibilities</h4>
              <p>You are responsible for maintaining your account security and ensuring polls comply with community guidelines.</p>
            </div>
            <div>
              <h4 className="font-medium">2. Poll Usage Guidelines</h4>
              <p>Polls must not contain offensive, illegal, or harmful content. Pollify reserves the right to remove any poll that violates these rules.</p>
            </div>
            <div>
              <h4 className="font-medium">3. Limitations of Liability</h4>
              <p>Pollify is provided “as is” without warranties. We are not liable for damages arising from use of the platform.</p>
            </div>
            <div>
              <h4 className="font-medium">4. Governing Law</h4>
              <p>These terms are governed by applicable laws in your jurisdiction.</p>
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Privacy Policy</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium">1. Information We Collect</h4>
              <p>We collect information you provide when creating polls, voting, or signing up, as well as technical data such as device type and usage statistics.</p>
            </div>
            <div>
              <h4 className="font-medium">2. How We Use Data</h4>
              <p>Your data is used to improve poll accuracy, enhance user experience, and provide relevant content.</p>
            </div>
            <div>
              <h4 className="font-medium">3. Sharing & Security</h4>
              <p>We do not sell your data. Pollify implements industry-standard security measures to protect your information.</p>
            </div>
            <div>
              <h4 className="font-medium">4. Your Rights</h4>
              <p>You may request deletion of your account or data at any time through the settings page.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}