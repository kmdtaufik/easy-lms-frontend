import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: "Browse Courses", href: "/courses" },
      { name: "Become an Instructor", href: "/instructor" },
      { name: "Enterprise", href: "/enterprise" },
      { name: "Mobile App", href: "/mobile" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" },
    ],
    resources: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Community", href: "/community" },
      { name: "Tutorials", href: "/tutorials" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Accessibility", href: "/accessibility" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com", icon: Facebook },
    { name: "Twitter", href: "https://twitter.com", icon: Twitter },
    { name: "Instagram", href: "https://instagram.com", icon: Instagram },
    { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src={Logo} alt="Easy LMS" className="size-8" />
              <span className="font-bold text-xl">Easy LMS</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Empowering learners worldwide with cutting-edge online education.
              Transform your career with our comprehensive course catalog and
              expert instructors.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Stay Updated</h4>
              <div className="flex gap-2 max-w-sm">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button size="sm" className="px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@easylms.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">Follow Us</h4>
              <div className="flex gap-2">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-background hover:bg-primary hover:text-primary-foreground rounded-md transition-colors"
                      aria-label={social.name}
                    >
                      <IconComponent className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Easy LMS. All rights reserved.
          </div>

          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
