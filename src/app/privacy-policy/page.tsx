import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">Privacy Policy</h1>
          <p className="text-lg text-surface-600 dark:text-surface-400">
            Last updated: December 19, 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-surface-800 rounded-lg p-8 shadow-xl border-2 border-electric-cyan/20">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-purple mb-4">Introduction</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                Welcome to ConnectMore (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p className="text-surface-700 dark:text-surface-300">
                ConnectMore is operated by Right Path Programming, LLC, located at 3532 Savannah Park Lane, Birmingham, Alabama 35216.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-cyan mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-electric-green mb-3">Personal Information</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                We may collect the following personal information when you use our services:
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Name and contact information (email address, phone number)</li>
                <li>Profile information and photos</li>
                <li>Event preferences and interests</li>
                <li>Location data (when you allow location services)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-electric-green mb-3">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Log files and analytics data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-pink mb-4">How We Use Your Information</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Provide and maintain our event discovery and management services</li>
                <li>Create and manage your account</li>
                <li>Process event registrations and payments</li>
                <li>Send you relevant event recommendations</li>
                <li>Communicate with you about events, updates, and promotional offers</li>
                <li>Improve our services and user experience</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-orange mb-4">Information Sharing and Disclosure</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold text-electric-green mb-3">With Event Organizers</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                When you register for an event, we share necessary information with event organizers to facilitate your participation.
              </p>

              <h3 className="text-xl font-semibold text-electric-green mb-3">Service Providers</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                We work with trusted third-party service providers for payment processing, analytics, email delivery, and other services.
              </p>

              <h3 className="text-xl font-semibold text-electric-green mb-3">Legal Requirements</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                We may disclose your information if required by law or to protect our rights, property, or safety.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-yellow mb-4">Data Security</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication procedures</li>
                <li>Employee training on data protection</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">Your Rights and Choices</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li><strong>Access:</strong> Request copies of your personal information</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate information</li>
                <li><strong>Erasure:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Objection:</strong> Object to processing of your information</li>
                <li><strong>Restriction:</strong> Request limitation of processing</li>
              </ul>
              <p className="text-surface-700 dark:text-surface-300">
                To exercise these rights, please contact us at{" "}
                <a href="mailto:rightpathprogramming@gmail.com" className="text-electric-cyan hover:text-electric-blue transition-colors">
                  rightpathprogramming@gmail.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-red mb-4">Cookies and Tracking</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings. For more information, see our{" "}
                <Link href="/cookie-policy" className="text-electric-cyan hover:text-electric-blue transition-colors">
                  Cookie Policy
                </Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-green mb-4">Third-Party Links</h2>
              <p className="text-surface-700 dark:text-surface-300">
                Our service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-purple mb-4">Children&apos;s Privacy</h2>
              <p className="text-surface-700 dark:text-surface-300">
                Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-orange mb-4">International Data Transfers</h2>
              <p className="text-surface-700 dark:text-surface-300">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-pink mb-4">Data Retention</h2>
              <p className="text-surface-700 dark:text-surface-300">
                We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-cyan mb-4">Changes to This Privacy Policy</h2>
              <p className="text-surface-700 dark:text-surface-300">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-yellow mb-4">Contact Us</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
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