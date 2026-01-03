import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Terms of Service for J StaR Films Studios - Review the rules and guidelines for using our platform.",
};

export default function TermsOfServicePage() {
    const lastUpdated = "January 3, 2026";
    const effectiveDate = "January 3, 2026";

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-gray-400">Last updated: {lastUpdated}</p>
                    <p className="text-gray-400">Effective date: {effectiveDate}</p>
                </header>

                {/* Content */}
                <article className="prose prose-lg prose-invert max-w-none space-y-8">
                    {/* Introduction */}
                    <section>
                        <p className="text-lg leading-relaxed">
                            Welcome to J StaR Films Studios. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, products, and services at{" "}
                            <a href="https://www.jstarstudios.com" className="text-jstar-blue hover:text-jstar-blue/80 transition-colors">
                                www.jstarstudios.com
                            </a>{" "}
                            (collectively, the &quot;Services&quot;). Please read these Terms carefully before using our Services.
                        </p>
                    </section>

                    {/* Acceptance of Terms */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing or using our Services, you agree to be bound by these Terms and our{" "}
                            <a href="/privacy-policy" className="text-jstar-blue hover:text-jstar-blue/80 transition-colors">
                                Privacy Policy
                            </a>
                            . If you do not agree to these Terms, you may not access or use our Services.
                        </p>
                        <p>
                            We may update these Terms from time to time. Your continued use of the Services after any changes indicates your acceptance of the updated Terms.
                        </p>
                    </section>

                    {/* Eligibility */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Eligibility</h2>
                        <p>
                            You must be at least 13 years of age to use our Services. By using our Services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
                        </p>
                    </section>

                    {/* Account Registration */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration</h2>
                        <p className="mb-4">
                            To access certain features of our Services, you may be required to create an account. When you create an account, you agree to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain and promptly update your account information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Accept responsibility for all activities that occur under your account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                        </ul>
                    </section>

                    {/* User Conduct */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. User Conduct</h2>
                        <p className="mb-4">
                            When using our Services, you agree NOT to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Violate any applicable laws, regulations, or third-party rights</li>
                            <li>Use the Services for any illegal, harmful, or fraudulent purposes</li>
                            <li>Upload, transmit, or distribute any viruses, malware, or other harmful code</li>
                            <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
                            <li>Interfere with or disrupt the integrity or performance of the Services</li>
                            <li>Harass, abuse, threaten, or intimidate other users</li>
                            <li>Impersonate any person or entity or misrepresent your affiliation</li>
                            <li>Engage in any activity that could damage, disable, or impair our Services</li>
                            <li>Use automated means (bots, scrapers, etc.) to access the Services without our permission</li>
                            <li>Circumvent any access or usage restrictions implemented by us</li>
                        </ul>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                        <p className="mb-4">
                            <strong className="text-white">Our Content:</strong> All content, features, and functionality of our Services—including but not limited to text, graphics, logos, icons, images, audio clips, video clips, software, and the &quot;J StaR Films Studios&quot; brand—are owned by J StaR Films Studios or our licensors and are protected by international copyright, trademark, patent, and other intellectual property laws.
                        </p>
                        <p className="mb-4">
                            <strong className="text-white">Your Content:</strong> You retain ownership of any content you submit, post, or display through our Services. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with providing our Services.
                        </p>
                        <p>
                            <strong className="text-white">Restrictions:</strong> You may not copy, modify, distribute, sell, or lease any part of our Services or included software, nor may you reverse engineer or attempt to extract the source code of any software.
                        </p>
                    </section>

                    {/* Third-Party Services */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Third-Party Services</h2>
                        <p>
                            Our Services may contain links to third-party websites or integrate with third-party services (such as Google Sign-In). We are not responsible for the content, privacy policies, or practices of any third-party services. Your use of such services is at your own risk and subject to their respective terms and conditions.
                        </p>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
                        <p className="mb-4">
                            <strong className="text-white">By You:</strong> You may terminate your account at any time by contacting us or using the account deletion feature in your dashboard.
                        </p>
                        <p className="mb-4">
                            <strong className="text-white">By Us:</strong> We reserve the right to suspend or terminate your access to our Services at any time, with or without cause and with or without notice, including if we believe you have violated these Terms.
                        </p>
                        <p>
                            Upon termination, your right to use the Services will immediately cease. All provisions of these Terms that should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                        </p>
                    </section>

                    {/* Disclaimers */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimers</h2>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                            <p className="mb-4">
                                <strong className="text-white">THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</strong>
                            </p>
                            <p className="mb-4">
                                We do not warrant that the Services will be uninterrupted, error-free, or secure. We disclaim all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
                            </p>
                            <p>
                                Any content or materials downloaded or otherwise obtained through the Services are accessed at your own risk, and you will be solely responsible for any damage or loss resulting from such access.
                            </p>
                        </div>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                            <p className="mb-4">
                                <strong className="text-white">TO THE MAXIMUM EXTENT PERMITTED BY LAW, J STAR FILMS STUDIOS AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</strong>
                            </p>
                            <p>
                                This includes, but is not limited to, damages for loss of profits, goodwill, data, or other intangible losses resulting from: (a) your use or inability to use the Services; (b) unauthorized access to or alteration of your data; (c) statements or conduct of any third party; or (d) any other matter relating to the Services.
                            </p>
                        </div>
                    </section>

                    {/* Indemnification */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Indemnification</h2>
                        <p>
                            You agree to indemnify, defend, and hold harmless J StaR Films Studios and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys&apos; fees) arising out of or in any way connected with your access to or use of the Services, your violation of these Terms, or your infringement of any third-party rights.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">11. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Nigeria.
                        </p>
                    </section>

                    {/* Severability */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">12. Severability</h2>
                        <p>
                            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions of these Terms shall remain in full force and effect.
                        </p>
                    </section>

                    {/* Entire Agreement */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">13. Entire Agreement</h2>
                        <p>
                            These Terms, together with our Privacy Policy, constitute the entire agreement between you and J StaR Films Studios regarding your use of the Services and supersede all prior agreements and understandings.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                            <p className="font-semibold text-white mb-2">J StaR Films Studios</p>
                            <p>
                                Email:{" "}
                                <a href="mailto:legal@jstarstudios.com" className="text-jstar-blue hover:text-jstar-blue/80 transition-colors">
                                    legal@jstarstudios.com
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
