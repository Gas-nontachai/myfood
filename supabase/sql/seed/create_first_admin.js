import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const username = "admin";
  const password = "admin1234";
  const fakeEmail = `${username}@local.local`;

  // 1) Create auth user
  const { data: user, error } = await supabase.auth.admin.createUser({
    email: fakeEmail,
    password,
    user_metadata: { username, deleted: false },
    email_confirm: true
  });

  if (error) {
    console.error("Create user error:", error);
    process.exit(1);
  }

  const userId = user.user.id;

  // 2) Insert profile
  await supabase.from("profiles").insert({
    user_id: userId,
    username,
    full_name: "System Administrator",
    role_primary: 1,        // role 'admin'
    status: "active"
  });

  // 3) Assign role
  await supabase.from("user_roles").insert({
    user_id: userId,
    role_id: 1               // admin role id
  });

  console.log("Admin user created successfully:", username);
}

main();
// 📌 วิธีรัน script เพื่อสร้าง admin user
//npm install @supabase/supabase-js
//node create_first_admin.js
