// Service for managing product reviews and ratings

const STORAGE_KEY = 'berkah_reviews_v2';
const INITIAL_REVIEWS = [];

export const reviewService = {
  getReviews: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  },

  getReviewsByProductId: (productId) => {
    const all = reviewService.getReviews();
    return all.filter((r) => String(r.productId) === String(productId));
  },

  getUserReviews: (userEmail) => {
    const all = reviewService.getReviews();
    if (!userEmail) return all;
    return all.filter((r) => r.userEmail === userEmail);
  },

  getProductRatingSummary: (productId) => {
    const reviews = reviewService.getReviewsByProductId(productId);
    if (reviews.length === 0) {
      return {
        average: 0,
        totalCount: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        withPhotoCount: 0,
        withCommentCount: 0
      };
    }

    const totalCount = reviews.length;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const average = (sum / totalCount).toFixed(1);

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let withPhotoCount = 0;
    let withCommentCount = 0;

    reviews.forEach((r) => {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
      if (r.images && r.images.length > 0) withPhotoCount++;
      if (r.comment && r.comment.trim().length > 0) withCommentCount++;
    });

    return {
      average: parseFloat(average),
      totalCount,
      breakdown,
      withPhotoCount,
      withCommentCount
    };
  },

  addReview: (newReviewData) => {
    const reviews = reviewService.getReviews();
    const formattedReview = {
      id: Date.now(),
      productId: String(newReviewData.productId),
      userEmail: newReviewData.userEmail || 'julianto@gmail.com',
      userName: newReviewData.userName || 'Juli Anto',
      userAvatar: newReviewData.userAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: Number(newReviewData.rating || 5),
      variant: newReviewData.variant || 'Standard Edition',
      date: new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      comment: newReviewData.comment || 'Produk sangat memuaskan dan berkualitas tinggi!',
      images: newReviewData.images || [],
      helpfulCount: 0,
      sellerResponse: null
    };

    const updated = [formattedReview, ...reviews];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return formattedReview;
  },

  toggleHelpful: (reviewId) => {
    const reviews = reviewService.getReviews();
    const updated = reviews.map((r) => {
      if (r.id === reviewId) {
        return { ...r, helpfulCount: (r.helpfulCount || 0) + 1 };
      }
      return r;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
