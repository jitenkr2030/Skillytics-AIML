'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  Download, 
  Play,
  FileText,
  Video,
  Code,
  GraduationCap,
  Briefcase,
  ChevronDown,
  Grid,
  List,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  tags: string[];
  price: number;
  currency: string;
  isFree: boolean;
  creator: {
    name: string;
    avatar?: string;
  };
  rating: {
    average: number;
    count: number;
  };
  sales: number;
  previewContent?: string;
  hasPurchased: boolean;
}

interface MarketplaceProps {
  userId?: string;
}

const itemTypeIcons: Record<string, React.ElementType> = {
  MISSION_PACK: GraduationCap,
  STUDY_GUIDE: FileText,
  VIDEO_COURSE: Video,
  TEMPLATE: Code,
  PRACTICE_EXAM: Briefcase,
  INTERVIEW_PREP: Briefcase
};

const itemTypeLabels: Record<string, string> = {
  MISSION_PACK: 'Mission Pack',
  STUDY_GUIDE: 'Study Guide',
  VIDEO_COURSE: 'Video Course',
  TEMPLATE: 'Template',
  PRACTICE_EXAM: 'Practice Exam',
  INTERVIEW_PREP: 'Interview Prep'
};

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'mission-bundles', name: 'Mission Bundles' },
  { id: 'study-guides', name: 'Study Guides' },
  { id: 'video-courses', name: 'Video Courses' },
  { id: 'templates', name: 'Templates' },
  { id: 'practice-exams', name: 'Practice Exams' },
  { id: 'interview-prep', name: 'Interview Prep' }
];

const sortOptions = [
  { id: 'popular', name: 'Most Popular' },
  { id: 'newest', name: 'Newest' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'price_asc', name: 'Price: Low to High' },
  { id: 'price_desc', name: 'Price: High to Low' }
];

export function Marketplace({ userId }: MarketplaceProps) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [useCredits, setUseCredits] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
    if (userId) {
      fetchUserCredits();
    }
  }, [userId, selectedCategory, selectedType, sortBy, page]);

  const fetchUserCredits = async () => {
    try {
      const response = await fetch('/api/users/me');
      const data = await response.json();
      setUserCredits(data.credits || 0);
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy
      });

      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/marketplace?${params}`);
      const data = await response.json();

      setItems(data.items || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load marketplace items',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  const handlePurchase = async () => {
    if (!selectedItem) return;

    setIsPurchasing(true);
    try {
      const response = await fetch('/api/marketplace', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: selectedItem.id,
          useCredits: useCredits || selectedItem.price === 0
        })
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else if (data.success) {
        toast({
          title: 'Purchase Successful!',
          description: data.message,
          variant: 'default'
        });
        setSelectedItem(null);
        fetchItems();
        fetchUserCredits();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Purchase failed',
        variant: 'destructive'
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  };

  const ItemTypeIcon = itemTypeIcons[selectedItem?.type || 'STUDY_GUIDE'] || FileText;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Skillytics Marketplace
          </h1>
          <p className="text-slate-600">
            Enhance your learning with premium study materials, mission bundles, and expert resources
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="search"
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </form>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(itemTypeLabels).map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-slate-500'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Credits Display */}
        {userId && userCredits > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700">
                You have <strong>{userCredits} credits</strong> available
              </span>
            </div>
            <Button variant="outline" size="sm">
              Add More Credits
            </Button>
          </div>
        )}

        {/* Items Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No items found
              </h3>
              <p className="text-slate-500">
                Try adjusting your filters or search query
              </p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <MarketplaceCard
                key={item.id}
                item={item}
                onSelect={() => setSelectedItem(item)}
                formatPrice={formatPrice}
                ItemTypeIcon={itemTypeIcons[item.type] || FileText}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <MarketplaceListItem
                key={item.id}
                item={item}
                onSelect={() => setSelectedItem(item)}
                formatPrice={formatPrice}
                ItemTypeIcon={itemTypeIcons[item.type] || FileText}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-slate-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Purchase Modal */}
        {selectedItem && (
          <PurchaseModal
            item={selectedItem}
            open={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            onPurchase={handlePurchase}
            isPurchasing={isPurchasing}
            useCredits={useCredits}
            onUseCreditsChange={setUseCredits}
            userCredits={userCredits}
            formatPrice={formatPrice}
            ItemTypeIcon={ItemTypeIcon}
          />
        )}
      </div>
    </div>
  );
}

interface MarketplaceCardProps {
  item: MarketplaceItem;
  onSelect: () => void;
  formatPrice: (price: number, currency: string) => string;
  ItemTypeIcon: React.ElementType;
}

function MarketplaceCard({ item, onSelect, formatPrice, ItemTypeIcon }: MarketplaceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelect}>
      <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <ItemTypeIcon className="w-16 h-16 text-slate-400" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {itemTypeLabels[item.type]}
          </Badge>
          {item.isFree && (
            <Badge className="bg-green-100 text-green-700 text-xs">Free</Badge>
          )}
        </div>
        <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{item.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium ml-1">{item.rating.average.toFixed(1)}</span>
          </div>
          <span className="text-sm text-slate-400">({item.rating.count})</span>
          <span className="text-sm text-slate-400">•</span>
          <span className="text-sm text-slate-400">{item.sales} sold</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            {formatPrice(item.price, item.currency)}
          </span>
          <span className="text-sm text-slate-500">{item.creator.name}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MarketplaceListItem({ item, onSelect, formatPrice, ItemTypeIcon }: MarketplaceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
      <div className="flex">
        <div className="w-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
          <ItemTypeIcon className="w-10 h-10 text-slate-400" />
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <Badge variant="secondary" className="text-xs mb-2">
                {itemTypeLabels[item.type]}
              </Badge>
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
            </div>
            {item.isFree && (
              <Badge className="bg-green-100 text-green-700">Free</Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-3 line-clamp-1">{item.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium ml-1">{item.rating.average.toFixed(1)}</span>
              </div>
              <span className="text-sm text-slate-400">{item.sales} sold</span>
              <span className="text-sm text-slate-500">by {item.creator.name}</span>
            </div>
            <span className="text-xl font-bold text-slate-900">
              {formatPrice(item.price, item.currency)}
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

interface PurchaseModalProps {
  item: MarketplaceItem;
  open: boolean;
  onClose: () => void;
  onPurchase: () => void;
  isPurchasing: boolean;
  useCredits: boolean;
  onUseCreditsChange: (value: boolean) => void;
  userCredits: number;
  formatPrice: (price: number, currency: string) => string;
  ItemTypeIcon: React.ElementType;
}

function PurchaseModal({
  item,
  open,
  onClose,
  onPurchase,
  isPurchasing,
  useCredits,
  onUseCreditsChange,
  userCredits,
  formatPrice,
  ItemTypeIcon
}: PurchaseModalProps) {
  const canUseCredits = item.price > 0 && userCredits >= item.price;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase {item.title}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Item Preview */}
          <div className="bg-slate-100 rounded-lg p-4 mb-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <ItemTypeIcon className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900">{item.title}</h4>
              <p className="text-sm text-slate-500">by {item.creator.name}</p>
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-4">
            <span className="text-3xl font-bold text-slate-900">
              {formatPrice(item.price, item.currency)}
            </span>
          </div>

          {/* Payment Options */}
          {item.price > 0 && (
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="payment"
                  checked={!useCredits}
                  onChange={() => onUseCreditsChange(false)}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Credit/Debit Card</p>
                  <p className="text-sm text-slate-500">Pay via Stripe</p>
                </div>
              </label>

              {canUseCredits && (
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="payment"
                    checked={useCredits}
                    onChange={() => onUseCreditsChange(true)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Use Credits</p>
                    <p className="text-sm text-slate-500">
                      {userCredits} credits available
                    </p>
                  </div>
                </label>
              )}

              {!canUseCredits && userCredits > 0 && (
                <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    You need {item.price - userCredits} more credits for this item
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onPurchase}
            disabled={isPurchasing || (useCredits && !canUseCredits)}
          >
            {isPurchasing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : item.isFree ? (
              'Get for Free'
            ) : (
              `Pay ${formatPrice(item.price, item.currency)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Marketplace;
