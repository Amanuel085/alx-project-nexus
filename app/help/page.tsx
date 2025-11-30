"use client";

import Link from "next/link";

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Help Center</h1>
        <p className="text-muted-foreground mb-8">Find answers, troubleshoot issues, and learn how to use Pollify.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Creating Polls</h2>
            <p className="text-sm text-muted-foreground mb-3">Learn how to create polls with options, images, and categories.</p>
            <ul className="text-sm list-disc pl-5 space-y-2">
              <li>Open Polls and click Create</li>
              <li>Add at least two options</li>
              <li>Select a category</li>
              <li>Publish</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Voting</h2>
            <p className="text-sm text-muted-foreground mb-3">Cast one vote per poll. Results update in real time.</p>
            <ul className="text-sm list-disc pl-5 space-y-2">
              <li>Select an option and submit</li>
              <li>Closed polls show results only</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Managing Polls</h2>
            <p className="text-sm text-muted-foreground mb-3">Edit, delete, or close polls you created.</p>
            <ul className="text-sm list-disc pl-5 space-y-2">
              <li>Edit title and description</li>
              <li>Delete with confirmation</li>
              <li>Close to stop voting</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Themes</h2>
            <p className="text-sm text-muted-foreground mb-3">Enable Dark Mode from Settings. It applies to your account only.</p>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Need More Help?</h2>
          <p className="text-sm text-muted-foreground mb-4">Contact our support team or browse common questions.</p>
          <div className="flex gap-4">
            <Link href="/contact" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">Contact Support</Link>
            <Link href="/legal" className="border border-border px-4 py-2 rounded-md text-sm">Privacy & Terms</Link>
          </div>
        </div>
      </section>
    </main>
  );
}