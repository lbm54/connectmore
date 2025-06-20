import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">Terms of Service</h1>
          <p className="text-lg text-surface-600 dark:text-surface-400">
            Last updated: December 19, 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-surface-800 rounded-lg p-8 shadow-xl border-2 border-electric-cyan/20">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-purple mb-4">1. Acceptance of Terms</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                By accessing and using ConnectMore (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. ConnectMore is operated by Right Path Programming, LLC (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              </p>
              <p className="text-surface-700 dark:text-surface-300">
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-cyan mb-4">2. Description of Service</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                ConnectMore is an event discovery and management platform that allows users to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Discover and browse local events</li>
                <li>Register for and attend events</li>
                <li>Create and manage events (for organizers)</li>
                <li>Connect with other event attendees</li>
                <li>Manage venue information and bookings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-green mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-electric-pink mb-3">3.1 Account Creation</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                To access certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>

              <h3 className="text-xl font-semibold text-electric-pink mb-3">3.2 Account Security</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <h3 className="text-xl font-semibold text-electric-pink mb-3">3.3 Account Termination</h3>
              <p className="text-surface-700 dark:text-surface-300">
                We reserve the right to terminate or suspend your account at any time for violations of these Terms or for any other reason at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-orange mb-4">4. User Content and Conduct</h2>
              
              <h3 className="text-xl font-semibold text-electric-yellow mb-3">4.1 Content Responsibility</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                You are solely responsible for any content you post, upload, or share through the Service. By posting content, you represent that you have all necessary rights to such content and that it does not violate any laws or third-party rights.
              </p>

              <h3 className="text-xl font-semibold text-electric-yellow mb-3">4.2 Prohibited Content</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                You agree not to post content that:
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Is illegal, harmful, threatening, or harassing</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains spam, viruses, or malicious code</li>
                <li>Is fraudulent or misleading</li>
                <li>Promotes violence or discrimination</li>
                <li>Violates privacy or publicity rights</li>
              </ul>

              <h3 className="text-xl font-semibold text-electric-yellow mb-3">4.3 Content License</h3>
              <p className="text-surface-700 dark:text-surface-300">
                By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, copy, modify, and display such content in connection with operating the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">5. Event Management</h2>
              
              <h3 className="text-xl font-semibold text-electric-green mb-3">5.1 Event Organizers</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                Event organizers are responsible for the accuracy of event information, compliance with applicable laws, and the actual conduct of their events. We are not responsible for the quality, safety, or legality of events listed on our platform.
              </p>

              <h3 className="text-xl font-semibold text-electric-green mb-3">5.2 Event Attendance</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                By registering for an event, you agree to comply with the event organizer&apos;s terms and conditions. Refund policies are determined by individual event organizers.
              </p>

              <h3 className="text-xl font-semibold text-electric-green mb-3">5.3 Event Cancellations</h3>
              <p className="text-surface-700 dark:text-surface-300">
                Event organizers may cancel or modify events at their discretion. We are not liable for any damages resulting from event cancellations or modifications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-red mb-4">6. Payment Terms</h2>
              
              <h3 className="text-xl font-semibold text-electric-orange mb-3">6.1 Payment Processing</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                Payments are processed through secure third-party payment providers. We do not store your payment information on our servers.
              </p>

              <h3 className="text-xl font-semibold text-electric-orange mb-3">6.2 Fees</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                We may charge fees for certain services. All fees are clearly disclosed before you complete a transaction.
              </p>

              <h3 className="text-xl font-semibold text-electric-orange mb-3">6.3 Refunds</h3>
              <p className="text-surface-700 dark:text-surface-300">
                Refund policies vary by event and are determined by event organizers. Platform fees may be non-refundable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-purple mb-4">7. Privacy</h2>
              <p className="text-surface-700 dark:text-surface-300">
                Your privacy is important to us. Please review our{" "}
                <Link href="/privacy-policy" className="text-electric-cyan hover:text-electric-blue transition-colors">
                  Privacy Policy
                </Link>{" "}
                to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-cyan mb-4">8. Intellectual Property</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                The Service and its content, features, and functionality are owned by Right Path Programming, LLC and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-surface-700 dark:text-surface-300">
                You may not modify, copy, distribute, transmit, display, reproduce, or create derivative works from the Service without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-pink mb-4">9. Disclaimers</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, WHETHER EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-surface-700 dark:text-surface-300">
                We do not warrant that the Service will be uninterrupted, error-free, or completely secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-orange mb-4">10. Limitation of Liability</h2>
              <p className="text-surface-700 dark:text-surface-300">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, RIGHT PATH PROGRAMMING, LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA, OR USE, ARISING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-yellow mb-4">11. Indemnification</h2>
              <p className="text-surface-700 dark:text-surface-300">
                You agree to defend, indemnify, and hold harmless Right Path Programming, LLC from any claims, damages, costs, and expenses (including attorneys&apos; fees) arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-green mb-4">12. Governing Law</h2>
              <p className="text-surface-700 dark:text-surface-300">
                These Terms shall be governed by and construed in accordance with the laws of the State of Alabama, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Jefferson County, Alabama.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">13. Changes to Terms</h2>
              <p className="text-surface-700 dark:text-surface-300">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on our website. Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-red mb-4">14. Severability</h2>
              <p className="text-surface-700 dark:text-surface-300">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will continue to be valid and enforceable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-purple mb-4">15. Contact Information</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-surface-100 dark:bg-surface-700 p-4 rounded-lg">
                <p className="text-surface-700 dark:text-surface-300 mb-2">
                  <strong>Right Path Programming, LLC</strong>
                </p>
                <p className="text-surface-700 dark:text-surface-300 mb-2">
                  3532 Savannah Park Lane<br />
                  Birmingham, Alabama 35216
                </p>
                <p className="text-surface-700 dark:text-surface-300">
                  Email:{" "}
                  <a href="mailto:rightpathprogramming@gmail.com" className="text-electric-cyan hover:text-electric-blue transition-colors">
                    rightpathprogramming@gmail.com
                  </a>
                </p>
              </div>
            </section>

          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-electric-cyan hover:text-electric-blue transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 