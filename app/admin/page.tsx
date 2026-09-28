'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';

const CAFE_ID = '54cff0d2-7598-4d69-9d01-51c5d54c16ce';

type OrderItem = {
  id: string;
  item_name: string;
  quantity: number;
  price: number;
  customization: string | null;
};

type Order = {
  id: string;
  customer_name: string | null;
  status: string;
  subtotal: number;
  gst: number;
  total: number;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
};

type Category = {
  id: string;
  name: string;
};

type MenuItem = {
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

type CafeTable = {
  id: string;
  table_number: number;
};

export default function AdminPage() {
  const [tab, setTab] = useState<'dashboard' | 'orders' | 'menu' | 'tables'>(
    'dashboard'
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddTable, setShowAddTable] = useState(false);

  const [newMenu, setNewMenu] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    veg: true,
  });
  const [newCategory, setNewCategory] = useState('');
  const [newTable, setNewTable] = useState('');

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2500);
  };

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        customer_name,
        status,
        subtotal,
        gst,
        total,
        notes,
        created_at,
        order_items (
          id,
          item_name,
          quantity,
          price,
          customization
        )
      `
      )
      .eq('cafe_id', CAFE_ID)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      showMessage('Could not load orders');
      return;
    }

    setOrders((data || []) as Order[]);
  };

  const loadMenu = async () => {
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
        category_id,
        categories(name)
      `
      )
      .eq('cafe_id', CAFE_ID)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(error);
      showMessage('Could not load menu');
      return;
    }

    setMenuItems((data || []) as MenuItem[]);
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .eq('cafe_id', CAFE_ID)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setCategories(data || []);
  };

  const loadTables = async () => {
    const { data, error } = await supabase
      .from('cafe_tables')
      .select('id, table_number')
      .eq('cafe_id', CAFE_ID)
      .order('table_number', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setTables(data || []);
  };

  const loadEverything = async () => {
    setLoading(true);
    await Promise.all([
      loadOrders(),
      loadMenu(),
      loadCategories(),
      loadTables(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadEverything();
    const timer = window.setInterval(loadOrders, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (order) => new Date(order.created_at).toDateString() === today
    );
    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      preparing: orders.filter((o) => o.status === 'preparing').length,
      revenue: todayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0),
      menu: menuItems.length,
    };
  }, [orders, menuItems]);

  const filteredOrders = orders.filter(
    (order) => orderFilter === 'all' || order.status === orderFilter
  );

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(menuSearch.toLowerCase())
  );

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    if (error) {
      showMessage('Status update failed');
      return;
    }
    setOrders((previous) =>
      previous.map((order) => (order.id === id ? { ...order, status } : order))
    );
    showMessage('Order updated');
  };

  const toggleAvailability = async (item: MenuItem) => {
    const next = !item.available;
    const { error } = await supabase
      .from('menu_items')
      .update({ available: next })
      .eq('id', item.id)
      .eq('cafe_id', CAFE_ID);

    if (error) {
      showMessage('Could not update item');
      return;
    }

    setMenuItems((previous) =>
      previous.map((x) => (x.id === item.id ? { ...x, available: next } : x))
    );
  };

  const deleteMenuItem = async (id: string) => {
    if (!window.confirm('Delete this menu item?')) return;

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)
      .eq('cafe_id', CAFE_ID);

    if (error) {
      showMessage('Delete failed');
      return;
    }

    setMenuItems((previous) => previous.filter((item) => item.id !== id));
    showMessage('Menu item deleted');
  };

  const addMenuItem = async () => {
    if (!newMenu.name.trim() || !newMenu.price || !newMenu.category_id) {
      showMessage('Enter name, price and category');
      return;
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        cafe_id: CAFE_ID,
        name: newMenu.name.trim(),
        description: newMenu.description.trim(),
        price: Number(newMenu.price),
        category_id: newMenu.category_id,
        image_url: newMenu.image_url.trim() || null,
        veg: newMenu.veg,
        available: true,
      })
      .select(
        `
        id,
        name,
        description,
        price,
        image_url,
        veg,
        available,
        category_id,
        categories(name)
      `
      )
      .single();

    if (error) {
      console.error(error);
      showMessage('Could not add item');
      return;
    }

    setMenuItems((previous) => [...previous, data as MenuItem]);
    setNewMenu({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      veg: true,
    });
    setShowAddMenu(false);
    showMessage('Menu item added');
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    const { data, error } = await supabase
      .from('categories')
      .insert({ cafe_id: CAFE_ID, name: newCategory.trim() })
      .select('id, name')
      .single();

    if (error) {
      showMessage('Could not add category');
      return;
    }

    setCategories((previous) => [...previous, data as Category]);
    setNewCategory('');
    setShowAddCategory(false);
    showMessage('Category added');
  };

  const addTable = async () => {
    const number = Number(newTable);
    if (!number || number < 1) {
      showMessage('Enter a valid table number');
      return;
    }

    const { data, error } = await supabase
      .from('cafe_tables')
      .insert({ cafe_id: CAFE_ID, table_number: number })
      .select('id, table_number')
      .single();

    if (error) {
      showMessage('Could not add table');
      return;
    }

    setTables((previous) =>
      [...previous, data as CafeTable].sort(
        (a, b) => a.table_number - b.table_number
      )
    );
    setNewTable('');
    setShowAddTable(false);
    showMessage('Table added');
  };

  const deleteTable = async (id: string) => {
    if (!window.confirm('Delete this table?')) return;
    const { error } = await supabase
      .from('cafe_tables')
      .delete()
      .eq('id', id)
      .eq('cafe_id', CAFE_ID);
    if (error) {
      showMessage('Could not delete table');
      return;
    }
    setTables((previous) => previous.filter((table) => table.id !== id));
  };

  const printOrderBill = (order: Order) => {
    const rows = order.order_items
      .map(
        (item) => `
          <tr>
            <td>${item.item_name}${
          item.customization ? `<br><small>${item.customization}</small>` : ''
        }</td>
            <td>${item.quantity}</td>
            <td>₹${(Number(item.price) * item.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join('');

    const html = `<!doctype html><html><head><title>Bill - ${order.id.slice(
      0,
      8
    )}</title><style>body{font-family:Arial;padding:30px;max-width:700px;margin:auto}h1{text-align:center}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{padding:10px;border-bottom:1px solid #ddd;text-align:left}.right{text-align:right}.total{font-size:22px;font-weight:bold}</style></head><body><h1>QR Café</h1><p style="text-align:center">Customer Bill</p><p><b>Order:</b> #${order.id.slice(
      0,
      8
    )}</p><p><b>Customer:</b> ${
      order.customer_name || 'Guest'
    }</p><p><b>Date:</b> ${new Date(
      order.created_at
    ).toLocaleString()}</p><table><thead><tr><th>Item</th><th>Qty</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table><p class="right">Subtotal: ₹${Number(
      order.subtotal
    ).toFixed(2)}</p><p class="right">GST: ₹${Number(order.gst).toFixed(
      2
    )}</p><p class="right total">Total: ₹${Number(order.total).toFixed(
      2
    )}</p><script>window.print();</script></body></html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#f5f1eb] text-xl font-bold text-[#3b2416]">
        Loading owner dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-gray-900">
      <header className="bg-[#3b2416] text-white">
        <div className="mx-auto max-w-7xl px-5 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-orange-200">QR Café</p>
              <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            </div>
            <div className="flex gap-2">
              <a
                href="/"
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
              >
                Customer View
              </a>
              <button
                onClick={loadEverything}
                className="rounded-xl bg-[#d97706] px-4 py-2 text-sm font-semibold"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {message && (
        <div className="fixed right-5 top-5 z-50 rounded-xl bg-[#3b2416] px-5 py-3 font-semibold text-white shadow-xl">
          {message}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-6">
        <nav className="mb-6 flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm">
          {[
            ['dashboard', 'Dashboard'],
            ['orders', 'Orders'],
            ['menu', 'Menu'],
            ['tables', 'Tables'],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value as any)}
              className={`whitespace-nowrap rounded-xl px-5 py-3 font-semibold ${
                tab === value
                  ? 'bg-[#3b2416] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === 'dashboard' && (
          <section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat title="Today's Orders" value={stats.todayOrders} />
              <Stat title="Pending" value={stats.pending} />
              <Stat title="Preparing" value={stats.preparing} />
              <Stat
                title="Today's Revenue"
                value={`₹${stats.revenue.toFixed(2)}`}
              />
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Recent Orders</h2>
                  <button
                    onClick={() => setTab('orders')}
                    className="text-sm font-semibold text-orange-600"
                  >
                    View all
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <OrderCompact key={order.id} order={order} />
                  ))}
                  {orders.length === 0 && (
                    <p className="text-gray-500">No orders yet.</p>
                  )}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Café Overview</h2>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <MiniStat label="Menu Items" value={stats.menu} />
                  <MiniStat label="Tables" value={tables.length} />
                  <MiniStat label="All Orders" value={stats.totalOrders} />
                  <MiniStat label="Categories" value={categories.length} />
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === 'orders' && (
          <section>
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Customer Orders</h2>
                <p className="text-gray-600">
                  Orders refresh automatically every 5 seconds.
                </p>
              </div>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="rounded-xl border bg-white px-4 py-3"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <Status status={order.status} />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                      <p className="mt-2">
                        <b>Customer:</b> {order.customer_name || 'Guest'}
                      </p>
                      {order.notes && (
                        <p className="text-sm text-gray-600">
                          <b>Notes:</b> {order.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.status === 'pending' && (
                        <ActionButton
                          onClick={() =>
                            updateOrderStatus(order.id, 'preparing')
                          }
                          label="Accept / Preparing"
                        />
                      )}
                      {order.status === 'preparing' && (
                        <ActionButton
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          label="Mark Ready"
                        />
                      )}
                      {order.status === 'ready' && (
                        <ActionButton
                          onClick={() =>
                            updateOrderStatus(order.id, 'completed')
                          }
                          label="Complete"
                        />
                      )}
                      <button
                        onClick={() => printOrderBill(order)}
                        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Print Bill
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2 border-t pt-4">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="rounded-xl bg-gray-50 p-3">
                        <div className="flex justify-between gap-4">
                          <span className="font-semibold">
                            {item.item_name} × {item.quantity}
                          </span>
                          <span>
                            ₹{(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        {item.customization && (
                          <p className="mt-1 text-sm text-orange-700">
                            Customization: {item.customization}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end gap-6 border-t pt-4 text-sm">
                    <span>Subtotal ₹{Number(order.subtotal).toFixed(2)}</span>
                    <span>GST ₹{Number(order.gst).toFixed(2)}</span>
                    <b className="text-lg">
                      Total ₹{Number(order.total).toFixed(2)}
                    </b>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
                  No orders in this filter.
                </div>
              )}
            </div>
          </section>
        )}

        {tab === 'menu' && (
          <section>
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Menu Management</h2>
                <p className="text-gray-600">
                  Add items, control availability and manage categories.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="rounded-xl bg-white px-4 py-3 font-semibold shadow-sm"
                >
                  + Category
                </button>
                <button
                  onClick={() => setShowAddMenu(true)}
                  className="rounded-xl bg-[#d97706] px-4 py-3 font-semibold text-white"
                >
                  + Add Item
                </button>
              </div>
            </div>
            <input
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search menu items..."
              className="mb-5 w-full rounded-xl border bg-white px-4 py-3"
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <div className="h-40 bg-gray-100">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between gap-3">
                      <h3 className="font-bold">{item.name}</h3>
                      <span
                        className={`text-xs font-bold ${
                          item.veg ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {item.veg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.categories?.[0]?.name || 'Uncategorized'}
                    </p>
                    <p className="mt-2 font-bold">
                      ₹{Number(item.price).toFixed(2)}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => toggleAvailability(item)}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                          item.available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                      <button
                        onClick={() => deleteMenuItem(item.id)}
                        className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'tables' && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Table Management</h2>
                <p className="text-gray-600">
                  Create the tables that will be connected to QR codes.
                </p>
              </div>
              <button
                onClick={() => setShowAddTable(true)}
                className="rounded-xl bg-[#d97706] px-4 py-3 font-semibold text-white"
              >
                + Add Table
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="rounded-2xl bg-white p-5 text-center shadow-sm"
                >
                  <div className="text-sm text-gray-500">TABLE</div>
                  <div className="my-2 text-4xl font-black text-[#3b2416]">
                    #{String(table.table_number).padStart(2, '0')}
                  </div>
                  <button
                    onClick={() => deleteTable(table.id)}
                    className="text-sm font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            {tables.length === 0 && (
              <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
                No tables added yet.
              </div>
            )}
          </section>
        )}
      </div>

      {showAddMenu && (
        <Modal title="Add Menu Item" onClose={() => setShowAddMenu(false)}>
          <div className="space-y-3">
            <input
              placeholder="Item name"
              value={newMenu.name}
              onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
              className="w-full rounded-xl border px-4 py-3"
            />
            <textarea
              placeholder="Description"
              value={newMenu.description}
              onChange={(e) =>
                setNewMenu({ ...newMenu, description: e.target.value })
              }
              className="w-full rounded-xl border px-4 py-3"
            />
            <input
              type="number"
              placeholder="Price"
              value={newMenu.price}
              onChange={(e) =>
                setNewMenu({ ...newMenu, price: e.target.value })
              }
              className="w-full rounded-xl border px-4 py-3"
            />
            <select
              value={newMenu.category_id}
              onChange={(e) =>
                setNewMenu({ ...newMenu, category_id: e.target.value })
              }
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Image URL (optional)"
              value={newMenu.image_url}
              onChange={(e) =>
                setNewMenu({ ...newMenu, image_url: e.target.value })
              }
              className="w-full rounded-xl border px-4 py-3"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newMenu.veg}
                onChange={(e) =>
                  setNewMenu({ ...newMenu, veg: e.target.checked })
                }
              />{' '}
              Vegetarian
            </label>
            <button
              onClick={addMenuItem}
              className="w-full rounded-xl bg-[#d97706] py-3 font-bold text-white"
            >
              Add Item
            </button>
          </div>
        </Modal>
      )}
      {showAddCategory && (
        <Modal title="Add Category" onClose={() => setShowAddCategory(false)}>
          <input
            autoFocus
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          />
          <button
            onClick={addCategory}
            className="mt-3 w-full rounded-xl bg-[#d97706] py-3 font-bold text-white"
          >
            Add Category
          </button>
        </Modal>
      )}
      {showAddTable && (
        <Modal title="Add Table" onClose={() => setShowAddTable(false)}>
          <input
            autoFocus
            type="number"
            placeholder="Table number"
            value={newTable}
            onChange={(e) => setNewTable(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          />
          <button
            onClick={addTable}
            className="mt-3 w-full rounded-xl bg-[#d97706] py-3 font-bold text-white"
          >
            Add Table
          </button>
        </Modal>
      )}
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-black text-[#3b2416]">{value}</p>
    </div>
  );
}
function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-[#f5f1eb] p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
function Status({ status }: { status: string }) {
  const cls: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        cls[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}
function ActionButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-[#d97706] px-4 py-2 text-sm font-semibold text-white"
    >
      {label}
    </button>
  );
}
function OrderCompact({ order }: { order: Order }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
      <div>
        <p className="font-semibold">
          #{order.id.slice(0, 8)} · {order.customer_name || 'Guest'}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(order.created_at).toLocaleString()}
        </p>
      </div>
      <div className="text-right">
        <Status status={order.status} />
        <p className="mt-1 font-bold">₹{Number(order.total).toFixed(2)}</p>
      </div>
    </div>
  );
}
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-2xl text-gray-500">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
