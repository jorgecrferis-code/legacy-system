  const SUPABASE_URL = "https://ougbokufspjduwepqepj.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91Z2Jva3Vmc3BqZHV3ZXBxZXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTQ2MTYsImV4cCI6MjA4ODI5MDYxNn0.5C_k0vbKSE_vgmwK9kRQkM3oR1CWoPG_BaiHbBKHOVQ";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// =============================
// ORDERS
// =============================

async function getOrdersByStatus(status) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', status)
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

async function createOrder(customer, notes) {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        customer_name: customer,
        notes: notes,
        status: 'waiting_picking'
      }
    ])
    .select();

  if (error) {
    console.log(error);
    return null;
  }

  return data[0];
}

async function updateOrderStatus(order_id, status) {
  await supabase
    .from('orders')
    .update({ status: status })
    .eq('id', order_id);
}

// =============================
// ORDER ITEMS
// =============================

async function addOrderItem(order_id, product, qty) {
  await supabase
    .from('order_items')
    .insert([
      {
        order_id: order_id,
        product_name: product,
        qty: qty,
        picked: false
      }
    ]);
}

async function getPickingItems(order_id) {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order_id);

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

async function markItemPicked(item_id) {
  await supabase
    .from('order_items')
    .update({ picked: true })
    .eq('id', item_id);
}

// =============================
// FLOW STATUS
// =============================

async function finishPicking(order_id) {
  await updateOrderStatus(order_id, 'packing');
}

async function finishPacking(order_id) {
  await updateOrderStatus(order_id, 'staging');
}

async function moveToTruck(order_id) {
  await updateOrderStatus(order_id, 'truck');
}

async function markDelivered(order_id) {
  await updateOrderStatus(order_id, 'delivered');
}

// =============================
// TEST CONNECTION
// =============================

async function testConnection() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .limit(1);

  if (error) {
    console.log("Supabase error:", error);
  } else {
    console.log("Supabase connected:", data);
  }
}

testConnection();
