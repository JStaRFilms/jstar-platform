import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Privacy Policy for J StaR Films Studios - Learn how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
    const lastUpdated = "January 3, 2026";

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-400">Last updated: {lastUpdated}</p>
                </header>

                {/* Content */}
                <article className="prose prose-lg prose-invert max-w-none space-y-8">
                    {/* Introduction */}
                    <section>
                        <p className="text-lg leading-relaxed">
                            J StaR Films Studios (&quot;JStar Studios,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services at{" "}
                            <a href="https://www.jstarstudios.com" className="text-jstar-blue hover:text-jstar-blue/80 transition-colors">
                                www.jstarstudios.com
                            </a>.
                        </p>
                    </section>

                    {/* Data Collection */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Data Collection</h2>
                        <p className="mb-4">We collect information that you provide directly to us, including:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong className="text-white">Account Information:</strong> When you create an account using Google Sign-In, we collect your email address, name, and profile picture as provided by Google.</li>
                            <li><strong className="text-white">Contact Information:</strong> When you submit inquiries through our contact form, we collect your name, email address, and message content.</li>
                            <li><strong className="text-white">Newsletter Subscription:</strong> If you subscribe to our newsletter, we collect your email address.</li>
                            <li><strong className="text-white">Usage Data:</strong> We automatically collect information about how you interact with our services, including pages visited, features used, and time spent on the platform.</li>
                        </ul>
                    </section>

                    {/* Purpose of Processing */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Purpose of Data Processing</h2>
                        <p className="mb-4">We use the information we collect for the following purposes:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong className="text-white">Account Creation:</strong> To create and manage your user account on our platform.</li>
                            <li><strong className="text-white">Service Personalization:</strong> To personalize your experience and provide tailored content and recommendations.</li>
                            <li><strong className="text-white">Communication:</strong> To send you updates, newsletters (if subscribed), and respond to your inquiries.</li>
                            <li><strong className="text-white">Service Improvement:</strong> To analyze usage patterns and improve our services, features, and user experience.</li>
                            <li><strong className="text-white">Security:</strong> To protect against unauthorized access, maintain data integrity, and ensure the security of our services.</li>
                        </ul>
                    </section>

                    {/* Data Sharing */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Data Sharing</h2>
                        <p className="mb-4">
                            <strong className="text-white">We do not sell your personal data to third parties.</strong>
                        </p>
                        <p className="mb-4">We may share your information only in the following circumstances:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong className="text-white">Service Providers:</strong> With trusted third-party vendors who assist us in operating our website and providing our services (e.g., hosting, analytics).</li>
                            <li><strong className="text-white">Legal Requirements:</strong> When required by law, legal process, or government request.</li>
                            <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity.</li>
                        </ul>
                    </section>

                    {/* Data Retention & Deletion */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Data Retention & Deletion</h2>
                        <p className="mb-4">
                            We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, typically for the duration of your account&apos;s active status plus an additional 30 days for backup and recovery purposes.
                        </p>
                        <p className="mb-4">
                            <strong className="text-white">Your Rights:</strong> You have the right to request deletion of your personal data at any time. To request data deletion, please contact us at{" "}
                            <a href="mailto:privacy@jstarstudios.com" className="text-jstar-blue hover:text-jstar-blue/80 transition-colors">
                                privacy@jstarstudios.com
                            </a>{" "}
                            or use the account settings in your dashboard. We will process your request within 30 days.
                        </p>
                    </section>

                    {/* Google API Disclosure */}
                    <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Google API Services Disclosure</h2>
                        <p className="mb-4">
                            JStar Studios&apos; use of information received from Google APIs will adhere to the{" "}
                            <a
                                href="https://developers.google.com/terms/api-services-user-data-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-jstar-blue hover:text-jstar-blue/80 transition-colors underline"
                            >
                                Google API Services User Data Policy
                            </a>
                            , including the Limited Use requirements.
                        </p>
                        <p>
                            Specifically, we limit our use of Google user data to providing and improving our services. We do not use Google user data for advertising purposes or sell this data to third parties.
                        </p>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal data, including encryption in transit (TLS/SSL) and at rest. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* Cookies */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies & Tracking Technologies</h2>
                        <p className="mb-4">
                            We use cookies and similar tracking technologies to enhance your experience on our website. These include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong className="text-white">Essential Cookies:</strong> Required for the basic functionality of our website.</li>
                            <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
                            <li><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences.</li>
                        </ul>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Children&apos;s Privacy</h2>
                        <p>
                            Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal data from a child under 13, we will take steps to delete that information.
                        </p>
                    </section>

                    {/* Changes to Policy */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to This Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions about this Privacy Policy or our data practices, please contact us at:
                        </p>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                            <p className="font-semibold text-white mb-2">J StaR Films Studios</p>
                            <p>
                                Email:{" "}
                                <a href="mailto:privacy@jstarstudios.com" className="text-jstar-blue hover:text-jstar-blue/80 transition-colors">
                                    privacy@jstarstudios.com
                                </a>
                            </p>
                            <p>
                                Website:{" "}
                                <a href="https://www.jstarstudios.com/contact" className="text-jstar-blue hover:text-jstar-blue/80 transition-colors">
                                    www.jstarstudios.com/contact
                                </a>
                            </p>
                        </div>
                    </section>
                </article>
            </div>
        </main>
    );
}
