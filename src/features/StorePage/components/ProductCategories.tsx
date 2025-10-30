
import React from 'react';
import Link from 'next/link';

const ProductCategories = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse by <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Find exactly what you need to enhance your creative workflow and grow your audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Category 1 */}
          <Link href="#courses" className="block bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-jstar-blue to-faith-purple rounded-xl flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Video Courses</h3>
            <p className="text-muted mb-4">
              Comprehensive courses on video production, editing, and storytelling.
            </p>
            <span className="text-jstar-blue font-semibold">12 Products</span>
          </Link>

          {/* Category 2 */}
          <Link href="#templates" className="block bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-faith-purple to-growth-green rounded-xl flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Templates</h3>
            <p className="text-muted mb-4">
              Ready-to-use templates for editing, design, and content planning.
            </p>
            <span className="text-faith-purple font-semibold">8 Products</span>
          </Link>

          {/* Category 3 */}
          <Link href="#tools" className="block bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-growth-green to-jstar-blue rounded-xl flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">AI Tools</h3>
            <p className="text-muted mb-4">
              AI-powered tools for content creation, optimization, and automation.
            </p>
            <span className="text-growth-green font-semibold">5 Products</span>
          </Link>

          {/* Category 4 */}
          <Link href="#free" className="block bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Free Resources</h3>
            <p className="text-muted mb-4">
              Free templates, guides, and resources to get you started.
            </p>
            <span className="text-yellow-500 font-semibold">10 Products</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
