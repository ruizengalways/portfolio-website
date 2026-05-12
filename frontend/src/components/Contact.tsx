import { Mail, MapPin, Phone, Send } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { FaGithub, FaLinkedin, FaGoogleScholar } from "react-icons/fa6";
import { toast } from "sonner";
import { sendMessage } from "../services/api";

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string,
      };

      // Validate fields
      if (!data.name || !data.email || !data.message) {
        toast.error("Please fill in all fields");
        setIsSubmitting(false);
        return;
      }

      // Frontend validation: Message must be at least 10 characters
      if (data.message.length < 10) {
        toast.error("Message too short", {
          description: "Please write at least 10 characters in your message",
          style: {
            background: "hsl(var(--card))",
            border: "1px solid #750014",
            color: "hsl(var(--foreground))",
          },
        });
        setIsSubmitting(false);
        return;
      }

      // Send to backend
      await sendMessage(data);

      // Show success toast
      toast.success("Message sent!", {
        description: "Thank you! I'll get back to you soon.",
        style: {
          background: "hsl(var(--card))",
          border: "1px solid #750014",
          color: "hsl(var(--foreground))",
        },
      });

      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message";

      toast.error("Error sending message", {
        description: errorMessage,
      });

      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section
      id="contact"
      className="min-h-screen py-24 px-4 relative bg-secondary/30"
    >
      <div className="container mx-auto max-w-5xl">
        <h2 className="container text-3xl md:text-5xl font-bold mb-12">
          Get In <span className="text-primary"> Touch</span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Looking to solve complex data or AI challenges? Let’s connect and
          explore how we can deliver scalable, high-impact solutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-24 w-fit mx-auto text-left">
            <h3 className="text-2xl font-semibold mb-6">
              {" "}
              Contact Information
            </h3>
            {/* email phone location */}
            <div className="space-y-6 flex flex-col flex-1 item-center justify-center">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />{" "}
                </div>
                <div>
                  <h4 className="font-medium"> Email</h4>
                  <a
                    href="mailto:r.zeng@outlook.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    r.zeng@outlook.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />{" "}
                </div>
                <div>
                  <h4 className="font-medium"> Phone</h4>
                  <a
                    href="tel:+11234567890"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Available upon request
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />{" "}
                </div>
                <div>
                  <h4 className="font-medium"> Location</h4>
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Sydney, NSW, Australia
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6 text-center md:text-left">
                Connect With Me
              </h3>
              <div className="flex items-center justify-center md:justify-start gap-6">
                <a
                  href="https://www.linkedin.com/in/rui-zeng/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size={28} />
                </a>
                <a
                  href="https://github.com/ruizengalways"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub size={28} />
                </a>
                <a
                  href="https://scholar.google.com.au/citations?user=ddVT6cMAAAAJ&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGoogleScholar size={28} />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg ">
            <h3 className="text-2xl font-semibold mb-6"> Send a Message</h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  {" "}
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-md border border-border bg-card text-foreground
                  placeholder:text-muted-foreground/50
                  focus:outline-hidden foucs:ring-2 focus:ring-primary/20 focus:border-primary
                  transition-all duration-200"
                  placeholder="Peter Smith..."
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  {" "}
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-md border border-border bg-card text-foreground
                  placeholder:text-muted-foreground/50
                  focus:outline-hidden foucs:ring-2 focus:ring-primary/20 focus:border-primary
                  transition-all duration-200"
                  placeholder="Peter.Smith@gmail.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  {" "}
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full px-4 py-3 rounded-md border border-border bg-card text-foreground
                  placeholder:text-muted-foreground/50
                  focus:outline-hidden foucs:ring-2 focus:ring-primary/20 focus:border-primary
                  transition-[color,box-shadow,border-color] duration-200 min-h-[100px]"
                  placeholder="Hello, I'd like to talk about..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "cosmic-button w-full flex items-center justify-center gap-2",
                )}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
