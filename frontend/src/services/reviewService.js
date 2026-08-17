// Service for managing product reviews and ratings (Shopee style)

const INITIAL_REVIEWS = [
  {
    id: 1,
    productId: 1,
    userEmail: 'julianto@gmail.com',
    userName: 'Juli Anto',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    variant: '2.4m (Carbon)',
    date: '14 Agu 2026 14:20',
    comment: 'Barang josss super mantap! Packing sangat rapi pakai pipa PVC aman 100%. Kelenturan joran dapet banget, tes landed lele 4kg langsung teratasi. Penjual fast respon banget. Recomended seller Berkah Pancing!',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?w=500&auto=format&fit=crop&q=80'
    ],
    helpfulCount: 24,
    sellerResponse: 'Terima kasih banyak Mas Juli atas ulasannya! Semoga makin gacor dan strike terus saat mancing 🔥 Salam Angler!'
  },
  {
    id: 2,
    productId: 1,
    userEmail: 'budi_strike@gmail.com',
    userName: 'Budi Angler Mania',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    variant: '2.7m (Heavy)',
    date: '10 Agu 2026 09:15',
    comment: 'Kualitas original Shimano! Beratnya pas di tangan, reel seat presisi. Pengiriman cuma 1 hari nyampe Tangerang.',
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80'
    ],
    helpfulCount: 15,
    sellerResponse: 'Mantaapp Mas Budi! Terima kasih sudah berlangganan di toko kami 🙏'
  },
  {
    id: 3,
    productId: 2,
    userEmail: 'andi_fisherman@gmail.com',
    userName: 'Andi Mancing',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    variant: '3000 Series',
    date: '08 Agu 2026 18:45',
    comment: 'Putaran reel super halus, drag smooth gak patah-patah saat ditarik monster laut. Worth it banget harganya!',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80'
    ],
    helpfulCount: 9,
    sellerResponse: null
  },
  {
    id: 4,
    productId: 3,
    userEmail: 'rizky_angler@gmail.com',
    userName: 'Rizky Angler',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    rating: 4,
    variant: 'PE 3.0 (150m)',
    date: '02 Agu 2026 11:30',
    comment: 'Senar ulet tidak gampang melintir. Cuma warna agak sedikit beda dengan di foto, tapi kinerjanya sangat memuaskan.',
    images: [],
    helpfulCount: 6,
    sellerResponse: 'Terima kasih mas sarannya, akan kami tingkatkan kualitas foto produknya 🙏'
  }
];

export const reviewService = {
  getReviews: () => {
    const saved = localStorage.getItem('berkah_reviews');
    if (!saved) {
      localStorage.setItem('berkah_reviews', JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(saved);
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
      const baseRating = (4.5 + (Number(productId) % 5) * 0.1).toFixed(1);
      const baseCount = ((Number(productId) * 31) % 150) + 12;
      return {
        average: parseFloat(baseRating),
        totalCount: baseCount,
        breakdown: { 5: baseCount - 10, 4: 8, 3: 2, 2: 0, 1: 0 },
        withPhotoCount: Math.floor(baseCount * 0.4),
        withCommentCount: Math.floor(baseCount * 0.8)
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
      productId: Number(newReviewData.productId),
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
    localStorage.setItem('berkah_reviews', JSON.stringify(updated));
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
    localStorage.setItem('berkah_reviews', JSON.stringify(updated));
    return updated;
  }
};
