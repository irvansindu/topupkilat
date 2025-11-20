'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Instagram, Twitter, Youtube, Facebook, Music, Video, 
  Users, Heart, Eye, ThumbsUp, MessageCircle, Share2,
  TrendingUp, Zap, Shield, Star
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  services: string[];
}

export default function SocialMediaPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');

  const platforms: Platform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      slug: 'instagram',
      description: 'Followers, Likes, Views, Comments',
      icon: <Instagram className="h-8 w-8" />,
      color: 'from-purple-500 via-pink-500 to-orange-500',
      services: ['Followers', 'Likes', 'Views', 'Comments', 'Story Views', 'Reels Views'],
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      slug: 'tiktok',
      description: 'Followers, Likes, Views, Shares',
      icon: <Music className="h-8 w-8" />,
      color: 'from-black to-gray-800',
      services: ['Followers', 'Likes', 'Views', 'Shares', 'Comments', 'Live Views'],
    },
    {
      id: 'youtube',
      name: 'YouTube',
      slug: 'youtube',
      description: 'Subscribers, Views, Likes, Watch Hours',
      icon: <Youtube className="h-8 w-8" />,
      color: 'from-red-600 to-red-800',
      services: ['Subscribers', 'Views', 'Likes', 'Watch Hours', 'Comments', 'Shares'],
    },
    {
      id: 'facebook',
      name: 'Facebook',
      slug: 'facebook',
      description: 'Page Likes, Post Likes, Followers',
      icon: <Facebook className="h-8 w-8" />,
      color: 'from-blue-600 to-blue-800',
      services: ['Page Likes', 'Post Likes', 'Followers', 'Views', 'Comments', 'Shares'],
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      slug: 'twitter',
      description: 'Followers, Likes, Retweets, Views',
      icon: <Twitter className="h-8 w-8" />,
      color: 'from-sky-400 to-sky-600',
      services: ['Followers', 'Likes', 'Retweets', 'Views', 'Comments', 'Bookmarks'],
    },
    {
      id: 'spotify',
      name: 'Spotify',
      slug: 'spotify',
      description: 'Plays, Followers, Monthly Listeners',
      icon: <Music className="h-8 w-8" />,
      color: 'from-green-500 to-green-700',
      services: ['Plays', 'Followers', 'Monthly Listeners', 'Playlist Followers', 'Saves'],
    },
  ];

  const serviceIcons: Record<string, React.ReactNode> = {
    'Followers': <Users className="h-4 w-4" />,
    'Likes': <Heart className="h-4 w-4" />,
    'Views': <Eye className="h-4 w-4" />,
    'Subscribers': <Users className="h-4 w-4" />,
    'Comments': <MessageCircle className="h-4 w-4" />,
    'Shares': <Share2 className="h-4 w-4" />,
    'Retweets': <Share2 className="h-4 w-4" />,
    'Plays': <Music className="h-4 w-4" />,
  };

  const getServiceIcon = (service: string): React.ReactNode => {
    for (const [key, icon] of Object.entries(serviceIcons)) {
      if (service.includes(key)) return icon;
    }
    return <TrendingUp className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Social Media Booster</h1>
          <p className="text-lg opacity-90">
            Tingkatkan engagement social media Anda dengan layanan terpercaya
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">1M+</div>
              <div className="text-sm text-gray-600">Orders Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">50K+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">Auto Process</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-600">Safe & Secure</div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Grid */}
        <h2 className="text-2xl font-bold mb-6">Choose Platform</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {platforms.map((platform) => (
            <Link key={platform.id} href={`/socialmedia/${platform.slug}`}>
              <Card className={`hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full ${
                selectedPlatform === platform.id ? 'ring-2 ring-purple-500' : ''
              }`}>
                <div className={`h-32 bg-gradient-to-br ${platform.color} flex items-center justify-center text-white relative overflow-hidden`}>
                  {platform.icon}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {platform.description}
                  </p>
                  
                  {/* Service Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {platform.services.slice(0, 3).map((service, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full"
                      >
                        {getServiceIcon(service)}
                        {service}
                      </span>
                    ))}
                    {platform.services.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full">
                        +{platform.services.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <Button className="w-full" size="sm">
                    View Services
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Popular Services */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Popular Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <div>
                    <p className="font-medium">Instagram Followers</p>
                    <p className="text-xs text-gray-500">Real & Active</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Order</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Music className="h-5 w-5 text-black" />
                  <div>
                    <p className="font-medium">TikTok Views</p>
                    <p className="text-xs text-gray-500">High Quality</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Order</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Youtube className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">YouTube Subscribers</p>
                    <p className="text-xs text-gray-500">Non-Drop</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Order</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Facebook Page Likes</p>
                    <p className="text-xs text-gray-500">Worldwide</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Order</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Twitter className="h-5 w-5 text-sky-500" />
                  <div>
                    <p className="font-medium">Twitter Followers</p>
                    <p className="text-xs text-gray-500">Fast Delivery</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Order</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Music className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Spotify Plays</p>
                    <p className="text-xs text-gray-500">Premium Quality</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Order</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Instant Start</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Orders start processing within minutes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">100% Safe</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No password required, completely secure
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Real Quality</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                High quality services from real accounts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customer support available anytime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Is it safe to use?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yes, 100% safe. We never ask for your password and use secure methods.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How fast is the delivery?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Most orders start within 0-1 hour. Delivery speed varies by service.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer refill guarantee?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yes, many services come with 30-day refill guarantee. Check service description.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods accepted?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We accept all major payment methods including e-wallets and bank transfer.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
