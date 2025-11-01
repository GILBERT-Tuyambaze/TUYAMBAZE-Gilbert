import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Contact section animations
    revealElements('.contact-title', { origin: 'top', distance: '60px', duration: 1000, delay: 200 });
    revealElements('.contact-description', { origin: 'bottom', distance: '40px', duration: 800, delay: 400 });
    revealElements('.contact-info', { origin: 'bottom', distance: '40px', duration: 800, delay: 400, interval: 100 });
    revealElements('.contact-form', { origin: 'bottom', distance: '40px', duration: 800, delay: 400 });
    revealElements('.form-field', { origin: 'bottom', distance: '30px', duration: 600, delay: 600, interval: 50 });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      access_key: 'e0331897-d912-4f1d-a5f1-2a8dcd09d928', // Your Web3Forms key
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log('Form response:', result);

      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 9000);
      } else {
        alert('Error submitting form, please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting form, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'tuyambazegilbert05@gmail.com', description: 'Send me an email anytime!', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { icon: Phone, title: 'Phone', value: '+250 (79) 343-8873', description: 'Call me for urgent inquiries', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { icon: MapPin, title: 'Location', value: 'Kigali, RWANDA', description: 'Available for local meetings', color: 'text-purple-500', bgColor: 'bg-purple-500/10' }
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-background overflow-x-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="contact-title text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="contact-description text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to start your next project? I'd love to hear from you. Send me a message and I'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="contact-title text-2xl font-bold mb-8">Let's Connect</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm always interested in new opportunities and exciting projects. Whether you have a question or just want to say hi, feel free to reach out!
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="contact-info group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`p-3 rounded-full ${info.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{info.title}</h4>
                      <p className="text-primary font-medium mb-1">{info.value}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="contact-form hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Send Message</CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">Thank you for reaching out. I'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-field space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        className="focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="form-field space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="form-field space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      required
                      className="focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="form-field space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell me about your project..."
                      rows={6}
                      required
                      className="focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full group relative overflow-hidden" disabled={isSubmitting}>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-500/80 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
