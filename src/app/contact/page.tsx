import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">Contact Us</h1>
          <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
            Have questions about ConnectMore? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-surface-800 rounded-lg p-8 shadow-xl border-2 border-electric-cyan/20">
            <h2 className="text-2xl font-semibold text-electric-purple mb-6">Send us a message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-2 border-2 border-surface-300 dark:border-surface-600 rounded-lg focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-2 border-2 border-surface-300 dark:border-surface-600 rounded-lg focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border-2 border-surface-300 dark:border-surface-600 rounded-lg focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 transition-all"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-2 border-2 border-surface-300 dark:border-surface-600 rounded-lg focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 transition-all"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="events">Event Management</option>
                  <option value="organizer">Become an Organizer</option>
                  <option value="venue">Venue Partnership</option>
                  <option value="business">Business Inquiry</option>
                  <option value="bug">Bug Report</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  placeholder="Tell us how we can help you..."
                  className="w-full px-4 py-2 border-2 border-surface-300 dark:border-surface-600 rounded-lg focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 transition-all resize-y"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-primary text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-transform"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Company Info */}
            <div className="bg-white dark:bg-surface-800 rounded-lg p-8 shadow-xl border-2 border-electric-pink/20">
              <h2 className="text-2xl font-semibold text-electric-pink mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 text-electric-cyan mt-1">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-100">Email</p>
                    <a href="mailto:rightpathprogramming@gmail.com" className="text-electric-cyan hover:text-electric-blue transition-colors">
                      rightpathprogramming@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 text-electric-green mt-1">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-100">Address</p>
                    <p className="text-surface-600 dark:text-surface-400">
                      Right Path Programming, LLC<br />
                      3532 Savannah Park Lane<br />
                      Birmingham, Alabama 35216
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 text-electric-orange mt-1">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-100">Response Time</p>
                    <p className="text-surface-600 dark:text-surface-400">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-white dark:bg-surface-800 rounded-lg p-8 shadow-xl border-2 border-electric-yellow/20">
              <h3 className="text-xl font-semibold text-electric-yellow mb-4">Quick Help</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                Looking for immediate answers? Check out our helpful resources:
              </p>
              <div className="space-y-2">
                <Link href="/help" className="block text-electric-cyan hover:text-electric-blue transition-colors">
                  → Help Center
                </Link>
                <Link href="/faq" className="block text-electric-cyan hover:text-electric-blue transition-colors">
                  → Frequently Asked Questions
                </Link>
                <Link href="/status" className="block text-electric-cyan hover:text-electric-blue transition-colors">
                  → System Status
                </Link>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white dark:bg-surface-800 rounded-lg p-8 shadow-xl border-2 border-electric-green/20">
              <h3 className="text-xl font-semibold text-electric-green mb-4">Connect With Us</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                Follow us on social media for updates and community events:
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com/connectmore" target="_blank" rel="noopener noreferrer" 
                   className="p-2 rounded-lg border border-electric-blue/30 hover:border-electric-blue transition-all hover:shadow-lg hover:shadow-electric-blue/20">
                  <svg className="w-5 h-5 text-electric-blue" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/connectmore" target="_blank" rel="noopener noreferrer"
                   className="p-2 rounded-lg border border-electric-cyan/30 hover:border-electric-cyan transition-all hover:shadow-lg hover:shadow-electric-cyan/20">
                  <svg className="w-5 h-5 text-electric-cyan" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/connectmore" target="_blank" rel="noopener noreferrer"
                   className="p-2 rounded-lg border border-electric-green/30 hover:border-electric-green transition-all hover:shadow-lg hover:shadow-electric-green/20">
                  <svg className="w-5 h-5 text-electric-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 