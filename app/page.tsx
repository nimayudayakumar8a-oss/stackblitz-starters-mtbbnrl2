'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

type MenuItem = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  veg: boolean;
};

const categories = ['All', 'Starters', 'Main Course', 'Drinks', 'Desserts'];

const fallbackMenuItems: MenuItem[] = [
  // =========================
  // STARTERS
  // =========================
  {
    id: 1,
    name: 'Loaded Cheese Fries',
    description: 'Crispy fries topped with melted cheese and sauce',
    price: 180,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/29285460/pexels-photo-29285460.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 2,
    name: 'Chicken Wings',
    description: 'Crispy chicken wings with spicy sauce',
    price: 220,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/7428284/pexels-photo-7428284.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 3,
    name: 'Mozzarella Sticks',
    description: 'Golden mozzarella sticks with marinara dip',
    price: 190,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/37279725/pexels-photo-37279725.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 4,
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 140,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/13062441/pexels-photo-13062441.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 5,
    name: 'Chicken Nuggets',
    description: 'Crispy chicken nuggets with dipping sauce',
    price: 170,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/7428284/pexels-photo-7428284.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 6,
    name: 'Nachos & Cheese',
    description: 'Crispy nachos with creamy cheese dip',
    price: 180,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/29269192/pexels-photo-29269192.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 7,
    name: 'Onion Rings',
    description: 'Golden crispy onion rings with dip',
    price: 150,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/33419292/pexels-photo-33419292.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 8,
    name: 'Chicken Tenders',
    description: 'Crispy seasoned chicken strips',
    price: 210,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/20003229/pexels-photo-20003229.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 9,
    name: 'Crispy Chicken Bites',
    description: 'Bite-sized crispy chicken with special dip',
    price: 200,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/8463433/pexels-photo-8463433.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 10,
    name: 'Cheesy Fries',
    description: 'Golden fries with creamy cheese topping',
    price: 170,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/29285463/pexels-photo-29285463.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },

  // =========================
  // MAIN COURSE
  // =========================
  {
    id: 11,
    name: 'Classic Chicken Burger',
    description: 'Crispy chicken, lettuce, cheese and house sauce',
    price: 220,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/33253846/pexels-photo-33253846.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 12,
    name: 'Double Cheese Burger',
    description: 'Juicy beef patty with double cheese',
    price: 280,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/20185767/pexels-photo-20185767.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 13,
    name: 'Chicken Alfredo Pasta',
    description: 'Creamy Alfredo pasta with grilled chicken',
    price: 260,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/17137896/pexels-photo-17137896.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 14,
    name: 'Creamy Mushroom Pasta',
    description: 'Creamy pasta with mushrooms and herbs',
    price: 230,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/18890240/pexels-photo-18890240.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 15,
    name: 'Grilled Chicken',
    description: 'Juicy grilled chicken with fries and fresh sides',
    price: 290,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/37575753/pexels-photo-37575753.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 16,
    name: 'Grilled Chicken Wrap',
    description: 'Grilled chicken, vegetables and creamy sauce',
    price: 210,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/32538756/pexels-photo-32538756.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 17,
    name: 'Chicken Club Sandwich',
    description: 'Triple-layer sandwich with chicken and cheese',
    price: 220,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/5215183/pexels-photo-5215183.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 18,
    name: 'Pepperoni Pizza',
    description: 'Cheesy pizza topped with pepperoni',
    price: 280,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/29269192/pexels-photo-29269192.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 19,
    name: 'Chicken Quesadilla',
    description: 'Grilled tortilla filled with chicken and cheese',
    price: 240,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/33682598/pexels-photo-33682598.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },
  {
    id: 20,
    name: 'Loaded Chicken Fries',
    description: 'Fries loaded with chicken, cheese and sauces',
    price: 230,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/28525210/pexels-photo-28525210.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: false,
  },

  // =========================
  // DRINKS
  // =========================
  {
    id: 21,
    name: 'Cold Coffee',
    description: 'Chilled creamy café coffee',
    price: 140,
    category: 'Drinks',
    image:
      'https://images.pexels.com/photos/11774913/pexels-photo-11774913.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 22,
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and latte art',
    price: 150,
    category: 'Drinks',
    image:
      'https://images.pexels.com/photos/29359728/pexels-photo-29359728.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 23,
    name: 'Cafe Latte',
    description: 'Smooth espresso with creamy steamed milk',
    price: 160,
    category: 'Drinks',
    image:
      'https://images.pexels.com/photos/2858192/pexels-photo-2858192.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 24,
    name: 'Chocolate Milkshake',
    description: 'Rich chocolate shake topped with cream',
    price: 180,
    category: 'Drinks',
    image:
      'https://images.pexels.com/photos/29200682/pexels-photo-29200682.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 25,
    name: 'Strawberry Milkshake',
    description: 'Creamy strawberry milkshake',
    price: 180,
    category: 'Drinks',
    image:
      'https://images.pexels.com/photos/25409673/pexels-photo-25409673.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 26,
    name: 'Vanilla Milkshake',
    description: 'Classic creamy vanilla milkshake',
    price: 170,
    category: 'Drinks',
    image:
      'https://images.pexels.com/photos/28525198/pexels-photo-28525198.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 27,
    name: 'Iced Latte',
    description: 'Chilled espresso with cold milk',
    price: 170,
    category: 'Drinks',
    image:
      'https://images.pexels.com/photos/35056953/pexels-photo-35056953.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 28,
    name: 'Iced Tea',
    description: 'Refreshing chilled lemon iced tea',
    price: 110,
    category: 'Drinks',
    image:
      'https://images.pexels.com/photos/11009224/pexels-photo-11009224.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 29,
    name: 'Mint Mojito',
    description: 'Fresh mint, lime and sparkling soda',
    price: 140,
    category: 'Drinks',
    image:
      'https://images.pexels.com/photos/11009207/pexels-photo-11009207.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 30,
    name: 'Fresh Lemonade',
    description: 'Fresh lemon juice with chilled soda',
    price: 100,
    category: 'Drinks',
    image:
      'https://images.pexels.com/photos/4987064/pexels-photo-4987064.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },

  // =========================
  // DESSERTS
  // =========================
  {
    id: 31,
    name: 'Chocolate Brownie',
    description: 'Warm fudgy chocolate brownie',
    price: 150,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/38028992/pexels-photo-38028992.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 32,
    name: 'Brownie with Ice Cream',
    description: 'Warm brownie served with vanilla ice cream',
    price: 210,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/3259585/pexels-photo-3259585.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 33,
    name: 'Cheesecake',
    description: 'Creamy cheesecake served café style',
    price: 190,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/8440061/pexels-photo-8440061.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 34,
    name: 'Tiramisu',
    description: 'Classic coffee and mascarpone dessert',
    price: 210,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/32405027/pexels-photo-32405027.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 35,
    name: 'Chocolate Waffles',
    description: 'Crispy waffles with chocolate and berries',
    price: 190,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/31670575/pexels-photo-31670575.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 36,
    name: 'Berry Waffles',
    description: 'Golden waffles topped with fresh berries',
    price: 200,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/6083992/pexels-photo-6083992.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 37,
    name: 'Pancake Stack',
    description: 'Fluffy pancakes with berries and syrup',
    price: 190,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/10414807/pexels-photo-10414807.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 38,
    name: 'Vanilla Ice Cream',
    description: 'Creamy vanilla ice cream',
    price: 110,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/9227978/pexels-photo-9227978.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 39,
    name: 'Chocolate Ice Cream',
    description: 'Rich chocolate ice cream',
    price: 120,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/9227722/pexels-photo-9227722.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
  {
    id: 40,
    name: 'Tiramisu Café Cup',
    description: 'Creamy tiramisu served in a dessert glass',
    price: 220,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/34759481/pexels-photo-34759481.jpeg?auto=compress&cs=tinysrgb&w=900',
    veg: true,
  },
];
const CAFE_ID = '54cff0d2-7598-4d69-9d01-51c5d54c16ce';

function supabaseItemToMenuItem(item: any): MenuItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: Number(item.price),
    category: item.categories?.name || 'Main Course',
    image: item.image_url || '',
    veg: Boolean(item.veg),
  };
}
function AdminDashboard() {
  type AdminMenuItem = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    veg: boolean;
    available: boolean;
    category_id: string | null;
    categories?: { name: string }[] | null;
  };
  type Category = { id: string; name: string };
  type CafeTable = { id: string; table_number: number };
  type CafeBranding = {
    name: string;
    description: string | null;
    logo_url: string | null;
    banner_url: string | null;
    template: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    font: string | null;
  };

  const [activeTab, setActiveTab] = useState('orders');
  const [cafeBranding, setCafeBranding] = useState<CafeBranding | null>(null);
  const [cafeName, setCafeName] = useState('');
  const [cafeDescription, setCafeDescription] = useState('');
  const [cafeLogo, setCafeLogo] = useState('');
  const [cafeBanner, setCafeBanner] = useState('');
  const [cafeTemplate, setCafeTemplate] = useState('modern');
  const [cafePrimary, setCafePrimary] = useState('#3b2416');
  const [cafeSecondary, setCafeSecondary] = useState('#d97706');
  const [cafeFont, setCafeFont] = useState('Inter');
  const [orders, setOrders] = useState<any[]>([]);
  const [menu, setMenu] = useState<AdminMenuItem[]>([]);
  const [categoriesAdmin, setCategoriesAdmin] = useState<Category[]>([]);
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [message, setMessage] = useState('');
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemVeg, setItemVeg] = useState(true);
  const [itemAvailable, setItemAvailable] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [newTable, setNewTable] = useState('');

  const showAdminMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2500);
  };

  const loadOrders = async () => {
    const { data, error } = await supabase.from('orders').select(`
      id, customer_name, status, subtotal, gst, total, notes, created_at,
      order_items (id, item_name, quantity, price, customization)
    `).eq('cafe_id', CAFE_ID).order('created_at', { ascending: false });
    if (!error) setOrders(data || []);
  };

  const loadMenu = async () => {
    const { data, error } = await supabase.from('menu_items').select(`
      id, name, description, price, image_url, veg, available, category_id,
      categories(name)
    `).eq('cafe_id', CAFE_ID).order('created_at', { ascending: true });
    if (!error) setMenu((data || []) as AdminMenuItem[]);
  };

  const loadCategories = async () => {
    const { data, error } = await supabase.from('categories')
      .select('id, name').eq('cafe_id', CAFE_ID).order('name');
    if (!error) setCategoriesAdmin(data || []);
  };

  const loadTables = async () => {
    const { data, error } = await supabase.from('cafe_tables')
      .select('id, table_number').eq('cafe_id', CAFE_ID).order('table_number');
    if (!error) setTables(data || []);
  };

  const loadCafe = async () => {
    const { data, error } = await supabase
      .from('cafes')
      .select('name, description, logo_url, banner_url, template, primary_color, secondary_color, font')
      .eq('id', CAFE_ID)
      .single();

    if (!error && data) {
      const cafe = data as CafeBranding;
      setCafeBranding(cafe);
      setCafeName(cafe.name || '');
      setCafeDescription(cafe.description || '');
      setCafeLogo(cafe.logo_url || '');
      setCafeBanner(cafe.banner_url || '');
      setCafeTemplate(cafe.template || 'modern');
      setCafePrimary(cafe.primary_color || '#3b2416');
      setCafeSecondary(cafe.secondary_color || '#d97706');
      setCafeFont(cafe.font || 'Inter');
    }
  };

  const saveCafe = async () => {
    if (!cafeName.trim()) {
      return showAdminMessage('Café name is required.');
    }

    const { data, error } = await supabase
      .from('cafes')
      .update({
        name: cafeName.trim(),
        description: cafeDescription.trim(),
        logo_url: cafeLogo.trim() || null,
        banner_url: cafeBanner.trim() || null,
        template: cafeTemplate,
        primary_color: cafePrimary,
        secondary_color: cafeSecondary,
        font: cafeFont,
      })
      .eq('id', CAFE_ID)
      .select()
      .single();

    if (error) {
      return showAdminMessage(error.message);
    }

    setCafeBranding(data as CafeBranding);
    showAdminMessage('Café customization saved.');
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      loadOrders(),
      loadMenu(),
      loadCategories(),
      loadTables(),
      loadCafe(),
    ]);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) return showAdminMessage('Could not update order.');
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const resetItemForm = () => {
    setShowItemForm(false); setEditingItem(null);
    setItemName(''); setItemDescription(''); setItemPrice('');
    setItemImage(''); setItemCategory(categoriesAdmin[0]?.id || '');
    setItemVeg(true); setItemAvailable(true);
  };

  const openAddItem = () => {
    setEditingItem(null); setItemName(''); setItemDescription('');
    setItemPrice(''); setItemImage(''); setItemCategory(categoriesAdmin[0]?.id || '');
    setItemVeg(true); setItemAvailable(true); setShowItemForm(true);
  };

  const openEditItem = (item: AdminMenuItem) => {
    setEditingItem(item); setItemName(item.name);
    setItemDescription(item.description || ''); setItemPrice(String(item.price));
    setItemImage(item.image_url || ''); setItemCategory(item.category_id || '');
    setItemVeg(item.veg); setItemAvailable(item.available); setShowItemForm(true);
  };

  const saveItem = async () => {
    if (!itemName.trim() || !itemPrice || !itemCategory)
      return showAdminMessage('Name, price and category are required.');

    const payload = {
      cafe_id: CAFE_ID, name: itemName.trim(), description: itemDescription.trim(),
      price: Number(itemPrice), image_url: itemImage.trim() || null,
      category_id: itemCategory, veg: itemVeg, available: itemAvailable
    };

    const result = editingItem
      ? await supabase.from('menu_items').update(payload).eq('id', editingItem.id)
      : await supabase.from('menu_items').insert(payload);

    if (result.error) return showAdminMessage(result.error.message);
    resetItemForm(); await loadMenu();
    showAdminMessage(editingItem ? 'Menu item updated.' : 'Menu item added.');
  };

  const toggleAvailability = async (item: AdminMenuItem) => {
    const available = !item.available;
    const { error } = await supabase.from('menu_items')
      .update({ available }).eq('id', item.id);
    if (error) return showAdminMessage('Could not update availability.');
    setMenu(prev => prev.map(x => x.id === item.id ? { ...x, available } : x));
  };

  const deleteItem = async (item: AdminMenuItem) => {
    if (!window.confirm(`Delete "${item.name}" from the menu?`)) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', item.id);
    if (error) return showAdminMessage(error.message);
    setMenu(prev => prev.filter(x => x.id !== item.id));
    showAdminMessage('Menu item deleted.');
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return showAdminMessage('Enter a category name.');
    const { error } = await supabase.from('categories')
      .insert({ cafe_id: CAFE_ID, name: newCategory.trim() });
    if (error) return showAdminMessage(error.message);
    setNewCategory(''); await loadCategories(); showAdminMessage('Category added.');
  };

  const deleteCategory = async (category: Category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    const { error } = await supabase.from('categories').delete().eq('id', category.id);
    if (error) return showAdminMessage(error.message);
    await loadCategories(); await loadMenu(); showAdminMessage('Category deleted.');
  };

  const addTable = async () => {
    const table_number = Number(newTable);
    if (!table_number || table_number < 1) return showAdminMessage('Enter a valid table number.');
    const { error } = await supabase.from('cafe_tables').insert({ cafe_id: CAFE_ID, table_number });
    if (error) return showAdminMessage(error.message);
    setNewTable(''); await loadTables(); showAdminMessage('Table added.');
  };

  const deleteTable = async (table: CafeTable) => {
    if (!window.confirm(`Delete Table #${table.table_number}?`)) return;
    const { error } = await supabase.from('cafe_tables').delete().eq('id', table.id);
    if (error) return showAdminMessage(error.message);
    setTables(prev => prev.filter(x => x.id !== table.id)); showAdminMessage('Table deleted.');
  };

  const filteredAdminMenu = menu.filter(item => {
    const q = menuSearch.toLowerCase().trim();
    return !q || item.name.toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q) ||
      (item.categories?.[0]?.name || '').toLowerCase().includes(q);
  });

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
  const todaySales = todayOrders.reduce((s, o) => s + Number(o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;

  return (
    <main className="min-h-screen bg-[#f5f1eb] p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#3b2416]">{cafeBranding?.name || cafeName || "Lollino Café"} — Owner Dashboard</h1>
            <p className="mt-1 text-gray-600">Manage orders, menu, categories and tables.</p>
          </div>
          <button onClick={loadAll} className="rounded-xl bg-white px-4 py-3 font-semibold text-[#3b2416] shadow-sm">
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>
        </div>

        {message && <div className="fixed right-4 top-4 z-[300] rounded-xl bg-[#3b2416] px-5 py-3 font-semibold text-white shadow-xl">{message}</div>}

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Today's Orders", todayOrders.length, 'text-[#3b2416]'],
            ["Today's Sales", `₹${todaySales.toFixed(2)}`, 'text-[#3b2416]'],
            ['Pending', pendingOrders, 'text-orange-600'],
            ['Preparing', preparingOrders, 'text-yellow-600']
          ].map(([label, value, cls]) => (
            <div key={String(label)} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`mt-1 text-3xl font-bold ${cls}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm">
          {[
            ['orders', '📦 Orders'], ['menu', '🍔 Menu'],
            ['categories', '📂 Categories'], ['tables', '🪑 Tables'],
            ['customize', '🎨 Customize']
          ].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-xl px-5 py-3 font-semibold ${activeTab === tab ? 'bg-[#3b2416] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <section className="mt-6 space-y-5">
            {orders.length === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <p className="text-xl font-bold text-[#3b2416]">No orders yet</p>
                <p className="mt-2 text-gray-500">New customer orders will appear here.</p>
              </div>
            ) : orders.map(order => (
              <div key={order.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#3b2416]">Order #{order.id.slice(0, 8)}</h2>
                    <p className="mt-1 text-gray-600">{order.notes || 'Table not specified'}</p>
                    <p className="mt-1 text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <span className="w-fit rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">{order.status}</span>
                </div>
                <div className="mt-5 space-y-3">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="rounded-xl bg-gray-50 p-3">
                      <div className="flex justify-between gap-3">
                        <span className="font-medium">{item.item_name} × {item.quantity}</span>
                        <span>₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
                      </div>
                      {item.customization && <p className="mt-1 text-sm text-orange-700">Customization: {item.customization}</p>}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <p className="text-xl font-bold text-[#3b2416]">Total: ₹{Number(order.total).toFixed(2)}</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="rounded-lg bg-yellow-100 px-3 py-2 text-sm font-semibold text-yellow-700">Preparing</button>
                    <button onClick={() => updateOrderStatus(order.id, 'ready')} className="rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">Ready</button>
                    <button onClick={() => updateOrderStatus(order.id, 'completed')} className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">Completed</button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === 'menu' && (
          <section className="mt-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <input value={menuSearch} onChange={e => setMenuSearch(e.target.value)} placeholder="Search menu..."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none md:max-w-md" />
              <button onClick={openAddItem} className="rounded-xl bg-[#d97706] px-5 py-3 font-bold text-white">+ Add New Item</button>
            </div>

            {showItemForm && (
              <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#3b2416]">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                  <button onClick={resetItemForm} className="text-2xl text-gray-400">×</button>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <input value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Food name" className="rounded-xl border p-3" />
                  <input value={itemPrice} onChange={e => setItemPrice(e.target.value)} placeholder="Price" type="number" min="0" className="rounded-xl border p-3" />
                  <input value={itemImage} onChange={e => setItemImage(e.target.value)} placeholder="Image URL" className="rounded-xl border p-3 md:col-span-2" />
                  <textarea value={itemDescription} onChange={e => setItemDescription(e.target.value)} placeholder="Description" className="min-h-24 rounded-xl border p-3 md:col-span-2" />
                  <select value={itemCategory} onChange={e => setItemCategory(e.target.value)} className="rounded-xl border p-3">
                    <option value="">Select category</option>
                    {categoriesAdmin.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <div className="flex items-center gap-5 rounded-xl border p-3">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={itemVeg} onChange={e => setItemVeg(e.target.checked)} /> Vegetarian</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={itemAvailable} onChange={e => setItemAvailable(e.target.checked)} /> Available</label>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <button onClick={saveItem} className="rounded-xl bg-[#3b2416] px-5 py-3 font-bold text-white">{editingItem ? 'Save Changes' : 'Add Item'}</button>
                  <button onClick={resetItemForm} className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700">Cancel</button>
                </div>
              </div>
            )}

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {filteredAdminMenu.map(item => (
                <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="flex gap-4 p-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {item.image_url ? <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-3xl">🍽️</div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-[#3b2416]">{item.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{item.categories?.[0]?.name || 'No category'}</p>
                        </div>
                        <p className="font-bold text-[#3b2416]">₹{Number(item.price).toFixed(0)}</p>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{item.description || 'No description'}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={() => toggleAvailability(item)} className={`rounded-lg px-3 py-2 text-xs font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.available ? '● Available' : '● Unavailable'}
                        </button>
                        <button onClick={() => openEditItem(item)} className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700">Edit</button>
                        <button onClick={() => deleteItem(item)} className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'categories' && (
          <section className="mt-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#3b2416]">Manage Categories</h2>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name" className="flex-1 rounded-xl border p-3" />
                <button onClick={addCategory} className="rounded-xl bg-[#d97706] px-5 py-3 font-bold text-white">+ Add Category</button>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {categoriesAdmin.map(c => (
                <div key={c.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
                  <span className="font-semibold text-[#3b2416]">{c.name}</span>
                  <button onClick={() => deleteCategory(c)} className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">Delete</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'tables' && (
          <section className="mt-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#3b2416]">Manage Tables & QR Codes</h2>
              <p className="mt-1 text-sm text-gray-500">
                Each table gets a unique QR code. Scanning it opens the customer menu for that table.
              </p>
              <p className="mt-2 rounded-xl bg-orange-50 p-3 text-sm text-orange-800">
                Preview note: the QR will work with the final deployed website URL. The Open button below lets you test the table link inside StackBlitz now.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={newTable}
                  onChange={e => setNewTable(e.target.value)}
                  placeholder="Table number"
                  type="number"
                  min="1"
                  className="flex-1 rounded-xl border p-3"
                />
                <button
                  onClick={addTable}
                  className="rounded-xl bg-[#d97706] px-5 py-3 font-bold text-white"
                >
                  + Add Table
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tables.map(t => {
                const tableUrl =
                  typeof window !== 'undefined'
                    ? `${window.location.origin}/?table=${t.table_number}`
                    : `/?table=${t.table_number}`;

                const qrUrl =
                  `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(tableUrl)}`;

                return (
                  <div
                    key={t.id}
                    className="rounded-2xl bg-white p-5 text-center shadow-sm"
                  >
                    <p className="text-lg font-bold text-[#3b2416]">
                      Table #{String(t.table_number).padStart(2, '0')}
                    </p>

                    <div className="mx-auto mt-4 w-fit rounded-xl border bg-white p-2">
                      <img
                        src={qrUrl}
                        alt={`QR code for Table ${t.table_number}`}
                        className="h-44 w-44"
                      />
                    </div>

                    <p className="mt-3 break-all text-xs text-gray-400">
                      {tableUrl}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => window.location.assign(tableUrl)}
                        className="flex-1 rounded-lg bg-[#3b2416] px-3 py-2 text-sm font-semibold text-white"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => deleteTable(t)}
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {tables.length === 0 && (
              <div className="mt-5 rounded-2xl bg-white p-10 text-center text-gray-500">
                No tables added yet. Add Table 1, Table 2, Table 3 and so on.
              </div>
            )}
          </section>
        )}

        {activeTab === 'customize' && (
          <section className="mt-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#3b2416]">Customize Café Website</h2>
              <p className="mt-1 text-sm text-gray-500">
                These settings control the café branding shown to customers.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input
                  value={cafeName}
                  onChange={e => setCafeName(e.target.value)}
                  placeholder="Café name"
                  className="rounded-xl border p-3"
                />
                <input
                  value={cafeDescription}
                  onChange={e => setCafeDescription(e.target.value)}
                  placeholder="Short description"
                  className="rounded-xl border p-3"
                />
                <input
                  value={cafeLogo}
                  onChange={e => setCafeLogo(e.target.value)}
                  placeholder="Logo image URL"
                  className="rounded-xl border p-3 md:col-span-2"
                />
                <input
                  value={cafeBanner}
                  onChange={e => setCafeBanner(e.target.value)}
                  placeholder="Banner image URL"
                  className="rounded-xl border p-3 md:col-span-2"
                />

                <label className="rounded-xl border p-3">
                  <span className="mb-2 block text-sm font-semibold text-gray-600">Template</span>
                  <select
                    value={cafeTemplate}
                    onChange={e => setCafeTemplate(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </label>

                <label className="rounded-xl border p-3">
                  <span className="mb-2 block text-sm font-semibold text-gray-600">Font</span>
                  <select
                    value={cafeFont}
                    onChange={e => setCafeFont(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Arial">Arial</option>
                  </select>
                </label>

                <label className="rounded-xl border p-3">
                  <span className="mb-2 block text-sm font-semibold text-gray-600">Primary color</span>
                  <input
                    type="color"
                    value={cafePrimary}
                    onChange={e => setCafePrimary(e.target.value)}
                    className="h-12 w-full cursor-pointer rounded-lg"
                  />
                </label>

                <label className="rounded-xl border p-3">
                  <span className="mb-2 block text-sm font-semibold text-gray-600">Secondary color</span>
                  <input
                    type="color"
                    value={cafeSecondary}
                    onChange={e => setCafeSecondary(e.target.value)}
                    className="h-12 w-full cursor-pointer rounded-lg"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-2xl p-5 text-white" style={{ backgroundColor: cafePrimary }}>
                <div className="flex items-center gap-4">
                  {cafeLogo ? (
                    <img src={cafeLogo} alt="Logo preview" className="h-16 w-16 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 text-2xl">☕</div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold">{cafeName || 'Lollino Café'}</h3>
                    <p className="text-white/80">{cafeDescription || 'Scan • Order • Enjoy'}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={saveCafe}
                className="mt-5 rounded-xl bg-[#d97706] px-6 py-3 font-bold text-white"
              >
                Save Café Customization
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietPreference, setDietPreference] = useState('None');
  const [specialRequest, setSpecialRequest] = useState('');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isAdmin, setIsAdmin] = useState(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('admin') === 'true'
  );
  const [dbMenuItems, setDbMenuItems] = useState<MenuItem[]>([]);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    string[]
  >([]);
  const [cartCustomizations, setCartCustomizations] = useState<
    Record<string, string>
  >({});
  const [bill, setBill] = useState<any>(null);
  const [tableNumber, setTableNumber] = useState(4);
  const [cafeBranding, setCafeBranding] = useState({
    name: 'Lollino Café',
    description: 'Scan • Order • Enjoy',
    logo_url: '',
    banner_url: '',
    primary_color: '#3b2416',
    secondary_color: '#d97706',
    font: 'Inter',
  });
  const menuItems = dbMenuItems.length > 0 ? dbMenuItems : fallbackMenuItems;
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = Number(params.get('table'));
    if (Number.isInteger(value) && value > 0) {
      setTableNumber(value);
    }
  }, []);

  useEffect(() => {
    async function loadCafeBranding() {
      const { data, error } = await supabase
        .from('cafes')
        .select('name, description, logo_url, banner_url, primary_color, secondary_color, font')
        .eq('id', CAFE_ID)
        .single();

      if (!error && data) {
        setCafeBranding({
          name: data.name || 'Lollino Café',
          description: data.description || 'Scan • Order • Enjoy',
          logo_url: data.logo_url || '',
          banner_url: data.banner_url || '',
          primary_color: data.primary_color || '#3b2416',
          secondary_color: data.secondary_color || '#d97706',
          font: data.font || 'Inter',
        });
      }
    }

    loadCafeBranding();
  }, []);

  useEffect(() => {
    async function loadMenuFromDatabase() {
      const { data, error } = await supabase
        .from('menu_items')
        .select(
          `
          id,
          name,
          description,
          price,
          image_url,
          veg,
          available,
          categories(name)
        `
        )
        .eq('cafe_id', CAFE_ID)
        .eq('available', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Database menu error:', error);
        return;
      }

      setDbMenuItems((data ?? []).map(supabaseItemToMenuItem));
    }

    loadMenuFromDatabase();
  }, []);

  // FILTER MENU
  const filteredItems = menuItems.filter((item) => {
    const categoryMatch =
      selectedCategory === 'All' || item.category === selectedCategory;

    const searchMatch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // ADD ITEM
  const addToCart = (id: string | number) => {
    setCart((previous) => ({
      ...previous,
      [id]: (previous[id] || 0) + 1,
    }));
  };

  // REMOVE ITEM
  const removeFromCart = (id: string | number) => {
    setCart((previous) => {
      const updated = { ...previous };

      if (updated[id] > 1) {
        updated[id] = updated[id] - 1;
      } else {
        delete updated[id];
      }

      return updated;
    });
  };

  // CART ITEMS
  const cartItems = menuItems.filter((item) => cart[item.id]);
  // BILL CALCULATION
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * cart[item.id],
    0
  );

  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const cartCount = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#f5f1eb]">
        <div className="sticky top-0 z-50 bg-[#3b2416] px-4 py-3">
          <button
            onClick={() => setIsAdmin(false)}
            className="rounded-xl bg-white px-4 py-2 font-semibold text-[#3b2416]"
          >
            ← Back to Customer Menu
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] text-gray-900 pb-36">
      {/* ================= HEADER ================= */}
      <header className="text-white" style={{ backgroundColor: cafeBranding.primary_color }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm text-white/80 mb-1">Welcome to</p>

              <h1 className="text-4xl md:text-5xl font-bold">{cafeBranding.name}</h1>

              <p className="text-white/90 mt-2">{cafeBranding.description}</p>
            </div>

            <div className="bg-white/10 rounded-2xl px-6 py-4">
              <p className="text-sm text-orange-200">Your Table</p>

              <p className="text-3xl font-bold">#{String(tableNumber).padStart(2, "0")}</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdmin(true)}
            className="mt-4 block w-full rounded-xl px-4 py-3 text-center text-white font-semibold" style={{ backgroundColor: cafeBranding.secondary_color }}
          >
            Owner Dashboard
          </button>
          {/* SEARCH */}

          <div className="mt-7">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search burgers, pasta, coffee..."
              className="w-full bg-white text-gray-900 rounded-xl px-5 py-4 outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-orange-300/30"
            />
          </div>
        </div>
      </header>

      {/* ================= CATEGORIES ================= */}

      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full font-semibold transition ${
                selectedCategory === category
                  ? 'bg-[#3b2416] text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* ================= MENU ================= */}

      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Our Menu</h2>

            <p className="text-gray-500 mt-1">
              Fresh food and drinks made for you
            </p>
          </div>

          <p className="text-sm text-gray-500">{filteredItems.length} items</p>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">🔍</div>

            <h3 className="text-xl font-bold">No items found</h3>

            <p className="text-gray-500 mt-2">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
              >
                {/* IMAGE */}

                <div className="h-56 overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>

                {/* CONTENT */}

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ${
                        item.veg ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      title={item.veg ? 'Vegetarian' : 'Non-vegetarian'}
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg leading-tight">
                        {item.name}
                      </h3>

                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5">
                    <div>
                      <p className="text-xl font-bold text-[#3b2416]">
                        ₹{item.price}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {item.category}
                      </p>
                    </div>

                    {/* ADD / QUANTITY */}

                    {!cart[item.id] ? (
                      <button
                        onClick={() => setCustomizingItem(item)}
                        className="text-white px-6 py-2.5 rounded-xl font-bold transition" style={{ backgroundColor: cafeBranding.secondary_color }}
                      >
                        Customize
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 bg-[#3b2416] text-white rounded-xl px-3 py-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-xl"
                        >
                          −
                        </button>

                        <span className="font-bold min-w-5 text-center">
                          {cart[item.id]}
                        </span>

                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-xl"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ================= CART ================= */}

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-4xl mx-auto px-4 pb-4">
            <div className="bg-[#3b2416] text-white rounded-2xl shadow-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <p className="text-sm text-orange-200">Your Cart</p>

                  <p className="text-xl font-bold">
                    {cartCount} item
                    {cartCount !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-xs text-orange-200">Total</p>

                    <p className="text-2xl font-bold">₹{total.toFixed(2)}</p>
                  </div>

                  <button
                    onClick={async () => {
                      if (cartItems.length === 0) {
                        alert('Your cart is empty.');
                        return;
                      }

                      const { data: order, error: orderError } = await supabase
                        .from('orders')
                        .insert({
                          cafe_id: CAFE_ID,
                          customer_name: 'Guest',
                          status: 'pending',
                          subtotal: subtotal,
                          gst: gst,
                          total: total,
                          notes: `Table #${String(tableNumber).padStart(2, '0')}`,
                        })
                        .select()
                        .single();

                      if (orderError) {
                        console.error(orderError);
                        alert('Failed to place order.');
                        return;
                      }

                      const orderItems = cartItems.map((item) => ({
                        order_id: order.id,
                        menu_item_id: item.id,
                        item_name: item.name,
                        quantity: cart[item.id],
                        price: item.price,
                        customization: cartCustomizations[item.id] || '',
                      }));

                      const { error: itemsError } = await supabase
                        .from('order_items')
                        .insert(orderItems);

                      if (itemsError) {
                        console.error(itemsError);
                        alert(`Order item error: ${itemsError.message}`);
                        return;
                      }

                      setBill({
                        orderId: order.id,
                        table: `Table #${String(tableNumber).padStart(2, '0')}`,
                        items: orderItems.map((item) => ({
                          ...item,
                          lineTotal: item.price * item.quantity,
                        })),
                        subtotal,
                        gst,
                        total,
                      });

                      setCart({});
                      setCartCustomizations({});
                    }}
                    className="bg-[#d97706] hover:bg-[#b45309] px-6 py-3 rounded-xl font-bold transition"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {bill && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div id="print-bill" className="p-6">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold text-[#3b2416]">{cafeBranding.name}</h2>
                <p className="text-sm text-gray-500">Order Bill</p>
              </div>

              <div className="py-4 text-sm space-y-1">
                <p>
                  <span className="font-semibold">Order ID:</span>{' '}
                  {bill.orderId.slice(0, 8)}
                </p>
                <p>
                  <span className="font-semibold">Table:</span> {bill.table}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{' '}
                  {new Date().toLocaleString()}
                </p>
              </div>

              <div className="border-y py-4 space-y-3">
                {bill.items.map((item: any, index: number) => (
                  <div key={`${item.item_name}-${index}`}>
                    <div className="flex justify-between gap-3">
                      <span>
                        {item.item_name} × {item.quantity}
                      </span>
                      <span>₹{Number(item.lineTotal).toFixed(2)}</span>
                    </div>
                    {item.customization && (
                      <p className="text-xs text-orange-700 mt-1">
                        {item.customization}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{Number(bill.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>₹{Number(bill.gst).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[#3b2416] border-t pt-3">
                  <span>Total</span>
                  <span>₹{Number(bill.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-gray-50">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#3b2416] text-white py-3 rounded-xl font-bold"
              >
                Print Bill
              </button>
              <button
                onClick={() => setBill(null)}
                className="flex-1 bg-[#d97706] text-white py-3 rounded-xl font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {customizingItem && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-2xl font-bold">
                  Customize {customizingItem.name}
                </h2>
                <p className="text-gray-500 mt-1">Make it the way you like</p>
              </div>

              <button
                onClick={() => setCustomizingItem(null)}
                className="text-2xl text-gray-500"
              >
                ×
              </button>
            </div>

            <h3 className="font-bold mb-3">Customization</h3>

            <div className="space-y-3">
              {['No Onion', 'No Mayo', 'Extra Cheese', 'Extra Chicken'].map(
                (option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 border rounded-xl p-3"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCustomizations.includes(option)}
                      onChange={() => {
                        setSelectedCustomizations((previous) =>
                          previous.includes(option)
                            ? previous.filter((x) => x !== option)
                            : [...previous, option]
                        );
                      }}
                    />
                    <span>{option}</span>
                  </label>
                )
              )}
            </div>

            <h3 className="font-bold mt-6 mb-3">Dietary Preference</h3>

            <select
              value={dietPreference}
              onChange={(e) => setDietPreference(e.target.value)}
              className="w-full border rounded-xl p-3"
            >
              <option>None</option>
              <option>High Protein</option>
              <option>Low Calorie</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Gluten Free</option>
            </select>

            <h3 className="font-bold mt-6 mb-3">Special Request</h3>

            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Example: Less spicy, no salt..."
              className="w-full border rounded-xl p-3 min-h-24"
            />

            <button
              onClick={() => {
                const customizationText = [
                  ...selectedCustomizations,
                  dietPreference !== 'None' ? dietPreference : '',
                  specialRequest.trim() ? specialRequest.trim() : '',
                ]
                  .filter(Boolean)
                  .join(', ');

                setCartCustomizations((previous) => ({
                  ...previous,
                  [customizingItem.id]: customizationText,
                }));

                addToCart(customizingItem.id as any);
                setCustomizingItem(null);
                setSelectedCustomizations([]);
                setDietPreference('None');
                setSpecialRequest('');
              }}
              className="w-full mt-6 bg-[#d97706] text-white py-3 rounded-xl font-bold"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
