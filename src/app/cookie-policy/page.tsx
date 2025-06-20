import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">Cookie Policy</h1>
          <p className="text-lg text-surface-600 dark:text-surface-400">
            Last updated: December 19, 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-surface-800 rounded-lg p-8 shadow-xl border-2 border-electric-cyan/20">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-purple mb-4">What Are Cookies?</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and store information about your preferences or past actions.
              </p>
              <p className="text-surface-700 dark:text-surface-300">
                ConnectMore uses cookies to enhance your experience on our platform and provide you with personalized content and features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-cyan mb-4">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold text-electric-green mb-3">Essential Cookies</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You may disable these through your browser settings, but this may affect how the website functions.
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Authentication and security</li>
                <li>Session management</li>
                <li>Load balancing</li>
                <li>Form submission</li>
              </ul>

              <h3 className="text-xl font-semibold text-electric-pink mb-3">Performance Cookies</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                These cookies collect information about how visitors use our website, such as which pages are visited most often and if they get error messages from web pages.
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Website analytics and usage statistics</li>
                <li>Performance monitoring</li>
                <li>Error tracking</li>
                <li>Page load optimization</li>
              </ul>

              <h3 className="text-xl font-semibold text-electric-orange mb-3">Functional Cookies</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Language preferences</li>
                <li>Theme settings (light/dark mode)</li>
                <li>Location preferences</li>
                <li>Recently viewed events</li>
                <li>Search filters and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-electric-yellow mb-3">Targeting/Advertising Cookies</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                These cookies are used to deliver advertisements that are relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Personalized event recommendations</li>
                <li>Targeted advertisements</li>
                <li>Social media integration</li>
                <li>Marketing campaign tracking</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">Third-Party Cookies</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                We work with trusted third-party service providers who may also set cookies on your device. These include:
              </p>
              
              <h3 className="text-xl font-semibold text-electric-green mb-3">Analytics Services</h3>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li><strong>Google Analytics:</strong> Helps us understand how visitors interact with our website</li>
                <li><strong>Mixpanel:</strong> Provides detailed user behavior analytics</li>
              </ul>

              <h3 className="text-xl font-semibold text-electric-green mb-3">Authentication Services</h3>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li><strong>Clerk:</strong> Manages user authentication and account security</li>
              </ul>

              <h3 className="text-xl font-semibold text-electric-green mb-3">Payment Processing</h3>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li><strong>Stripe:</strong> Securely processes payments for event registrations</li>
              </ul>

              <h3 className="text-xl font-semibold text-electric-green mb-3">Communication</h3>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li><strong>SendGrid:</strong> Manages email communications</li>
                <li><strong>Twilio:</strong> Handles SMS notifications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-red mb-4">Cookie Duration</h2>
              
              <h3 className="text-xl font-semibold text-electric-orange mb-3">Session Cookies</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                These temporary cookies are deleted when you close your browser. They help maintain your session while you navigate our website.
              </p>

              <h3 className="text-xl font-semibold text-electric-orange mb-3">Persistent Cookies</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                These cookies remain on your device for a set period or until you delete them. They remember your preferences across visits.
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li><strong>Authentication cookies:</strong> Up to 30 days</li>
                <li><strong>Preference cookies:</strong> Up to 1 year</li>
                <li><strong>Analytics cookies:</strong> Up to 2 years</li>
                <li><strong>Marketing cookies:</strong> Up to 1 year</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-purple mb-4">Managing Your Cookie Preferences</h2>
              
              <h3 className="text-xl font-semibold text-electric-cyan mb-3">Browser Settings</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>View what cookies are stored on your device</li>
                <li>Delete all or specific cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies (this may affect website functionality)</li>
                <li>Set your browser to notify you when cookies are being set</li>
              </ul>

              <h3 className="text-xl font-semibold text-electric-cyan mb-3">Cookie Consent Banner</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                When you first visit ConnectMore, you&apos;ll see a cookie consent banner where you can:
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize your cookie preferences</li>
                <li>Learn more about our cookie usage</li>
              </ul>

              <h3 className="text-xl font-semibold text-electric-cyan mb-3">Opt-Out Links</h3>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                You can opt out of certain third-party tracking:
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-electric-cyan hover:text-electric-blue transition-colors">Google Analytics Opt-out</a></li>
                <li><a href="https://www.facebook.com/help/568137493302217" target="_blank" rel="noopener noreferrer" className="text-electric-cyan hover:text-electric-blue transition-colors">Facebook Pixel Opt-out</a></li>
                <li><a href="http://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-electric-cyan hover:text-electric-blue transition-colors">Digital Advertising Alliance Opt-out</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-green mb-4">How to Delete Cookies</h2>
              
              <h3 className="text-xl font-semibold text-electric-pink mb-3">Chrome</h3>
              <ol className="list-decimal pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Click the three dots menu → Settings</li>
                <li>Go to Privacy and security → Cookies and other site data</li>
                <li>Click &quot;See all cookies and site data&quot;</li>
                <li>Search for &quot;connectmore&quot; or delete all cookies</li>
              </ol>

              <h3 className="text-xl font-semibold text-electric-pink mb-3">Firefox</h3>
              <ol className="list-decimal pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Click the menu button → Settings</li>
                <li>Go to Privacy & Security</li>
                <li>Under Cookies and Site Data, click &quot;Manage Data&quot;</li>
                <li>Search for &quot;connectmore&quot; or remove all data</li>
              </ol>

              <h3 className="text-xl font-semibold text-electric-pink mb-3">Safari</h3>
              <ol className="list-decimal pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>Go to Safari → Preferences</li>
                <li>Click the Privacy tab</li>
                <li>Click &quot;Manage Website Data&quot;</li>
                <li>Search for &quot;connectmore&quot; or remove all data</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-yellow mb-4">Impact of Disabling Cookies</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                Disabling cookies may affect your experience on ConnectMore:
              </p>
              <ul className="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300">
                <li>You may need to log in repeatedly</li>
                <li>Your preferences (theme, language) won&apos;t be saved</li>
                <li>Some features may not work properly</li>
                <li>Event recommendations may be less relevant</li>
                <li>You may see the cookie banner repeatedly</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-orange mb-4">Updates to This Cookie Policy</h2>
              <p className="text-surface-700 dark:text-surface-300">
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will post the updated policy on this page with a new &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">More Information</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                For more information about how we process your personal data, please see our{" "}
                <Link href="/privacy-policy" className="text-electric-cyan hover:text-electric-blue transition-colors">
                  Privacy Policy
                </Link>.
              </p>
              <p className="text-surface-700 dark:text-surface-300">
                For general information about cookies, visit{" "}
                <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-electric-cyan hover:text-electric-blue transition-colors">
                  www.allaboutcookies.org
                </a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-purple mb-4">Contact Us</h2>
              <p className="text-surface-700 dark:text-surface-300 mb-4">
                If you have any questions about our use of cookies, please contact us:
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