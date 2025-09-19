
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProductCarousel } from '../hooks/useProductCarousel';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, ArrowRightIcon } from '../../../components/icons/static-icons';

const products = [
    {
        title: 'Video Production Masterclass',
        image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        price: '$197',
        rating: 4.9,
        isBestseller: true,
        isNew: false,
        description: 'Learn professional video production from pre-production to post-production with our comprehensive masterclass.'
    },
    {
        title: 'Cinematic LUTs Pack',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        price: '$49',
        rating: 4.8,
        isBestseller: false,
        isNew: false,
        description: 'Professional-grade LUTs to give your footage that blockbuster film look in seconds.'
    },
    {
        title: 'Premium Sound Effects Library',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        price: '$79',
        rating: 5.0,
        isBestseller: false,
        isNew: true,
        description: 'High-quality sound effects to enhance your videos and create professional audio experiences.'
    },
];

const StoreSection = () => {
    const { currentIndex, prev, next } = useProductCarousel(products.length, 3);

  return (
    <section id="store" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary dark:text-accent rounded-full text-sm font-medium mb-4">
            Digital Products
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Tools to Elevate Your Creative Work
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            High-quality digital products designed to help creators and businesses thrive in the digital landscape.
          </p>
        </div>

        <div className="relative mb-16">
            <div className="overflow-hidden">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}>
                    {products.map((product, index) => (
                        <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-4 flex-shrink-0">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                <div className="relative h-48 bg-gradient-to-br from-jstar-blue to-faith-purple flex items-center justify-center">
                                    <Image src={product.image} alt={product.title} fill className="object-cover opacity-90" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    {product.isBestseller && (
                                        <div className="absolute bottom-4 left-4">
                                            <span className="inline-block px-3 py-1 bg-white/90 text-jstar-blue text-xs font-semibold rounded-full">BEST SELLER</span>
                                        </div>
                                    )}
                                    {product.isNew && (
                                        <div className="absolute top-4 right-4">
                                            <span className="inline-block px-3 py-1 bg-white/90 text-jstar-blue text-xs font-semibold rounded-full">NEW</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.title}</h3>
                                        <div className="flex items-center text-amber-400">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                            <span className="ml-1 text-gray-600 dark:text-gray-400">{product.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>
                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{product.price}</span>
                                            <button className="px-4 py-2 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white dark:bg-gray-800 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
            </button>
            <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white dark:bg-gray-800 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        </div>

        <div className="bg-gradient-to-r from-jstar-blue to-faith-purple rounded-2xl p-8 md:p-12 text-white overflow-hidden relative">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full"></div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Your Free Creator Bundle</h2>
                    <p className="text-lg mb-6 text-blue-100">
                        Join our community of creators and get instant access to our free bundle including:
                    </p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-start">
                            <CheckIcon className="h-6 w-6 text-white mr-3 flex-shrink-0" />
                            <span>5 Free LUTs for cinematic looks</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon className="h-6 w-6 text-white mr-3 flex-shrink-0" />
                            <span>10 High-quality sound effects</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon className="h-6 w-6 text-white mr-3 flex-shrink-0" />
                            <span>Exclusive video tutorials</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon className="h-6 w-6 text-white mr-3 flex-shrink-0" />
                            <span>Weekly creative tips & resources</span>
                        </li>
                    </ul>
                    <form className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-jstar-blue/50" />
                            <button type="submit" className="px-6 py-3 bg-white text-jstar-blue font-semibold rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap">
                                Get Free Bundle
                            </button>
                        </div>
                        <p className="text-sm text-blue-100">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </form>
                </div>
                <div className="relative">
                    <div className="relative z-10 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                        <div className="bg-black/30 rounded-lg overflow-hidden">
                            <Image src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80" alt="Free Creator Bundle" width={400} height={225} className="w-full h-full object-cover" />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-xl font-bold">Free Creator Bundle</h3>
                            <div className="flex items-center mt-2">
                                <span className="text-2xl font-bold">$0</span>
                                <span className="ml-2 text-sm line-through text-blue-200">$49 value</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold text-sm transform rotate-[-15deg] shadow-lg">
                        FREE
                    </div>
                </div>
            </div>
        </div>

        <div className="text-center mt-16">
          <Link href="/store" className="inline-flex items-center px-8 py-3.5 border-2 border-jstar-blue text-base font-medium rounded-full text-jstar-blue dark:text-white bg-transparent hover:bg-jstar-blue/10 dark:hover:bg-jstar-blue/20 transition-all">
            View All Products
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StoreSection;
