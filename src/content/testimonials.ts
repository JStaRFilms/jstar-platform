// src/content/testimonials.ts
export interface Testimonial {
  quote: string;        // The client's full testimonial.
  authorName: string;   // The name of the person who gave the quote.
  authorRole: string;   // Their title and company (e.g., "Founder, Sharon's Chronicles").
  authorImage: string;  // The path to the author's headshot (e.g., "/testimonials/pearl.jpg").
  tags: string[];       // Service tags related to the testimonial.
}

export const testimonials: Testimonial[] = [
  {
    quote: "I love how he brings my vision to life in the best way possible. He's corroborative, attentive and open to correction. Love the end results always.",
    authorName: "Sharon",
    authorRole: "Influencer, Sharon's Chronicles",
    authorImage: "/testimonials/sharon.jpg",
    tags: ["Video Editing", "Channel Management"],
  },
  {
    quote: "Huge thanks to Goodness for helping elevate our church’s YouTube channel... we’ve started seeing some improvements in engagement and we are very glad we are working with him.",
    authorName: "Rev. Dr. Emmanuel Oke",
    authorRole: "Lead Pastor, Winning Worship Way Christian Centre",
    authorImage: "/testimonials/rev-dr-oke.jpg",
    tags: ["Live Streaming", "Social Media Content"],
  },
  {
    quote: "He is very good at what he does and he demonstrates exceptional creativity.",
    authorName: "Monjola Aminu",
    authorRole: "Chief Brand & Communications Officer",
    authorImage: "/testimonials/monjola-aminu.jpg", // Reusing her official team photo
    tags: ["Creative Direction", "Brand Strategy"],
  },
  {
    quote: "Goodness is a fantastic editor! He took my raw footage and transformed it into a truly engaging video... Their creativity and attention to detail really shined through.",
    authorName: "John",
    authorRole: "Youtuber, 13 Cubes",
    authorImage: "/testimonials/john-13cubes.jpg",
    tags: ["Video Editing", "YouTube Content"],
  },
  // {
  //   quote: "I love working and teaching people how to make better videos, especially because we are all still learning. But carrying people along my journey with editing hits different.",
  //   authorName: "John Oluleke-Oke",
  //   authorRole: "Founder & CEO, J StaR Films Studios",
  //   authorImage: "/team/john-oluleke-oke.jpg", // Reusing your official team photo
  //   tags: ["Filmmaking Education", "Creative Mentorship"],
  // },
];