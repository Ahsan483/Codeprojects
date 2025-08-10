<script setup>
import { ref, computed } from 'vue';

const coupons = ref([
  { code: 'FIRST50', discount: '50% off first deposit', value: 0.5 },
  { code: 'LOYAL20', discount: '20% off any order', value: 0.2 },
  { code: 'PROJECT10', discount: '10% off projects', value: 0.1 }
]);

const catalog = ref([
  {
    id: 1,
    name: 'Vue Project Template',
    price: 50,
    description: 'A starter template for Vue.js projects with pre-configured tools',
    reviews: [{ user: 'User1', rating: 5, text: 'Great template!', timestamp: new Date(Date.now() - 3600000) }],
    inCart: false,
    image: '',
    category: 'Templates',
    tags: ['vue', 'starter'],
    timestamp: new Date(Date.now() - 7200000)
  },
  {
    id: 2,
    name: 'Full Stack Course',
    price: 100,
    description: 'Comprehensive course covering Vue, Node.js, and MongoDB',
    reviews: [],
    inCart: false,
    image: '',
    category: 'Courses',
    tags: ['fullstack', 'learning'],
    timestamp: new Date(Date.now() - 10800000)
  }
]);

const selectedCoupon = ref('');
const orderAmount = ref(0);
const cart = ref([]);
const selectedCatalogItem = ref(null);
const newRating = ref(0);
const newReviewText = ref('');
const searchQuery = ref('');
const sortOption = ref('newest');

const applyCoupon = () => {
  const coupon = coupons.value.find(c => c.code === selectedCoupon.value);
  if (coupon) {
    orderAmount.value = orderAmount.value * (1 - coupon.value);
    console.log(`Coupon ${coupon.code} applied!`);
  }
};

const placeOrder = () => {
  if (cart.value.length > 0) {
    console.log('Order placed!');
    cart.value.forEach(item => (item.inCart = false));
    cart.value = [];
    orderAmount.value = 0;
    selectedCoupon.value = '';
  }
};

const addToCart = (item) => {
  if (!item.inCart) {
    cart.value.push(item);
    item.inCart = true;
    orderAmount.value += item.price;
  }
};

const removeFromCart = (item) => {
  cart.value = cart.value.filter(c => c.id !== item.id);
  item.inCart = false;
  orderAmount.value -= item.price;
};

const addReview = (item, rating, text) => {
  if (rating >= 1 && rating <= 5 && text.trim()) {
    item.reviews.push({ user: 'You', rating, text, timestamp: new Date() });
    console.log('Review added!');
    newRating.value = 0;
    newReviewText.value = '';
  }
};

const viewProduct = (item) => {
  selectedCatalogItem.value = item;
};

const filteredCatalog = computed(() => {
  let result = catalog.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
  if (sortOption.value === 'newest') {
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortOption.value === 'price') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === 'rating') {
    result.sort((a, b) => {
      const avgA = a.reviews.length ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length : 0;
      const avgB = b.reviews.length ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length : 0;
      return avgB - avgA;
    });
  }
  return result;
});

const formatTime = (timestamp) => {
  const now = new Date();
  const diff = (now - new Date(timestamp)) / 1000;
  if (diff < 60) return `${Math.floor(diff)} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};
</script>

<template>
  <div class="orders">
    <div class="hero-section">
      <h1 class="hero-title">Code Marketplace</h1>
      <p class="hero-subtitle">Browse and purchase coding templates, courses, and more.</p>
      <div class="search-sort">
        <div class="search-bar">
          <input v-model="searchQuery" placeholder="Search products by name, description, or tags..." class="search-input" />
          <i class="fas fa-search search-icon"></i>
        </div>
        <select v-model="sortOption" class="sort-select">
          <option value="newest">Newest</option>
          <option value="price">Price (Low to High)</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>

    <div class="catalog">
      <h2 class="section-title">Product Catalog</h2>
      <transition-group name="catalog-list" tag="div" class="catalog-grid">
        <div v-for="item in filteredCatalog" :key="item.id" class="catalog-card">
          <div class="card-header">
            <span class="category-badge">{{ item.category }}</span>
            <span class="timestamp">{{ formatTime(item.timestamp) }}</span>
          </div>
          <div class="card-content">
            <h3>{{ item.name }}</h3>
            <p class="description">{{ item.description }}</p>
            <p class="price">${{ item.price }}</p>
            <div class="tags">
              <span v-for="tag in item.tags" :key="tag" class="tag" @click="searchQuery = tag">#{{ tag }}</span>
            </div>
            <img v-if="item.image" :src="item.image" alt="Product Image" class="product-media" />
          </div>
          <div class="card-actions">
            <button @click="viewProduct(item)" class="action-button">
              <i class="fas fa-eye"></i> View
            </button>
            <button @click="addToCart(item)" :disabled="item.inCart" class="action-button">
              <i class="fas fa-cart-plus"></i> {{ item.inCart ? 'In Cart' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </transition-group>
    </div>

    <div class="cart">
      <h2 class="section-title">Your Cart</h2>
      <div v-if="cart.length === 0" class="empty-cart">Your cart is empty</div>
      <transition-group name="cart-list" tag="div" class="cart-grid">
        <div v-for="item in cart" :key="item.id" class="cart-card">
          <p>{{ item.name }} - ${{ item.price }}</p>
          <button @click="removeFromCart(item)" class="remove-btn">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </transition-group>
      <div class="cart-total">
        <p>Total: ${{ orderAmount.toFixed(2) }}</p>
        <div class="coupon-section">
          <select v-model="selectedCoupon" class="coupon-select">
            <option value="">Select Coupon</option>
            <option v-for="coupon in coupons" :key="coupon.code" :value="coupon.code">{{ coupon.code }} ({{ coupon.discount }})</option>
          </select>
          <button @click="applyCoupon" class="action-button">
            <i class="fas fa-ticket-alt"></i> Apply Coupon
          </button>
        </div>
        <button @click="placeOrder" class="place-order-btn" :disabled="cart.length === 0">
          <i class="fas fa-check-circle"></i> Place Order
        </button>
      </div>
    </div>

    <div v-if="selectedCatalogItem" class="product-details">
      <h2 class="section-title">{{ selectedCatalogItem.name }} Details</h2>
      <div class="details-content">
        <p><strong>Price:</strong> ${{ selectedCatalogItem.price }}</p>
        <p><strong>Description:</strong> {{ selectedCatalogItem.description }}</p>
        <p><strong>Category:</strong> {{ selectedCatalogItem.category }}</p>
        <p><strong>Tags:</strong> <span v-for="tag in selectedCatalogItem.tags" :key="tag" class="tag">#{{ tag }}</span></p>
        <img v-if="selectedCatalogItem.image" :src="selectedCatalogItem.image" alt="Product Image" class="product-media" />
        <div class="reviews">
          <h4>Reviews</h4>
          <div v-if="selectedCatalogItem.reviews.length === 0" class="no-reviews">No reviews yet</div>
          <div v-for="(review, index) in selectedCatalogItem.reviews" :key="index" class="review">
            <strong>{{ review.user }} ({{ review.rating }} stars):</strong> {{ review.text }}
            <span class="review-timestamp">{{ formatTime(review.timestamp) }}</span>
          </div>
          <div class="review-form">
            <input type="number" min="1" max="5" placeholder="Rating (1-5)" v-model="newRating" class="review-input" />
            <textarea placeholder="Write your review..." v-model="newReviewText" class="review-textarea"></textarea>
            <button @click="addReview(selectedCatalogItem, newRating, newReviewText)" class="action-button">
              <i class="fas fa-star"></i> Add Review
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');

.orders {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  color: #f9fafb;
  display: grid;
  gap: 30px;
}

.hero-section {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #f9fafb, #60a5fa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 18px;
  color: #e5e7eb;
  margin-bottom: 20px;
}

.search-sort {
  display: flex;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
  align-items: center;
}

.search-bar {
  position: relative;
  flex: 1;
}

.search-input {
  width: 90%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #60a5fa;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.9);
  color: #f9fafb;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #60a5fa;
}

.sort-select,
.coupon-select {
  padding: 10px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.9);
  color: #f9fafb;
  font-size: 14px;
  cursor: pointer;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #f9fafb;
}

.catalog-grid,
.cart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.catalog-card,
.cart-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(59, 130, 246, 0.2));
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.catalog-card:hover,
.cart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.category-badge {
  background: #22c55e;
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.timestamp {
  font-size: 12px;
  color: #94a3b8;
}

.card-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px;
}

.description {
  font-size: 14px;
  color: #e5e7eb;
  margin-bottom: 10px;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: #22c55e;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.tag {
  color: #60a5fa;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.tag:hover {
  color: #93c5fd;
  text-decoration: underline;
}

.product-media {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.action-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #f9fafb;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  transform: translateY(-2px);
}

.action-button:disabled {
  background: #4b5563;
  cursor: not-allowed;
}

.remove-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #f9fafb;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

.cart-total {
  margin-top: 20px;
  padding: 20px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.coupon-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.place-order-btn {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #f9fafb;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.place-order-btn:hover {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  transform: translateY(-2px);
}

.place-order-btn:disabled {
  background: #4b5563;
  cursor: not-allowed;
}

.empty-cart {
  text-align: center;
  color: #94a3b8;
  font-size: 16px;
}

.product-details {
  padding: 20px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
}

.details-content {
  display: grid;
  gap: 15px;
}

.reviews {
  margin-top: 20px;
}

.review {
  background: rgba(59, 130, 246, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  position: relative;
}

.review-timestamp {
  font-size: 12px;
  color: #94a3b8;
  position: absolute;
  right: 10px;
  bottom: 5px;
}

.no-reviews {
  color: #94a3b8;
  font-size: 14px;
}

.review-form {
  display: grid;
  gap: 10px;
  margin-top: 15px;
}

.review-input,
.review-textarea {
  padding: 10px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.8);
  color: #f9fafb;
  font-size: 14px;
}

.review-textarea {
  min-height: 80px;
  resize: vertical;
}

.review-input:focus,
.review-textarea:focus {
  outline: none;
  border-color: #60a5fa;
}

.catalog-list-enter-active,
.catalog-list-leave-active,
.cart-list-enter-active,
.cart-list-leave-active {
  transition: all 0.5s ease;
}

.catalog-list-enter-from,
.catalog-list-leave-to,
.cart-list-enter-from,
.cart-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.light-mode .orders {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.9), rgba(191, 219, 254, 0.8));
  color: #1f2937;
}

.light-mode .hero-section {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.light-mode .hero-title {
  background: linear-gradient(45deg, #1f2937, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.light-mode .hero-subtitle,
.light-mode .description {
  color: #4b5563;
}

.light-mode .section-title {
  color: #1f2937;
}

.light-mode .search-input,
.light-mode .review-input,
.light-mode .review-textarea {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
  border: 1px solid #3b82f6;
}

.light-mode .search-input:focus,
.light-mode .review-input:focus,
.light-mode .review-textarea:focus {
  border-color: #60a5fa;
  background: rgba(243, 244, 246, 0.9);
}

.light-mode .sort-select,
.light-mode .coupon-select {
  background: rgba(243, 244, 246, 0.7);
  color: #1f2937;
}

.light-mode .catalog-card,
.light-mode .cart-card,
.light-mode .product-details,
.light-mode .cart-total {
  background: linear-gradient(135deg, rgba(243, 244, 246, 0.8), rgba(191, 219, 254, 0.2));
}

.light-mode .action-button,
.light-mode .place-order-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #1f2937;
}

.light-mode .action-button:hover,
.light-mode .place-order-btn:hover {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.light-mode .remove-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #1f2937;
}

.light-mode .remove-btn:hover {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

.light-mode .timestamp,
.light-mode .review-timestamp,
.light-mode .empty-cart,
.light-mode .no-reviews {
  color: #64748b;
}

.light-mode .tag {
  color: #3b82f6;
}

.light-mode .tag:hover {
  color: #2563eb;
}

.light-mode .review {
  background: rgba(59, 130, 246, 0.1);
}

@media (max-width: 768px) {
  .orders {
    padding: 20px;
  }
  .hero-title {
    font-size: 32px;
  }
  .catalog-grid,
  .cart-grid {
    grid-template-columns: 1fr;
  }
}
</style>