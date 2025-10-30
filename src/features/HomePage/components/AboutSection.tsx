import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheckIcon, CheckIcon } from '../../../components/icons/static-icons';
import ClientLogoPlaceholder from '../../../components/ui/ClientLogoPlaceholder';

const teamMembers = [
{ name: 'John Doe', role: 'Founder & Creative Director', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' },
{ name: 'Jane Smith', role: 'Lead Video Editor', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop' },
{ name: 'Michael Johnson', role: 'Cinematographer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' },
{ name: 'Sarah Williams', role: 'Motion Designer', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' }];


// Example client data - replace with your actual client information
const clients = [
{ name: 'TechCorp', logo: '/logos/techcorp.png', alt: 'TechCorp logo' },
{ name: 'DesignStudio', logo: '/logos/designstudio.svg', alt: 'Design Studio logo' },
{ name: 'MediaGroup', logo: undefined, alt: 'Media Group logo' }, // Will show placeholder
{ name: 'CreativeAgency', logo: '/logos/creativeagency.jpg', alt: 'Creative Agency logo' }];


/**
 * AboutSection - Homepage about section component
 * Displays company overview, team members, and client logos
 * Part of the homepage hero area showcasing J StaR Films
 */
const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary dark:text-accent rounded-full text-sm font-medium mb-4">
            About J StaR Films
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          <span className="text-foreground">Crafting Exceptional </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Visual Experiences</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We blend creativity, technology, and strategy to bring your vision to life with stunning visuals that captivate and inspire.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Our Team"
                width={1470}
                height={980}
                className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold">Our Creative Team</h3>
              <p className="text-gray-200">Passionate professionals dedicated to excellence</p>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/10 rounded-full -z-10 hidden lg:block"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/10 rounded-full -z-10 hidden lg:block"></div>
            {/* Stats Card */}
            <div className="bg-card rounded-xl p-6 shadow-lg absolute -bottom-8 right-0 max-w-xs transform translate-x-1/4 hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 dark:bg-accent/20 rounded-lg flex items-center justify-center text-primary dark:text-accent">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">10+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="lg:pl-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              We're a creative studio passionate about storytelling through video and digital experiences
            </h3>
            <p className="text-muted-foreground mb-6">
              At J StaR Films, we believe in the power of visual storytelling to connect, engage, and inspire. Our team of experienced filmmakers, designers, and developers work together to create compelling content that resonates with your audience and achieves your business goals.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-primary/10 dark:bg-accent/20 flex items-center justify-center text-primary dark:text-accent">
                    <CheckIcon className="w-3 h-3" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-foreground">Client-Focused Approach</h4>
                  <p className="text-muted-foreground">Your vision is our priority, and we're committed to bringing it to life.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-primary/10 dark:bg-accent/20 flex items-center justify-center text-primary dark:text-accent">
                    <CheckIcon className="w-3 h-3" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-foreground">Technical Expertise</h4>
                  <p className="text-muted-foreground">State-of-the-art equipment and cutting-edge techniques for superior quality.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-primary/10 dark:bg-accent/20 flex items-center justify-center text-primary dark:text-accent">
                    <CheckIcon className="w-3 h-3" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Client-Focused Approach</h4>
                  <p className="text-gray-600 dark:text-gray-400">Your vision is our priority, and we&apos;re committed to bringing it to life.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contact" className="btn-enhanced px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold text-center">
                Get in Touch
              </Link>
              <Link href="#portfolio" className="btn-enhanced px-8 py-4 bg-transparent border-2 border-primary dark:border-accent text-primary dark:text-accent rounded-full font-semibold hover:bg-primary/10 dark:hover:bg-accent/10 transition-all duration-300 text-center">
                View Our Work
              </Link>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Meet Our Creative Team</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A talented group of professionals passionate about creating exceptional visual experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) =>
            <div key={index} className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden h-64">
                  <Image src={member.image} alt={member.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="text-white">
                          <h4 className="text-lg font-semibold">{member.name}</h4>
                          <p className="text-gray-200 text-sm">{member.role}</p>
                      </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Clients Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Trusted By Industry Leaders</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've had the privilege of working with amazing companies across various industries
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {clients.map((client, index) =>
            <div key={index} className="flex justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                <ClientLogoPlaceholder
                src={client.logo}
                alt={client.alt}
                name={client.name}
                type={client.logo?.endsWith('.svg') ? 'svg' : 'image'} />
              
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default AboutSection;
