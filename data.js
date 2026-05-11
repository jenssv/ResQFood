// Mock Data for Prototype

const MOCK_USER = {
    name: "Ihsan",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    coins: 150,
    rank: "Rescue Scout",
    xp: 650,
    nextRankXp: 2000,
    stats: {
        mealsRescued: 12,
        moneySaved: 360000, // IDR
        foodSavedKg: 4.5,
        co2Prevented: 11.2,
        streakDays: 4
    },
    badges: [
        { id: "b1", name: "First Rescue", icon: "🥇", earned: true },
        { id: "b2", name: "Eco Starter", icon: "🌱", earned: true },
        { id: "b3", name: "On Fire", icon: "🔥", earned: false },
        { id: "b4", name: "Explorer", icon: "🗺️", earned: true },
        { id: "b5", name: "Night Owl", icon: "🌙", earned: false },
        { id: "b6", name: "Hundred Club", icon: "💯", earned: false }
    ]
};

const MOCK_CATEGORIES = [
    { id: "all", name: "All", icon: "🍽️" },
    { id: "bakery", name: "Bakery", icon: "🥐" },
    { id: "bento", name: "Bento", icon: "🍱" },
    { id: "fastfood", name: "Fast Food", icon: "🍔" },
    { id: "local", name: "Local", icon: "🍛" },
    { id: "vegan", name: "Vegan", icon: "🥗" }
];

const MOCK_FOODS = [
    {
        id: "f1",
        restaurantId: "r1",
        restaurantName: "Sweetie Bakery",
        title: "Assorted Pastry Box",
        description: "A surprise mix of today's unsold croissants, danishes, and muffins. Perfectly fine to eat, just baked this morning!",
        ingredients: ["Wheat Flour", "Butter", "Sugar", "Eggs", "Milk"],
        allergens: ["Gluten", "Dairy", "Eggs"],
        timeMade: "07:00 AM",
        pickupWindow: "19:00 - 21:00",
        originalPrice: 75000,
        discountedPrice: 25000,
        qty: 3,
        distance: "0.4 km",
        category: "bakery",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        freshness: 70
    },
    {
        id: "f2",
        restaurantId: "r2",
        restaurantName: "Sushi Zen",
        title: "End of Day Sushi Platter",
        description: "Assorted nigiri and rolls made this afternoon. Must be consumed immediately.",
        ingredients: ["Rice", "Salmon", "Tuna", "Seaweed", "Cucumber"],
        allergens: ["Fish", "Soy"],
        timeMade: "14:00 PM",
        pickupWindow: "20:30 - 22:00",
        originalPrice: 120000,
        discountedPrice: 40000,
        qty: 2,
        distance: "1.2 km",
        category: "bento",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        freshness: 40
    },
    {
        id: "f3",
        restaurantId: "r3",
        restaurantName: "Warung Nusantara",
        title: "Nasi Campur Surplus",
        description: "Generous portion of rice with fried chicken, tempeh, and vegetables. Saved from our dinner buffet.",
        ingredients: ["Rice", "Chicken", "Tempeh", "Coconut Milk", "Spices"],
        allergens: ["Soy", "Nuts"],
        timeMade: "17:00 PM",
        pickupWindow: "21:00 - 23:00",
        originalPrice: 45000,
        discountedPrice: 15000,
        qty: 5,
        distance: "0.8 km",
        category: "local",
        image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        freshness: 85
    },
    {
        id: "f4",
        restaurantId: "r4",
        restaurantName: "Green Bowl",
        title: "Leftover Salad Base",
        description: "Fresh greens and quinoa that didn't sell today. Add your own dressing!",
        ingredients: ["Kale", "Spinach", "Quinoa", "Cherry Tomatoes"],
        allergens: [],
        timeMade: "11:00 AM",
        pickupWindow: "18:00 - 20:00",
        originalPrice: 60000,
        discountedPrice: 20000,
        qty: 4,
        distance: "1.5 km",
        category: "vegan",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        freshness: 60
    }
];

const MOCK_ORDERS = [
    {
        id: "ORD-9823",
        foodId: "f1",
        date: "2026-04-16",
        status: "completed"
    },
    {
        id: "ORD-8742",
        foodId: "f3",
        date: "2026-04-14",
        status: "completed"
    }
];

// Helper to format IDR currency
const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};
