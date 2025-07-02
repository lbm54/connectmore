import React from "react";
import Link from "next/link";
export function AppFooter() {
  return (
    <footer className="mt-auto bg-surface-900 dark:bg-surface-900 border-t-2 border-electric-cyan/20 dark:border-electric-purple/20">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gradient-primary">
              ConnectMore
            </h3>
            <p className="text-sm text-surface-200 leading-relaxed">
              Bringing communities together through amazing events and
              meaningful connections.
            </p>
            <div className="text-sm text-surface-200 ">
              <div className="mb-1">Right Path Programming, LLC</div>
              <div className="mb-1">3532 Savannah Park Lane</div>
              <div>Birmingham, Alabama 35216</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-electric-cyan">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/events"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Browse Events
                </Link>
              </li>
              <li>
                <a
                  href="/organizers"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Event Organizers
                </a>
              </li>
              <li>
                <a
                  href="/venues"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Find Venues
                </a>
              </li>
              <li>
                <a
                  href="/calendar"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Event Calendar
                </a>
              </li>
              <li>
                <a
                  href="/map"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Event Map
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-electric-pink">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/help"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:rightpathprogramming@gmail.com"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Email Support
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-electric-orange">
              Connect & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  className="text-surface-300 hover:text-electric-green transition-colors duration-300"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="pt-2">
              <h5 className="text-sm font-medium text-electric-yellow mb-3">
                Follow Us
              </h5>
              <div className="flex space-x-4">
                {/* Facebook */}
                <a
                  href="https://facebook.com/connectmore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-electric-blue/30 hover:border-electric-blue transition-all duration-300 hover:shadow-lg hover:shadow-electric-blue/20"
                >
                  <svg
                    className="w-5 h-5 text-electric-blue group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Twitter/X */}
                <a
                  href="https://twitter.com/connectmore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-electric-cyan/30 hover:border-electric-cyan transition-all duration-300 hover:shadow-lg hover:shadow-electric-cyan/20"
                >
                  <svg
                    className="w-5 h-5 text-electric-cyan group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/connectmore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-electric-pink/30 hover:border-electric-pink transition-all duration-300 hover:shadow-lg hover:shadow-electric-pink/20"
                >
                  <svg
                    className="w-5 h-5 text-electric-pink group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.33-1.291C4.239 14.885 3.76 13.623 3.76 12.207c0-1.415.479-2.678 1.36-3.489.88-.81 2.031-1.299 3.329-1.299 1.297 0 2.448.49 3.33 1.299.88.81 1.36 2.074 1.36 3.489 0 1.416-.48 2.678-1.36 3.48-.882.811-2.033 1.301-3.33 1.301zm7.83-1.734c-.297.341-.65.613-1.047.805-.396.193-.826.289-1.29.289-.463 0-.894-.096-1.29-.289-.397-.192-.75-.464-1.047-.805-.297-.34-.531-.743-.7-1.211-.169-.467-.254-.972-.254-1.515 0-.543.085-1.048.254-1.515.169-.468.403-.871.7-1.211.297-.341.65-.613 1.047-.805.396-.193.827-.289 1.29-.289.464 0 .894.096 1.29.289.397.192.75.464 1.047.805.297.34.531.743.7 1.211.169.467.254.972.254 1.515 0 .543-.085 1.048-.254 1.515-.169.468-.403.871-.7 1.211z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/connectmore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-electric-green/30 hover:border-electric-green transition-all duration-300 hover:shadow-lg hover:shadow-electric-green/20"
                >
                  <svg
                    className="w-5 h-5 text-electric-green group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/rightpathprogramming"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-electric-yellow/30 hover:border-electric-yellow transition-all duration-300 hover:shadow-lg hover:shadow-electric-yellow/20"
                >
                  <svg
                    className="w-5 h-5 text-electric-yellow group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-electric-cyan/10 dark:border-electric-purple/10">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-surface-400 dark:text-surface-500">
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} Right Path Programming, LLC. All
              rights reserved.
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="/accessibility"
                className="hover:text-electric-green transition-colors duration-300"
              >
                Accessibility
              </a>
              <a
                href="/sitemap"
                className="hover:text-electric-green transition-colors duration-300"
              >
                Sitemap
              </a>
              <a
                href="/status"
                className="hover:text-electric-green transition-colors duration-300"
              >
                System Status
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
